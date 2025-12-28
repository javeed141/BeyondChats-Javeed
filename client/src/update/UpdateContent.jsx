import React, { useState } from 'react'
import api from '../api'

export default function UpdateContent({ articles = [], onUpdated }) {
  const [selected, setSelected] = useState('')
  const [status, setStatus] = useState('')
  const [result, setResult] = useState(null)

  const selectedArticle = articles.find(a => a._id === selected)

  const handleUpdate = async () => {
    if (!selected) return
    setStatus('Running update (searching Google and calling LLM)...')
    setResult(null)
    try {
      const res = await api.post(`/articles/${selected}/update-from-google`)
      setResult(res.data)
      setStatus('Updated successfully')
      if (onUpdated) onUpdated()
    } catch (err) {
      console.error(err)
      setStatus(err?.response?.data?.error || err.message || 'Update failed')
    }
  }

  return (
    <div style={{ marginTop: 24 }}>
      <h2>Update Article from Top Google Results</h2>
      <div>
        <select value={selected} onChange={e => setSelected(e.target.value)}>
          <option value="">-- choose an article --</option>
          {articles.map(a => (
            <option key={a._id} value={a._id}>{a.title}</option>
          ))}
        </select>
        <button onClick={handleUpdate} style={{ marginLeft: 8 }}>Update from Google</button>
      </div>

      {status && <p><strong>Status:</strong> {status}</p>}

      {result && (
        <div style={{ marginTop: 12 }}>
          <h3>Updated Article</h3>
          <h4>{result.updated?.title}</h4>
          <h5>Original</h5>
          <div style={{ whiteSpace: 'pre-wrap', background: '#f8f8f8', padding: 8 }}>{selectedArticle?.originalContent || result.updated?.originalContent || selectedArticle?.content}</div>
          <h5 style={{ marginTop: 12 }}>Updated</h5>
          <div style={{ whiteSpace: 'pre-wrap' }}>{result.updated?.updatedContent || result.updated?.content}</div>
          {result.references && result.references.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <h4>References</h4>
              <ul>
                {result.references.map(r => (
                  <li key={r.url}><a href={r.url} target="_blank" rel="noreferrer">{r.title || r.url}</a></li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
