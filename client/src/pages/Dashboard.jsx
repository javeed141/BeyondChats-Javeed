import { useEffect, useState } from "react"
import api from "@/api/api"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    updated: 0,
    lastUpdated: "—",
  })

  useEffect(() => {
    api.get("/articles").then(res => {
      const articles = res.data || []
      const updated = articles.filter(a => a.updatedContent).length
      const last = articles
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0]

      setStats({
        total: articles.length,
        updated,
        lastUpdated: last
          ? new Date(last.updatedAt).toLocaleString()
          : "—",
      })
    })
  }, [])

  return (
    <div>
      <div className="p-6 mb-6 rounded-md bg-blue-600 text-white">
        Tailwind test banner — if styled, Tailwind is working.
      </div>
      <div className="grid grid-cols-3 gap-6">
      <Stat title="Total Articles" value={stats.total} />
      <Stat title="Updated from Google" value={stats.updated} />
      <Stat title="Last Activity" value={stats.lastUpdated} />
      </div>
    </div>
  )
}

function Stat({ title, value }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-3xl font-bold">
        {value}
      </CardContent>
    </Card>
  )
}
