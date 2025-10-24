import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getEvent, applyEvent } from '../api/eventApi'
import { Button } from 'react-bootstrap'

export default function EventDetail(){
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [applied, setApplied] = useState(false)

  useEffect(()=>{(async()=>{
    const { data } = await getEvent(id); setEvent(data)
  })()},[id])

  const apply = async ()=>{
    await applyEvent({ eventId: id })
    setApplied(true)
  }

  if (!event) return <div>Loading…</div>
  return (
    <div>
      <h2>{event.title}</h2>
      <div className="text-muted">{new Date(event.startAt||event.date).toLocaleString()} • {event.location?.name||event.location}</div>
      <p className="mt-3">{event.description}</p>
      <Button onClick={apply} disabled={applied} variant="primary">{applied? 'Applied' : 'Apply'}</Button>
    </div>
  )
}