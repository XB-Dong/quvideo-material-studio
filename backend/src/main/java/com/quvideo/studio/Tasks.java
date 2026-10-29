package com.quvideo.studio;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.*;
import java.util.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.*;

@Service
public class Tasks {
  public record Create(String templateId, List<String> assetIds, Simulation simulation) {}

  private final Db db;
  private final FilesService files;
  private final Processing processing;
  private final TransactionTemplate tx;
  private final ObjectMapper json;

  @Value("${SIMULATION_CONTROLS_ENABLED:true}")
  private boolean enabled;

  @Value("${SIMULATION_ASSET_CHECK_DELAY_MS:1000}")
  private int check;

  @Value("${SIMULATION_GENERATE_DELAY_MS:5000}")
  private int generate;

  @Value("${SIMULATION_FINALIZE_DELAY_MS:1000}")
  private int finalizeDelay;

  public Tasks(
      Db db, FilesService files, Processing processing, TransactionTemplate tx, ObjectMapper json) {
    this.db = db;
    this.files = files;
    this.processing = processing;
    this.tx = tx;
    this.json = json;
  }

  Map<String, Object> create(String user, Create request) {
    if (request.templateId() == null) throw Problem.invalid("请选择模板");
    var template = db.template(request.templateId());
    if (template == null) throw Problem.missing();
    var ids = request.assetIds();
    if (ids == null
        || ids.size() != ((Number) template.get("requiredImageCount")).intValue()
        || new HashSet<>(ids).size() != ids.size()) throw Problem.invalid("图片数量必须符合模板要求且不能重复");
    for (String assetId : ids) {
      var asset = db.assetByOwner(assetId, user);
      if (asset == null) throw Problem.missing();
      if (!files.exists((String) asset.get("storageKey"))) throw Problem.invalid("上传图片已丢失，请重新上传");
      if (((Number) asset.get("sizeBytes")).longValue()
              > ((Number) template.get("maxFileSizeBytes")).longValue()
          || !Set.of("image/png", "image/jpeg").contains(asset.get("mimeType")))
        throw Problem.invalid("素材不符合模板要求");
    }
    Simulation sim =
        Simulation.resolve(request.simulation(), check, generate, finalizeDelay, enabled);
    String id = UUID.randomUUID().toString();
    String snapshot;
    try {
      snapshot = json.writeValueAsString(sim);
    } catch (Exception e) {
      throw new IllegalStateException(e);
    }
    tx.executeWithoutResult(
        s -> {
          db.task(id, user, request.templateId(), (String) template.get("title"), snapshot);
          for (int i = 0; i < ids.size(); i++) db.link(id, ids.get(i), i);
          for (String stage : Simulation.STAGES) db.step(id, stage);
          TransactionSynchronizationManager.registerSynchronization(
              new TransactionSynchronization() {
                @Override
                public void afterCommit() {
                  processing.dispatch(id, sim);
                }
              });
        });
    return get(user, id);
  }

  Map<String, Object> get(String user, String id) {
    return tx.execute(
        s -> {
          var task = db.taskOwned(id, user);
          if (task == null) throw Problem.missing();
          return view(task);
        });
  }

  Map<String, Object> view(Map<String, Object> task) {
    String id = (String) task.get("id");
    String key = (String) task.remove("resultKey");
    task.remove("userId");
    task.remove("simulationJson");
    for (String field :
        List.of("stage", "failedStage", "failureCode", "failureReason", "startedAt", "completedAt"))
      task.putIfAbsent(field, null);
    task.put("resultUrl", key == null ? null : "/media/results/" + id);
    task.put(
        "steps",
        db.steps(id).stream()
            .map(
                step -> {
                  for (String field : List.of("startedAt", "completedAt", "failureReason"))
                    step.putIfAbsent(field, null);
                  Api.times(step);
                  return step;
                })
            .toList());
    Api.times(task);
    return task;
  }

  Map<String, Object> history(String user, boolean active, String cursor, int limit) {
    return tx.execute(s -> historySnapshot(user, active, cursor, limit));
  }

  Map<String, Object> historySnapshot(String user, boolean active, String cursor, int limit) {
    if (limit < 1 || limit > 50) throw Problem.invalid("每页条数应在 1 到 50 之间");
    LocalDateTime before = null;
    String beforeId = null;
    if (cursor != null) {
      try {
        String decoded =
            new String(
                Base64.getUrlDecoder().decode(cursor), java.nio.charset.StandardCharsets.UTF_8);
        String[] parts = decoded.split("[|]", 2);
        before = LocalDateTime.parse(parts[0]);
        beforeId = UUID.fromString(parts[1]).toString();
      } catch (Exception e) {
        throw Problem.invalid("分页游标无效");
      }
    }
    var rows = db.history(user, active, before, beforeId, limit + 1);
    String next = null;
    if (rows.size() > limit) {
      rows = rows.subList(0, limit);
      var last = rows.getLast();
      next =
          Base64.getUrlEncoder()
              .withoutPadding()
              .encodeToString(
                  (Api.local(last.get("createdAt")) + "|" + last.get("id"))
                      .getBytes(java.nio.charset.StandardCharsets.UTF_8));
    }
    Map<String, Object> result = new HashMap<>();
    result.put("items", rows.stream().map(this::view).toList());
    result.put("nextCursor", next);
    return result;
  }
}
