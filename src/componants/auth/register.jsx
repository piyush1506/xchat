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
    <div className="bg-purple-100 flex items-center justify-center h-screen">
        <form onSubmit={handleSubmit}>
        <div className="bg-white text-2xl">
          <h1>register</h1>
       <div className="flex flex-col  gap-3">
<input type='text'    className='bg-gray-200 p-1 m-1 rounded-md outline-none' value={name} onChange={(e)=>{setName(e.target.value)}} placeholder='enter your name'/>       
<input type='email'   className='bg-gray-200 p-1 m-1 rounded-md outline-none' value={email} onChange={(e)=>{setEmail(e.target.value)}} placeholder='enter your email'/>
<input type='password'className='bg-gray-200 p-1 m-1 rounded-md outline-none' value={password} onChange={(e)=>{setPassword(e.target.value)}} placeholder='enter your password'/>       
       </div>
       <button className='bg-purple-600 text-white p-1 rounded-lg mx-auto m-2'>Register</button>
        </div>
        </form>
     
    </div>
  )
}

export default Register
