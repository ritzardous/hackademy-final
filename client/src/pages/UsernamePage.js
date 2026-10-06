import CyberArtwork from '../components/CyberArtwork'
import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { userAPI } from '../utils/api'
import { Loader, ArrowRight, Terminal, ShieldAlert, Check } from 'lucide-react'
import styles from '../styles/UsernamePage.module.css'
import commonStyles from '../styles/common.module.css'

const funnyTexts = [
  'Getting your player profile ready…',
  'Still connecting. Thanks for your patience.'
]

const UsernamePage = ({ setUser }) => {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [forceLoginNeeded, setForceLoginNeeded] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('Getting your player profile ready…')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    let index = 0;
    let interval;
    if (loading) {
      interval = setInterval(() => {
        index = (index + 1) % funnyTexts.length;
        setLoadingMessage(funnyTexts[index]);
      }, 3000);
    } else {
      setLoadingMessage('Getting your player profile ready…');
    }
    return () => clearInterval(interval);
  }, [loading]);

  const from = location.state?.from || '/games'

  const handleSubmit = async (e, force = false) => {
    e.preventDefault()

    const normalizedUsername = username.trim().toLowerCase()

    if (!normalizedUsername) {
      setError('Please enter a username')
      return
    }

    if (normalizedUsername.length < 2) {
      setError('Username must be at least 2 characters')
      return
    }

    if (normalizedUsername.length > 30) {
      setError('Username cannot exceed 30 characters')
      return
    }

    if (!/^[a-z0-9_]+$/.test(normalizedUsername)) {
      setError('Username can only contain letters, numbers, and underscores')
      return
    }

    setLoading(true)
    setError('')

    try {
      const storedToken = localStorage.getItem(`visitorToken_${normalizedUsername}`) || ''
      const response = await userAPI.createUser(normalizedUsername, force, storedToken)

      if (response.success) {
        setUser(response.data.username, response.token)
        navigate(from, { replace: true })
      } else {
        setError(response.message || 'Failed to create user')
      }
    } catch (error) {
      if (error.isAlreadyActive) {
        setForceLoginNeeded(true)
        setError(error.message || 'Username is active elsewhere. Force login to disconnect them.')
      } else {
         setError(error.message || 'Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.usernamePage}>
      <div className={styles.ambientLight} />

      <div className={styles.welcome}>
        <div className={styles.welcomeIcon} aria-hidden="true"><CyberArtwork kind="arcade" /></div>
        <h1>Enter the<br /><span>playground.</span></h1>
        <p>Practise spotting scams, build your defenses, and give your internet survival skills a name.</p>
        <div className={styles.perks}><span><Check size={18} /> Free to play</span><span><Check size={18} /> No password needed</span><span><Check size={18} /> Your scores, your handle</span></div>
      </div>

      <div className={styles.formContainer}>
        <div className={styles.terminalDots} aria-hidden="true">
          <span></span><span></span><span></span>
        </div>

        <div className={styles.formHeader}>
          <Terminal className={styles.headerIcon} />
          <h2>Identify Yourself</h2>
          <p>
            Pick a handle. Your scores and progress live under this name.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.usernameForm}>
          <div className={styles.inputGroup}>
            <label htmlFor='username'>Handle</label>
            <div className={`${styles.inputWrapper} ${error ? styles.inputError : ''}`}>
              <span className={styles.atSymbol}>@</span>
              <input
                type='text'
                id='username'
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                  setForceLoginNeeded(false)
                  setError('')
                }}
                placeholder='player_one'
                maxLength='30'
                disabled={loading}
                autoComplete='off'
                spellCheck='false'
                aria-describedby={error ? 'handle-help handle-error' : 'handle-help'}
                aria-invalid={!!error}
              />
            </div>
            <small id='handle-help'>Use 2–30 lowercase letters, numbers, or underscores.</small>
          </div>

          {error && (
            <div
              className={`${commonStyles.errorMessage} ${styles.errorShake}`}
              id='handle-error'
              role='alert'
            >
              <ShieldAlert size={14} />
              {error}
            </div>
          )}

          {forceLoginNeeded ? (
            <button
              type='button'
              onClick={(e) => handleSubmit(e, true)}
              disabled={loading}
              className={`${styles.forceButton} ${
                loading ? styles.disabledButton : ''
              }`}
            >
              {loading ? (
                <><Loader className={styles.loadingIcon} /> Connecting...</>
              ) : (
                <><ShieldAlert className={styles.icon} /> Force Login</>
              )}
            </button>
          ) : (
            <button
              type='submit'
              disabled={loading}
              className={`${styles.primaryButton} ${
                loading ? styles.disabledButton : ''
              }`}
            >
              {loading ? (
                <><Loader className={styles.loadingIcon} /> Connecting...</>
              ) : (
                <>Enter the arcade <ArrowRight className={styles.icon} /></>
              )}
            </button>
          )}

          {loading && (
            <p className={styles.loadingMessage}>
              {loadingMessage}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}

export default UsernamePage
