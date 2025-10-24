import { Form } from 'react-bootstrap';

const DEPARTMENTS = ['IT', 'CS', 'ME', 'Other'];
const TYPES = ['Talk', 'Workshop', 'Contest', 'Game', 'Webinar', 'Other'];
const SORTS = [
  { value: 'startAt', label: 'Date' },
  { value: 'createdAt', label: 'Created' },
];

export default function FilterBar({ filters, setFilters }) {
  const safe = (v) => (v ?? ''); // avoid undefined -> controlled warning

  return (
    <div className="row g-2 align-items-center mb-3">
      <div className="col-sm">
        <Form.Control
          placeholder="Search keywords"
          value={safe(filters.q)}
          onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
        />
      </div>

      <div className="col-sm">
        <Form.Select
          value={safe(filters.department)}
          onChange={(e) =>
            setFilters((f) => ({ ...f, department: e.target.value }))
          }
        >
          <option value="">All Departments</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </Form.Select>
      </div>

      <div className="col-sm">
        <Form.Select
          value={safe(filters.type)}
          onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
        >
          <option value="">All Types</option>
          {TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </Form.Select>
      </div>

      <div className="col-sm">
        <Form.Select
          value={safe(filters.sort)}
          onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </Form.Select>
      </div>
    </div>
  );
}
