import React, { useEffect, useState } from 'react'
import api from './api'
import ArticleForm from './components/ArticleForm'
import ArticleEditor from './components/ArticleEditor'
import UpdateContent from './update/UpdateContent'

export default function App() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchArticles = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('/articles')
      const data = res.data
      if (!Array.isArray(data)) {
        console.error('Unexpected /articles response:', data)
        setError('Invalid response from server')
        setArticles([])
      } else {
        setArticles(data)
      }
    } catch (err) {
      console.error(err)
      setError(err?.response?.data?.error || err.message || 'Failed to fetch')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchArticles() }, [])

  return (
    <div className="container">
      <h1>BeyondChats — Articles</h1>
      <ArticleForm onCreated={fetchArticles} />
      {loading && <p>Loading articles…</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <ArticleEditor articles={articles} onChanged={fetchArticles} />
      <UpdateContent articles={articles} onUpdated={fetchArticles} />
    </div>
  )
}
