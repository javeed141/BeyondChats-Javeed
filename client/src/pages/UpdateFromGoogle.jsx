import { useEffect, useState } from "react"
import api from "@/api/api"
import { Button } from "@/components/ui/button"
import Spinner from "@/components/Spinner"
import { toast } from "sonner"

export default function UpdateFromGoogle() {
  const [articles, setArticles] = useState([])
  const [selected, setSelected] = useState("")
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    api.get("/articles")
      .then(res => setArticles(res.data || []))
      .finally(() => setLoading(false))
  }, [])

  const run = async () => {
    if (!selected) {
      toast.warning("Select an article")
      return
    }

    setRunning(true)
    try {
      await api.post(`/articles/${selected}/update-from-google`)
      toast.success("Article updated from Google")
    } catch {
      toast.error("Update failed")
    } finally {
      setRunning(false)
    }
  }

  if (loading) return <Spinner label="Loading articles..." />

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">Update from Google</h1>
        <p className="text-sm text-muted-foreground">
          Refresh article content using latest sources
        </p>
      </header>

      <div
        className="max-w-xl card-base space-y-4"
        style={{ borderLeft: '4px solid rgb(var(--primary))' }}
      >
        <select
          className="w-full rounded-md border bg-card p-2 text-foreground"
          value={selected}
          onChange={e => setSelected(e.target.value)}
        >
          <option value="">Select article</option>
          {articles.map(a => (
            <option key={a._id} value={a._id}>
              {a.title}
            </option>
          ))}
        </select>

        <Button onClick={run} disabled={running} className="w-full">
          {running ? "Updating..." : "Run Update"}
        </Button>
      </div>
    </div>
  )
}
