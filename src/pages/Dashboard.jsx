import { useEffect, useState } from 'react';
import { listEvents } from '../api/eventApi';
import { listApplications, appStats } from '../api/eventApi';
import { Table, Badge, Form, Row, Col, Card } from 'react-bootstrap';

export default function Dashboard() {
  const role = localStorage.getItem('role') || 'user';
  if (role !== 'admin') return <div className="text-danger">Forbidden: Admins only</div>;

  const [events, setEvents] = useState([]);
  const [apps, setApps] = useState([]);
  const [stats, setStats] = useState([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ eventId: '', status: '', page: 1, limit: 20 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // preload events for filter dropdown + stats
    (async () => {
      const ev = await listEvents({ limit: 500, sort: 'startAt', order: 'desc' });
      setEvents(ev.data.items || ev.data);
      const st = await appStats();
      setStats(st.data.stats || []);
    })();
  }, []);

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line
  }, [filters.eventId, filters.status, filters.page, filters.limit]);

  async function fetchApplications() {
    setLoading(true);
    try {
      const { data } = await listApplications(filters);
      setApps(data.items);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }

  const update = (k, v) => setFilters(prev => ({ ...prev, [k]: v, page: 1 }));

  return (
    <div>
      <h2 className="mb-3">Admin Dashboard</h2>

      {/* Stats row */}
      <Row className="g-3 mb-3">
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <div className="text-muted">Total Applications</div>
              <div className="fs-3 fw-bold">{stats.reduce((a, b) => a + b.applications, 0)}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <div className="text-muted">Top Event</div>
              <div className="fw-semibold">
                {stats[0]?.title || '—'}{' '}
                {stats[0] && <Badge bg="primary" className="ms-2">{stats[0].applications}</Badge>}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <div className="text-muted">Events With Applicants</div>
              <div className="fs-3 fw-bold">{stats.length}</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Form className="mb-3">
        <Row className="g-2">
          <Col md={8}>
            <Form.Select value={filters.eventId} onChange={(e) => update('eventId', e.target.value)}>
              <option value="">All Events</option>
              {events.map(ev => (
                <option key={ev._id} value={ev._id}>
                  {ev.title} — {new Date(ev.startAt || ev.date).toLocaleDateString()}
                </option>
              ))}
            </Form.Select>
          </Col>
          
          <Col md={4}>
            <Form.Select value={filters.limit} onChange={(e) => update('limit', Number(e.target.value))}>
              {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n} per page</option>)}
            </Form.Select>
          </Col>
        </Row>
      </Form>

      {/* Table */}
      <div className="table-responsive shadow-sm rounded">
        <Table hover className="mb-0">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Event</th>
              <th>Applicant</th>
              <th>Email</th>
              <th>Status</th>
              <th>Applied At</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={6} className="text-muted">Loading…</td></tr>
            )}
            {!loading && apps.length === 0 && (
              <tr><td colSpan={6} className="text-muted">No applications.</td></tr>
            )}
            {!loading && apps.map((a, i) => (
              <tr key={a._id}>
                <td>{(filters.page - 1) * filters.limit + i + 1}</td>
                <td>{a.event?.title || '—'}</td>
                <td>{a.user?.name || '—'}</td>
                <td>{a.user?.email || '—'}</td>
                <td>
                  <Badge bg={
                    a.status === 'accepted' ? 'success' :
                    a.status === 'rejected' ? 'danger' :
                    a.status === 'waitlist' ? 'warning' : 'secondary'
                  }>
                    {a.status}
                  </Badge>
                </td>
                <td>{new Date(a.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Simple pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="text-muted">Total: {total}</div>
        <div className="btn-group">
          <button className="btn btn-outline-secondary" disabled={filters.page === 1}
                  onClick={() => setFilters(p => ({ ...p, page: p.page - 1 }))}>Prev</button>
          <button className="btn btn-outline-secondary"
                  disabled={filters.page * filters.limit >= total}
                  onClick={() => setFilters(p => ({ ...p, page: p.page + 1 }))}>Next</button>
        </div>
      </div>
    </div>
  );
}
