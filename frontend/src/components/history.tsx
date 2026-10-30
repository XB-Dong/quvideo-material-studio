"use client";
import Link from "next/link";
import { SceneEdge, clickFeedback } from "./motion/journey";
import { useState, useEffect, useRef, type ReactNode } from "react";
import { useIdentity } from "./providers";
import { useTasks } from "../lib/use-tasks";
import { stageLabel, type Task } from "../lib/types";
import { Modal, Shell } from "./shell";
import { StudioIcon } from "./visual/icons";
export function HistoryPage() {
  return (
    <Shell>
      <section className="history-page p12-history-page">
        <p className="eyebrow">YOUR CREATIVE JOURNEY</p>
        <h1>我的作品</h1>
        <p className="muted">每一次创作，都在这里留下记录。</p>
        <History />
      </section>
    </Shell>
  );
}
export function History({
  onReady,
}: {
  onReady?: (add: (task: Task) => void) => void;
}) {
  const { session } = useIdentity();
  return session ? (
    <HistoryContent
      key={session.userId}
      userId={session.userId}
      onReady={onReady}
    />
  ) : (
    <div className="empty-state">正在连接个人作品记录…</div>
  );
}
function HistoryContent({
  userId,
  onReady,
}: {
  userId: string;
  onReady?: (add: (task: Task) => void) => void;
}) {
  const model = useTasks(userId);
  const [preview, setPreview] = useState<Task | null>(null);
  const previewOrigin = useRef<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  // The parent uses the shared query cache for accepted tasks; no lifecycle callbacks needed.
  void onReady;
  return (
    <section className="history-panel p12-history">
      <div className="section-top">
        <div>
          <h2>
            制作记录 <span className="count">{model.tasks.length}</span>
          </h2>
          <p className="muted">后台持续制作，你可以继续探索。</p>
        </div>
        <button
          className="icon-button"
          aria-label="刷新制作记录"
          onClick={model.refresh}
        >
          <StudioIcon name="refresh" />
        </button>
      </div>
      <SceneEdge />
      {(model.history.isError || model.active.isError) && (
        <div className="query-error" role="alert">
          状态暂时无法更新，已有记录已保留。
          <button onClick={model.refresh}>恢复查询</button>
        </div>
      )}
      {model.history.isPending ? (
        <div className="empty-state">正在加载记录…</div>
      ) : !model.tasks.length ? (
        <div className="empty-state">
          <span className="empty-icon">
            <StudioIcon name="image" />
          </span>
          <h3>你的下一份作品，从这里开始</h3>
          <p>选择模板并上传照片，制作记录会出现在这里。</p>
          <Link className="p12-text-link" href="/">
            探索模板 ↗
          </Link>
        </div>
      ) : (
        <div className="task-grid">
          {model.tasks.map(({ task: t, queryError, refresh }) => (
            <TaskFrame
              task={t}
              key={t.id}
              emphasis={
                t.id ===
                model.tasks.find(
                  (item) =>
                    item.task.status === "RUNNING" ||
                    item.task.status === "QUEUED",
                )?.task.id
              }
            >
              <div className="task-visual">
                {t.status === "SUCCEEDED" && t.resultUrl ? (
                  <button
                    className="result-button"
                    onPointerDown={(e) => clickFeedback(e.currentTarget)}
                    onClick={(event) => {
                      const rect = event.currentTarget.getBoundingClientRect();
                      previewOrigin.current = {
                        left: rect.left,
                        top: rect.top,
                        width: rect.width,
                        height: rect.height,
                      };
                      setPreview(t);
                    }}
                    aria-label={"预览" + t.templateTitle}
                  >
                    <img src={t.resultUrl} alt={t.templateTitle + "制作结果"} />
                    <span>查看作品 ↗</span>
                  </button>
                ) : (
                  <div className="task-progress">
                    <span
                      className={
                        t.status === "FAILED" ? "failed-symbol" : "orbit"
                      }
                    >
                      {t.status === "FAILED" ? (
                        "!"
                      ) : (
                        <StudioIcon name="spark" />
                      )}
                    </span>
                    <strong>
                      {t.status === "QUEUED"
                        ? "等待制作"
                        : t.status === "FAILED"
                          ? "制作失败"
                          : t.stage
                            ? stageLabel[t.stage]
                            : "正在处理"}
                    </strong>
                    <p>
                      {t.status === "QUEUED"
                        ? "任务已受理，即将开始"
                        : t.status === "FAILED"
                          ? t.failureReason
                          : "正在把灵感变为画面…"}
                    </p>
                  </div>
                )}
              </div>
              <StagePath task={t} />
              <div className="task-info">
                <div>
                  <h3>{t.templateTitle}</h3>
                  <span
                    key={t.status + ":" + t.stage}
                    className={"status " + t.status.toLowerCase()}
                  >
                    {
                      {
                        QUEUED: "排队中",
                        RUNNING: "制作中",
                        SUCCEEDED: "已完成",
                        FAILED: "失败",
                      }[t.status]
                    }
                  </span>
                </div>
                <time dateTime={t.createdAt}>
                  {new Date(t.createdAt).toLocaleString("zh-CN", {
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
                <p className="task-id" title={t.id}>
                  任务 {t.id.slice(0, 8)}
                </p>
                {t.failedStage && (
                  <p className="failure">
                    失败阶段：{stageLabel[t.failedStage]}
                  </p>
                )}
                {queryError && (
                  <div className="query-error" role="alert">
                    查询暂时异常，保留上次状态。
                    <button onClick={refresh}>恢复查询</button>
                  </div>
                )}
              </div>
            </TaskFrame>
          ))}
        </div>
      )}
      {model.history.hasNextPage && (
        <button
          className="load-more"
          disabled={model.history.isFetchingNextPage}
          onClick={() => model.history.fetchNextPage()}
        >
          加载更早记录
        </button>
      )}
      {preview?.resultUrl && (
        <Modal
          title={preview.templateTitle}
          origin={previewOrigin.current}
          onClose={() => setPreview(null)}
        >
          <img
            className="preview-image"
            src={preview.resultUrl}
            alt={preview.templateTitle + "制作结果预览"}
          />
        </Modal>
      )}
    </section>
  );
}

function TaskFrame({
  task,
  emphasis,
  children,
}: {
  task: Task;
  emphasis: boolean;
  children: ReactNode;
}) {
  const before = useRef(task.status + ":" + task.stage);
  const [transition, setTransition] = useState("");
  useEffect(() => {
    const now = task.status + ":" + task.stage;
    if (now === before.current) return;
    before.current = now;
    setTransition(
      task.status === "SUCCEEDED"
        ? "success"
        : task.status === "FAILED"
          ? "failure"
          : "stage",
    );
    const timer = setTimeout(() => setTransition(""), 220);
    return () => clearTimeout(timer);
  }, [task.status, task.stage]);
  return (
    <article
      className="task-card p12-task"
      data-task-id={task.id}
      data-emphasis={emphasis}
      data-task-transition={transition}
    >
      {children}
    </article>
  );
}
function StagePath({ task }: { task: Task }) {
  const stages = ["ASSET_CHECK", "GENERATE", "FINALIZE"] as const;
  return (
    <ol className="p12-stage-path" aria-label="制作阶段">
      {stages.map((stage) => (
        <li
          key={stage}
          data-current={task.stage === stage && task.status === "RUNNING"}
          data-finished={
            task.status === "SUCCEEDED" ||
            task.steps.some(
              (s) => s.stage === stage && s.status === "SUCCEEDED",
            )
          }
        >
          <i aria-hidden="true" />
          <span>{stageLabel[stage]}</span>
        </li>
      ))}
    </ol>
  );
}
