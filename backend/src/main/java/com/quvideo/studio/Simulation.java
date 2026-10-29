package com.quvideo.studio;
import java.util.*;
public record Simulation(String failAt, Delays delayMs) {
 public record Delays(Integer assetCheck,Integer generate,Integer finalize){}
 public static final List<String> STAGES=List.of("ASSET_CHECK","GENERATE","FINALIZE");
 static Simulation resolve(Simulation s,int check,int generate,int finalize,boolean enabled){if(s!=null&&!enabled)throw Problem.invalid("模拟控制未启用");String fail=s==null?null:s.failAt();if(fail!=null&&!STAGES.contains(fail))throw Problem.invalid("失败阶段无效");Delays d=s==null?null:s.delayMs();return new Simulation(fail,new Delays(valid(d==null?null:d.assetCheck(),check),valid(d==null?null:d.generate(),generate),valid(d==null?null:d.finalize(),finalize)));}
 static int valid(Integer value,int fallback){int x=value==null?fallback:value;if(x<0||x>30000)throw Problem.invalid("模拟耗时必须在 0 到 30000 毫秒之间");return x;}
 int delay(String stage){return switch(stage){case "ASSET_CHECK"->delayMs.assetCheck();case "GENERATE"->delayMs.generate();case "FINALIZE"->delayMs.finalize();default->throw new IllegalArgumentException(stage);};}
}
