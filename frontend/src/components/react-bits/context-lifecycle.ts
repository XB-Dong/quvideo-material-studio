type GL = WebGLRenderingContext | WebGL2RenderingContext;
const contexts = new WeakMap<HTMLCanvasElement, GL>();
export function rememberContext(
  canvas: HTMLCanvasElement | null | undefined,
  context: GL | null | undefined,
) {
  if (canvas && context) contexts.set(canvas, context);
}
export function releaseContext(canvas: HTMLCanvasElement) {
  const context = contexts.get(canvas);
  contexts.delete(canvas);
  if (!context) return;
  const started = performance.now();
  try {
    context.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
  } finally {
    try {
      performance.measure("yingzuo-effect-release", {
        start: started,
        end: performance.now(),
      });
    } catch {}
  }
}
