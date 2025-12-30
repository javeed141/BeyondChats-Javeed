import { useEffect, useState } from "react"
import api from "@/api/api"
import Spinner from "@/components/Spinner"
import { useNavigate } from "react-router-dom"
import ArticleCard from "@/components/ArticleCard"

export default function Dashboard() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const loadArticles = async () => {
    setLoading(true)
    try {
      const res = await api.get("/articles")
      setArticles(res.data || [])
    } catch {
      setArticles([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadArticles()
  }, [])

  const onEditArticle = (article) => {
    // ArticleCard passes the full article object
    navigate(`/articles/${article._id}/edit`)
  }

  const onDeleteArticle = async (id) => {
    if (!confirm("Delete this article?")) return
    try {
      await api.delete(`/articles/${id}`)
      loadArticles()
    } catch {
      // ignore
    }
  }

  const total = articles.length
  const updatedCount = articles.filter(a => (a.updatedContent && a.updatedContent.length > 0) || (a.references && a.references.length > 0)).length
  const pending = articles.filter(a => !a.updatedContent || a.updatedContent.length === 0).length
  const lastUpdated = articles.reduce((latest, a) => {
    const t = a.updatedAt ? new Date(a.updatedAt) : new Date(a.createdAt)
    return !latest || t > latest ? t : latest
  }, null)

  if (loading) return <Spinner label="Loading dashboard..." />

  const recent = articles.slice().sort((x,y) => new Date(y.updatedAt || y.createdAt) - new Date(x.updatedAt || x.createdAt)).slice(0,3)

  return (
    <div className="space-y-8">
      <div className="opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your content activity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-base">
          <div style={{ height: 6, background: 'linear-gradient(90deg, rgb(var(--primary)), rgba(59,130,246,0.6))', borderRadius: 6 }} className="mb-3" />
          <p className="text-sm text-muted-foreground">Total Articles</p>
          <p className="mt-2 text-3xl font-semibold">{total}</p>
        </div>

        <div className="card-base">
          <div style={{ height: 6, background: 'linear-gradient(90deg, rgb(var(--primary)), rgba(59,130,246,0.6))', borderRadius: 6 }} className="mb-3" />
          <p className="text-sm text-muted-foreground">Updated via Google</p>
          <p className="mt-2 text-3xl font-semibold">{updatedCount}</p>
        </div>

        <div className="card-base">
          <div style={{ height: 6, background: 'linear-gradient(90deg, rgb(var(--primary)), rgba(59,130,246,0.6))', borderRadius: 6 }} className="mb-3" />
          <p className="text-sm text-muted-foreground">Pending Updates</p>
          <p className="mt-2 text-3xl font-semibold">{pending}</p>
          <p className="text-xs text-muted-foreground mt-1">Last update: {lastUpdated ? lastUpdated.toLocaleDateString() : 'N/A'}</p>
        </div>
      </div>

      <div className="opacity-0 animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Recent Articles</h2>
          <span className="text-sm text-muted-foreground">{total} total</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recent.map((article, index) => (
            <div key={article._id} className="opacity-0 animate-scale-in" style={{ animationDelay: `${0.6 + index * 0.1}s`, animationFillMode: 'forwards' }}>
              <ArticleCard article={article} onEdit={onEditArticle} onDelete={onDeleteArticle} />
            </div>
          ))}

          {articles.length === 0 && (
            <div className="text-center py-16 muted-bg rounded-2xl border border-sidebar-border">
              <p className="text-muted-foreground">No articles yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
