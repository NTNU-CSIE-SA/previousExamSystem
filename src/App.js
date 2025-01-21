import React, { useState } from 'react';
import Navbar from './components/Navbar'
import Login from './components/Login'
import Footer from './components/Footer'
import Upload from './components/Upload'
import Setting from './components/Setting'
import { Routes, Route } from "react-router-dom";

function App() {

  const [token, setToken] = useState();

  if(!token) {
    return <Login setToken={setToken} />
  }

  return (
    <>
      <Navbar />
        <Routes>
          <Route path="/upload" element={<Upload />} /> 
          <Route path="/setting" element={<Setting />} /> 
        </Routes>
      <Footer />
    </>
  );
}


export default App;