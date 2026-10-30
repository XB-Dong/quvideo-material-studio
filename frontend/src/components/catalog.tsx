"use client";
import { beginCoverTransition, clickFeedback } from "./motion/journey";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";
import { api } from "../lib/api";
import type { Template } from "../lib/types";
import { Shell } from "./shell";
import { AnimatedBorder, CardVisual, cardKind } from "./creative/visuals";
import { CreativeShowcase, PublicImage } from "./creative/showcase";
export function Catalog() {
  const [category, setCategory] = useState("");
  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: ({ signal }) =>
      api<{ id: string; title: string }[]>("/api/categories", { signal }),
  });
  const templates = useQuery({
    queryKey: ["templates", category],
    queryFn: ({ signal }) =>
      api<Template[]>(
        "/api/templates" +
          (category ? "?categoryId=" + encodeURIComponent(category) : ""),
        { signal },
      ),
  });
  const showcaseTemplates = useQuery({
    queryKey: ["templates", ""],
    queryFn: ({ signal }) => api<Template[]>("/api/templates", { signal }),
  });
  return (
    <Shell>
      <CreativeShowcase templates={showcaseTemplates.data || []}>
        <div className="section-top" id="templates">
          <h2>探索灵感</h2>
          <span className="muted">为你的每一种想象</span>
        </div>
        <div className="categories" aria-label="模板分类">
          <button
            className={!category ? "active" : ""}
            onClick={() => setCategory("")}
          >
            全部模板
          </button>
          {categories.data?.map((c) => (
            <button
              key={c.id}
              className={category === c.id ? "active" : ""}
              onClick={() => setCategory(c.id)}
            >
              {c.title}
            </button>
          ))}
        </div>
        {categories.isError && (
          <p role="alert">
            分类加载失败{" "}
            <button onClick={() => categories.refetch()}>重试</button>
          </p>
        )}
        {templates.isPending ? (
          <div className="template-grid">
            {Array.from({ length: 4 }, (_, i) => (
              <div className="skeleton template-cover" key={i} />
            ))}
          </div>
        ) : templates.isError ? (
          <div className="empty-state" role="alert">
            <h3>暂时无法加载模板</h3>
            <p>{templates.error.message}</p>
            <button onClick={() => templates.refetch()}>重新加载</button>
          </div>
        ) : !templates.data?.length ? (
          <div className="empty-state">
            这个分类还没有模板，试试其他分类吧。
          </div>
        ) : (
          <div className="template-grid">
            {templates.data.map((t, i) => (
              <Link
                href={"/templates/" + t.id}
                className="template-card"
                onPointerDown={e=>clickFeedback(e.currentTarget)}
                onNavigate={()=>beginCoverTransition(t.id)}
                key={t.id}
              >
                <div className="template-image">
                  <PublicImage
                    src={t.coverUrl}
                    publicId={t.id}
                    alt={t.title}
                    className="template-cover"
                  />
                  <CardVisual id={t.id} src={t.coverUrl} />
                </div>
                {cardKind(t.id) && <AnimatedBorder kind={cardKind(t.id)} />}
                <span className="template-tag">
                  {t.requiredImageCount} 张图片
                </span>
                <div className="template-meta">
                  <small>0{i + 1} / 创作模板</small>
                  <h3>
                    {t.title}
                    <span>↗</span>
                  </h3>
                  <p>{t.description}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CreativeShowcase>
    </Shell>
  );
}
