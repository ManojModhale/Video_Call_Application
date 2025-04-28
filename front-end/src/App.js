import logo from './logo.svg';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ChangePassword from './pages/ForgotPassword';
import WebinarPlatform from './pages/landingpage';
import StreamRoom from './live-stream/streamroom';
import CallRoom from './video-Call/callroom';
import NotFound from './pages/NotFound';


function App() {
  return (
    <>

      <Routes>
        <Route path='/' element={<WebinarPlatform />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home/*" element={<HomePage />} />
        <Route path="/changepass" element={<ChangePassword />} />
        <Route path='/room/:roomId' element={<CallRoom />} />
        <Route path='/stream/:roomId' element={<StreamRoom />} />
        <Route path='/*' element={<NotFound />} />
      </Routes>

    </>

  );
}

export default App;
