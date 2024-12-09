import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Chatbot from "./components/Chatbot"
import Login from "./components/Login"
import Signup from "./components/Signup"
import Navbar from './components/Navbar'


function App() {

  return (
    <>
    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path="/chatbot" element={<Chatbot/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/" element={<Signup/>} />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App