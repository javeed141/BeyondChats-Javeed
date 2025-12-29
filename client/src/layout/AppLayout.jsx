import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-muted/40">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
