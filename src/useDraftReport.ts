import { useEffect, useState } from "react";
import { api, errorMessage } from "./api";
import { CATS, type Compatibility, type Power } from "./data";
import { useStore } from "./store";

export interface DraftReport {
  compatibility: Compatibility;
  power: Power;
  warnings: string[];
}

export function useDraftReport(enabled: boolean) {
  const { draft, editingId, builds } = useStore();
  const original = builds.find((b) => b.id === editingId);
  // Preserve quantities from an edited saved build, just as Save does.
  const payload = JSON.stringify({ items: CATS.flatMap((cat) => {
    const componentId = draft[cat];
    return componentId ? [{ componentId, quantity:
      original?.rows.find((r) => r.componentId._id === componentId)?.quantity ?? 1
    }] : [];
  }) });
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<{
    key: string;
    data?: DraftReport;
    error?: string;
  } | null>(null);
  const key = `${payload}:${attempt}`;
  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      void api.post<{ data: DraftReport }>("/builds/preview", JSON.parse(payload), {
        signal: controller.signal,
      }).then((response) => {
        if (!controller.signal.aborted) setState({ key, data: response.data.data });
      }).catch((error: unknown) => {
        if (!controller.signal.aborted) setState({ key, error: errorMessage(error) });
      });
    }, 250);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [enabled, key, payload]);
  // A result for previous selections is never presented as current.
  const current = enabled && state?.key === key ? state : null;
  return {
    data: current?.data,
    error: current?.error,
    loading: enabled && !current,
    retry: () => setAttempt((n) => n + 1),
  };
}
