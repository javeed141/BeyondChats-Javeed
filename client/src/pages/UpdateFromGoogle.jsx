import { useEffect, useState } from "react"
import api from "@/api/api"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Spinner from "@/components/Spinner"
import { Separator } from "@/components/ui/separator"

export default function UpdateFromGoogle() {
  const [articles, setArticles] = useState([])
  const [selected, setSelected] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    api.get("/articles").then(res => setArticles(res.data || []))
  }, [])

  const run = async () => {
    if (!selected) return
    setLoading(true)
    setResult(null)

    try {
      const res = await api.post(`/articles/${selected}/update-from-google`)
      setResult(res.data)
      toast.success("Article updated using Google")
    } catch {
      toast.error("Update failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-4xl">
      <CardHeader>
        <CardTitle>Update from Google</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <select
          className="w-full rounded-md border p-2"
          value={selected}
          onChange={e => setSelected(e.target.value)}
        >
          <option value="">Select article</option>
          {articles.map(a => (
            <option key={a._id} value={a._id}>{a.title}</option>
          ))}
        </select>

        <Button onClick={run} disabled={loading}>
          {loading ? <Spinner label="Analyzing & rewriting..." /> : "Run Update"}
        </Button>

        {result?.updated && (
          <>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">Updated Content</h3>
              <div className="whitespace-pre-wrap rounded-md bg-muted p-4">
                {result.updated.content}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
