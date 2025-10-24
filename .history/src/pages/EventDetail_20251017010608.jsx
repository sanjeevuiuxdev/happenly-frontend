import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getEvent, applyEvent } from '../api/eventApi'
import { Button, Carousel, Ratio } from 'react-bootstrap'

export default function EventDetail(){
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [applied, setApplied] = useState(false)



  const handleApply = async () => {
    try {
      if (!event?._id) return alert('Invalid event id');
      const { data } = await applyEvent(event._id);
      alert('Applied successfully!');
      // optional: disable button or update UI with data
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        (err?.response?.status === 400 ? 'Bad request' : err.message);
      alert(`Apply failed: ${msg}`);
      console.error('apply error:', err?.response || err);
    }
  };

  useEffect(()=>{ (async()=>{
    const { data } = await getEvent(id); setEvent(data)
  })() },[id])

  const apply = async ()=>{ await applyEvent({ eventId: id }); setApplied(true) }

  if (!event) return <div>Loading…</div>

  return (
    <div>
      <h2 className="mb-1">{event.title}</h2>
      <div className="text-muted mb-3">
        {new Date(event.startAt || event.date).toLocaleString()} • {event.location?.name || event.location || 'TBA'}
      </div>

      {/* Media gallery */}
      {event.media?.length > 0 && (
        <div className="mb-4">
          <Carousel variant="dark" className="shadow-sm rounded overflow-hidden">
            {event.media.map((m, i) => (
              <Carousel.Item key={i}>
                <Ratio aspectRatio="16x9">
                  {m.kind === 'video'
                    ? <video src={m.url} controls style={{objectFit:'cover', width:'100%', height:'100%'}}/>
                    : <img src={m.url} alt={`media-${i}`} style={{objectFit:'cover', width:'100%', height:'100%'}}/>}
                </Ratio>
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
      )}

      

      <p>{event.description}</p>

      {(event.organizer?.name || event.organizer?.company || event.organizer?.email) && (
  <div className="mb-3">
    <strong>Organizer:</strong>{' '}
    {event.organizer?.name || '—'}
    {event.organizer?.company ? ` — ${event.organizer.company}` : ''}
    {event.organizer?.email ? (
      <> — <a href={`mailto:${event.organizer.email}`}>{event.organizer.email}</a></>
    ) : null}
  </div>
)}


      <div className="d-flex gap-2">
        <Button onClick={apply} disabled={applied} variant="primary">
          {applied ? 'Applied' : 'Apply'}
        </Button>
      </div>
    </div>
  )
}
