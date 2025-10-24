import { useState } from 'react'
import { signup } from '../api/authApi'

export default function Signup(){
  const [form, setForm] = useState({ name:'', email:'', password:'' })
  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value })
  const onSubmit = async e => { e.preventDefault(); await signup(form); window.location.href = '/login' }
  return (
    <form className="mx-auto" style={{maxWidth:480}} onSubmit={onSubmit}>
      <h3 className="mb-3">Create Account</h3>
      <input name="name" className="form-control mb-2" placeholder="Name" onChange={onChange} />
      <input name="email" className="form-control mb-2" placeholder="Email" onChange={onChange} />
      <input type="password" name="password" className="form-control mb-3" placeholder="Password" onChange={onChange} />
      <button className="btn btn-primary w-100">Sign Up</button>
    </form>
  )
}