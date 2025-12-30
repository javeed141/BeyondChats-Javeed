import { Loader2 } from "lucide-react"

export default function Spinner({ label = "Loading...", size = 56 }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(var(--bg), 0.6)" }}
    >
      <div className="flex flex-col items-center gap-4">
        <Loader2
          className="animate-spin"
          style={{ width: size, height: size, color: "rgb(var(--primary))" }}
        />
        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>
      </div>
    </div>
  )
}
