import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  FileText,
  Plus,
  RefreshCcw,
  Moon,
  Sun,
} from "lucide-react"
import { useTheme } from "@/context/ThemeContext"

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <aside className="flex w-64 flex-col border-r border-sidebar-border bg-sidebar p-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
          <FileText className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">BeyondChats</h1>
          <p className="text-xs text-muted-foreground">Article Manager</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        <Item to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" />
        <Item to="/articles" icon={<FileText size={18} />} label="Articles" />
        <Item to="/articles/new" icon={<Plus size={18} />} label="Create Article" />
        <Item
          to="/articles/update-google"
          icon={<RefreshCcw size={18} />}
          label="Update from Google"
        />
      </nav>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="mt-4 sidebar-item w-full justify-center"
        aria-label="Toggle theme"
      >
        {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        <span className="sr-only">Toggle theme</span>
      </button>
    </aside>
  )
}

function Item({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `sidebar-item ${isActive ? 'active' : ''}`
      }
    >
      {icon}
      <span className="font-medium">{label}</span>
    </NavLink>
  )
}
