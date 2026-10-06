import CyberArtwork from '../components/CyberArtwork'
import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Play, BookOpen } from 'lucide-react'
import styles from '../styles/GamesHubPage.module.css'

const GamesHubPage = ({ currentUser }) => {
  const navigate = useNavigate()

  useEffect(() => {
    if (!currentUser) {
      navigate('/username')
    }
  }, [currentUser, navigate])

  if (!currentUser) return null

  return (
    <div className={styles.hubPage}>
      <div className={styles.ambientLight} />
      
      <div className={styles.hubHeader}>
        <h1>@{currentUser}'s Arcade</h1>
        <p>Choose your training module. Test your knowledge or simulate real-world attacks to earn points and climb the leaderboard.</p>
      </div>

      <div className={styles.gamesGrid}>
        
        {/* Game 1: MCQ */}
        <Link to="/game" className={styles.gameCard}>
          <div className={styles.iconWrapper}>
            <CyberArtwork kind="arcade" className={styles.gameIcon} />
          </div>
          <h2 className={styles.gameTitle}>Knowledge Check</h2>
          <p className={styles.gameDescription}>
            Answer rapid-fire multiple choice questions about common cybersecurity threats, scams, and best practices.
          </p>
          <div className={styles.playButton}>
            <Play className={styles.playButtonIcon} /> Play Game
          </div>
        </Link>

        {/* Game 2: Phishing Simulator */}
        <Link to="/phishing-game" className={`${styles.gameCard} ${styles.phishing}`}>
          <div className={styles.iconWrapper}>
            <CyberArtwork kind="phishing" className={styles.gameIcon} />
          </div>
          <h2 className={styles.gameTitle}>Phishing Simulator</h2>
          <p className={styles.gameDescription}>
            Analyze real-world emails and text messages to determine if they are legitimate communications or dangerous scams.
          </p>
          <div className={styles.playButton}>
            <Play className={styles.playButtonIcon} /> Start Training
          </div>
        </Link>

        {/* Game 3: Link Decoder */}
        <Link to="/link-decoder" className={`${styles.gameCard} ${styles.linkDecoder}`}>
          <div className={styles.iconWrapper}>
            <CyberArtwork kind="link" className={styles.gameIcon} />
          </div>
          <h2 className={styles.gameTitle}>The Link Decoder</h2>
          <p className={styles.gameDescription}>
            Hone your visual literacy. Spot the tiny differences between a safe website and a scammer's trap.
          </p>
          <div className={styles.playButton}>
            <Play className={styles.playButtonIcon} /> Analyze Links
          </div>
        </Link>
        
      </div>

      <div className={styles.refresherContainer}>
        <h2>Need a Refresher?</h2>
        <p>Before jumping into the arena, you can review our defense modules to learn about the latest scams.</p>
        <Link to="/learn" className={styles.refresherBtn}>
          <BookOpen size={20} /> Read the Survival Guide
        </Link>
      </div>

    </div>
  )
}

export default GamesHubPage
