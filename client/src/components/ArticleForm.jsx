import React, { useState } from 'react'
import api from '../api'

export default function ArticleForm({ onCreated }) {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/articles', { title, author, url })
      setTitle(''); setAuthor(''); setUrl('')
      onCreated && onCreated()
    } catch (err) { console.error(err) }
  }

  return (
    <form onSubmit={submit} className="form">
      <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
      <input placeholder="Author" value={author} onChange={e=>setAuthor(e.target.value)} />
      <input placeholder="URL" value={url} onChange={e=>setUrl(e.target.value)} />
      <button type="submit">Create</button>
    </form>
  )
}
