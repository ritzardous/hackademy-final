import CyberArtwork from '../components/CyberArtwork'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Play, Pause, Gamepad2, ArrowRight } from 'lucide-react'
import styles from '../styles/ArticlePage.module.css'
import ArticleLayout from '../components/ArticleLayout'

const FakeJobScamPage = () => {
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
        document.querySelector(`.${styles.realWorldStories} p`)?.textContent,
        document.querySelector(`.${styles.stayProtected} h2`)?.textContent,
        ...Array.from(
          document.querySelectorAll(`.${styles.stayProtected} li`)
        ).map((li) => li.textContent),
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
        <CyberArtwork kind="job" className={styles.articleIcon} />
        <h1>Fake Job / Work-From-Home / Call-Centre Scams</h1>
        <p>
          Understanding and protecting yourself from fake job and work-from-home
          scams
        </p>
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
            Fake job, work-from-home, and call-centre scams promise easy income
            through ads for jobs like "data entry for ₹20,000/month" or
            call-center roles. Scammers demand upfront fees, access to bank
            accounts, or involve victims in illegal money mule activities.
            Seniors seeking extra income are often targeted in India.
          </p>
          <div className={styles.imageContainer}>
            <img
              src='/images/job2.jpg'
              alt='Fake Job Email Ad Example'
              className={styles.bentoImage}
            />
          </div>
        </section>

        <section className={`${styles.bentoCard} ${styles.howItHappens}`}>
          <h2>How it happens</h2>
          <p>Scammers cleverly lure victims with these manipulative tactics:</p>
          <ul>
            <li>
              Email or SMS messages promising “No experience needed, start
              earning today now!”
            </li>
            <li>
              Demanding ₹500 or even more for “kit/training materials,” followed
              by further creative excuses for additional unnecessary payments.
            </li>
            <li>
              Requesting complete bank details for “salary setup,” eventually
              leading to financial data theft and personal loss.
            </li>
            <li>
              Involving unsuspecting victims in “payment processing” schemes
              that secretly support serious criminal or illegal activities
              unknowingly.
            </li>
          </ul>
        </section>

        <section className={`${styles.bentoCard} ${styles.realWorldStories}`}>
          <h2>Real world stories</h2>
          <div className={styles.imageContainer}>
            <img
              src='/images/job3.png'
              alt='Fake Job and Investment Scam Arrest'
              className={styles.bentoImage}
            />
          </div>
          <p>
            A Delhi based family was defrauded of ₹1.10 crore in a fake job and
            investment scam. The accused, posing as a company CEO, used forged
            documents, fake offer letters, and social media to trick victims.
            Police tracked him down in Goa after months of digital investigation
            and arrested him for running a sophisticated cyber fraud network.
          </p>
        </section>

        <section className={`${styles.bentoCard} ${styles.stayProtected}`}>
          <h2>How to stay protected</h2>
          <ul>
            <li>
              Use trusted platforms like Naukri.com; legitimate jobs don’t
              require upfront fees.
            </li>
            <li>Never share bank details for "verification."</li>
            <li>
              Prefer in person interviews; video calls are acceptable but verify
              the employer.
            </li>
            <li>Discuss job offers with trusted family or friends.</li>
            <li>
              Contact local police or report to cybercrime.gov.in if suspicious.
            </li>
          </ul>
        </section>

        {/* Combat Readiness Section */}
        <section className={`${styles.bentoCard} ${styles.combatReadiness}`}>
          <h2>Combat Readiness</h2>
          <p>Mastered this module? Put your skills to the test or move to the next threat.</p>
          <div className={styles.combatButtons}>
            <Link to="/game" className={styles.primaryBtn}>
              <Gamepad2 size={20} /> Test Your Knowledge
            </Link>
            <Link to="/learn/whatsapp-stock-scam" className={styles.secondaryBtn}>
              Next Module: Stock Scams <ArrowRight size={20} />
            </Link>
          </div>
        </section>
      </div>
    </ArticleLayout>
  )
}

export default FakeJobScamPage
