export type Session = {
  userId: string;
  displayName: string;
  expiresAt: string;
};
export type Template = {
  id: string;
  title: string;
  categoryId: string;
  coverUrl: string;
  description: string;
  requiredImageCount: number;
  acceptedMimeTypes: string[];
  maxFileSizeBytes: number;
};
export type Asset = {
  id: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  width: number;
  height: number;
};
export type Stage = "ASSET_CHECK" | "GENERATE" | "FINALIZE";
export type Task = {
  id: string;
  templateId: string;
  templateTitle: string;
  status: "QUEUED" | "RUNNING" | "SUCCEEDED" | "FAILED";
  stage: Stage | null;
  failedStage: Stage | null;
  failureCode: string | null;
  failureReason: string | null;
  resultUrl: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
  startedAt: string | null;
  completedAt: string | null;
  steps: {
    stage: Stage;
    status: string;
    startedAt: string | null;
    completedAt: string | null;
    failureReason: string | null;
  }[];
};
export type TaskPage = { items: Task[]; nextCursor: string | null };
export const terminal = (task: Task) =>
  task.status === "SUCCEEDED" || task.status === "FAILED";
export const stageLabel: Record<Stage, string> = {
  ASSET_CHECK: "素材检查",
  GENERATE: "模拟生成",
  FINALIZE: "结果整理",
};
export function mergeTask(previous: Task | undefined, next: Task): Task {
  return previous &&
    (previous.version > next.version || (terminal(previous) && !terminal(next)))
    ? previous
    : next;
}
