import { Loader2 } from "lucide-react"

export default function Spinner({ label = "Loading...", size = 48 }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-6 text-muted-foreground">
      <Loader2
        className="animate-spin"
        style={{ width: size, height: size }}
      />
      <span className="text-sm">{label}</span>
    </div>
  )
}
