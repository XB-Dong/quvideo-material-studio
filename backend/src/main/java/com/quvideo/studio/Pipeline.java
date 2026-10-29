package com.quvideo.studio;
/** Deterministic processing orchestration. Store boundaries surround each action independently. */
public class Pipeline {
 public interface Store {boolean begin(String id,String stage);void end(String id,String stage);void success(String id);void fail(String id,String code,String reason);}
 public interface Action {void execute(String id,String stage)throws Exception;}
 public interface Sleeper {void sleep(long milliseconds)throws InterruptedException;}
 private final Store store;private final Action action;private final Sleeper sleeper;
 public Pipeline(Store store,Action action,Sleeper sleeper){this.store=store;this.action=action;this.sleeper=sleeper;}
 public void run(String id,Simulation simulation){String current=null;try{for(String stage:Simulation.STAGES){current=stage;if(!store.begin(id,stage))return;sleeper.sleep(simulation.delay(stage));if(stage.equals(simulation.failAt())){store.fail(id,"SIMULATED_FAILURE",label(stage)+"阶段按演示配置失败");return;}action.execute(id,stage);store.end(id,stage);}store.success(id);}catch(InterruptedException e){Thread.currentThread().interrupt();store.fail(id,"INTERRUPTED","任务因服务停止而中断");}catch(Exception e){store.fail(id,"PROCESSING_ERROR",label(current)+"阶段处理失败，请检查素材或服务存储");}}
 static String label(String stage){if(stage==null)return "任务";return switch(stage){case "ASSET_CHECK"->"素材检查";case "GENERATE"->"模拟生成";case "FINALIZE"->"结果整理";default->"任务";};}
}
