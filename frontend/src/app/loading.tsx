import { Shell } from "../components/shell";
import { StatePanel } from "../components/motion/state-panel";
export default function Loading() {
  return (
    <Shell>
      <StatePanel
        loading
        title="正在展开你的工作台"
        detail="内容正在加载，请稍候。"
      />
    </Shell>
  );
}
