import { currentSessionGeneration } from "./session-generation";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const requestGeneration = currentSessionGeneration();
  const response = await fetch(path, {
    ...init,
    cache: "no-store",
    credentials: "same-origin",
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    if (
      response.status === 401 &&
      typeof window !== "undefined" &&
      !init.signal?.aborted &&
      requestGeneration === currentSessionGeneration()
    )
      window.dispatchEvent(
        new CustomEvent("session-expired", {
          detail: { generation: requestGeneration },
        }),
      );
    throw new ApiError(
      response.status,
      body.message || "请求暂时不可用，请稍后重试",
    );
  }
  return response.json();
}
