"use client";
import {
  useInfiniteQuery,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "./api";
import { mergeTask, terminal, type Task, type TaskPage } from "./types";
export function useTasks(userId: string) {
  const client = useQueryClient();
  const base = ["personal", userId] as const;
  const history = useInfiniteQuery({
    queryKey: [...base, "history"],
    enabled: !!userId,
    initialPageParam: "",
    queryFn: ({ signal, pageParam }) =>
      api<TaskPage>(
        "/api/tasks?limit=20" +
          (pageParam ? "&cursor=" + encodeURIComponent(pageParam) : ""),
        { signal },
      ),
    getNextPageParam: (p) => p.nextCursor || undefined,
  });
  const active = useQuery({
    queryKey: [...base, "active"],
    enabled: !!userId,
    queryFn: async ({ signal }) => {
      let cursor: string | null = null;
      const tasks: Task[] = [];
      do {
        const page: TaskPage = await api(
          "/api/tasks?activeOnly=true&limit=50" +
            (cursor ? "&cursor=" + encodeURIComponent(cursor) : ""),
          { signal },
        );
        tasks.push(...page.items);
        cursor = page.nextCursor;
      } while (cursor);
      return tasks;
    },
  });
  const created = useQuery<Task[]>({
    queryKey: [...base, "created"],
    queryFn: async () => [],
    enabled: false,
    initialData: [],
  });
  const snapshots = new Map<string, Task>();
  for (const t of [
    ...(history.data?.pages.flatMap((p) => p.items) || []),
    ...(active.data || []),
    ...(created.data || []),
  ])
    snapshots.set(t.id, mergeTask(snapshots.get(t.id), t));
  const seed = [...snapshots.values()];
  const tracked = useQueries({
    queries: seed.map((t) => ({
      queryKey: [...base, "task", t.id],
      initialData: t,
      queryFn: ({ signal }: { signal: AbortSignal }) =>
        api<Task>("/api/tasks/" + t.id, { signal }),
      structuralSharing: (old: unknown, next: unknown) =>
        mergeTask(old as Task | undefined, next as Task),
      refetchInterval: (q: { state: { data: Task | undefined } }) =>
        q.state.data && !terminal(q.state.data) ? 2000 : (false as const),
      retry: false,
      enabled: !!userId && !terminal(t),
    })),
  });
  const tasks = seed
    .map((t, i) => ({
      task: mergeTask(t, tracked[i]?.data || t),
      queryError: tracked[i]?.error,
      refresh: () => tracked[i]?.refetch(),
    }))
    .sort((a, b) => b.task.createdAt.localeCompare(a.task.createdAt));
  const add = (task: Task) => {
    client.setQueryData<Task[]>([...base, "created"], (old) => [
      ...(old || []).filter((t) => t.id !== task.id),
      task,
    ]);
    client.setQueryData([...base, "task", task.id], (old: Task | undefined) =>
      mergeTask(old, task),
    );
  };
  const refresh = () => {
    history.refetch();
    active.refetch();
    tracked.forEach((t) => {
      if (t.data && !terminal(t.data)) t.refetch();
    });
  };
  return { tasks, add, refresh, history, active };
}
