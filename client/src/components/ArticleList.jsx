import React from 'react'
import api from '../api'

export default function ArticleList({ articles, onChanged }) {
  const remove = async (id) => {
    try { await api.delete(`/articles/${id}`); onChanged && onChanged() } catch (e) { console.error(e) }
  }

  return (
    <div className="list">
      {articles.length === 0 && <p>No articles</p>}
      {articles.map(a => (
        <div key={a._id} className="item">
          <div className="meta">
            <strong>{a.title}</strong>
            <span>{a.author}</span>
          </div>
          <div className="actions">
            {a.url && <a href={a.url} target="_blank" rel="noreferrer">Open</a>}
            <button onClick={()=>remove(a._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  )
}
