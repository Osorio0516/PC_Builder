import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { PARTS, type Build, type Cat, type Items, type Part } from './data'

const SEED: Build[] = [
  { id: 'b1', name: 'Living Room 1440p', items: { CPU: 'cpu1', Motherboard: 'mb1', RAM: 'ram1', GPU: 'gpu1', Storage: 'ssd1', PSU: 'psu1', Case: 'case1' } },
  { id: 'b2', name: 'Budget 1080p', items: { CPU: 'cpu3', Motherboard: 'mb3', RAM: 'ram3', GPU: 'gpu2', Storage: 'ssd2', PSU: 'psu2', Case: 'case2' } },
]

function useLocal<T>(key: string, init: T) {
  const [v, set] = useState<T>(() => {
    try { const r = localStorage.getItem(key); return r ? (JSON.parse(r) as T) : init } catch { return init }
  })
  useEffect(() => { localStorage.setItem(key, JSON.stringify(v)) }, [key, v])
  return [v, set] as const
}

interface Store {
  parts: Part[]; builds: Build[]; draft: Items
  pick: (c: Cat, id: string) => void; setDraft: (i: Items) => void
  save: (name: string) => string; rename: (id: string, name: string) => void
  dup: (id: string) => void; del: (id: string) => void
  upsertPart: (p: Part) => void; delPart: (id: string) => void
}
const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [parts, setParts] = useLocal<Part[]>('rf-parts', PARTS)
  const [builds, setBuilds] = useLocal<Build[]>('rf-builds', SEED)
  const [draft, setDraft] = useLocal<Items>('rf-draft', {})
  const uid = () => 'b' + Date.now().toString(36)
  const value: Store = {
    parts, builds, draft, setDraft,
    pick: (c, id) => setDraft((d) => { const n = { ...d }; if (id) n[c] = id; else delete n[c]; return n }),
    save: (name) => { const id = uid(); setBuilds((b) => [...b, { id, name: name || 'Untitled build', items: draft }]); return id },
    rename: (id, name) => setBuilds((b) => b.map((x) => (x.id === id ? { ...x, name } : x))),
    dup: (id) => setBuilds((b) => { const s = b.find((x) => x.id === id); return s ? [...b, { ...s, id: uid(), name: s.name + ' (copy)' }] : b }),
    del: (id) => setBuilds((b) => b.filter((x) => x.id !== id)),
    upsertPart: (p) => setParts((a) => (a.some((x) => x.id === p.id) ? a.map((x) => (x.id === p.id ? p : x)) : [...a, p])),
    delPart: (id) => setParts((a) => a.filter((x) => x.id !== id)),
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useStore must be used inside StoreProvider')
  return c
}
