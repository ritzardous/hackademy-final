import CyberArtwork from '../components/CyberArtwork'
import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { RefreshCw, Gamepad2 } from 'lucide-react'

import { userAPI } from '../utils/api'
import LeaderboardItem from '../components/LeaderboardItem'
import styles from '../styles/LeaderboardPage.module.css'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from 'recharts'

const LeaderboardPage = ({ currentUser }) => {
  const [leaderboard, setLeaderboard] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    setError('')
    try {
      const [leaderboardResponse, statsResponse] = await Promise.all([
        userAPI.getLeaderboard(20),
        userAPI.getStats(),
      ])
      if (leaderboardResponse.success) {
        setLeaderboard(leaderboardResponse.data)
      }
      if (statsResponse.success) {
        setStats(statsResponse.data)
      }
    } catch (error) {
      setError('Oops! Could not load the leaderboard. Please try again.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const graphData = useMemo(() => {
    const months = []
    const now = new Date()
    for (let i = 2; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthName = date.toLocaleString('default', { month: 'long' })
      months.push(monthName)
    }

    const monthlyGames = {}
    months.forEach((m) => (monthlyGames[m] = 0))

    leaderboard.forEach((user) => {
      if (user.lastPlayed) {
        const date = new Date(user.lastPlayed)
        const month = date.toLocaleString('default', { month: 'long' })
        if (monthlyGames.hasOwnProperty(month)) {
          monthlyGames[month] += user.gamesPlayed || 0
        }
      }
    })

    return months.map((m) => ({ month: m, games: monthlyGames[m] }))
  }, [leaderboard])

  const topPlayersData = useMemo(() => {
    return leaderboard.slice(0, 5).map(user => ({
      username: `@${user.username}`,
      score: user.score
    }))
  }, [leaderboard])

  if (loading) {
    return (
      <div className={styles.leaderboardPage}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading the leaderboard… please wait a moment.</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.leaderboardPage}>
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>{error}</p>
          <button onClick={fetchData} className={styles.retryButton}>
            <RefreshCw className={styles.buttonIcon} /> Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.leaderboardPage}>
      <div className={styles.leaderboardHeader}>
        <h2>
          <CyberArtwork kind="trophy" className={styles.headerIcon} /> Our Learning Leaders
        </h2>
        <p>See who is doing well and get inspired to improve your skills!</p>
      </div>
      <div className={styles.chartGrid}>
        <div className={styles.graphContainer} style={{ marginBottom: 0 }}>
          <h3 className={styles.graphTitle}>Games Played Per Month</h3>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart
              data={graphData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient id='colorGames' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='0%' stopColor='#594082' />
                  <stop offset='50%' stopColor='#8b68c0' />
                  <stop offset='100%' stopColor='#bca5ec' />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray='3 3'
                stroke='#c4c9b7'
              />
              <XAxis dataKey='month' stroke='#62675a' />
              <YAxis stroke='#62675a' allowDecimals={false} width={36} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fffef8',
                  border: '2px solid #20221f',
                  borderRadius: '0',
                  color: '#20221f',
                  padding: '12px',
                  boxShadow: '4px 4px 0 #20221f',
                }}
                cursor={{ fill: '#eae4f4' }}
              />
              <Legend wrapperStyle={{ color: '#20221f' }} />
              <Bar
                dataKey='games'
                name='Games played'
                fill='url(#colorGames)'
                radius={[3, 3, 0, 0]}
                stroke="#594082" strokeWidth={1}
                barSize={40}
              >
                <LabelList
                  dataKey='games'
                  position='top'
                  fill='#20221f'
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.graphContainer} style={{ marginBottom: 0 }}>
          <h3 className={styles.graphTitle}>Top 5 Hacker Scores</h3>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart
              data={topPlayersData}
              layout="vertical"
              margin={{ top: 20, right: 42, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient id='colorScores' x1='0' y1='0' x2='1' y2='0'>
                  <stop offset='0%' stopColor='#594082' />
                  <stop offset='50%' stopColor='#8b68c0' />
                  <stop offset='100%' stopColor='#bca5ec' />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray='3 3' horizontal={true} vertical={false} stroke='#c4c9b7' />
              <XAxis type="number" stroke='#62675a' />
              <YAxis dataKey='username' type="category" stroke='#62675a' width={108} tickFormatter={name => name.length > 13 ? `${name.slice(0, 12)}…` : name} tickLine={false} axisLine={false} style={{fontSize: '0.8rem'}} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fffef8',
                  border: '2px solid #20221f',
                  borderRadius: '0',
                  color: '#20221f',
                  padding: '12px',
                  boxShadow: '4px 4px 0 #20221f',
                }}
                cursor={{ fill: '#eae4f4' }}
              />
              <Bar dataKey='score' name='Points' fill='url(#colorScores)' radius={[0, 3, 3, 0]} stroke="#594082" strokeWidth={1} barSize={25}>
                <LabelList dataKey='score' position='right' fill='#20221f' style={{fontFamily: 'Space Grotesk', fontWeight: 'bold'}}/>
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {stats && (
        <div className={styles.statsContainer}>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{stats.totalUsers}</span>
            <span className={styles.statLabel}>Total Learners</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{stats.totalGamesPlayed}</span>
            <span className={styles.statLabel}>Simulations Played</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{stats.totalQuestions}</span>
            <span className={styles.statLabel}>Threats Analyzed</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>
              {stats.totalQuestions > 0 ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100) : 0}%
            </span>
            <span className={styles.statLabel}>Global Accuracy</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{stats.totalScore.toLocaleString()}</span>
            <span className={styles.statLabel}>Global Points</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>
              {stats.topPlayer?.score || 0}
            </span>
            <span className={styles.statLabel}>Highest Score</span>
          </div>
        </div>
      )}

      {currentUser && (
        <div className={styles.userRankBanner}>
           <h3>
              Your Current Rank:{' '}
              {(() => {
                 const myRank = leaderboard.findIndex(u => u.username === currentUser.toLowerCase()) + 1;
                 if (myRank > 0) return <span style={{color: '#7755ab', fontSize: '1.6rem', marginLeft: '10px'}}>#{myRank}</span>
                 return <span style={{color: '#7755ab', fontSize: '1.4rem', marginLeft: '10px'}}>Unranked</span>
              })()}
           </h3>
        </div>
      )}
      <div className={styles.leaderboardContainer}>
        {leaderboard.length === 0 ? (
          <div className={styles.emptyLeaderboard}>
            <p>
              <Gamepad2 className={styles.emptyIcon} /> No learners have started
              yet! You can be the first to try and see your name here.
            </p>
          </div>
        ) : (
          <>
            <div className={styles.podiumContainer}>
              {leaderboard.slice(0, 3).map((user, idx) => (
                <div key={user._id} className={styles.podiumItem}>
                  <div className={styles.podiumMedal}>
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                  </div>
                  <div className={styles.podiumName}>@{user.username}</div>
                  <div className={styles.podiumScore}>{user.score}</div>
                </div>
              ))}
            </div>
            <div className={styles.leaderboardList}>
              {leaderboard.map((user, index) => (
                <LeaderboardItem
                  key={user._id}
                  user={user}
                  position={index + 1}
                />
              ))}
            </div>
            {leaderboard.length >= 20 && (
              <div className={styles.loadMoreContainer}>
                <button onClick={fetchData} className={styles.loadMoreButton}>
                  <RefreshCw className={styles.buttonIcon} /> Refresh
                  Leaderboard
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div className={styles.boostContainer}>
        <h3 className={styles.boostTitle}>Ready to climb the ranks?</h3>
        <Link to="/games" className={styles.boostBtn}>
          <Gamepad2 size={24} /> Boost Your Score
        </Link>
      </div>
    </div>
  )
}

export default LeaderboardPage
