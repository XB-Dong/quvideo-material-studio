"use client";
import Link from "next/link";
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="zh-CN">
      <body
        style={{
          margin: 0,
          padding: "15vh 24px",
          background: "#f8f9f7",
          color: "#252d3b",
          fontFamily: "Arial,Microsoft YaHei,sans-serif",
        }}
      >
        <main
          style={{
            maxWidth: 520,
            margin: "auto",
            padding: 32,
            background: "white",
            border: "1px solid #e2dff0",
            borderRadius: 24,
          }}
        >
          <p>疏影</p>
          <h1>工作台暂时无法打开</h1>
          <p>请重新加载页面。已受理的任务会继续在后台处理。</p>
          <button onClick={reset}>重新加载</button>　<Link href="/">返回探索</Link>
        </main>
      </body>
    </html>
  );
}
