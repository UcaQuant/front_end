import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center gap-6 p-6">
      <div className="flex items-center gap-6">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1 className="text-3xl font-bold tracking-tight">Vite + React</h1>
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 text-center max-w-md w-full">
        <button
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700 active:bg-indigo-800 transition"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>
        <p className="mt-4 text-sm text-slate-600">
          Edit <code className="font-mono">src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="text-sm text-slate-500">
        If you can see styling, Tailwind is working.
      </p>
    </div>
  )
}

export default App
