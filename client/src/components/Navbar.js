import CyberArtwork from './CyberArtwork'
import React, { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { LogOut, Menu, X, ArrowUpRight } from 'lucide-react'
import styles from '../styles/Navbar.module.css'
import { userAPI } from '../utils/api'

export default function Navbar({ currentUser, setUser }) {
  const [open, setOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  useEffect(() => { setOpen(false) }, [location.pathname])
  useEffect(() => {
    const escape = event => { if (event.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', escape)
    return () => document.removeEventListener('keydown', escape)
  }, [])
  const logout = async () => {
    setLoggingOut(true)
    try { await userAPI.logoutUser(currentUser) } catch (error) { console.error('Logout request failed', error) }
    setUser('')
    setOpen(false)
    setLoggingOut(false)
    navigate('/')
  }
  const navClass = ({ isActive }) => isActive ? styles.activeLink : undefined
  return <nav className={styles.navbar} aria-label="Main navigation">
    <div className={styles.navInner}>
      <Link to="/" className={styles.logo} aria-label="Hackademy home"><CyberArtwork kind="brand" /> hackademy<span aria-hidden="true">✳</span></Link>
      <button className={styles.menuToggle} onClick={() => setOpen(value => !value)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="main-navigation" data-testid="hamburger-button">{open ? <X /> : <Menu />}</button>
      <div id="main-navigation" className={open ? styles.menuOpen : styles.menu} data-testid="nav-menu">
        <div className={styles.links}>
          <NavLink to="/learn" className={navClass}>Learn <ArrowUpRight size={15} aria-hidden="true" /></NavLink>
          <NavLink to="/games" className={navClass}>Play <ArrowUpRight size={15} aria-hidden="true" /></NavLink>
          <NavLink to="/leaderboard" className={navClass}>Leaderboard <ArrowUpRight size={15} aria-hidden="true" /></NavLink>
        </div>
        {currentUser ? <div className={styles.account}><Link to="/games" className={styles.handle} title={'@' + currentUser}>@{currentUser}</Link><button onClick={logout} disabled={loggingOut} className={styles.logout} data-testid="logout-button"><LogOut size={17} /> {loggingOut ? 'Leaving…' : 'Log out'}</button></div> : <Link to="/username" className={styles.start}>Let’s get scam-proof <ArrowUpRight size={18} aria-hidden="true" /></Link>}
      </div>
    </div>
  </nav>
}
