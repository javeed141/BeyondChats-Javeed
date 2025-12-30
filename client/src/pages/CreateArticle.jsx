import { useState } from "react"
import api from "@/api/api"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import Spinner from "@/components/Spinner"
import { useNavigate } from "react-router-dom"

export default function CreateArticle() {
  const [form, setForm] = useState({
    title: "",
    author: "",
    url: "",
  })
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  const submit = async () => {
    if (!form.title) {
      toast.warning("Title is required")
      return
    }

    setSaving(true)
    try {
      await api.post("/articles", form)
      toast.success("Article created")
      navigate("/articles")
    } catch {
      toast.error("Creation failed")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">Create Article</h1>
        <p className="text-sm text-muted-foreground">
          Add a new article to your workspace
        </p>
      </header>

      <div
        className="max-w-xl card-base space-y-4"
        style={{ borderLeft: '4px solid rgb(var(--primary))' }}
      >
        <Input
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
        />
        <Input
          placeholder="Author"
          value={form.author}
          onChange={e => setForm({ ...form, author: e.target.value })}
        />
        <Input
          placeholder="Source URL"
          value={form.url}
          onChange={e => setForm({ ...form, url: e.target.value })}
        />

        <div className="flex justify-end">
          <Button onClick={submit} disabled={saving}>
            {saving ? <Spinner label="Creating..." /> : "Create Article"}
          </Button>
        </div>
      </div>
    </div>
  )
}
