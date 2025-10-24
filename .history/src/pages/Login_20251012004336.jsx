import { useState } from 'react'
import { login } from '../api/authApi'

export default function Login(){
  const [form, setForm] = useState({ email:'', password:'' })
  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value })
  const onSubmit = async e => { e.preventDefault(); const { data } = await login(form); localStorage.setItem('token', data.token); window.location.href = '/' }
  return (
    <form className="mx-auto" style={{maxWidth:420}} onSubmit={onSubmit}>
      <h3 className="mb-3">Login</h3>
      <input name="email" className="form-control mb-2" placeholder="Email" onChange={onChange} />
      <input type="password" name="password" className="form-control mb-3" placeholder="Password" onChange={onChange} />
      <button className="btn btn-primary w-100">Login</button>
    </form>
  )
}