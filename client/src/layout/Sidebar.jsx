import {
  LayoutDashboard,
  FileText,
  Plus,
  RefreshCcw,
} from "lucide-react"
import { PAGES } from "@/constants/pages"
import clsx from "clsx"

export default function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="w-64 border-r bg-background p-4">
      <h1 className="mb-6 text-2xl font-bold">BeyondChats</h1>

      <nav className="space-y-1">
        <Item
          label="Dashboard"
          icon={<LayoutDashboard size={18} />}
          active={activePage === PAGES.DASHBOARD}
          onClick={() => setActivePage(PAGES.DASHBOARD)}
        />

        <Item
          label="Articles"
          icon={<FileText size={18} />}
          active={activePage === PAGES.ARTICLES}
          onClick={() => setActivePage(PAGES.ARTICLES)}
        />

        <Item
          label="Create Article"
          icon={<Plus size={18} />}
          active={activePage === PAGES.CREATE}
          onClick={() => setActivePage(PAGES.CREATE)}
        />

        <Item
          label="Update from Google"
          icon={<RefreshCcw size={18} />}
          active={activePage === PAGES.UPDATE_GOOGLE}
          onClick={() => setActivePage(PAGES.UPDATE_GOOGLE)}
        />
      </nav>
    </aside>
  )
}

function Item({ label, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "group relative flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-all",
        active
          ? "bg-blue-500/10 text-blue-600 font-medium"
          : "text-muted-foreground hover:bg-blue-500/5 hover:text-foreground"
      )}
    >
      {/* Left blue accent bar */}
      <span
        className={clsx(
          "absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r",
          active ? "bg-blue-600" : "bg-transparent"
        )}
      />

      {icon}
      <span className="truncate">{label}</span>
    </button>
  )
}
