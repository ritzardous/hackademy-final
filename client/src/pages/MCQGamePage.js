import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { gameAPI } from '../utils/api'
import styles from '../styles/GamePage.module.css'
import QuitDialog from '../components/QuitDialog'
import {
  Award,
  RefreshCw,
  Trophy,
  CheckCircle,
  Loader,
  ArrowRight,
  Flag,
  Gamepad2,
  ShieldAlert,
  Clock,
  ArrowLeft
} from 'lucide-react'

const MCQGamePage = ({ currentUser }) => {
  const [questions, setQuestions] = useState([])
  const [sessionId, setSessionId] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)
  const [streak, setStreak] = useState(0)
  const [bonusPoints, setBonusPoints] = useState(0)
  const [explanation, setExplanation] = useState('')
  const [correctOptionText, setCorrectOptionText] = useState('')
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [timeTakenForQuestion, setTimeTakenForQuestion] = useState(0)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [startError, setStartError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showQuitConfirm, setShowQuitConfirm] = useState(false)
  
  const timerRef = useRef()
  const navigate = useNavigate()

  const startNewGame = useCallback(async () => {
    setLoading(true)
    setStartError('')
    try {
      const resp = await gameAPI.startGame(currentUser, 'mcq')
      if (!resp.success || !resp.data?.questions?.length) throw new Error('Round unavailable')
      if (resp.success) {
        setQuestions(resp.data.questions)
        setSessionId(resp.data.sessionId)
        setCurrentQuestion(0)
        setScore(0)
        setShowResult(false)
        setSelectedAnswer('')
        setShowFeedback(false)
        setIsCorrect(null)
        setStreak(0)
        setBonusPoints(0)
        setGameCompleted(false)
        setTimeRemaining(resp.data.questions[0].timeLimit)
        setTimeTakenForQuestion(0)
      }
    } catch (e) {
      console.error(e)
      setStartError('We couldn’t load your round. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [currentUser])

  // redirects to username page if no user is logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/username')
    } else if (questions.length === 0 && !showResult) {
      startNewGame()
    }
  }, [currentUser, navigate, questions.length, showResult, startNewGame])



  // handles moving to the next question or finishing game
  const handleAnswerSubmit = useCallback(async (answerOption, finalTimeTaken) => {
    if (showFeedback || submitting) return // Prevent duplicate clicking

    setSelectedAnswer(answerOption)
    setShowFeedback(true)
    setSubmitting(true)
    clearInterval(timerRef.current)

    try {
      const resp = await gameAPI.submitAnswer(
        sessionId,
        questions[currentQuestion].id,
        answerOption,
        finalTimeTaken
      )

      if (resp.success) {
        setIsCorrect(resp.data.isCorrect)
        setScore(prev => prev + resp.data.pointsEarned)
        setStreak(resp.data.streak)
        setBonusPoints(resp.data.streakBonus + resp.data.timeBonus)
        setExplanation(resp.data.explanation)
        setCorrectOptionText(resp.data.correctOption)
      }
    } catch (e) {
      console.error("Submission failed", e)
    } finally {
      setSubmitting(false)
    }
  }, [showFeedback, submitting, sessionId, questions, currentQuestion])

  const handleTimeOut = useCallback(() => {
    // Auto-submit with empty/timeout selectedAnswer
    handleAnswerSubmit('__TIMEOUT__', questions[currentQuestion].timeLimit)
  }, [handleAnswerSubmit, questions, currentQuestion])

  // Timer logic
  useEffect(() => {
    if (loading || showResult || showFeedback || !questions.length) {
      clearInterval(timerRef.current)
      return
    }

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          handleTimeOut()
          return 0
        }
        return prev - 1
      })
      setTimeTakenForQuestion((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [loading, showResult, showFeedback, questions, currentQuestion, handleTimeOut])

  // handles moving to the next question or finishing game
  const handleNextQuestion = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer('')
      setShowFeedback(false)
      setIsCorrect(null)
      setBonusPoints(0)
      setTimeRemaining(questions[currentQuestion + 1].timeLimit)
      setTimeTakenForQuestion(0)
    } else {
      finishQuiz(false)
    }
  }

  const finishQuiz = async (isQuit = false) => {
    setLoading(true)
    try {
      await gameAPI.finishGame(sessionId, isQuit)
      
      if (isQuit) {
        navigate('/games')
        return
      }

      setGameCompleted(true)
      setShowResult(true)
    } catch (error) {
      console.error('Error finishing game:', error)
      if (!isQuit) {
        setGameCompleted(true)
        setShowResult(true)
      }
    } finally {
      setLoading(false)
    }
  }

  const resetGame = () => {
    startNewGame()
  }

  const getScoreMessage = () => {
    if (score > 200) return "Excellent! You're a cybersecurity expert!"
    if (score > 100)
      return 'Good job! You have solid cybersecurity knowledge.'
    if (score > 0)
      return 'Not bad! Consider studying more cybersecurity concepts.'
    return 'Keep learning! Cybersecurity takes practice.'
  }

  if (loading && questions.length === 0) {
    return (
      <div className={styles.gamePage}>
        <div className={`${styles.gameContainer} ${styles.loadingState}`} role="status"><Loader className={styles.loadingIcon} size={48} /><p>Getting your round ready…</p></div>
      </div>
    )
  }

  if (!currentUser) {
    return <div>Redirecting...</div>
  }

  if (startError && questions.length === 0) {
    return <div className={styles.gamePage}><div className={`${styles.gameContainer} ${styles.errorState}`} role="alert"><h2>Your round isn’t ready yet.</h2><p>{startError}</p><button onClick={startNewGame} className={styles.nextButton}><RefreshCw size={20} /> Try again</button><button onClick={() => navigate('/games')} className={styles.backButton}><ArrowLeft size={20} /> Back to arcade</button></div></div>
  }

  if (showResult) {
    return (
      <div className={styles.gamePage}>
        <div className={styles.ambientLight} />
        <div className={styles.gridOverlay} />
        <div className={styles.resultContainer}>
          <h2>
            <Award className={styles.icon} /> Game Complete!
          </h2>
          <div className={styles.scoreDisplay}>
            <div className={styles.finalScore}>
              <span className={styles.scoreLabel}>Final Score:</span>
              <span className={styles.scoreValue}>{score}</span>
            </div>
          </div>

          <div className={styles.resultMessage}>{getScoreMessage()}</div>

          <div className={styles.resultActions}>
            <button onClick={resetGame} className={styles.playAgainButton}>
              <RefreshCw className={styles.icon} /> Play Again
            </button>
            <button
              onClick={() => navigate('/leaderboard')}
              className={styles.leaderboardButton}
            >
              <Trophy className={styles.icon} /> Leaderboard
            </button>
            <button
              onClick={() => navigate('/games')}
              className={styles.arcadeButton}
            >
              <Gamepad2 className={styles.icon} /> Arcade
            </button>
          </div>

          {gameCompleted && (
            <div className={styles.completionNote}>
              <CheckCircle className={styles.icon} /> Score has been saved to
              your profile!
            </div>
          )}
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className={styles.gamePage}>
      <div className={styles.ambientLight} />
      <div className={styles.gridOverlay} />

      <QuitDialog open={showQuitConfirm} onCancel={() => setShowQuitConfirm(false)} onConfirm={() => { setShowQuitConfirm(false); finishQuiz(true); }} />

      <div className={styles.gameContainer}>
        {!showResult && (
          <button 
            onClick={() => setShowQuitConfirm(true)} className={styles.backButton}
          >
            <ArrowLeft size={20} /> Back
          </button>
        )}

        <h1 className={styles.gameTitle}>Knowledge check</h1>
        <div className={styles.gameHeader}>
          <div className={styles.progressInfo}>
            <div style={{ display: 'flex', gap: '15px' }}>
              <span>
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: timeRemaining <= 10 ? '#ef4444' : '#a855f7' }}>
                <Clock size={16} /> {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              {streak >= 2 && (
                <span style={{ color: '#f59e0b', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '5px', animation: 'slideUp 0.3s ease-out' }}>
                  🔥 {streak} Streak!
                </span>
              )}
              <span>Score: {score}</span>
            </div>
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{
                width: `${(timeRemaining / question.timeLimit) * 100}%`,
                background: timeRemaining <= 10 ? '#ef4444' : '#a855f7'
              }}
            ></div>
          </div>
        </div>

        <div className={styles.questionContainer}>
          <h3 className={styles.questionText}>{question.question}</h3>
          <div className={styles.questionPoints}>
            Worth {question.points} points
          </div>
        </div>

        <div className={styles.optionsContainer}>
          {question.options.map((option, index) => {
            let optionStyles = `${styles.optionButton}`
            
            // Add visual feedback to clicked buttons AFTER backend evaluation
            if (showFeedback && !submitting) {
              if (option === correctOptionText) {
                 optionStyles += ` ${styles.correctOption}`
              } else if (selectedAnswer === option && !isCorrect) {
                 optionStyles += ` ${styles.incorrectOption}`
              }
            } else if (selectedAnswer === option) {
              optionStyles += ` ${styles.selected}`
            }

            return (
              <button
                key={index}
                className={optionStyles}
                onClick={() => handleAnswerSubmit(option, timeTakenForQuestion)}
                disabled={showFeedback || submitting}
              >
                <span className={styles.optionLetter}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span className={styles.optionText}>{option}</span>
              </button>
            )
          })}
        </div>

        {submitting && (
           <div style={{ textAlign: 'center', color: '#a855f7', marginBottom: '20px' }}>
              <Loader className={styles.loadingIcon} style={{display:'inline', marginRight:'10px'}}/> Evaluating Securely...
           </div>
        )}

        {showFeedback && !submitting && (
          <div className={`${styles.feedbackPanel} ${isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect}`}>
            <h4 className={styles.feedbackTitle}>
              {isCorrect ? (
                <><CheckCircle size={20} /> Correct!</>
              ) : (
                <><ShieldAlert size={20} /> Incorrect</>
              )}

              {isCorrect && bonusPoints > 0 && (
                <span className={styles.bonusBadge}>
                  +{bonusPoints} Bonus! 🎁 Time & Streak
                </span>
              )}
            </h4>
            <p className={styles.feedbackText}>{explanation}</p>
          </div>
        )}

        {showFeedback && !submitting && (
          <div className={styles.gameActions}>
            <button
              onClick={handleNextQuestion}
              disabled={loading}
              className={styles.nextButton}
            >
              {loading ? (
                <>
                  <Loader className={styles.loadingIcon} /> Saving...
                </>
              ) : currentQuestion === questions.length - 1 ? (
                <>
                  <Flag className={styles.icon} /> Finish Game
                </>
              ) : (
                <>
                  <ArrowRight className={styles.icon} /> Next Question
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MCQGamePage
