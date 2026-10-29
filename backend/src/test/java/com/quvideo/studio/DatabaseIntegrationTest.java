package com.quvideo.studio;

import static org.junit.jupiter.api.Assertions.*;

import java.nio.file.*;
import java.time.*;
import java.util.*;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.transaction.support.TransactionTemplate;

@SpringBootTest
class DatabaseIntegrationTest {
  @DynamicPropertySource
  static void properties(DynamicPropertyRegistry r) {
    r.add(
        "STORAGE_ROOT",
        () ->
            System.getProperty("java.io.tmpdir")
                + "/material-integration-"
                + ProcessHandle.current().pid());
    r.add("TASK_QUEUE_CAPACITY", () -> 1);
    r.add("SIMULATION_ASSET_CHECK_DELAY_MS", () -> 0);
    r.add("SIMULATION_GENERATE_DELAY_MS", () -> 0);
    r.add("SIMULATION_FINALIZE_DELAY_MS", () -> 0);
  }

  @Autowired Db db;
  @Autowired Tasks tasks;
  @Autowired FilesService files;
  @Autowired Identity identity;
  @Autowired TransactionTemplate tx;
  @Autowired Processing processing;
  @Autowired org.springframework.transaction.PlatformTransactionManager manager;

  String user() {
    var m = identity.ensure(new MockHttpServletRequest(), new MockHttpServletResponse());
    return (String) m.get("userId");
  }

  String upload(String user) throws Exception {
    return (String)
        files
            .upload(
                user,
                "demo-pet",
                new MockMultipartFile("file", "pet.png", "image/png", files.demo("pet.png")))
            .get("id");
  }

  Map<String, Object> waitDone(String user, String id) throws Exception {
    long end = System.nanoTime() + java.util.concurrent.TimeUnit.SECONDS.toNanos(10);
    Map<String, Object> t;
    do {
      t = tasks.get(user, id);
      if (Set.of("SUCCEEDED", "FAILED").contains(t.get("status"))) return t;
      Thread.sleep(20);
    } while (System.nanoTime() < end);
    throw new AssertionError("Task did not terminate");
  }

  @Test
  void commitBeforeDispatchAndRollbackDoesNotDispatch() throws Exception {
    String user = user(), asset = upload(user);
    String[] id = {null};
    tx.executeWithoutResult(
        s -> {
          var task = tasks.create(user, new Tasks.Create("demo-pet", List.of(asset), null));
          id[0] = (String) task.get("id");
          assertEquals("QUEUED", db.taskById(id[0]).get("status"));
          assertTrue(
              db.steps(id[0]).stream().allMatch(step -> step.get("status").equals("NOT_STARTED")));
        });
    assertEquals("SUCCEEDED", waitDone(user, id[0]).get("status"));
    String[] rolled = {null};
    tx.executeWithoutResult(
        s -> {
          rolled[0] =
              (String)
                  tasks.create(user, new Tasks.Create("demo-pet", List.of(asset), null)).get("id");
          s.setRollbackOnly();
        });
    assertNull(db.taskById(rolled[0]));
  }

  @Test
  void stagesFailuresHistoryAndOwnership() throws Exception {
    String owner = user(), other = user(), asset = upload(owner);
    assertThrows(
        Problem.class,
        () -> tasks.create(other, new Tasks.Create("demo-pet", List.of(asset), null)));
    for (String fail : Simulation.STAGES) {
      String id =
          (String)
              tasks
                  .create(
                      owner,
                      new Tasks.Create(
                          "demo-pet",
                          List.of(asset),
                          new Simulation(fail, new Simulation.Delays(0, 0, 0))))
                  .get("id");
      var task = waitDone(owner, id);
      assertEquals("FAILED", task.get("status"));
      assertEquals(fail, task.get("failedStage"));
      var steps = db.steps(id);
      for (int i = Simulation.STAGES.indexOf(fail) + 1; i < 3; i++)
        assertEquals("NOT_STARTED", steps.get(i).get("status"));
      assertThrows(Problem.class, () -> tasks.get(other, id));
      long version = ((Number) task.get("version")).longValue();
      assertEquals(version, ((Number) tasks.get(owner, id).get("version")).longValue());
    }
    assertNull(db.assetByOwner(asset, other));
    assertTrue(((List<?>) tasks.history(owner, false, null, 20).get("items")).size() >= 3);
  }

