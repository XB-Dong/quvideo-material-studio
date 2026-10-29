package com.quvideo.studio;

import static org.junit.jupiter.api.Assertions.*;

import java.util.*;
import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

class PipelineTest {
  static class Memory implements Pipeline.Store {
    List<String> events = new ArrayList<>();
    String status = "QUEUED", failed;

    public boolean begin(String id, String stage) {
      if (status.equals("SUCCEEDED") || status.equals("FAILED")) return false;
      events.add("begin:" + stage);
      status = "RUNNING";
      return true;
    }

    public void end(String id, String stage) {
      events.add("end:" + stage);
    }

    public void success(String id) {
      events.add("success");
      status = "SUCCEEDED";
    }

    public void fail(String id, String code, String reason) {
      events.add("fail:" + code);
      status = "FAILED";
      failed = reason;
    }
  }

  Simulation sim(String fail) {
    return Simulation.resolve(new Simulation(fail, new Simulation.Delays(0, 0, 0)), 0, 0, 0, true);
  }

  @Test
  void orderedBoundariesAndStableTerminal() {
    var store = new Memory();
    var p = new Pipeline(store, (id, stage) -> store.events.add("execute:" + stage), ms -> {});
    p.run("task", sim(null));
    assertEquals(
        List.of(
            "begin:ASSET_CHECK",
            "execute:ASSET_CHECK",
            "end:ASSET_CHECK",
            "begin:GENERATE",
            "execute:GENERATE",
            "end:GENERATE",
            "begin:FINALIZE",
            "execute:FINALIZE",
            "end:FINALIZE",
            "success"),
        store.events);
    p.run("task", sim(null));
    assertEquals(10, store.events.size());
    assertEquals("SUCCEEDED", store.status);
  }

  @ParameterizedTest
  @ValueSource(strings = {"ASSET_CHECK", "GENERATE", "FINALIZE"})
  void failureStopsFollowingHandlers(String fail) {
    var store = new Memory();
    List<String> executed = new ArrayList<>();
    new Pipeline(store, (id, stage) -> executed.add(stage), ms -> {}).run("task", sim(fail));
    assertEquals(Simulation.STAGES.subList(0, Simulation.STAGES.indexOf(fail)), executed);
    assertEquals("FAILED", store.status);
    assertTrue(store.failed.contains("阶段"));
    assertFalse(store.events.contains("success"));
    for (String later : Simulation.STAGES.subList(Simulation.STAGES.indexOf(fail) + 1, 3))
      assertFalse(store.events.contains("begin:" + later));
  }

  @Test
  void unexpectedActionFailureStopsPipeline() {
    var store = new Memory();
    new Pipeline(
            store,
            (id, stage) -> {
              throw new java.io.IOException("disk unavailable");
            },
            ms -> {})
        .run("task", sim(null));
    assertEquals(List.of("begin:ASSET_CHECK", "fail:PROCESSING_ERROR"), store.events);
  }

  @Test
  void simulationValidationAndSnapshot() {
    assertThrows(
        Problem.class, () -> Simulation.resolve(new Simulation("GENERATE", null), 1, 2, 3, false));
    assertThrows(Problem.class, () -> sim("INVALID"));
    assertThrows(
        Problem.class,
        () ->
            Simulation.resolve(
                new Simulation(null, new Simulation.Delays(-1, 0, 0)), 0, 0, 0, true));
    assertEquals(5, Simulation.resolve(null, 5, 6, 7, true).delay("ASSET_CHECK"));
  }
}
