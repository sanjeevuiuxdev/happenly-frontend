import { useState } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: ,
  withCredentials: true,
});

export default function AiPage() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const askAI = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setErrMsg('');
    setAnswer('');

    try {
      const { data } = await api.post('/ai/ask', { question });
      setAnswer(data.answer || '(no answer)');
    } catch (err) {
      console.error('AI error:', err?.response || err);
      setErrMsg(
        err?.response?.data?.message ||
        'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setQuestion('');
    setAnswer('');
    setErrMsg('');
  };

  return (
    <div className="py-4" style={{ maxWidth: 640 }}>
      <h2 className="mb-3">Ask AI</h2>
      <p className="text-muted">
        Ask anything. Each question is answered fresh (it doesn’t remember old
        chats). Example: “What is coding event?” or “Is today Sunday?”
      </p>

      <form onSubmit={askAI} className="mb-3">
        <textarea
          className="form-control mb-2"
          rows={3}
          placeholder="Type your question here…"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={loading}
          required
        />

        <div className="d-flex gap-2">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Thinking…' : 'Ask'}
          </button>

          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={clearAll}
            disabled={loading && !answer && !errMsg}
          >
            Clear
          </button>
        </div>
      </form>

      {errMsg && (
        <div className="alert alert-danger small" role="alert">
          {errMsg}
        </div>
      )}

      {answer && (
        <div className="alert alert-success small" role="alert" style={{ whiteSpace: 'pre-wrap' }}>
          {answer}
        </div>
      )}
    </div>
  );
}
