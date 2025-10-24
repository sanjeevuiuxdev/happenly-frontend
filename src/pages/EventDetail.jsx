import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { getEvent, applyEvent } from '../api/eventApi';
import { Button, Carousel, Ratio } from 'react-bootstrap';

// ---- helpers ---------------------------------------------------------------

// If admin pasted a Google Maps iframe, extract only the src attribute.
// Returns null if no iframe found.
function extractIframeSrc(htmlOrText = '') {
  if (typeof htmlOrText !== 'string') return null;
  const match = htmlOrText.match(/<iframe[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

// For display (cards/titles), turn location into a short label.
function locationLabel(loc) {
  if (!loc) return 'TBA';
  if (typeof loc === 'string') {
    // If it's an iframe string, show generic label
    if (/<iframe/i.test(loc)) return 'See map below';
    // else show the text directly
    return loc;
  }
  return loc?.name || 'TBA';
}

// ----------------------------------------------------------------------------

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await getEvent(id);
      setEvent(data);
    })();
  }, [id]);

  const handleApply = async () => {
    try {
      if (!event?._id) return alert('Invalid event id');
      await applyEvent(event._id);
      setApplied(true);
      alert('Applied successfully!');
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        (err?.response?.status === 400 ? 'Bad request' : err.message);
      alert(`Apply failed: ${msg}`);
      console.error('apply error:', err?.response || err);
    }
  };

  const mapSrc = useMemo(() => {
    if (!event || !event.location) return null;

    // if it's a simple string
    if (typeof event.location === 'string') {
      const match = event.location.match(/<iframe[^>]+src=["']([^"']+)["']/i);
      return match ? match[1] : null;
    }

    // if it's an object (some APIs return location as { name: "...iframe..." })
    if (typeof event.location?.name === 'string') {
      const match = event.location.name.match(/<iframe[^>]+src=["']([^"']+)["']/i);
      return match ? match[1] : null;
    }

    return null;
  }, [event]);


  if (!event) return <div>Loading…</div>;



  return (
    <div>
      <h2 className="mb-1">{event.title}</h2>

      {/* <div className="text-muted mb-3">
        {new Date(event.startAt || event.date).toLocaleString()} • {locationLabel(event.location)}
      </div> */}

      {/* Media gallery */}
      {event.media?.length > 0 && (
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

      {/* Description */}
      {event.description && <p>{event.description}</p>}

      {/* Organizer */}
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

      {/* Embedded map (safe: we render only the src attr) */}
      {mapSrc && (
        <div className="mb-4 col-sm-8">
          <div className="ratio ratio-16x9 rounded overflow-hidden shadow-sm">
            <iframe
              src={mapSrc}
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              title="Event location map"
            />
          </div>
        </div>
      )}

      {(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user?.role === 'admin') return null;

        return (
          <div className="d-flex gap-2 mt-3">
            <Button onClick={handleApply} disabled={applied} variant="primary">
              {applied ? 'Applied' : 'Apply'}
            </Button>
          </div>
        );
      })()}
    </div>
  );
}