  @Test
  void uploadRejectsSpoofingAndBrokenImage() throws Exception {
    String owner = user();
    assertThrows(
        Problem.class,
        () ->
            files.upload(
                owner,
                "demo-pet",
                new MockMultipartFile("file", "x.png", "image/png", "not png".getBytes())));
    assertThrows(
        Problem.class,
        () ->
            files.upload(
                owner,
                "demo-pet",
                new MockMultipartFile("file", "x.jpg", "image/jpeg", files.demo("pet.png"))));
  }

  @Test
  void restartClosesOnlyNonterminalTasks() throws Exception {
    String owner = user(), asset = upload(owner);
    String done =
        (String) tasks.create(owner, new Tasks.Create("demo-pet", List.of(asset), null)).get("id");
    waitDone(owner, done);
    String orphan = UUID.randomUUID().toString();
    tx.executeWithoutResult(
        s -> {
          db.task(orphan, owner, "demo-pet", "test", "{}");
          for (String stage : Simulation.STAGES) db.step(orphan, stage);
        });
    processing.run(null);
    assertEquals("FAILED", db.taskById(orphan).get("status"));
    assertEquals("INTERRUPTED", db.taskById(orphan).get("failureCode"));
    assertEquals("SUCCEEDED", db.taskById(done).get("status"));
  }

  @Test
  void saturatedQueueFailurePersistsFromAfterCommit() throws Exception {
    String owner = user(), asset = upload(owner);
    String first =
        (String)
            tasks
                .create(
                    owner,
                    new Tasks.Create(
                        "demo-pet",
                        List.of(asset),
                        new Simulation(null, new Simulation.Delays(5000, 0, 0))))
                .get("id");
    long deadline = System.nanoTime() + java.util.concurrent.TimeUnit.SECONDS.toNanos(3);
    while ("QUEUED".equals(db.taskById(first).get("status")) && System.nanoTime() < deadline)
      Thread.sleep(10);
    assertEquals("RUNNING", db.taskById(first).get("status"));
    String second =
        (String) tasks.create(owner, new Tasks.Create("demo-pet", List.of(asset), null)).get("id");
    String[] rejected = {null};
    tx.executeWithoutResult(
        s -> {
          rejected[0] =
              (String)
                  tasks.create(owner, new Tasks.Create("demo-pet", List.of(asset), null)).get("id");
          assertEquals("QUEUED", db.taskById(rejected[0]).get("status"));
        });
    assertEquals("FAILED", db.taskById(rejected[0]).get("status"));
    assertEquals("QUEUE_FULL", db.taskById(rejected[0]).get("failureCode"));
    assertEquals("SUCCEEDED", waitDone(owner, first).get("status"));
    assertEquals("SUCCEEDED", waitDone(owner, second).get("status"));
  }

  @Test
  void finalCompletionRollsBackStepAndPersistsFailure() throws Exception {
    String owner = user();
    String id = UUID.randomUUID().toString();
    tx.executeWithoutResult(
        s -> {
          db.task(id, owner, "demo-pet", "test", "{}");
          for (String stage : Simulation.STAGES) db.step(id, stage);
        });
    Db failing = org.mockito.Mockito.mock(Db.class, org.mockito.AdditionalAnswers.delegatesTo(db));
    org.mockito.Mockito.doThrow(new IllegalStateException("injected final persistence failure"))
        .when(failing)
        .success(org.mockito.ArgumentMatchers.eq(id), org.mockito.ArgumentMatchers.anyString());
    Processing isolated = new Processing(failing, files, manager, 1);
    try {
      new Pipeline(isolated, (task, stage) -> {}, ms -> {})
          .run(id, Simulation.resolve(null, 0, 0, 0, true));
      var task = db.taskById(id);
      assertEquals("FAILED", task.get("status"));
      assertEquals("FINALIZE", task.get("failedStage"));
      assertEquals("FAILED", db.steps(id).get(2).get("status"));
      assertNull(task.get("resultKey"));
    } finally {
      isolated.shutdown();
    }
  }
}
