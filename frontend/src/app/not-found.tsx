import { Shell } from "../components/shell";
import { StatePanel } from "../components/motion/state-panel";
export default function NotFound() {
  return (
    <Shell>
      <StatePanel
        title="这个页面暂时找不到"
        detail="链接可能已经改变，回到模板继续探索。"
      />
    </Shell>
  );
}
