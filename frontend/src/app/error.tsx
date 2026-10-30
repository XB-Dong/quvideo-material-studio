"use client";
import Link from "next/link";
import { Shell } from "../components/shell";
import { StatePanel } from "../components/motion/state-panel";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <Shell>
      <div role="alert">
        <StatePanel
          title="页面暂时无法打开"
          detail="你的后台任务仍会继续，可以重试或返回探索。"
        >
          <button onClick={reset}>重新加载</button>
          <Link href="/">返回探索 ↗</Link>
        </StatePanel>
      </div>
    </Shell>
  );
}
