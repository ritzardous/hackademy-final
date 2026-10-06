import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { userAPI } from '../utils/api'
import styles from '../styles/GamePage.module.css'
import QuitDialog from '../components/QuitDialog'
import {
  Award,
  RefreshCw,
  Trophy,
  CheckCircle,
  Loader,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Link as LinkIcon,
  Gamepad2,
  ArrowLeft
} from 'lucide-react'

const LinkDecoderGamePage = ({ currentUser }) => {
  const [currentScenario, setCurrentScenario] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selectedLink, setSelectedLink] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [streak, setStreak] = useState(0)
  const [bonusPoints, setBonusPoints] = useState(0)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showQuitConfirm, setShowQuitConfirm] = useState(false)
  const navigate = useNavigate()

  const scenarios = [
    {
      id: 1,
      title: "The Urgent KYC Notice",
      scenario: "You get an SMS at 11 PM: 'Dear HDFC Bank customer, your NetBanking access will be suspended within 12 hours due to incomplete Video KYC. Avoid service disruption - verify now:'",
      options: [
        { url: "netbanking.hdfcbank.com/kyc-verify", isLegit: true },
        { url: "hdfc-netbanking-kyc.com/verify-now", isLegit: false },
        { url: "www.hdfcbank-secure.in/kyc", isLegit: false }
      ],
      explanation: "HDFC Bank's real NetBanking portal lives at netbanking.hdfcbank.com - a subdomain of the official hdfcbank.com domain. Scammers register convincing lookalikes like 'hdfc-netbanking-kyc.com' or add 'secure' to trick you. The hyphen and the separate domain ownership are the giveaways.",
      points: 15
    },
    {
      id: 2,
      title: "The Tax Refund Alert",
      scenario: "An email from 'IT Department – India' says: 'Your Income Tax Refund of ₹18,340 for AY 2024-25 is ready. To credit it to your bank account, re-verify your Aadhaar-linked PAN at the link below within 7 days.'",
      options: [
        { url: "www.incometax-refund.org/verify-pan", isLegit: false },
        { url: "eportal.incometax.gov.in/iec/foservices", isLegit: true },
        { url: "www.incometaxindia-portal.com/refund", isLegit: false }
      ],
      explanation: "The official Income Tax e-filing portal is eportal.incometax.gov.in - all government sites in India must end in '.gov.in'. Domains like 'incometax-refund.org' or 'incometaxindia-portal.com' are completely unauthorized. The IT Department will never ask you to re-verify PAN via a link to claim a refund.",
      points: 15
    },
    {
      id: 3,
      title: "The Tatkal Ticket Trap",
      scenario: "A WhatsApp forward says: 'IRCTC Tatkal booking is now open for non-AC classes with ZERO convenience fee for the next 2 hours. Book via the official fast-track link:' - three links are listed.",
      options: [
        { url: "www.irctc.co.in/nget/train-search", isLegit: true },
        { url: "www.irctc-tatkal-booking.in/fast-track", isLegit: false },
        { url: "tickets.irctc-india.com/tatkal", isLegit: false }
      ],
      explanation: "IRCTC's only official ticketing website is irctc.co.in - a .co.in domain owned by the Indian Railway Catering and Tourism Corporation. Sites like 'irctc-tatkal-booking.in' or 'irctc-india.com' are lookalike fraud domains. IRCTC never offers 'zero convenience fee' Tatkal windows via WhatsApp forwards.",
      points: 20
    },
    {
      id: 4,
      title: "The DigiLocker Document Request",
      scenario: "An official-looking email claims: 'Your Driving Licence on DigiLocker is expiring. Re-link your Aadhaar to retain digital access. Failure to act may invalidate your DL for online verification purposes.'",
      options: [
        { url: "www.digilocker-aadhaar-link.in/renew", isLegit: false },
        { url: "digilocker.gov.in/public/auth/signin", isLegit: true },
        { url: "app.digilocker-india.com/verify-dl", isLegit: false }
      ],
      explanation: "DigiLocker is a Government of India service and its only legitimate URL is digilocker.gov.in - identifiable by the mandatory .gov.in suffix. Documents stored in DigiLocker do not 'expire', and Aadhaar linking is never done by clicking an email link. Any domain without the .gov.in suffix claiming to be DigiLocker is fraudulent.",
      points: 20
    },
    {
      id: 5,
      title: "The UPI Cashback Lure",
      scenario: "An SMS reads: 'PhonePe Reward: You have an unclaimed cashback of ₹237 from last month's UPI transaction. Claim before it expires at midnight - tap the secure link below to credit it instantly.'",
      options: [
        { url: "phonepe-cashback-claim.net/upi-reward", isLegit: false },
        { url: "www.phonepe.com/cashback", isLegit: false },
        { url: "support.phonepe.com/rewards", isLegit: true }
      ],
      explanation: "PhonePe's official domain is phonepe.com - but here's the trap: scammers know this, so they also fake 'www.phonepe.com/cashback' to look plausible. The correct link for support/rewards is support.phonepe.com, a verified subdomain. Critically, PhonePe NEVER sends SMS links to claim cashback - all rewards appear only inside the app. Any SMS with a claim link is a phish.",
      points: 25
    },
    {
      id: 6,
      title: "The SBI YONO Session Expiry",
      scenario: "A pop-up on a news website reads: 'SBI YONO session expired. For security, please re-authenticate your account to prevent unauthorized access. Your last login was from an unrecognized device.'",
      options: [
        { url: "www.sbi-yono-login.co.in/reauth", isLegit: false },
        { url: "www.onlinesbi.sbi/personal/login", isLegit: true },
        { url: "yono.sbi.co.in/authenticate", isLegit: false }
      ],
      explanation: "SBI's authentic internet banking portal is onlinesbi.sbi - SBI operates under the exclusive .sbi top-level domain, which is regulated and cannot be purchased by scammers. The domain 'sbi.co.in' is SBI's corporate site, not the netbanking portal. 'sbi-yono-login.co.in' is a classic fraud domain - notice the hyphen and .co.in combination that mimics legitimacy. Real session expiry notices never appear as website pop-ups.",
      points: 25
    }
  ]

  useEffect(() => {
    if (!currentUser) {
      navigate('/username')
    }
  }, [currentUser, navigate])

  const handleLinkSelect = (index) => {
    if (showFeedback) return;

    setSelectedLink(index)
    setShowFeedback(true)

    const isCorrect = scenarios[currentScenario].options[index].isLegit
    if (isCorrect) {
      let earnedPoints = scenarios[currentScenario].points
      let bonus = 0

      if (streak >= 1 && Math.random() > 0.70) {
        bonus = Math.floor(Math.random() * 10) + 5
        setBonusPoints(bonus)
      }

      setScore(score + earnedPoints + bonus)
      setStreak(prev => prev + 1)
    } else {
      setStreak(0)
      setBonusPoints(0)
    }
  }

  const handleNext = async () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1)
      setSelectedLink(null)
      setShowFeedback(false)
      setBonusPoints(0)
    } else {
      setLoading(true)
      try {
        if (score > 0) {
          await userAPI.updateScore(currentUser, score, 'linkDecoder')
        }
        setGameCompleted(true)
        setShowResult(true)
      } catch (error) {
        console.error('Error updating score:', error)
        setGameCompleted(true)
        setShowResult(true)
      } finally {
        setLoading(false)
      }
    }
  }

  const resetGame = () => {
    setCurrentScenario(0)
    setScore(0)
    setShowResult(false)
    setSelectedLink(null)
    setShowFeedback(false)
    setStreak(0)
    setBonusPoints(0)
    setGameCompleted(false)
  }

  const getScoreMessage = () => {
    const maxScore = scenarios.reduce((acc, curr) => acc + curr.points, 0)
    const percentage = (score / maxScore) * 100
    if (percentage === 100) return "Flawless! You can spot a fake link from a mile away."
    if (percentage >= 70) return "Good eyes! Just remember to always check the root domain."
    return "You clicked some risky links! Keep practicing your visual literacy."
  }

  if (!currentUser) return <div>Redirecting...</div>

  if (showResult) {
    const maxScore = scenarios.reduce((acc, curr) => acc + curr.points, 0)
    return (
      <div className={styles.gamePage}>
        <div className={styles.ambientLight} />
        <div className={styles.gridOverlay} />
        <div className={styles.resultContainer}>
          <h2><Award className={styles.icon} /> Analysis Complete!</h2>
          <div className={styles.scoreDisplay}>
            <div className={styles.finalScore}>
              <span className={styles.scoreLabel}>Security Score:</span>
              <span className={styles.scoreValue}>{score} / {maxScore}</span>
            </div>
            <div className={styles.scorePercentage}>
              {((score / maxScore) * 100).toFixed(0)}%
            </div>
          </div>
          <div className={styles.resultMessage}>{getScoreMessage()}</div>
          <div className={styles.resultActions}>
            <button onClick={resetGame} className={styles.playAgainButton}>
              <RefreshCw className={styles.icon} /> Re-analyze Links
            </button>
            <button onClick={() => navigate('/leaderboard')} className={styles.leaderboardButton}>
              <Trophy className={styles.icon} /> See where you rank
            </button>
            <button onClick={() => navigate('/games')} className={styles.arcadeButton}>
              <Gamepad2 className={styles.icon} /> Return to Arcade
            </button>
          </div>
          {gameCompleted && (
            <div className={styles.completionNote}>
              <CheckCircle className={styles.icon} /> Training logged in your profile!
            </div>
          )}
        </div>
      </div>
    )
  }

  const scenario = scenarios[currentScenario]
  const isCorrect = selectedLink !== null && scenario.options[selectedLink].isLegit

  return (
    <div className={styles.gamePage}>
      <div className={styles.ambientLight} />
      <div className={styles.gridOverlay} />

      <QuitDialog open={showQuitConfirm} onCancel={() => setShowQuitConfirm(false)} onConfirm={() => { setShowQuitConfirm(false); navigate('/games'); }} />

      <div className={styles.gameContainer}>
        {!showResult && (
          <button 
            onClick={() => setShowQuitConfirm(true)} className={styles.backButton}
          >
            <ArrowLeft size={20} /> Back
          </button>
        )}

        <h1 className={styles.gameTitle}>The link decoder</h1>
        <div className={styles.gameHeader}>
          <div className={styles.progressInfo}>
            <span>Case {currentScenario + 1} of {scenarios.length}</span>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              {streak >= 2 && (
                <span style={{ color: '#3b82f6', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '5px', animation: 'slideUp 0.3s ease-out' }}>
                  🔥 {streak} Streak!
                </span>
              )}
              <span>Score: {score}</span>
            </div>
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${(currentScenario / scenarios.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className={styles.scenarioContainer}>
          <h2 className={styles.scenarioTitle}>
            <AlertTriangle color="#a855f7" /> {scenario.title}
          </h2>
          <p className={styles.scenarioText}>{scenario.scenario}</p>
        </div>

        <div className={styles.challengeContainer}>
          <h3 className={styles.challengeTitle}>Which is the ONLY safe link to click?</h3>
          <div className={styles.linksList}>
            {scenario.options.map((option, index) => (
              <button
                key={index}
                className={`${styles.linkOption} ${selectedLink === index ? styles.selected : ''}`}
                onClick={() => handleLinkSelect(index)}
                disabled={showFeedback}
              >
                <span>{option.url}</span>
                <LinkIcon className={styles.linkIcon} size={18} />
              </button>
            ))}
          </div>
        </div>

        {showFeedback && (
          <div className={`${styles.feedbackPanel} ${isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect}`}>
            <div className={styles.feedbackTitle}>
              {isCorrect ? <ShieldCheck size={24} /> : <AlertTriangle size={24} />}
              {isCorrect ? 'Correct! Safe Link Identified.' : 'Danger! That was a Trap.'}
              {isCorrect && bonusPoints > 0 && (
                <span className={styles.bonusBadge}>
                  +{bonusPoints} Bonus! 🎁
                </span>
              )}
            </div>
            <p className={styles.feedbackText}>{scenario.explanation}</p>
          </div>
        )}

        {showFeedback && (
          <div className={styles.gameActions}>
            <button onClick={handleNext} disabled={loading} className={styles.nextButton}>
              {loading ? (
                <><Loader className={styles.loadingIcon} /> Saving...</>
              ) : (
                <><ArrowRight className={styles.icon} /> {currentScenario === scenarios.length - 1 ? 'Finish Drill' : 'Next Case'}</>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default LinkDecoderGamePage
