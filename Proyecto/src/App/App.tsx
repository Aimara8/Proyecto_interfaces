import 'regenerator-runtime/runtime';
import Login from "../Components/Login"
import { Route, Routes } from 'react-router-dom'
import '../CSS/App.css'
import Menu from '../Components/Menu'
import { ThemeProvider } from "../Contexts/ThemeContext"
import { AuthProvider } from "../Contexts/AuthContext"
import { CatsApp } from '../Components/CatsApp'
import Series from '../Components/SeriesReducer'
import ErrorPage from '../Components/ErrorPage';
import { Home } from "../Components/Home"
import SearchBar from "../Components/SearchBar"
import ResponsiveComponents from "../Components/ResponsiveComponents"
import InputWithDisplay from '../Components/VoiceRecognition';
import Chatbot from '../Components/Chat';
import Informes from '../Components/Informes';


function App() {

  return (
    <ThemeProvider>
      <AuthProvider>
        <Menu />
        <Routes>
          <Route path='/Informes' element={<Informes/>}></Route>
          <Route path='/KozzyIA' element={<Chatbot/>}></Route>
          <Route path='/VoiceRecognition' element={<InputWithDisplay/>}></Route>
          <Route path='/ResponsiveComponents' element={<ResponsiveComponents />}></Route>
          <Route path='/SearchBar' element={<SearchBar />}></Route>
          <Route path='/SeriesReducer' element={<Series />}></Route>
          <Route path='/CatsApp' element={<CatsApp />}></Route>
          <Route path='/Home' element={<Home />}></Route>
          <Route path='/Login' element={<Login />}></Route>
          <Route path='/' element={<Home />}></Route>
          <Route path='/*' element={<ErrorPage />}></Route>
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
