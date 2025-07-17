import React, { useEffect, useState } from 'react';
import NextTopLoader from 'nextjs-toploader';
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
import './style/app.css'
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";


export const basicURL = '/';

interface AdminPermissions {
  ban: boolean;
  modify: boolean;
}

function App() {
  //set useState(true) to test pages without login

  //paths_withoutLogin array is an array which imply that the paths that 
  //does not require login to reach
  const navigate = useNavigate();
  const paths_withoutLogin = ['/terms-of-use', '/privacy-policy']
  let current_path = useLocation().pathname;

  let cookie = document.cookie
  let cookieObj: { [key: string]: string } = {};
  cookie.split(';').forEach(cookie => {
    let [name, value] = cookie.split('=');
    cookieObj[name.trim()] = value;
  });
  let haveToken = cookieObj.token;
  const [token, setToken] = useState(haveToken);

  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState<AdminPermissions>({ ban: false, modify: false });
  useEffect(() => {
    if (token) {
      checkIsAdmin();
      checkFirstLogin();
    }
  }, [token, isFirstLogin]);
  useEffect(() => {
    if (token && isFirstLogin && current_path !== '/setting') {
      alert('請先重新設定密碼！');
      navigate('/setting', { replace: true });
    }
  }, [token, isFirstLogin, current_path]);

  if (!token && !paths_withoutLogin.includes(current_path)) {
    return <Login setToken={setToken} />
  }

  // TODO: frontend use this api
  async function checkIsAdmin() {
    const admim_permission = await fetch(basicURL + 'api/admin/check', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    }).then(res => {
      if (res.status === 200) {
        return res.json();
      } else {
        console.error('Error:', res);
        return { ban: false, modify_file: false };
      }
    })
      .then(data => {
        return { ban: data.ban, modify: data.modify_file };
      })
      .catch(err => {
        console.error(err);
        return { ban: false, modify: false };
      });
    setIsAdmin(admim_permission as AdminPermissions);
    return;
  }
  async function checkFirstLogin() {
    try {
      const res = await fetch(basicURL + 'api/auth/is-first-login', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
      });
      if (res.status === 200) {
        const data = await res.json();
        setIsFirstLogin(data.is_first_login ? true : false);
      } else {
        console.error('Failed to check first login:', res.status);
      }
    } catch (error) {
      console.error('Error checking first login:', error);
    }
    return;
  }

  return (
    <div className='app-container'>
      <NextTopLoader color='#565656' showSpinner={false} />
      {paths_withoutLogin.includes(current_path) ? <></> : <Navbar isAdmin={isAdmin} />}
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
        <Route path="/setting" element={<Setting setIsFirstLogin={setIsFirstLogin}/> } />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;