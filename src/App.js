import React, { useState } from 'react';
import Navbar from './components/Navbar'
import Login from './components/Login'
import Footer from './components/Footer'
import Upload from './components/Upload'
import Setting from './components/Setting';
import Home from './components/Home'
import Management from './components/Management';
import { Routes, Route } from "react-router-dom";

function App() {
  //set useState(true) to test pages without login
  let cookie = document.cookie
  let cookieObj = {};
  cookie.split(';').forEach(cookie => {
    let [name, value] = cookie.split('=');
    cookieObj[name.trim()] = value;
  });
  let haveToken = cookieObj.token;
  const [token, setToken] = useState(haveToken);

  const [isAdmin, setIsAdmin] = useState(checkIsAdmin(token));

  if (!token) {
    return <Login setToken={setToken} />
  }

  function checkIsAdmin(token) {
    //ToDo: check the token and return true if the user is admin
    return true
  }

  return (
    <>
      <Navbar isAdmin={isAdmin} />
      <Routes>
        {
          isAdmin ?
            <Route path="/management" element={<Management />} /> :
            <> </>
        }
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/setting" element={<Setting />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;