import { useState } from 'react'
import { Form, Button, Card, Spinner, Container } from 'react-bootstrap'
import axios from 'axios'

// make sure axios is already using your baseURL (VITE_API_BASE_URL), 
// or import from your api file if you already set that up
// otherwise you can do: const API = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL })

export default function AiPage() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function askAI(e) {
    e.preventDefault()
    if (!question.trim()) return

    setLoading(true)
    setError('')
    setAnswer('')

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/ai/ask`,
        { question }
      )
      setAnswer(data.answer || '(no answer returned)')
    } catch (err) {
      console.error(err)
      setError(
        err?.response?.data?.message ||
        err.message ||
        'Something went wrong'
      )
    } finally {
      setLoading(false)
    }
  }

  // reset chat for new question
  function resetAll() {
    setQuestion('')
    setAnswer('')
    setError('')
  }

  return (
    <Container style={{ maxWidth: 700 }} className="py-4">
      <h2 className="mb-3">Ask AI about Events</h2>
      <p className="text-muted">
        Ask something like: "What is coding-6?" or "When is code round?"
        Each question is answered fresh. No chat history is saved.
      </p>

      <Form onSubmit={askAI} className="mb-4">
        <Form.Group className="mb-3">
          <Form.Label>Your question</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder='e.g. "What is coding-6?"'
            value={question}
            onChange={e => setQuestion(e.target.value)}
            disabled={loading}
          />
        </Form.Group>

        <div className="d-flex gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Thinking…
              </>
            ) : (
              'Ask'
            )}
          </Button>

          <Button
            variant="outline-secondary"
            type="button"
            onClick={resetAll}
            disabled={loading}
          >
            New Question
          </Button>
        </div>
      </Form>

      {(answer || error) && (
        <Card className="shadow-sm">
          <Card.Header>Answer</Card.Header>
          <Card.Body>
            {error ? (
              <div className="text-danger">{error}</div>
            ) : (
              <div style={{ whiteSpace: 'pre-wrap' }}>{answer}</div>
            )}
          </Card.Body>
        </Card>
      )}
    </Container>
  )
}
