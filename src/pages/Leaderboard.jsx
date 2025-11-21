/**
 * Leaderboard.jsx - REDESIGNED with Bold/Brutalist Design
 *
 * CHANGES:
 * - Applied bold design system with CSS variables
 * - Brutal borders (4-6px), no border-radius
 * - Space Grotesk headings, JetBrains Mono stats
 * - Neon accent colors for medals and highlights
 * - Brutal tabs with sharp edges
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
import {
  getThemeLeaderboard,
  getLeaderboardWithUserHighlight,
  getUserGlobalRank
} from '../services/leaderboardService';
import {
  getTodayDateString,
  getDailyLeaderboard,
  getUserDailyChallenge,
  getUserDailyRank,
  getUserDailyStats
} from '../services/dailyChallengeService';

/**
 * COMPONENT: Leaderboard
 */
export function Leaderboard() {

  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  // Check if we should start on daily tab
  const initialTab = searchParams.get('tab') || 'global';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [themes, setThemes] = useState([]);

  // Daily Challenge specific state
  const [dailyUserChallenge, setDailyUserChallenge] = useState(null);
  const [dailyUserStats, setDailyUserStats] = useState(null);

  /**
   * EFFECT: Fetch themes for tabs
   */
  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const themesRef = collection(db, 'themes');
        const q = query(
          themesRef,
          where('isPublished', '==', true),
          limit(5)
        );
        const snapshot = await getDocs(q);
        const themesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setThemes(themesData);
      } catch (err) {
        console.error('Error fetching themes:', err);
      }
    };

    fetchThemes();
  }, []);

  /**
   * EFFECT: Load leaderboard data
   */
  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);

        if (activeTab === 'global') {
          const lb = await getLeaderboardWithUserHighlight(user.uid, 100);
          setLeaderboard(lb);

          const rank = await getUserGlobalRank(user.uid);
          setUserRank(rank);
        } else if (activeTab === 'daily') {
          // Load Daily Challenge leaderboard
          const today = getTodayDateString();
          const lb = await getDailyLeaderboard(today);
          setLeaderboard(lb);

          // Load user's challenge
          const challenge = await getUserDailyChallenge(user.uid, today);
          setDailyUserChallenge(challenge);

          // Load user's rank
          if (challenge?.completed) {
            const rank = await getUserDailyRank(user.uid, today);
            setUserRank(rank);
          } else {
            setUserRank(null);
          }

          // Load user's stats
          const stats = await getUserDailyStats(user.uid);
          setDailyUserStats(stats);
        } else {
          const lb = await getThemeLeaderboard(activeTab, 50);
          setLeaderboard(lb);
        }

      } catch (err) {
        console.error('Error loading leaderboard:', err);
        setError('Error loading leaderboard');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadLeaderboard();
    }
  }, [activeTab, user]);

  /**
   * RENDER: Loading
   */
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--off-white)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '6px solid var(--sand)',
            borderTop: '6px solid var(--deep-brown)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--deep-brown)'
          }}>
            Se încarcă clasament...
          </p>
        </div>
      </div>
    );
  }

  /**
   * RENDER: Error
   */
  if (error) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--off-white)',
        padding: '2rem'
      }}>
        <div style={{
          background: 'var(--cream)',
          border: '6px solid var(--deep-brown)',
          padding: '3rem',
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '2rem',
            fontWeight: 900,
            color: 'var(--neon-pink)',
            marginBottom: '1.5rem'
          }}>
            ⚠️ Eroare
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: 'var(--deep-brown)',
            marginBottom: '2rem'
          }}>
            {error}
          </p>
          <button
            onClick={() => navigate('/subjects')}
            style={{
              background: 'var(--deep-brown)',
              color: 'var(--off-white)',
              border: '6px solid var(--deep-brown)',
              padding: '1rem 2rem',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 900,
              fontSize: '1rem',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--neon-cyan)';
              e.currentTarget.style.color = 'var(--deep-brown)';
              e.currentTarget.style.transform = 'translate(-5px, -5px)';
              e.currentTarget.style.boxShadow = '5px 5px 0 var(--deep-brown)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--deep-brown)';
              e.currentTarget.style.color = 'var(--off-white)';
              e.currentTarget.style.transform = 'translate(0, 0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            ← Înapoi la Materii
          </button>
        </div>
      </div>
    );
  }

  /**
   * RENDER: Leaderboard Page
   */
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--off-white)',
      padding: '2rem 5%'
    }}>

      {/* HEADER */}
      <header style={{
        maxWidth: '1400px',
        margin: '0 auto 3rem'
      }}>
        <div style={{
          background: 'var(--cream)',
          border: '6px solid var(--deep-brown)',
          padding: '2rem',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '12px',
            background: 'var(--neon-orange)'
          }}></div>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1.5rem'
          }}>
            <div>
              <h1 style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '3rem',
                fontWeight: 900,
                color: 'var(--deep-brown)',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '-0.02em'
              }}>
                🏆 Clasament
              </h1>
              <p style={{
                fontSize: '1.125rem',
                color: 'var(--warm-brown)'
              }}>
                Compară-te cu ceilalți utilizatori
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <button
                onClick={() => navigate('/subjects')}
                style={{
                  background: 'var(--deep-brown)',
                  color: 'var(--off-white)',
                  border: '4px solid var(--deep-brown)',
                  padding: '0.75rem 1.5rem',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--neon-cyan)';
                  e.currentTarget.style.color = 'var(--deep-brown)';
                  e.currentTarget.style.transform = 'translate(-3px, -3px)';
                  e.currentTarget.style.boxShadow = '3px 3px 0 var(--deep-brown)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--deep-brown)';
                  e.currentTarget.style.color = 'var(--off-white)';
                  e.currentTarget.style.transform = 'translate(0, 0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                ← Materii
              </button>

              <button
                onClick={() => navigate('/profile')}
                style={{
                  background: 'var(--neon-pink)',
                  color: 'var(--off-white)',
                  border: '4px solid var(--neon-pink)',
                  padding: '0.75rem 1.5rem',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translate(-3px, -3px)';
                  e.currentTarget.style.boxShadow = '3px 3px 0 var(--deep-brown)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translate(0, 0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                👤 Profil
              </button>
            </div>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* USER RANK CARD */}
        {(activeTab === 'global' || activeTab === 'daily') && userRank && (
          <div style={{
            background: 'var(--neon-lime)',
            border: '6px solid var(--deep-brown)',
            padding: '2rem',
            marginBottom: '2rem',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '12px',
              height: '100%',
              background: 'var(--deep-brown)'
            }}></div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '2rem'
            }}>
              <div>
                <p style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  color: 'var(--deep-brown)',
                  marginBottom: '0.5rem',
                  fontWeight: 700
                }}>
                  Locul tău
                </p>
                <p style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '3rem',
                  fontWeight: 900,
                  color: 'var(--deep-brown)',
                  lineHeight: 1
                }}>
                  #{userRank.rank || 'N/A'}
                </p>
              </div>

              <div>
                <p style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  color: 'var(--deep-brown)',
                  marginBottom: '0.5rem',
                  fontWeight: 700
                }}>
                  Din total
                </p>
                <p style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '3rem',
                  fontWeight: 900,
                  color: 'var(--deep-brown)',
                  lineHeight: 1
                }}>
                  {userRank.totalUsers}
                </p>
              </div>

              <div>
                <p style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  color: 'var(--deep-brown)',
                  marginBottom: '0.5rem',
                  fontWeight: 700
                }}>
                  Puncte
                </p>
                <p style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '3rem',
                  fontWeight: 900,
                  color: 'var(--deep-brown)',
                  lineHeight: 1
                }}>
                  {userRank.userPoints}
                </p>
              </div>

              <div>
                <p style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  color: 'var(--deep-brown)',
                  marginBottom: '0.5rem',
                  fontWeight: 700
                }}>
                  Procentaj
                </p>
                <p style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '3rem',
                  fontWeight: 900,
                  color: 'var(--deep-brown)',
                  lineHeight: 1
                }}>
                  Top {userRank.percentile}%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TABS */}
        <div style={{
          background: 'var(--cream)',
          border: '6px solid var(--deep-brown)',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            {/* Global Tab */}
            <button
              onClick={() => setActiveTab('global')}
              style={{
                background: activeTab === 'global' ? 'var(--deep-brown)' : 'transparent',
                color: activeTab === 'global' ? 'var(--off-white)' : 'var(--deep-brown)',
                border: `4px solid var(--deep-brown)`,
                padding: '0.75rem 1.5rem',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'global') {
                  e.currentTarget.style.background = 'var(--sand)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'global') {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              🌍 Global
            </button>

            {/* Daily Challenge Tab */}
            <button
              onClick={() => setActiveTab('daily')}
              style={{
                background: activeTab === 'daily' ? 'var(--neon-orange)' : 'transparent',
                color: activeTab === 'daily' ? 'var(--off-white)' : 'var(--deep-brown)',
                border: `4px solid ${activeTab === 'daily' ? 'var(--neon-orange)' : 'var(--deep-brown)'}`,
                padding: '0.75rem 1.5rem',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'daily') {
                  e.currentTarget.style.background = 'var(--sand)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'daily') {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              🌟 Daily Challenge
            </button>

            {/* Theme Tabs */}
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setActiveTab(theme.id)}
                style={{
                  background: activeTab === theme.id ? 'var(--deep-brown)' : 'transparent',
                  color: activeTab === theme.id ? 'var(--off-white)' : 'var(--deep-brown)',
                  border: `4px solid var(--deep-brown)`,
                  padding: '0.75rem 1.5rem',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== theme.id) {
                    e.currentTarget.style.background = 'var(--sand)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== theme.id) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {theme.icon} {theme.name.substring(0, 10)}
              </button>
            ))}
          </div>
        </div>

        {/* LEADERBOARD TABLE */}
        <div style={{
          background: 'var(--cream)',
          border: '6px solid var(--deep-brown)',
          overflow: 'hidden'
        }}>

          {/* Table Header */}
          <div style={{
            background: 'var(--deep-brown)',
            color: 'var(--off-white)',
            padding: '1.5rem',
            borderBottom: '4px solid var(--deep-brown)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '60px 1fr 120px 120px 120px 100px',
              gap: '1rem',
              alignItems: 'center'
            }}>
              <div style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '0.875rem',
                fontWeight: 900,
                textTransform: 'uppercase'
              }}>
                #
              </div>
              <div style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '0.875rem',
                fontWeight: 900,
                textTransform: 'uppercase'
              }}>
                Utilizator
              </div>
              <div style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '0.875rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                textAlign: 'center'
              }}>
                Puncte
              </div>
              <div style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '0.875rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                textAlign: 'center'
              }}>
                Quiz-uri
              </div>
              <div style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '0.875rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                textAlign: 'center'
              }}>
                Mediu
              </div>
              <div style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '0.875rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                textAlign: 'center'
              }}>
                Max
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div>
            {leaderboard.length === 0 ? (
              <div style={{
                padding: '3rem',
                textAlign: 'center',
                color: 'var(--warm-brown)',
                fontFamily: 'Inter, sans-serif'
              }}>
                Nu sunt date în clasament încă.
              </div>
            ) : (
              leaderboard.map((entry, index) => {
                const isTop3 = entry.rank <= 3;
                const isCurrentUser = entry.isCurrentUser;
                const medalColors = {
                  1: 'var(--neon-lime)',
                  2: 'var(--sand)',
                  3: 'var(--neon-orange)'
                };

                return (
                  <div
                    key={entry.userId || index}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '60px 1fr 120px 120px 120px 100px',
                      gap: '1rem',
                      alignItems: 'center',
                      padding: '1.5rem',
                      background: isCurrentUser ? 'var(--neon-cyan)' :
                                 index % 2 === 0 ? 'var(--sand)' : 'var(--cream)',
                      borderBottom: '2px solid var(--warm-brown)',
                      borderLeft: isTop3 ? `8px solid ${medalColors[entry.rank]}` :
                                 isCurrentUser ? `8px solid var(--deep-brown)` : 'none'
                    }}
                  >
                    {/* Rank */}
                    <div style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: isTop3 ? '2rem' : '1.25rem',
                      fontWeight: 900,
                      color: 'var(--deep-brown)'
                    }}>
                      {entry.medal || `#${entry.rank}`}
                    </div>

                    {/* User Info */}
                    <div>
                      <p style={{
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontSize: '1.125rem',
                        fontWeight: 700,
                        color: 'var(--deep-brown)'
                      }}>
                        {entry.displayName}
                        {isCurrentUser && ' (TU)'}
                      </p>
                    </div>

                    {/* Points */}
                    <div style={{ textAlign: 'center' }}>
                      <p style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        color: 'var(--deep-brown)'
                      }}>
                        {entry.totalPoints}
                      </p>
                    </div>

                    {/* Quizzes */}
                    <div style={{ textAlign: 'center' }}>
                      <p style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '1.125rem',
                        fontWeight: 600,
                        color: 'var(--deep-brown)'
                      }}>
                        {entry.totalQuizzes}
                      </p>
                    </div>

                    {/* Average Score */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        background: entry.averageScore >= 80 ? 'var(--neon-green)' :
                                   entry.averageScore >= 60 ? 'var(--neon-orange)' :
                                   'var(--neon-pink)',
                        color: 'var(--deep-brown)',
                        padding: '0.375rem 0.75rem',
                        border: '3px solid var(--deep-brown)',
                        display: 'inline-block',
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontSize: '1rem',
                        fontWeight: 900
                      }}>
                        {entry.averageScore}%
                      </div>
                    </div>

                    {/* Best Score */}
                    <div style={{ textAlign: 'center' }}>
                      <p style={{
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontSize: '1.125rem',
                        fontWeight: 900,
                        color: 'var(--neon-green)'
                      }}>
                        {entry.bestScore}%
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Add keyframes for spin animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

    </div>
  );
}

export default Leaderboard;
