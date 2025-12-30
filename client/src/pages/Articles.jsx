import { useEffect, useState } from "react"
import api from "@/api/api"
import { toast } from "sonner"
import Spinner from "@/components/Spinner"
import { useNavigate } from "react-router-dom"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

export default function Articles() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

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

  const [selectedArticle, setSelectedArticle] = useState(null)

  const closeViewer = () => setSelectedArticle(null)

  if (loading) {
    return <Spinner label="Fetching articles..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Articles
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage and update your articles
          </p>
        </div>

        <button
          onClick={() => navigate("/articles/new")}
          className="
            rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white
            hover:bg-blue-700
            dark:bg-blue-500 dark:hover:bg-blue-600
          "
        >
          Create Article
        </button>
      </div>

      {/* Table */}
      <div
        className="overflow-hidden rounded-xl card-base shadow-sm"
        style={{ borderLeft: '4px solid rgb(var(--primary))' }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-muted-foreground">
              <th className="px-6 py-4 text-left">Title</th>
              <th className="text-left">Author</th>
              <th>Status</th>
              <th className="px-6 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {articles.map(a => (
              <tr
                key={a._id}
                className="border-b hover:bg-muted-bg"
              >
                <td className="px-6 py-4 font-medium text-foreground">
                  {a.title}
                </td>
                <td>{a.author || "—"}</td>
                <td>
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      a.updatedContent
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                    style={{
                      boxShadow: 'none'
                    }}
                  >
                    {a.updatedContent ? "Updated" : "Original"}
                  </span>
                </td>
                <td className="px-6 text-right space-x-3">
                  <button
                    onClick={() => setSelectedArticle(a)}
                    className="text-gray-700 hover:underline"
                  >
                    View
                  </button>

                  <button
                    onClick={() => navigate(`/articles/${a._id}/edit`)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => remove(a._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {articles.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="px-6 py-10 text-center text-muted-foreground"
                >
                  No articles found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

     <Dialog open={!!selectedArticle} onOpenChange={(open) => !open && closeViewer()}>
  <DialogContent
    className="
      bg-white
      text-black
      max-w-[95vw]
      w-full
      max-h-[90vh]
      overflow-hidden
      rounded-xl
      shadow-2xl
      border border-gray-200
    "
  >
    {/* HEADER */}
    <DialogHeader className="border-b border-gray-200 pb-4">
      <DialogTitle className="text-2xl font-bold text-gray-900">
        {selectedArticle?.title}
      </DialogTitle>
      <DialogDescription className="text-sm text-gray-600">
        {selectedArticle?.author || "Unknown author"}
      </DialogDescription>
    </DialogHeader>

    {/* CONTENT */}
    <div className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-8">
      
      {/* ORIGINAL CONTENT */}
      <div className="p-6 rounded-lg border border-gray-200 bg-gray-50 max-h-[65vh] overflow-auto">
        <h4 className="mb-4 text-lg font-semibold text-gray-900">
          Original Content
        </h4>
        <div className="text-base leading-relaxed whitespace-pre-wrap text-gray-800">
          {selectedArticle?.originalContent ||
            selectedArticle?.content ||
            "No original content available."}
        </div>
      </div>

      {/* UPDATED CONTENT */}
      <div className="p-6 rounded-lg border border-gray-200 bg-white max-h-[65vh] overflow-auto">
        <h4 className="mb-4 text-lg font-semibold text-gray-900">
          Updated Content
        </h4>
        <div className="text-base leading-relaxed whitespace-pre-wrap text-gray-800">
          {selectedArticle?.updatedContent || "No updated content available."}
        </div>
      </div>
    </div>

    {/* FOOTER */}
    <DialogFooter className="border-t border-gray-200 pt-4 mt-6 flex justify-end">
      <DialogClose className="px-5 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-800 transition">
        Close
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>

    </div>
  )
}
