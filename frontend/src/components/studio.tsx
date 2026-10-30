"use client";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { api, ApiError } from "../lib/api";
import type { Asset, Task, Template } from "../lib/types";
import { useIdentity } from "./providers";
import { Shell } from "./shell";
import { History } from "./history";
import { StatePanel } from "./motion/state-panel";
import {
  SceneEdge,
  beginCoverTransition,
  clickFeedback,
} from "./motion/journey";
import { StudioIcon } from "./visual/icons";
export function Studio({ id }: { id: string }) {
  const template = useQuery({
    queryKey: ["template", id],
    queryFn: ({ signal }) =>
      api<Template>("/api/templates/" + encodeURIComponent(id), { signal }),
  });
  return (
    <Shell>
      {template.isPending ? (
        <StatePanel
          loading
          title="正在加载模板"
          detail="即将展开创作工作台。"
        />
      ) : template.isError ? (
        <div role="alert">
          <StatePanel
            title={
              template.error instanceof ApiError &&
              template.error.status === 404
                ? "这个模板不存在"
                : "模板暂时无法加载"
            }
            detail="你可以重试，或选择另一张模板继续创作。"
          >
            <button onClick={() => template.refetch()}>重试</button>
            <Link href="/">返回模板列表</Link>
          </StatePanel>
        </div>
      ) : (
        <div className="studio-layout p12-studio-layout">
          <Maker key={template.data.id} template={template.data} />
          <History />
        </div>
      )}
    </Shell>
  );
}
export type Slot = {
  status: "EMPTY" | "UPLOADING" | "READY" | "ERROR";
  asset?: Asset;
  preview?: string;
  error?: string;
};
export function UploadSlot({
  index,
  template,
  onChange,
  disabled = false,
}: {
  index: number;
  template: Template;
  onChange: (slot: Slot) => void;
  disabled?: boolean;
}) {
  const [slot, setSlot] = useState<Slot>({ status: "EMPTY" });
  const version = useRef(0);
  const controller = useRef<AbortController | null>(null);
  const preview = useRef<string | undefined>(undefined);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      controller.current?.abort();
      if (preview.current) URL.revokeObjectURL(preview.current);
    };
  }, []);
  const set = (next: Slot) => {
    setSlot(next);
    onChange(next);
  };
  const clear = () => {
    version.current++;
    controller.current?.abort();
    if (preview.current) URL.revokeObjectURL(preview.current);
    preview.current = undefined;
    set({ status: "EMPTY" });
  };
  const choose = async (file: File | undefined) => {
    if (!file) return;
    const current = ++version.current;
    controller.current?.abort();
    if (preview.current) URL.revokeObjectURL(preview.current);
    preview.current = undefined;
    if (!template.acceptedMimeTypes.includes(file.type)) {
      set({ status: "ERROR", error: "请选择 JPEG 或 PNG 图片" });
      return;
    }
    if (file.size > template.maxFileSizeBytes) {
      set({ status: "ERROR", error: "图片超过模板允许的大小" });
      return;
    }
    const url = URL.createObjectURL(file);
    preview.current = url;
    set({ status: "UPLOADING", preview: url });
    const abort = new AbortController();
    controller.current = abort;
    const form = new FormData();
    form.append("templateId", template.id);
    form.append("file", file);
    try {
      const asset = await api<Asset>("/api/assets", {
        method: "POST",
        body: form,
        signal: abort.signal,
      });
      if (
        mounted.current &&
        !abort.signal.aborted &&
        current === version.current
      )
        set({ status: "READY", asset, preview: url });
    } catch (e) {
      if (
        mounted.current &&
        current === version.current &&
        !abort.signal.aborted
      )
        set({
          status: "ERROR",
          preview: url,
          error: e instanceof Error ? e.message : "上传失败，请重新选择",
        });
    }
  };
  return (
    <div
      data-upload-state={slot.status}
      className={"upload-slot p12-upload " + slot.status.toLowerCase()}
    >
      <label
        className="upload-label"
        onPointerDown={(e) => {
          if (!disabled) clickFeedback(e.currentTarget);
        }}
      >
        <input
          disabled={disabled}
          type="file"
          accept={template.acceptedMimeTypes.join(",")}
          aria-label={"选择第" + (index + 1) + "张图片"}
          onChange={(e) => {
            choose(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
        {slot.preview ? (
          <img
            key={slot.preview}
            src={slot.preview}
            alt={"第" + (index + 1) + "张图片预览"}
          />
        ) : (
          <>
            <span className="upload-plus">＋</span>
            <strong>上传第 {index + 1} 张照片</strong>
            <small>点击选择 · JPEG / PNG</small>
          </>
        )}
        <svg
          className="p12-upload-edge"
          aria-hidden="true"
          viewBox="0 0 300 150"
          preserveAspectRatio="none"
        >
          <rect x="2" y="2" width="296" height="146" rx="12" pathLength="100" />
        </svg>
        {slot.preview && (
          <span className="upload-overlay">
            {slot.status === "UPLOADING"
              ? "正在上传…"
              : slot.status === "READY"
                ? "点击替换"
                : "选择照片"}
          </span>
        )}
      </label>
      <div className="p12-upload-status" aria-live="polite" key={slot.status}>
        {slot.status === "READY" ? (
          <>
            <svg aria-hidden="true" viewBox="0 0 20 20">
              <path d="m4 10 4 4 8-9" />
            </svg>
            已准备好
          </>
        ) : slot.status === "UPLOADING" ? (
          <>
            <span className="p12-upload-dot" />
            连接素材服务
          </>
        ) : slot.status === "ERROR" ? (
          "请重新选择图片"
        ) : (
          ""
        )}
      </div>
      {slot.status !== "EMPTY" && (
        <button
          className="remove-upload"
          onClick={clear}
          aria-label={"移除第" + (index + 1) + "张图片"}
        >
          ×
        </button>
      )}
      {slot.error && (
        <p role="alert" className="failure">
          {slot.error}
        </p>
      )}
    </div>
  );
}
export function Maker({ template: t }: { template: Template }) {
  const { session, epoch } = useIdentity();
  const client = useQueryClient();
  const [slots, setSlots] = useState<Slot[]>(() =>
    Array.from({ length: t.requiredImageCount }, () => ({ status: "EMPTY" })),
  );
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const locked = useRef(false);
  const alive = useRef(true);
  const pending = useRef<AbortController | null>(null);
  const submissionGeneration = useRef(0);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      pending.current?.abort();
    };
  }, []);
  useEffect(() => {
    pending.current?.abort();
    pending.current = null;
    submissionGeneration.current++;
    locked.current = false;
    setSubmitting(false);
    setSlots(
      Array.from({ length: t.requiredImageCount }, () => ({ status: "EMPTY" })),
    );
    setMessage("");
  }, [session?.userId, t.requiredImageCount]);
  const submit = async () => {
    if (locked.current || !session || slots.some((s) => s.status !== "READY"))
      return;
    locked.current = true;
    setSubmitting(true);
    setMessage("");
    const startEpoch = epoch.current;
    const startGeneration = ++submissionGeneration.current;
    const userId = session.userId;
    const abort = new AbortController();
    pending.current = abort;
    try {
      const task = await api<Task>("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: t.id,
          assetIds: slots.map((s) => s.asset!.id),
        }),
        signal: abort.signal,
      });
      if (
        alive.current &&
        !abort.signal.aborted &&
        epoch.current === startEpoch &&
        submissionGeneration.current === startGeneration
      ) {
        client.setQueryData<Task[]>(["personal", userId, "created"], (old) => [
          ...(old || []),
          task,
        ]);
        setMessage("任务已受理，你可以继续创建作品。");
      }
    } catch (e) {
      if (
        alive.current &&
        epoch.current === startEpoch &&
        submissionGeneration.current === startGeneration &&
        !abort.signal.aborted
      )
        setMessage(
          e instanceof ApiError && e.status < 500
            ? e.message
            : "提交结果未确认，请先刷新右侧记录，避免重复提交。",
        );
    } finally {
      if (
        alive.current &&
        epoch.current === startEpoch &&
        submissionGeneration.current === startGeneration
      ) {
        pending.current = null;
        locked.current = false;
        setSubmitting(false);
      }
    }
  };
  return (
    <aside className="maker-panel p12-studio">
      <Link
        href="/"
        className="back-link"
        onNavigate={() => beginCoverTransition(t.id)}
        onPointerDown={(e) => clickFeedback(e.currentTarget)}
      >
        ← 返回探索
      </Link>
      <h1>{t.title}</h1>
      <img
        className="detail-cover"
        data-public-cover={t.id}
        src={t.coverUrl}
        alt={t.title + "示例封面"}
      />
      <SceneEdge />
      <p className="description">{t.description}</p>
      <div className="section-top">
        <h2>上传素材</h2>
        <span className="muted">{t.requiredImageCount} 张照片</span>
      </div>
      <p className="file-requirement">
        JPEG / PNG · 每张不超过 {Math.round(t.maxFileSizeBytes / 1024 / 1024)}{" "}
        MB
      </p>
      <div className="upload-list" key={session?.userId || "pending"}>
        {Array.from({ length: t.requiredImageCount }, (_, i) => (
          <UploadSlot
            key={i}
            index={i}
            template={t}
            disabled={!session || submitting}
            onChange={(s) =>
              setSlots((old) => old.map((v, j) => (j === i ? s : v)))
            }
          />
        ))}
      </div>
      <div
        className="maker-action"
        data-submission-state={
          submitting
            ? "submitting"
            : message.startsWith("任务已受理")
              ? "accepted"
              : "idle"
        }
      >
        {message && (
          <p role="status" className="submission-message">
            {message}
          </p>
        )}
        <button
          className="primary-button"
          disabled={
            !session || submitting || slots.some((s) => s.status !== "READY")
          }
          onPointerDown={(e) => clickFeedback(e.currentTarget)}
          onClick={submit}
        >
          {submitting ? "正在提交…" : "开始制作"} <StudioIcon name="spark" />
        </button>
        <small>制作在后台进行，离开页面也会继续</small>
      </div>
    </aside>
  );
}
