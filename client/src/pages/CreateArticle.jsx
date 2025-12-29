import { useState } from "react"
import api from "@/api/api"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Spinner from "@/components/Spinner"

export default function CreateArticle() {
  const [form, setForm] = useState({ title: "", author: "", url: "" })
  const [saving, setSaving] = useState(false)

  const submit = async () => {
    if (!form.title) {
      toast.warning("Title is required")
      return
    }
     if (!form.author) {
      toast.warning("Author is required")
      return
    }
    
    setSaving(true)
    try {
      await api.post("/articles", form)
      toast.success("Article created")
      setForm({ title: "", author: "", url: "" })
    } catch {
      toast.error("Creation failed")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Create Article</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Input placeholder="Title" value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })} />
        <Input placeholder="Author" value={form.author}
          onChange={e => setForm({ ...form, author: e.target.value })} />
        <Input placeholder="URL" value={form.url}
          onChange={e => setForm({ ...form, url: e.target.value })} />

        <Button onClick={submit} disabled={saving}>
          {saving ? <Spinner label="Creating..." /> : "Create"}
        </Button>
      </CardContent>
    </Card>
  )
}
