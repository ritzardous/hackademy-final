import CyberArtwork from '../components/CyberArtwork'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Play, Pause, Gamepad2, ArrowRight } from 'lucide-react'
import styles from '../styles/ArticlePage.module.css'
import ArticleLayout from '../components/ArticleLayout'

const UPIScamPage = () => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const utteranceRef = React.useRef(null)

  // handles text-to-speech for article content, toggling play/pause and selecting a natural voice
  const handleReadAloud = () => {
    if (isSpeaking) {
      window.speechSynthesis.pause()
      setIsSpeaking(false)
    } else {
      if (utteranceRef.current && window.speechSynthesis.paused) {
        window.speechSynthesis.resume()
        setIsSpeaking(true)
        return
      }

      window.speechSynthesis.cancel()

      const articleText = [
        document.querySelector(`.${styles.articleHero} h1`)?.textContent,
        document.querySelector(`.${styles.articleHero} p`)?.textContent,
        document.querySelector(`.${styles.whatIsIt} h2`)?.textContent,
        document.querySelector(`.${styles.whatIsIt} p`)?.textContent,
        document.querySelector(`.${styles.howItHappens} h2`)?.textContent,
        ...Array.from(
          document.querySelectorAll(`.${styles.howItHappens} li`)
        ).map((li) => li.textContent),
        document.querySelector(`.${styles.realWorldStories} h2`)?.textContent,
        ...Array.from(
          document.querySelectorAll(`.${styles.realWorldStories} li`)
        ).map((li) => li.textContent),
        document.querySelector(`.${styles.stayProtected} h2`)?.textContent,
        document.querySelector(`.${styles.stayProtected} p`)?.textContent,
      ]
        .filter((text) => text)
        .join('. ')

      const utterance = new SpeechSynthesisUtterance(articleText)
      utterance.lang = 'en-US'

      const voices = window.speechSynthesis.getVoices()
      const naturalVoice = voices.find(
        (voice) =>
          voice.name.includes('Google US English') ||
          voice.name.includes('Microsoft Zira') ||
          voice.name.includes('Natural') ||
          voice.name.includes('Samantha') ||
          voice.name.includes('Alex') ||
          voice.default
      )
      if (naturalVoice) {
        utterance.voice = naturalVoice
      }

      utterance.volume = 1.0
      utterance.rate = 0.95
      utterance.pitch = 0.9

      utterance.onend = () => {
        setIsSpeaking(false)
        utteranceRef.current = null
      }

      utteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
      setIsSpeaking(true)
    }
  }

  // loads available voices for text-to-speech and cleans up event listener on unmount
  React.useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices()
    }
    window.speechSynthesis.onvoiceschanged = loadVoices
    loadVoices()
    return () => {
      window.speechSynthesis.onvoiceschanged = null
    }
  }, [])

  return (
    <ArticleLayout>
      <div className={styles.articleHero}>
        <CyberArtwork kind="payment" className={styles.articleIcon} />
        <h1>UPI Payment / Refund / Collect Request Scams</h1>
        <p>How UPI based scams work and how to avoid falling victim</p>
        <button
          className={styles.readAloudButton}
          onClick={handleReadAloud}
          aria-label={isSpeaking ? 'Pause reading' : 'Read page content aloud'}
        >
          {isSpeaking ? (
            <>
              <Pause className={styles.buttonIcon} /> Read Aloud
            </>
          ) : (
            <>
              <Play className={styles.buttonIcon} /> Read Aloud
            </>
          )}
        </button>
      </div>

      <div className={styles.bentoGrid}>
        <section className={`${styles.bentoCard} ${styles.whatIsIt}`}>
          <h2>What is it?</h2>
          <p>
            Scammers use UPI collect requests, fake refund messages, or social
            engineering to trick users into sending money or approving
            transactions. These attacks often rely on urgency, impersonation, or
            vulnerabilities in how users approve payments. In many cases,
            scammers pose as customer support agents or delivery staff, asking
            victims to “verify” or “accept” small refund amounts. Fraudsters may
            also send screenshots or use familiar logos to make their requests
            appear genuine. Such scams commonly spread through chat apps, social
            media, and fake helpline numbers. As UPI becomes more popular for
            daily payments, fraudsters continue to evolve their tactics, making
            awareness the strongest defense.
          </p>
          <div className={styles.imageContainer}>
            <img
              src='/images/upi1.jpg'
              alt='UPI Scam Example'
              className={styles.bentoImage}
            />
          </div>
        </section>

        <section className={`${styles.bentoCard} ${styles.howItHappens}`}>
          <h2>How it happens</h2>
          <ul>
            <li>Fake refund messages asking you to accept a collect request</li>
            <li>
              Impersonation of merchants or support staff asking for UPI
              approval
            </li>
            <li>
              Links leading to fake payment pages that harvest credentials
            </li>
            <li>
              Social engineering to pressure quick approval of a transaction
            </li>
          </ul>
        </section>

        <section className={`${styles.bentoCard} ${styles.realWorldStories}`}>
          <h2>How to Protect Yourself</h2>
          <div className={styles.imageContainer}>
            <img
              src='/images/upi2.png'
              alt='UPI Safety Tips'
              className={styles.bentoImage}
            />
          </div>
          <ul>
            <li>
              Never accept or approve UPI collect requests from unknown parties
            </li>
            <li>
              Verify refund claims through official channels before responding
            </li>
            <li>
              Use app notifications and transaction details to confirm payee
              identity
            </li>
            <li>
              Keep your UPI app and phone OS updated; use app level
              authentication
            </li>
          </ul>
        </section>

        <section className={`${styles.bentoCard} ${styles.stayProtected}`}>
          <h2>If You Were Scammed</h2>
          <p>
            Immediately contact your bank and block payments, report the fraud
            via official channels, and consider filing a police report. Preserve
            chat logs and transaction IDs for investigation.
          </p>
        </section>

        {/* Combat Readiness Section */}
        <section className={`${styles.bentoCard} ${styles.combatReadiness}`}>
          <h2>Combat Readiness</h2>
          <p>Mastered this module? Put your skills to the test or move to the next threat.</p>
          <div className={styles.combatButtons}>
            <Link to="/game" className={styles.primaryBtn}>
              <Gamepad2 size={20} /> Test Your Knowledge
            </Link>
            <Link to="/learn/ekyc-sim-swap" className={styles.secondaryBtn}>
              Next Module: e-KYC <ArrowRight size={20} />
            </Link>
          </div>
        </section>
      </div>
    </ArticleLayout>
  )
}

export default UPIScamPage
