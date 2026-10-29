package com.quvideo.studio;

import jakarta.annotation.PreDestroy;
import java.util.concurrent.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.support.TransactionTemplate;

@Component
public class Processing implements Pipeline.Store, ApplicationRunner {
  private final Db db;
  private final FilesService files;
  private final TransactionTemplate tx;
  private final ThreadPoolExecutor executor;
  private final Pipeline pipeline;

  public Processing(
      Db db,
      FilesService files,
      org.springframework.transaction.PlatformTransactionManager manager,
      @Value("${TASK_QUEUE_CAPACITY:20}") int capacity) {
    this.db = db;
    this.files = files;
    this.tx = new TransactionTemplate(manager);
    this.tx.setPropagationBehavior(
        org.springframework.transaction.TransactionDefinition.PROPAGATION_REQUIRES_NEW);
    executor =
        new ThreadPoolExecutor(
            1,
            1,
            0,
            TimeUnit.MILLISECONDS,
            new ArrayBlockingQueue<>(capacity),
            r -> {
              var t = new Thread(r, "material-worker");
              t.setDaemon(false);
              return t;
            },
            new ThreadPoolExecutor.AbortPolicy());
    pipeline = new Pipeline(this, this::execute, Thread::sleep);
  }

  public void run(ApplicationArguments args) {
    for (String id : db.unfinished()) fail(id, "INTERRUPTED", "服务重启导致任务中断，请重新提交");
  }

  void dispatch(String id, Simulation simulation) {
    try {
      executor.execute(() -> pipeline.run(id, simulation));
    } catch (RejectedExecutionException e) {
      fail(id, "QUEUE_FULL", "任务队列已满，请稍后提交新任务");
    }
  }

  public boolean begin(String id, String stage) {
    return Boolean.TRUE.equals(
        tx.execute(
            s -> {
              if (db.beginTask(id, stage) != 1) return false;
              if (db.beginStep(id, stage) != 1)
                throw new IllegalStateException("Invalid step transition");
              return true;
            }));
  }

  public void end(String id, String stage) {
    tx.executeWithoutResult(
        s -> {
          if (db.endStep(id, stage) != 1)
            throw new IllegalStateException("Step completion rejected");
          db.touch(id);
        });
  }

  public void success(String id) {
    tx.executeWithoutResult(s -> db.success(id, id + "-result.png"));
  }

  public void fail(String id, String code, String reason) {
    try {
      tx.executeWithoutResult(
          s -> {
            if (db.fail(id, code, reason) == 1) db.failStep(id, reason);
          });
    } catch (RuntimeException e) {
      org.slf4j.LoggerFactory.getLogger(Processing.class)
          .error("Could not persist failure for task {}", id, e);
    }
  }

  private void execute(String id, String stage) throws Exception {
    if (stage.equals("ASSET_CHECK")) {
      for (String key : db.taskFiles(id))
        if (!files.exists(key)) throw new java.io.IOException("Missing asset");
    } else if (stage.equals("GENERATE")) {
      var t = db.taskById(id);
      files.demo((String) db.template((String) t.get("templateId")).get("resultKey"));
    } else {
      var t = db.taskById(id);
      files.write(
          id + "-result.png",
          files.demo((String) db.template((String) t.get("templateId")).get("resultKey")));
    }
  }

  @PreDestroy
  void shutdown() {
    executor.shutdown();
    try {
      if (!executor.awaitTermination(5, TimeUnit.SECONDS)) executor.shutdownNow();
    } catch (InterruptedException e) {
      executor.shutdownNow();
      Thread.currentThread().interrupt();
    }
  }
}
