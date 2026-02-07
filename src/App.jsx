
import './App.css'
import { useState } from 'react'
import useUserStore from './store/usePlayerStore'
import Header from './components/layout/Header'
import Configuration from './components/configuration/config'
import Navbar from './components/layout/Navbar'
import SignIn from './components/signin/signin'

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const userData = useUserStore((state) => state.userData);
  function handleLogin() {
    setLoggedIn(true);
  }
  return (
    <>
    {!loggedIn && <SignIn onAction={handleLogin} />}
    {loggedIn && !userData.isConfigured && (
        <Configuration />
    )}
    {loggedIn && userData.isConfigured && (
        <>
        <Header />
        <Navbar />
        </>
    )}
    </>
  )
}

export default App
