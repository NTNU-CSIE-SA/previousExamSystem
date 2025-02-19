import React, { useState } from 'react';
import Navbar from './components/Navbar'
import Login from './components/Login'
import Footer from './components/Footer'
import Upload from './components/Upload'
import Setting from './components/Setting';
import Home from './components/Home'
import Management from './components/Management';
import TermsOfUse from './components/TermsOfUse';
import PrivacyPolicy from './components/PrivacyPolicy';
import { Routes, Route , useLocation } from "react-router-dom";

function App() {
  //set useState(true) to test pages without login

  //paths_withoutLogin array is an array which imply that the paths that 
  //does not require login to reach
  const paths_withoutLogin = ['/terms-of-use', '/privacy-policy']
  let current_path = useLocation().pathname;

  let cookie = document.cookie
  let cookieObj = {};
  cookie.split(';').forEach(cookie => {
    let [name, value] = cookie.split('=');
    cookieObj[name.trim()] = value;
  });
  let haveToken = cookieObj.token;
  const [token, setToken] = useState(haveToken);

  const [isAdmin, setIsAdmin] = useState(checkIsAdmin(token));

  if (!token&&!paths_withoutLogin.includes(current_path)) {
    return <Login setToken={setToken} />
  }

  function checkIsAdmin(token) {
    //TODO: check the token and return true if the user is admin
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
        <Route path="/terms-of-use" element={<TermsOfUse />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/setting" element={<Setting />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;