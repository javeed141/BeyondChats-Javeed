import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import api from "@/api/api"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function EditArticle() {
  const { id } = useParams()
  const [article, setArticle] = useState(null)

  useEffect(() => {
    api.get(`/articles/${id}`).then(res => setArticle(res.data))
  }, [id])

  if (!article) return <p>Loading...</p>

  const save = async () => {
    await api.put(`/articles/${id}`, article)
    alert("Saved")
  }

  return (
    <div className="space-y-4 max-w-3xl">
      <Input
        value={article.title}
        onChange={e => setArticle({ ...article, title: e.target.value })}
      />
      <Input
        value={article.author || ""}
        onChange={e => setArticle({ ...article, author: e.target.value })}
      />
      <Textarea
        rows={12}
        value={article.content || ""}
        onChange={e => setArticle({ ...article, content: e.target.value })}
      />
      <Button onClick={save}>Save</Button>
    </div>
  )
}
