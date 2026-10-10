import { useEffect, useState } from 'react'
import { StoreProvider } from './store'
import * as S from './screens'

const NAV: [string, string, string[]][] = [
  ['dashboard', 'Dashboard', ['dashboard']], ['catalog', 'Catalog', ['catalog', 'part']], ['builder', 'Builder', ['builder']],
  ['builds', 'My Builds', ['builds', 'build', 'report']], ['compare', 'Compare', ['compare']], ['admin', 'Admin', ['admin']],
]

function useHash() {
  const read = () => location.hash.replace(/^#\/?/, '').split('/')
  const [h, set] = useState(read)
  useEffect(() => {
    const f = () => { set(read()); window.scrollTo(0, 0) }
    window.addEventListener('hashchange', f)
    return () => window.removeEventListener('hashchange', f)
  }, [])
  return h
}

export default function App() {
  const [route, id = ''] = useHash()
  const page = (() => {
    switch (route) {
      case 'dashboard': return <S.Dashboard />
      case 'catalog': return <S.Catalog />
      case 'part': return <S.Details id={id} />
      case 'builder': return <S.Builder />
      case 'builds': return <S.MyBuilds />
      case 'build': return <S.BuildDetails id={id} />
      case 'report': return <S.Report id={id} />
      case 'compare': return <S.Compare />
      case 'admin': return <S.Admin />
      default: return <S.Landing />
    }
  })()
  return (
    <StoreProvider>
      <nav className="n">
        <b>RigForge</b>
        {NAV.map(([to, label, on]) => <a key={to} href={'#/' + to} className={on.includes(route) ? 'on' : ''}>{label}</a>)}
        <a className="b" href="#/builder">New build</a>
      </nav>
      {page}
    </StoreProvider>
  )
}
