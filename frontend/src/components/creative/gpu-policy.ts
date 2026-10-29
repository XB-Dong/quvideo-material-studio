export type GpuAssessment = {
  kind: "yingzuo-gpu-capability";
  allowed: boolean;
  released: boolean;
  reason: string;
  renderer: string;
  probeMs: number;
  releaseMs: number;
};
const unsupported = (reason: string): GpuAssessment => ({
  kind: "yingzuo-gpu-capability",
  allowed: false,
  released: true,
  reason,
  renderer: "",
  probeMs: 0,
  releaseMs: 0,
});
export function classifyGpuRenderer(
  renderer: string,
  debugInfoAvailable: boolean,
) {
  if (
    /swiftshader|llvmpipe|softpipe|software|lavapipe|basic render/i.test(
      renderer,
    )
  )
    return { allowed: false, reason: "software-renderer" };
  if (
    !debugInfoAvailable ||
    !renderer.trim() ||
    !/angle|nvidia|intel|amd|radeon|apple|adreno|mali|powervr|direct3d|vulkan|opengl|mesa/i.test(
      renderer,
    )
  )
    return { allowed: false, reason: "unrecognized-renderer" };
  return { allowed: true, reason: "hardware-capable" };
}
const workerSource = `const classifyRenderer = ${classifyGpuRenderer.toString()};
self.onmessage=()=>{
 const start=performance.now();let gl=null;let renderer="";let allowed=false;let reason="unsupported";let releaseMs=0;
 try{const canvas=new OffscreenCanvas(1,1);gl=canvas.getContext("webgl2",{failIfMajorPerformanceCaveat:true,alpha:false,antialias:false});if(gl){const info=gl.getExtension("WEBGL_debug_renderer_info");renderer=String(gl.getParameter(info?info.UNMASKED_RENDERER_WEBGL:gl.RENDERER));const decision=classifyRenderer(renderer,!!info);allowed=decision.allowed;reason=decision.reason;}}
 catch{reason="unsupported";allowed=false;}
 const done=()=>{const released=!gl||gl.isContextLost();self.postMessage({kind:"yingzuo-gpu-capability",allowed:allowed&&released,released,reason:released?reason:"release-unconfirmed",renderer,probeMs:performance.now()-start,releaseMs});self.close()};
 if(gl){try{const releaseStart=performance.now();gl.getExtension("WEBGL_lose_context")?.loseContext();releaseMs=performance.now()-releaseStart;}catch{allowed=false;reason="release-error";}if(!gl.isContextLost()){const wait=()=>{if(gl.isContextLost()||performance.now()-start>1500){done();return;}setTimeout(wait,10)};setTimeout(wait,0);return;}}done();
};`;
let cached: GpuAssessment | undefined;
export function assessGpu(signal: AbortSignal): Promise<GpuAssessment> {
  if (cached) return Promise.resolve(cached);
  if (typeof Worker === "undefined" || typeof OffscreenCanvas === "undefined")
    return Promise.resolve(unsupported("worker-unavailable"));
  return new Promise((resolve) => {
    let worker: Worker | undefined;
    let url = "";
    let settled = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const started = performance.now();
    const finish = (result: GpuAssessment) => {
      if (settled) return;
      settled = true;
      if (timeout) clearTimeout(timeout);
      signal.removeEventListener("abort", abort);
      if (worker) {
        worker.onmessage = null;
        worker.onerror = null;
        worker.terminate();
      }
      if (url) URL.revokeObjectURL(url);
      if (!signal.aborted) cached = result;
      try {
        performance.measure("yingzuo-gpu-probe", {
          start: started,
          end: performance.now(),
          detail: result,
        });
      } catch {}
      resolve(result);
    };
    const abort = () => finish(unsupported("aborted"));
    if (signal.aborted) {
      abort();
      return;
    }
    signal.addEventListener("abort", abort, { once: true });
    try {
      url = URL.createObjectURL(
        new Blob([workerSource], { type: "application/javascript" }),
      );
      worker = new Worker(url, { name: "yingzuo-gpu-capability" });
      worker.onmessage = (event) => {
        const result = event.data as GpuAssessment;
        if (
          result?.kind !== "yingzuo-gpu-capability" ||
          typeof result.allowed !== "boolean" ||
          result.released !== true
        ) {
          finish(unsupported("invalid-assessment"));
          return;
        }
        finish(result);
      };
      worker.onerror = () => finish(unsupported("worker-error"));
      timeout = setTimeout(() => finish(unsupported("probe-timeout")), 2000);
      worker.postMessage({ kind: "yingzuo-gpu-probe" });
    } catch {
      finish(unsupported("worker-error"));
    }
  });
}
