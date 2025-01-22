import React, { useState } from 'react';
import Navbar from './components/Navbar'
import Login from './components/Login'
import Footer from './components/Footer'
import Upload from './components/Upload'
import Setting from './components/Setting'
import Home from './components/Home'
import { Routes, Route } from "react-router-dom";

function App() {

  //to test pages/components without login, just mark up the token test feature below
  //the token check feature should be modified after connected to backend
  //not sure the current token saving method, but the token checking system should contains 
  //checking the token first before asking to login again.

  
  const [token, setToken] = useState();

  if(!token) {
    return <Login setToken={setToken} />
  }

  

  return (
    <>
      <Navbar />
        <Routes>
          <Route path="/home" element={<Home />} /> 
          <Route path="/upload" element={<Upload />} /> 
          <Route path="/setting" element={<Setting />} /> 
        </Routes>
      <Footer />
    </>
  );
}


export default App;