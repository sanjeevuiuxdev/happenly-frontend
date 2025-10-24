import { Card, Badge, Ratio } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { deleteEvent } from '../api/eventApi';


function Cover({ media }) {
  if (!media?.length) return (
    <div className="bg-body-secondary d-flex align-items-center justify-content-center rounded" style={{height:180}}>
      <span className="text-muted">No media</span>
    </div>
  )

  const m = media[0]
  if (m.kind === 'video') {
    // lightweight video cover (no autoplay)
    return (
      <Ratio aspectRatio="16x9" className="rounded overflow-hidden">
        <video src={m.url} muted controls={false} style={{objectFit:'cover', width:'100%', height:'100%'}}/>
      </Ratio>
    )
  }

  return (
    <Ratio aspectRatio="16x9" className="rounded overflow-hidden">
      <img src={m.url} alt="cover" style={{objectFit:'cover', width:'100%', height:'100%'}} />
    </Ratio>
  )
}

export default function EventCard({ e }) {
  return (
    <Card className="mb-3 shadow-sm event-card overflow-hidden">
      <div className="row g-0">
        <div className="col-md-4 p-2">
          <Cover media={e.media} />
        </div>
        <div className="col-md-8">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <Card.Title className="mb-1">
                  <Link to={`/events/${e._id}`}>{e.title}</Link>
                </Card.Title>
                <Card.Subtitle className="text-muted">
                  {new Date(e.startAt || e.date).toLocaleString()} • {e.location?.name || e.location || 'TBA'}
                </Card.Subtitle>
              </div>
              {e.department && <Badge bg="primary" pill>{e.department}</Badge>}
            </div>
            <Card.Text className="mt-2">
              {e.description?.slice(0, 140)}{e.description?.length > 140 ? '…' : ''}
            </Card.Text>
          </Card.Body>
        </div>
      </div>
    </Card>
  )
}
