import React, { useEffect, useState } from 'react'
import api from '../api'

export default function ArticleEditor({ articles, onChanged }) {
  const articleList = Array.isArray(articles) ? articles : []
  const [selected, setSelected] = useState(null)
  const [fields, setFields] = useState({ title: '', author: '', url: '', content: '' })
  const [status, setStatus] = useState({ msg: '', error: '' })
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!selected) return
    // refresh fields from the selected article
    const art = articleList.find(a => a._id === selected._id)
    if (art) setFields({ title: art.title || '', author: art.author || '', url: art.url || '', content: art.content || '' })
  }, [selected, articleList])

  useEffect(() => {
    // if articles changed and selected was deleted, clear selection
    if (selected && !articleList.find(a => a._id === selected._id)) {
      setSelected(null)
    }
  }, [articleList])

  const pick = (art) => {
    setStatus({ msg: '', error: '' })
    setSelected(art)
  }

  const handleChange = (k, v) => setFields(f => ({ ...f, [k]: v }))

  const save = async () => {
    if (!selected) return
    setBusy(true)
    setStatus({ msg: '', error: '' })
    try {
      const res = await api.put(`/articles/${selected._id}`, fields)
      setStatus({ msg: 'Article updated', error: '' })
      onChanged && onChanged()
      setSelected(res.data)
    } catch (err) {
      console.error(err)
      setStatus({ msg: '', error: err?.response?.data?.error || err.message || 'Update failed' })
    } finally { setBusy(false) }
  }

  const remove = async () => {
    if (!selected) return
    if (!confirm('Delete this article? This cannot be undone.')) return
    setBusy(true)
    setStatus({ msg: '', error: '' })
    try {
      await api.delete(`/articles/${selected._id}`)
      setStatus({ msg: 'Article deleted', error: '' })
      onChanged && onChanged()
      setSelected(null)
    } catch (err) {
      console.error(err)
      setStatus({ msg: '', error: err?.response?.data?.error || err.message || 'Delete failed' })
    } finally { setBusy(false) }
  }

  return (
    <div className="editor">
      <h2>Articles — Select to edit</h2>
      {status.msg && <div className="msg">{status.msg}</div>}
      {status.error && <div style={{ color: 'red' }}>{status.error}</div>}

      <div className="article-list">
        {(articleList.length === 0) ? (
          <p>No articles available.</p>
        ) : (
          <ul>
            {articleList.map(a => (
              <li key={a._id} onClick={() => pick(a)} style={{ cursor: 'pointer', padding: '6px 0', borderBottom: '1px solid #eee' }}>
                <strong>{a.title}</strong>
                <div style={{ fontSize: 12, color: '#666' }}>{a.author} — {a.url}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selected && (
        <div style={{ marginTop: 12 }}>
          <h3>Editing: {selected.title}</h3>
          <div className="field-row">
            <label>Title</label>
            <input value={fields.title} onChange={e => handleChange('title', e.target.value)} />
          </div>
          <div className="field-row">
            <label>Author</label>
            <input value={fields.author} onChange={e => handleChange('author', e.target.value)} />
          </div>
          <div className="field-row">
            <label>URL</label>
            <input value={fields.url} onChange={e => handleChange('url', e.target.value)} />
          </div>
          <div className="field-row">
            <label>Content</label>
            <textarea rows={10} value={fields.content} onChange={e => handleChange('content', e.target.value)} />
          </div>

          <div className="actions">
            <button onClick={save} disabled={busy}>Save</button>
            <button onClick={remove} disabled={busy} style={{ marginLeft: 8 }}>Delete</button>
            <button onClick={() => setSelected(null)} style={{ marginLeft: 8 }}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
