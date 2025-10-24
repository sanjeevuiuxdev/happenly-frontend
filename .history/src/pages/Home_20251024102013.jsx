import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listEvents } from '../api/eventApi';
import CalendarView from '../components/CalendarView';

// helpers to get month range
const monthRange = (date = new Date()) => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
};

export default function Home() {
  const nav = useNavigate();
  const [range, setRange] = useState(monthRange());       
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // fetch events for current range
  const fetchEvents = async ({ start, end }) => {
    setLoading(true);
    try {
      const { data } = await listEvents({
        from: start.toISOString(),
        to: end.toISOString(),
        sort: 'startAt',
        order: 'asc',
        limit: 200
      });
      const arr = (data.items || data).map(e => ({
        id: e._id,
        title: e.title,
        start: new Date(e.startAt || e.date),
        end: new Date(e.endAt || e.startAt || e.date),
        resource: e
      }));
      setItems(arr);
    } finally {
      setLoading(false);
    }
  };

  // initial load & when range changes
  useEffect(() => { fetchEvents(range); }, [range.start.getTime(), range.end.getTime()]);

  const onDateSelect = (iso) => nav(`/events?from=${iso}&to=${iso}`);
  const onEventClick = (ev) => nav(`/events/${ev.id}`);

  // react-big-calendar passes either an array (month) or object with start/end (week/day)
  const onRangeChange = (r) => {
    if (Array.isArray(r) && r.length) {
      const start = new Date(r[0].getFullYear(), r[0].getMonth(), 1);
      const end = new Date(r[0].getFullYear(), r[0].getMonth() + 1, 0, 23, 59, 59, 999);
      setRange({ start, end });
    } else if (r?.start && r?.end) {
      setRange({ start: r.start, end: r.end });
    }
  };

  return (
    <div>
      <h2 className="mb-2">Event Calendar Overview</h2>
      <p className="text-muted mb-4">Click a date to filter events, or click an event to open its details.</p>

      <div className="d-flex justify-content-center">
        <div className="w-100" style={{ maxWidth: 980 }}>
          {loading && <div className="text-muted mb-2">Loading events…</div>}
          <CalendarView
            events={items}
            onDateSelect={onDateSelect}
            onEventClick={onEventClick}
            onRangeChange={onRangeChange}
          />
        </div>
      </div>
    </div>
  );
}
