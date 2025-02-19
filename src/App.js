import React, { useState } from 'react';
import Navbar from './components/Navbar'
import Login from './components/Login'
import Footer from './components/Footer'
import Upload from './components/Upload'
import Setting from './components/Setting';
import Home from './components/Home'
import UserManagement from './components/UserManagement';
import DBManagement from './components/DBManagement'
import TermsOfUse from './components/TermsOfUse';
import PrivacyPolicy from './components/PrivacyPolicy';
import { Routes, Route , useLocation } from "react-router-dom";


export const basicURL = 'http://localhost:5000/';

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

  const [isAdmin, setIsAdmin] = useState(checkIsAdmin());
  

  if (!token&&!paths_withoutLogin.includes(current_path)) {
    return <Login setToken={setToken} />
  }

  // TODO: frontend use this api
  async function checkIsAdmin() {
      const admim_permission = await fetch(basicURL + 'api/admin/check', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true,
        credentials: 'include'
      }).then(res => res.json())
        .then(data => {
          return { ban: data.ban, modify: data.modify_file };
        })
        .catch(err => {
          console.error(err);
          return { ban: false, modify: false };
        });
      setIsAdmin(admim_permission);
      return;
  }

  return (
    <>
      <Navbar isAdmin={isAdmin} />
      <Routes>
        {
          isAdmin.ban ?
            <Route path="/user-management" element={<UserManagement />} /> :
            <> </>
        }
        {
          isAdmin.modify ?
            <Route path="/db-management" element={<DBManagement />} /> :
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