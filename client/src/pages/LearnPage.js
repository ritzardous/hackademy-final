import CyberArtwork from '../components/CyberArtwork'
import React from 'react'
import { Link } from 'react-router-dom'
import {
  Gamepad2,
} from 'lucide-react'
import styles from '../styles/LearnPage.module.css'

const LearnPage = ({ currentUser }) => {
  const marqueeText =
    'Stay alert! We update new scams as soon as they appear. Check here often to learn and protect yourself.'

  return (
    <div className={styles.learnPage}>
      <div className={styles.ambientLight}></div>
      <div className={styles.updateWrapper}>
        <div className={styles.updateBanner}>
          <div className={styles.updateLeft}>
            <div className={styles.pulse}></div>
            <div className={styles.updateMessage}>
              <span className={styles.ticker}>{marqueeText}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.heroSection}>
        <h1 className={styles.heroTitle}>
          <CyberArtwork kind="brand" className={styles.titleIcon} /> Learn About Common Scams
        </h1>
        <p className={styles.heroDescription}>
          Scammers often target through calls, messages or apps.
          <br />
          Learn how these tricks work and how to protect yourself step by step.
        </p>
      </div>

      <div className={styles.articlesGrid}>
        <Link to='/learn/digital-arrest-scam' className={styles.articleCard}>
          <div className={styles.articleContent}>
            <CyberArtwork kind="arrest" className={styles.articleIcon} />
            <h2>Digital Arrest Scam</h2>
            <p>
              Scammers pretend to be police or government officials and say you
              are in trouble. They ask for money or personal details.
            </p>
            <div className={styles.readMoreCta}>
              <span>Read Article</span>
              <span className={styles.arrow}>&rarr;</span>
            </div>
          </div>
        </Link>

        <Link to='/learn/upi-payment-scams' className={styles.articleCard}>
          <div className={styles.articleContent}>
            <CyberArtwork kind="payment" className={styles.articleIcon} />
            <h2>UPI Payment Scams</h2>
            <p>
              Fraudsters may trick you into sending money through fake UPI apps
              or QR codes.
            </p>
            <div className={styles.readMoreCta}>
              <span>Read Article</span>
              <span className={styles.arrow}>&rarr;</span>
            </div>
          </div>
        </Link>

        <Link to='/learn/ekyc-sim-swap' className={styles.articleCard}>
          <div className={styles.articleContent}>
            <CyberArtwork kind="identity" className={styles.articleIcon} />
            <h2>e-KYC / SIM Swap / Phone Number Theft</h2>
            <p>
              Scammers can take over your phone number and access your bank or
              messages.
            </p>
            <div className={styles.readMoreCta}>
              <span>Read Article</span>
              <span className={styles.arrow}>&rarr;</span>
            </div>
          </div>
        </Link>

        <Link to='/learn/fake-job-scams' className={styles.articleCard}>
          <div className={styles.articleContent}>
            <CyberArtwork kind="job" className={styles.articleIcon} />
            <h2>Work From Home Job Scams</h2>
            <p>
              Some offers promise easy work and high pay but ask for upfront
              fees or personal info.
            </p>
            <div className={styles.readMoreCta}>
              <span>Read Article</span>
              <span className={styles.arrow}>&rarr;</span>
            </div>
          </div>
        </Link>

        <Link to='/learn/whatsapp-stock-scam' className={styles.articleCard}>
          <div className={styles.articleContent}>
            <CyberArtwork kind="phishing" className={styles.articleIcon} />
            <h2>WhatsApp / Telegram Stock Market Group</h2>
            <p>
              Scammers send stock tips in WhatsApp or Telegram groups. They may
              try to get you to download fake apps or invest money.
            </p>
            <div className={styles.readMoreCta}>
              <span>Read Article</span>
              <span className={styles.arrow}>&rarr;</span>
            </div>
          </div>
        </Link>
      </div>

      <div className={styles.ctaContainer}>
        <Link
          to={currentUser ? '/games' : '/username'}
          className={styles.testKnowledgeButton}
        >
          <Gamepad2 className={styles.buttonIcon} />
          Go to Cyber Arcade
        </Link>
      </div>
    </div>
  )
}

export default LearnPage
