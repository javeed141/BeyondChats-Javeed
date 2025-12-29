import { useEffect, useState } from "react"
import api from "@/api/api"
import { toast } from "sonner"
import ArticleCard from "@/components/ArticleCard"
import Spinner from "../components/Spinner"

export default function Articles({ onEdit }) {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  const loadArticles = async () => {
    setLoading(true)
    try {
      const res = await api.get("/articles")
      setArticles(res.data || [])
    } catch {
      toast.error("Failed to fetch articles")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadArticles()
  }, [])

  const remove = async (id) => {
    if (!confirm("Delete this article?")) return
    try {
      await api.delete(`/articles/${id}`)
      toast.success("Article deleted")
      loadArticles()
    } catch {
      toast.error("Delete failed")
    }
  }

  if (loading) {
    return <Spinner label="Fetching articles..." />
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      {articles.map(article => (
        <ArticleCard
          key={article._id}
          article={article}
          onEdit={onEdit}
          onDelete={remove}
        />
      ))}
    </div>
  )
}
