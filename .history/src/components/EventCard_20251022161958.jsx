import { Card, Badge, Ratio, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { deleteEvent } from '../api/eventApi';

// ---------- MEDIA COVER COMPONENT ----------



function locationLabel(loc) {
  if (!loc) return 'TBA';
  if (typeof loc === 'string') {
    if (/<iframe/i.test(loc)) return 'See map'; // don't show raw HTML
    return loc;
  }
  return loc?.name || 'TBA';
}


function Cover({ media }) {
  if (!media?.length) {
    return (
      <div
        className="bg-body-secondary d-flex align-items-center justify-content-center rounded"
        style={{ height: 180 }}
      >
        <span className="text-muted">No media</span>
      </div>
    );
  }

  const m = media[0];
  if (m.kind === 'video') {
    return (
      <Ratio aspectRatio="16x9" className="rounded overflow-hidden">
        <video
          src={m.url}
          muted
          controls={false}
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        />
      </Ratio>
    );
  }

  return (
    <Ratio aspectRatio="16x9" className="rounded overflow-hidden">
      <img
        src={m.url}
        alt="cover"
        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
      />
    </Ratio>
  );
}

// ---------- MAIN EVENT CARD ----------
export default function EventCard({ e, refresh, openEdit }) {
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  })();
  const isAdmin = user?.role === 'admin';

  // handle delete
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this event permanently?')) return;
    try {
      await deleteEvent(e._id);
      refresh?.(); // ✅ auto refresh event list after deletion
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete event. Please try again.');
    }
  };

  return (
    <Card className="mb-3 shadow-sm event-card overflow-hidden">
      <div className="row g-0">
        {/* COVER / IMAGE */}
        <div className="col-md-4 p-2">
          <Cover media={e.media} />
        </div>

        {/* DETAILS */}
        <div className="col-md-8">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <Card.Title className="mb-1 pb-2">
                  <Link to={`/events/${e._id}`}>{e.title}</Link>
                </Card.Title>

                function fmtDate(d) {
  if (!d) return 'Date TBA';
  const dt = new Date(d);
  return isNaN(dt) ? 'Date TBA' : dt.toLocaleString();
}
                <Card.Subtitle className="text-muted">
                  {new Date(e.startAt || e.date).toLocaleString()} • {locationLabel(e.location)}
                </Card.Subtitle>

              </div>
              {e.department && (
                <Badge bg="primary" pill>
                  {e.department}
                </Badge>
              )}
            </div>

            {/* DESCRIPTION */}
            <Card.Text className="mt-2">
              {e.description?.slice(0, 140)}
              {e.description?.length > 140 ? '…' : ''}
            </Card.Text>

            {/* ADMIN ACTIONS */}
            {isAdmin && (
              <div className="d-flex gap-2 mt-2">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => openEdit?.(e)}
                >
                  Edit
                </Button>

                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </div>
            )}
          </Card.Body>
        </div>
      </div>
    </Card>
  );
}
