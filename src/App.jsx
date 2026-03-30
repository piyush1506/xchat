import { useState } from 'react'
import Header from './componants/Header'
import './App.css'
import Room from './componants/room/Room'
import Home from './Home'
import Register from './componants/auth/register'
import {Routes,Route,Link} from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (   <Routes>
        <Route path='/' element={<Home/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/room' element={<Room/>}/>

      </Routes>

  )
}

export default App
