import CyberArtwork from '../components/CyberArtwork'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Play, Pause, Gamepad2, ArrowRight } from 'lucide-react'
import styles from '../styles/ArticlePage.module.css'
import ArticleLayout from '../components/ArticleLayout'

const WhatsAppStockScamPage = () => {
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
        document.querySelector(`.${styles.realWorldStories} p`)?.textContent,
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
        <CyberArtwork kind="phishing" className={styles.articleIcon} />
        <h1>WhatsApp/Telegram Stock Market Group Scam</h1>
        <p>Protect yourself from fraudulent stock market schemes on WhatsApp</p>
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
            Buzzing WhatsApp groups promise "insider" stock tips for quick
            riches, but they're traps run by fraudsters posing as experts. They
            lure you with free advice, then push fake apps or schemes where your
            investments vanish. Seniors eyeing easy gains are easy prey in
            India, where trading hype is huge. Many victims only realize they've
            been scammed when trying to withdraw money or when the admin
            suddenly disappears. These scams exploit trust and the fear of
            missing out on high returns, making it crucial to stay cautious.
          </p>
          <div className={styles.imageContainer}>
            <img
              src='/images/whatsapp1.png'
              alt='Spotting WhatsApp Investment Red Flags'
              className={styles.bentoImage}
            />
          </div>
        </section>

        <section className={`${styles.bentoCard} ${styles.howItHappens}`}>
          <h2>How it happens</h2>
          <ul>
            <li>Unsolicited add via ad or contact, with "free tips" hype.</li>
            <li>Fake wins shared, small tips work to reel you in.</li>
            <li>
              Urge downloads of bogus apps or big deposits for "VIP" returns.
            </li>
            <li>Rigged profits shown, but withdrawals blocked money gone.</li>
          </ul>
        </section>

        <section className={`${styles.bentoCard} ${styles.realWorldStories}`}>
          <h2>Real-World Stories</h2>
          <div className={styles.imageContainer}>
            <img
              src='/images/whatsapp2.png'
              alt='Warning Poster for Stock Tips Groups'
              className={styles.bentoImage}
            />
          </div>
          <p>
            A 70 year-old from Kolshet, Thane, lost ₹2 crore after joining a
            WhatsApp group promising stock tips. The admin, posing as a Chicago
            investment firm rep, lured him with fake high return trades. He
            invested, saw false profits, but withdrawal demands exposed the
            scam.
          </p>
        </section>

        <section className={`${styles.bentoCard} ${styles.stayProtected}`}>
          <h2>If You Were Scammed</h2>
          <p>
            Verify sources with SEBI, avoid group shared apps or links, and
            report suspicious invites to cybercrime.gov.in or 1930 immediately.
          </p>
        </section>

        {/* Combat Readiness Section */}
        <section className={`${styles.bentoCard} ${styles.combatReadiness}`}>
          <h2>Combat Readiness</h2>
          <p>Mastered this module? Put your skills to the test or explore more threats.</p>
          <div className={styles.combatButtons}>
            <Link to="/game" className={styles.primaryBtn}>
              <Gamepad2 size={20} /> Test Your Knowledge
            </Link>
            <Link to="/learn" className={styles.secondaryBtn}>
              Back to Modules <ArrowRight size={20} />
            </Link>
          </div>
        </section>
      </div>
    </ArticleLayout>
  )
}

export default WhatsAppStockScamPage
