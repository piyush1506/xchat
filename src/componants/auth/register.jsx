import { useState } from 'react'
import { useNavigate } from 'react-router-dom'



import axios from 'axios'
function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user,setUser] = useState([])
  const [detail,setDetail] = useState()

const navigate = useNavigate()
  const handleSubmit= async(e)=>{
  try {
      e.preventDefault()
    const payload = {
        name,
        email,
        password

    }
     const res  =await  axios.post(`${ import.meta.env.VITE_API_URL||'http://localhost:8000'}/api/v1/register`,payload)
      const data = res.data
      console.log(res.data)
      setUser(data.user)
      console.log(res.data.success)
       localStorage.setItem('token',data.token)
      localStorage.setItem('user',JSON.stringify(data.user))
     
           if(res.data.success===true)navigate('/')
      setName('');
      setEmail('');
      setPassword('');
  } catch (err) {
    console.error(err)
  }
  }

  return (
    <div className="bg-purple-100 flex items-center bg-gradient-to-tr from-indigo-400  to-fuchsia-50 justify-center h-screen">
        <form onSubmit={handleSubmit}>
        <div className="bg-white text-2xl  p-3 rounded-xl shadow-lg">
          <h1 className='text-3xl font-manrope font-black leading-snug text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-pink-600 to-purple-600 shadow flex items-center justify-center '>register</h1>
       <div className="flex flex-col  gap-3">
<input type='text'    className='bg-gray-00 border-b-2 border-slate-500 p-1 m-1  outline-none' value={name} onChange={(e)=>{setName(e.target.value)}} placeholder='enter your name'/>       
<input type='email'   className='bg-gray100 border-b-2 border-slate-500 p-1 m-1  outline-none' value={email} onChange={(e)=>{setEmail(e.target.value)}} placeholder='enter your email'/>
<input type='password'className='bg-gray00  border-b-2 border-slate-500 p-1 m-1  outline-none' value={password} onChange={(e)=>{setPassword(e.target.value)}} placeholder='enter your password'/>       
       </div>
    <div class=" h-9 rounded-md bg-gradient-to-tr from-indigo-600  to-purple-500 p-0.5">
<div class="w-full h-full rounded-md  flex items-center justify-center">
<button type='submit' class="text-xl font-manrope font-bold text-white">Register</button>
</div>
</div> </div>
        </form>
     
    </div>
  )
}

export default Register
