import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEvent, applyEvent } from '../api/eventApi';
import { Button, Carousel, Ratio } from 'react-bootstrap';

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [applied, setApplied] = useState(false);

  // small helper so we never render an object
  const asText = (val) => {
    if (typeof val === 'string' || typeof val === 'number') return val;
    if (val && typeof val === 'object') return val.name || 'TBA';
    return 'TBA';
  };

  useEffect(() => {
    (async () => {
      const { data } = await getEvent(id);
      setEvent(data);
    })();
  }, [id]);

  const onApply = async () => {
    try {
      await applyEvent({ eventId: id }); // <-- backend expects { eventId }
      setApplied(true);
      alert('Applied successfully!');
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        (err?.response?.status === 400 ? 'Bad request' : err.message);
      alert(`Apply failed: ${msg}`);
      console.error(err?.response || err);
    }
  };

  if (!event) return <div>Loading…</div>;

  return (
    <div>
      <h2 className="mb-1">{event.title}</h2>

      <div className="text-muted mb-3">
        {new Date(event.startAt || event.date).toLocaleString()} • {asText(event.location)}
      </div>

      {/* Media gallery */}
      {!!event.media?.length && (
        <div className="mb-4">
          <Carousel variant="dark" className="shadow-sm rounded overflow-hidden col-sm-6">
            {event.media.map((m, i) => (
              <Carousel.Item key={i}>
                <Ratio aspectRatio="16x9">
                  {m.kind === 'video' ? (
                    <video
                      src={m.url}
                      controls
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    />
                  ) : (
                    <img
                      src={m.url}
                      alt={`media-${i}`}
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    />
                  )}
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
            <>
              {' '}
              — <a href={`mailto:${event.organizer.email}`}>{event.organizer.email}</a>
            </>
          ) : null}
        </div>
      )}

      <div className="d-flex gap-2">
        <Button onClick={onApply} disabled={applied} variant="primary">
          {applied ? 'Applied' : 'Apply'}
        </Button>
      </div>
    </div>
  );
}
