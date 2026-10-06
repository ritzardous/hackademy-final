import CyberArtwork from '../components/CyberArtwork'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Play, Pause, Gamepad2, ArrowRight } from 'lucide-react'
import styles from '../styles/ArticlePage.module.css'
import ArticleLayout from '../components/ArticleLayout'

const EKYCPage = () => {
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
        document.querySelector(`.${styles.howItHappens} p`)?.textContent,
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
        <CyberArtwork kind="identity" className={styles.articleIcon} />
        <h1>e-KYC / Data-Harvesting & SIM-Swap Frauds</h1>
        <p>Understanding data-harvesting, e-KYC attacks, and SIM-swap frauds</p>
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
            Attackers collect personal information through fake forms, phishing
            pages, or malicious apps and misuse it for identity theft or to
            bypass authentication systems like e-KYC. These scams often appear
            as legitimate requests from banks, telecom operators, or government
            agencies asking users to verify their details. Once the victim
            submits sensitive data such as Aadhaar numbers, PAN, or SIM details,
            cybercriminals can open fraudulent accounts or conduct unauthorized
            transactions. These attacks exploit trust and familiarity, making
            them especially dangerous for users less aware of online
            verification processes.
          </p>
          <div className={styles.imageContainer}>
            <img
              src='/images/ekyc1.png'
              alt='e-KYC Scam Example'
              className={styles.bentoImage}
            />
          </div>
        </section>

        <section className={`${styles.bentoCard} ${styles.howItHappens}`}>
          <h2>SIM-Swap Frauds</h2>
          <p>
            SIM-swap fraud occurs when attackers convince a mobile carrier to
            move a victim's number to a SIM they control. With control of the
            number, attackers can intercept OTPs and reset account passwords.
          </p>
          <ul>
            <li>Phishing for KYC documents or credentials</li>
            <li>Buying stolen personal data on underground markets</li>
            <li>Social engineering mobile carrier support to port a number</li>
          </ul>
        </section>

        <section className={`${styles.bentoCard} ${styles.realWorldStories}`}>
          <h2>Prevention Tips</h2>
          <div className={styles.imageContainer}>
            <img
              src='/images/ekyc3.png'
              alt='SIM Swap Protection'
              className={styles.bentoImage}
            />
          </div>
          <ul>
            <li>Don't upload KYC documents to untrusted sites or apps</li>
            <li>
              Enable carrier level PINs or two-factor methods that aren't SMS
              based
            </li>
            <li>
              Use hardware/authenticator apps instead of SMS OTP where possible
            </li>
            <li>Monitor accounts for unexpected changes and set alerts</li>
          </ul>
        </section>

        <section className={`${styles.bentoCard} ${styles.stayProtected}`}>
          <h2>Recovery Steps</h2>
          <p>
            If your number is ported, contact your carrier immediately, report
            to banks and services that may be affected, and file an official
            complaint with authorities. Change passwords for accounts using the
            number and enable stronger authentication.
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
            <Link to="/learn/fake-job-scams" className={styles.secondaryBtn}>
              Next Module: Job Scams <ArrowRight size={20} />
            </Link>
          </div>
        </section>
      </div>
    </ArticleLayout>
  )
}

export default EKYCPage
