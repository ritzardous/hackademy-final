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
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Mail,
  Smartphone,
  Gamepad2,
  ArrowLeft
} from 'lucide-react'

const PhishingGamePage = ({ currentUser }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
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
      type: 'sms',
      sender: 'HDFCBK-T',
      subject: 'Credit Card Alert',
      content: 'HDFC Bank: INR 12,845.00 debited from Credit Card XX9021 at AMAZON on 21-Feb-26. Avl Credit Limit: INR 87,155. If not you, call 1800-1600 or visit hdfcbank.com/fraud.',
      isPhishing: false,
      explanation: "This is a legitimate HDFC Bank transaction alert. The sender ID follows TRAI's registered format (HDFCBK-T, where 'T' means Transactional). It uses the last 4 digits of the card - not the full number - and directs you to the official hdfcbank.com domain rather than a link. Real bank alerts never ask you to click anything.",
      points: 10
    },
    {
      id: 2,
      type: 'sms',
      sender: 'HDFCBK-T',
      subject: 'Reward Points Alert',
      content: 'HDFC Bank: Your 18,500 reward points worth INR 4,625 will expire on 28-Feb-26. Redeem now before expiry: https://hdfc-rewardz.in/redeem?cust=TX9021',
      isPhishing: true,
      explanation: "The sender ID 'HDFCBK-T' looks exactly like the real HDFC format - scammers can spoof registered-looking sender IDs. The giveaway is the link: HDFC's official rewards portal is SmartBuy at smartbuy.hdfcbank.com. The domain 'hdfc-rewardz.in' is not owned by HDFC Bank. Also note the urgency tactic and a personalised-looking token in the URL designed to build false trust.",
      points: 20
    },
    {
      id: 3,
      type: 'email',
      sender: 'noreply@irctc.co.in',
      subject: 'Your Train Ticket - PNR 4156789023',
      content: 'Dear Passenger,\n\nYour booking is confirmed.\nPNR: 4156789023 | Train: 12952 Rajdhani Express\nFrom: NDLS (New Delhi) → BCT (Mumbai Central)\nDate: 26-Feb-2026 | Dep: 16:55\nClass: 3A | Passengers: 1\n\nDownload your e-ticket from the IRCTC app or at irctc.co.in/nget/train-search.\n\nRegards,\nIRCTC e-Ticketing',
      isPhishing: false,
      explanation: "This is a genuine IRCTC booking confirmation. It contains verifiable booking specifics (valid PNR format, real train number and route, correct IRCTC domain), and it does not ask you to click any link to 'confirm' or 'secure' the booking. Real IRCTC emails direct you to the official irctc.co.in domain and are specific about the journey details.",
      points: 10
    },
    {
      id: 4,
      type: 'sms',
      sender: '+91 9311042587',
      subject: 'UPI Payment Request',
      content: 'You have received a payment request of Rs 1.00 from PhonePe Support (phonepesupport@ybl). Accept to receive Rs 5,000 cashback credited instantly to your UPI. Tap: upi://pay?pa=phonepesupport@ybl&pn=PhonePe&am=1',
      isPhishing: true,
      explanation: "This is a classic UPI collect-request scam. The message comes from a random 10-digit mobile number - legitimate payment apps never send transactional alerts this way. Crucially, the logic is inverted: you are asked to PAY Re 1 to RECEIVE Rs 5,000. In UPI, you never need to enter your PIN or pay anything to receive money. The UPI deep-link is designed to silently initiate a payment from your account.",
      points: 20
    },
    {
      id: 5,
      type: 'email',
      sender: 'support@accounts-google.com',
      subject: 'Security alert: New sign-in on your Google Account',
      content: 'Hi,\n\nA new sign-in to your Google Account was detected.\n\nDevice: Android (Xiaomi Redmi Note 12)\nLocation: Pune, Maharashtra, India\nTime: Mon, 21 Feb 2026, 11:43 PM\n\nIf this was you, no further action is needed. If you don\'t recognize this activity, your account may be compromised.\n\nSecure your account now: https://accounts-google.com/security/review',
      isPhishing: true,
      explanation: "The sender domain 'accounts-google.com' is not owned by Google - Google's real domain is google.com, and security emails come from no-reply@accounts.google.com. This is a lookalike domain registration, a common trick. The device and location details (a popular phone model, a major Indian city) are added to seem personalized and credible. The link points to the same fake domain. Real Google alerts link to myaccount.google.com.",
      points: 20
    },
    {
      id: 6,
      type: 'sms',
      sender: 'MYGOVT-G',
      subject: 'PM Kisan Beneficiary Alert',
      content: 'PM-KISAN: Your 16th installment of Rs 2,000 could not be processed due to Aadhaar-bank seeding mismatch. Update your records at pmkisan.gov.in or visit your nearest CSC. Helpline: 155261.',
      isPhishing: false,
      explanation: "This is a legitimate PM-KISAN scheme alert. The sender ID uses the 'G' suffix (Government-type message per TRAI regulations) and references the real official portal pmkisan.gov.in. It mentions the real PM-KISAN helpline number (155261) and does not include a suspicious link asking for credentials. Aadhaar-bank seeding failures are a genuine, documented reason for delayed PM-KISAN installments.",
      points: 15
    },
    {
      id: 7,
      type: 'email',
      sender: 'hr@tcs-joinings.com',
      subject: 'TCS Offer Letter - Joining Date Confirmation Required',
      content: 'Dear Candidate,\n\nCongratulations! Your TCS Offer Letter (Ref: TCS/2026/NQT/084721) is ready.\n\nPlease log in to the Candidate Portal to confirm your joining date and submit your documents before 28-Feb-2026 to avoid offer withdrawal.\n\nPortal: https://tcs-joinings.com/candidate-login\nOffer Reference: TCS/2026/NQT/084721\n\nHR Operations | Tata Consultancy Services',
      isPhishing: true,
      explanation: "TCS's official joining and onboarding portal is iBegin, accessible via the official tcs.com domain - not 'tcs-joinings.com', which is a separately registered fraud domain. This type of scam specifically targets NQT/campus hire candidates who are anxiously awaiting results, making them more likely to act without verifying. The urgent deadline ('offer withdrawal') is a pressure tactic. Always verify offer letters by contacting TCS HR via tcs.com directly.",
      points: 25
    },
    {
      id: 8,
      type: 'sms',
      sender: 'VM-LOANOK',
      subject: 'Pre-approved Loan',
      content: 'Congratulations! You have a pre-approved personal loan of Rs 3,50,000 at 10.5% p.a. from LoanOK NBFC. No documentation needed. To accept, share your Aadhaar & PAN on WhatsApp: +91 8527013490. Offer valid 24 hrs.',
      isPhishing: true,
      explanation: "Multiple red flags here. Legitimate NBFCs registered with the RBI never request Aadhaar and PAN over WhatsApp - document submission always happens through a secure, official app or branch. The sender ID 'VM-LOANOK' is not associated with any RBI-registered NBFC. The '24-hour' pressure tactic and 'no documentation' promise are hallmarks of loan fraud. Such scams often lead to identity theft using the submitted documents.",
      points: 20
    }
  ]

  useEffect(() => {
    if (!currentUser) {
      navigate('/username')
    }
  }, [currentUser, navigate])

  const handleAnswer = (answerIsPhishing) => {
    if (showFeedback) return;

    setSelectedAnswer(answerIsPhishing)
    setShowFeedback(true)

    const isCorrect = answerIsPhishing === scenarios[currentQuestion].isPhishing
    if (isCorrect) {
      let earnedPoints = scenarios[currentQuestion].points
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
    if (currentQuestion < scenarios.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
      setBonusPoints(0)
    } else {
      setLoading(true)
      try {
        if (score > 0) {
          await userAPI.updateScore(currentUser, score, 'phishing')
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
    setCurrentQuestion(0)
    setScore(0)
    setShowResult(false)
    setSelectedAnswer(null)
    setShowFeedback(false)
    setStreak(0)
    setBonusPoints(0)
    setGameCompleted(false)
  }

  const getScoreMessage = () => {
    const maxScore = scenarios.reduce((acc, curr) => acc + curr.points, 0)
    const percentage = (score / maxScore) * 100
    if (percentage === 100) return "Perfect! You have a hawkeye for scams."
    if (percentage >= 70) return "Great job! You made mostly safe choices."
    return "You fell for some traps! Keep learning to stay safe."
  }

  if (!currentUser) return <div>Redirecting...</div>

  if (showResult) {
    const maxScore = scenarios.reduce((acc, curr) => acc + curr.points, 0)
    return (
      <div className={styles.gamePage}>
        <div className={styles.ambientLight} />
        <div className={styles.gridOverlay} />
        <div className={styles.resultContainer}>
          <h2><Award className={styles.icon} /> Game Complete!</h2>
          <div className={styles.scoreDisplay}>
            <div className={styles.finalScore}>
              <span className={styles.scoreLabel}>Your Score:</span>
              <span className={styles.scoreValue}>{score} / {maxScore}</span>
            </div>
            <div className={styles.scorePercentage}>
              {((score / maxScore) * 100).toFixed(0)}%
            </div>
          </div>
          <div className={styles.resultMessage}>{getScoreMessage()}</div>
          <div className={styles.resultActions}>
            <button onClick={resetGame} className={styles.playAgainButton}>
              <RefreshCw className={styles.icon} /> Play Again
            </button>
            <button onClick={() => navigate('/leaderboard')} className={styles.leaderboardButton}>
              <Trophy className={styles.icon} /> See where you rank
            </button>
            <button onClick={() => navigate('/games')} className={styles.arcadeButton}>
              <Gamepad2 className={styles.icon} /> Arcade
            </button>
          </div>
          {gameCompleted && (
            <div className={styles.completionNote}>
              <CheckCircle className={styles.icon} /> Score saved to profile!
            </div>
          )}
        </div>
      </div>
    )
  }

  const scenario = scenarios[currentQuestion]
  const isCorrect = selectedAnswer === scenario.isPhishing

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

        <h1 className={styles.gameTitle}>Phishing simulator</h1>
        <div className={styles.gameHeader}>
          <div className={styles.progressInfo}>
            <span>Case {currentQuestion + 1} of {scenarios.length}</span>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              {streak >= 2 && (
                <span style={{ color: '#ef4444', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '5px', animation: 'slideUp 0.3s ease-out' }}>
                  🔥 {streak} Streak!
                </span>
              )}
              <span>Score: {score}</span>
            </div>
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${(currentQuestion / scenarios.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className={styles.questionContainer}>
          <h3 className={styles.questionText}>Analyze this message. Is it a scam?</h3>
          <div className={styles.questionPoints}>Worth {scenario.points} points</div>
        </div>

        <div className={styles.messageContainer}>
          <div className={styles.messageHeader}>
            <div className={styles.messageSender}>
              {scenario.type === 'email' ? <Mail size={16} /> : <Smartphone size={16} />}
              <strong>From:</strong> {scenario.sender}
            </div>
            <div className={styles.messageSubject}>
              {scenario.subject}
            </div>
          </div>
          <div className={styles.messageBody}>
            {scenario.content.split('http').map((part, i, arr) => {
              if (i === 0) return part;
              const linkUrl = 'http' + part.split('\n')[0].split(' ')[0];
              const rest = part.substring(linkUrl.length - 4);
              return (
                <React.Fragment key={i}>
                  <span className={styles.fakeLink}>{linkUrl}</span>{rest}
                </React.Fragment>
              )
            })}
          </div>
        </div>

        {!showFeedback ? (
          <div className={styles.optionsContainer}>
            <button 
              className={`${styles.optionButton} ${styles.legit}`}
              onClick={() => handleAnswer(false)}
            >
              <ShieldCheck className={styles.optionIcon} color="#10b981" />
              <span>It's Legitimate</span>
            </button>
            <button 
              className={`${styles.optionButton} ${styles.phishing}`}
              onClick={() => handleAnswer(true)}
            >
              <ShieldAlert className={styles.optionIcon} color="#ef4444" />
              <span>It's a Scam!</span>
            </button>
          </div>
        ) : (
          <div className={`${styles.feedbackPanel} ${isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect}`}>
            <div className={styles.feedbackTitle}>
              {isCorrect ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
              {isCorrect ? 'Correct!' : 'Incorrect!'}
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
                <><ArrowRight className={styles.icon} /> {currentQuestion === scenarios.length - 1 ? 'Finish Game' : 'Next Case'}</>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default PhishingGamePage
