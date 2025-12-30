import { Routes, Route } from "react-router-dom"
import Sidebar from "./layout/Sidebar"
import Dashboard from "./pages/Dashboard"
import Articles from "./pages/Articles"
import CreateArticle from "./pages/CreateArticle"
import EditArticle from "./pages/EditArticle"
import UpdateFromGoogle from "./pages/UpdateFromGoogle"

export default function App() {
  return (
    <div className="flex h-screen bg-[rgb(var(--bg))]">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/articles/:id/edit" element={<EditArticle />} />
            <Route path="/articles/new" element={<CreateArticle />} />
            <Route path="/articles/update-google" element={<UpdateFromGoogle />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}
