import { useState } from 'react'
import api from '../api/axiosConfig'

export default function AiAssistant(){
  const [q, setQ] = useState('')
  const [a, setA] = useState('Ask the AI a question about your events!')
  const ask = async ()=>{
    const { data } = await api.post('/ai/ask', { question: q })
    setA(data.answer || 'No answer')
  }
  return (
    <div>
      <h2>AI Event Assistant</h2>
      <div className="input-group my-3">
        <input className="form-control" value={q} onChange={e=>setQ(e.target.value)} placeholder="e.g., What tech events are this month?" />
        <button className="btn btn-primary" onClick={ask}>Ask AI</button>
      </div>
      <div className="border rounded p-3 bg-body-tertiary">{a}</div>
    </div>
  )
}