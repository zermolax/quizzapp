/**
 * Profile.jsx - REDESIGNED with Bold/Brutalist Design
 *
 * CHANGES:
 * - Applied bold design system with CSS variables
 * - Brutal borders (4-6px), no border-radius
 * - Space Grotesk headings, JetBrains Mono stats
 * - Neon accent bars and colors
 * - Hover effects with translate + box shadow
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  getUserProfile,
  getProgressBySubject,
  getProgressByTheme,
  getQuizHistory,
  formatDate,
  formatDuration
} from '../services/profileService';
import { getAllBadges, getUserBadges, getCurrentStreak } from '../services/badgeService';
import { BadgeCard } from '../components/BadgeCard';

/**
 * COMPONENT: Profile
 */
export function Profile() {

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [userProfile, setUserProfile] = useState(null);
  const [subjectProgress, setSubjectProgress] = useState([]);
  const [themeProgress, setThemeProgress] = useState([]);
  const [quizHistory, setQuizHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [allBadges, setAllBadges] = useState([]);
  const [userBadges, setUserBadges] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);

  /**
   * EFFECT: Load all profile data
   */
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        const profile = await getUserProfile(user.uid);
        const subjectProg = await getProgressBySubject(user.uid);
        const progress = await getProgressByTheme(user.uid);
        const history = await getQuizHistory(user.uid, 10);

        const badges = await getAllBadges();
        const earnedBadges = await getUserBadges(user.uid);
        const streak = await getCurrentStreak(user.uid);

        setUserProfile(profile);
        setSubjectProgress(subjectProg);
        setThemeProgress(progress);
        setQuizHistory(history);
        setAllBadges(badges);
        setUserBadges(earnedBadges);
        setCurrentStreak(streak);

      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Error loading profile data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadProfileData();
    }
  }, [user]);

  /**
   * HANDLER: Logout
   */
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

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
            Se încarcă profil...
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
   * RENDER: Profile Page
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
          {/* Accent bar */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '12px',
            background: 'var(--neon-cyan)'
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
                👤 Profil
              </h1>
              <p style={{
                fontSize: '1.125rem',
                color: 'var(--warm-brown)'
              }}>
                Vizualizează progresul și statisticile tale
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
                onClick={() => navigate('/leaderboard')}
                style={{
                  background: 'var(--neon-orange)',
                  color: 'var(--deep-brown)',
                  border: '4px solid var(--neon-orange)',
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
                🏆 Clasament
              </button>

              <button
                onClick={handleLogout}
                style={{
                  background: 'transparent',
                  color: 'var(--deep-brown)',
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
                  e.currentTarget.style.background = 'var(--neon-pink)';
                  e.currentTarget.style.color = 'var(--off-white)';
                  e.currentTarget.style.borderColor = 'var(--neon-pink)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--deep-brown)';
                  e.currentTarget.style.borderColor = 'var(--deep-brown)';
                }}
              >
                Deconectare
              </button>
            </div>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* SECTION 1: USER INFO */}
        <div style={{
          background: 'var(--cream)',
          border: '6px solid var(--deep-brown)',
          padding: '2.5rem',
          marginBottom: '2rem',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '12px',
            height: '100%',
            background: 'var(--neon-lime)'
          }}></div>

          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '1.5rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            color: 'var(--deep-brown)',
            marginBottom: '1.5rem'
          }}>
            📋 Informații Personale
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            <div>
              <p style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--warm-brown)',
                marginBottom: '0.5rem',
                fontWeight: 700
              }}>
                Email
              </p>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--deep-brown)'
              }}>
                {userProfile?.email}
              </p>
            </div>

            <div>
              <p style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--warm-brown)',
                marginBottom: '0.5rem',
                fontWeight: 700
              }}>
                Membru din
              </p>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--deep-brown)'
              }}>
                {userProfile?.createdAt ? formatDate(userProfile.createdAt) : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: GLOBAL STATS */}
        <div style={{
          background: 'var(--cream)',
          border: '6px solid var(--deep-brown)',
          padding: '2.5rem',
          marginBottom: '2rem',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '12px',
            height: '100%',
            background: 'var(--neon-pink)'
          }}></div>

          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '1.5rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            color: 'var(--deep-brown)',
            marginBottom: '1.5rem'
          }}>
            📊 Statistici Globale
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.5rem'
          }}>
            {/* Stat 1: Total Quizzes */}
            <div style={{
              background: 'var(--sand)',
              border: '4px solid var(--warm-brown)',
              padding: '1.5rem',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '8px',
                background: 'var(--neon-cyan)'
              }}></div>
              <p style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                color: 'var(--warm-brown)',
                marginBottom: '0.5rem',
                fontWeight: 700
              }}>
                Quiz-uri jucate
              </p>
              <p style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '3rem',
                fontWeight: 900,
                color: 'var(--deep-brown)',
                lineHeight: 1
              }}>
                {userProfile?.stats.totalQuizzes || 0}
              </p>
            </div>

            {/* Stat 2: Average Score */}
            <div style={{
              background: 'var(--sand)',
              border: '4px solid var(--warm-brown)',
              padding: '1.5rem',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '8px',
                background: 'var(--neon-lime)'
              }}></div>
              <p style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                color: 'var(--warm-brown)',
                marginBottom: '0.5rem',
                fontWeight: 700
              }}>
                Scor mediu
              </p>
              <p style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '3rem',
                fontWeight: 900,
                color: 'var(--deep-brown)',
                lineHeight: 1
              }}>
                {userProfile?.stats.averageScore || 0}%
              </p>
            </div>

            {/* Stat 3: Best Score */}
            <div style={{
              background: 'var(--sand)',
              border: '4px solid var(--warm-brown)',
              padding: '1.5rem',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '8px',
                background: 'var(--neon-green)'
              }}></div>
              <p style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                color: 'var(--warm-brown)',
                marginBottom: '0.5rem',
                fontWeight: 700
              }}>
                Cel mai bun scor
              </p>
              <p style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '3rem',
                fontWeight: 900,
                color: 'var(--deep-brown)',
                lineHeight: 1
              }}>
                {userProfile?.stats.bestScore || 0}%
              </p>
            </div>

            {/* Stat 4: Total Points */}
            <div style={{
              background: 'var(--sand)',
              border: '4px solid var(--warm-brown)',
              padding: '1.5rem',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '8px',
                background: 'var(--neon-orange)'
              }}></div>
              <p style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                color: 'var(--warm-brown)',
                marginBottom: '0.5rem',
                fontWeight: 700
              }}>
                Puncte totale
              </p>
              <p style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '3rem',
                fontWeight: 900,
                color: 'var(--deep-brown)',
                lineHeight: 1
              }}>
                {userProfile?.stats.totalPoints || 0}
              </p>
            </div>

            {/* Stat 5: Current Streak */}
            <div style={{
              background: 'var(--neon-orange)',
              border: '4px solid var(--deep-brown)',
              padding: '1.5rem',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '8px',
                background: 'var(--deep-brown)'
              }}></div>
              <p style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                color: 'var(--deep-brown)',
                marginBottom: '0.5rem',
                fontWeight: 700
              }}>
                Streak curent
              </p>
              <p style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '3rem',
                fontWeight: 900,
                color: 'var(--deep-brown)',
                lineHeight: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                🔥 {currentStreak}
              </p>
              <p style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.75rem',
                color: 'var(--deep-brown)',
                marginTop: '0.5rem'
              }}>
                {currentStreak === 1 ? 'zi' : 'zile'}
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 3: BADGES */}
        <div style={{
          background: 'var(--cream)',
          border: '6px solid var(--deep-brown)',
          padding: '2.5rem',
          marginBottom: '2rem',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '12px',
            height: '100%',
            background: 'var(--neon-lime)'
          }}></div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <h2 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '1.5rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              color: 'var(--deep-brown)'
            }}>
              🎖️ Badge-uri
            </h2>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--warm-brown)'
            }}>
              {userBadges.length} / {allBadges.length} obținute
            </div>
          </div>

          {allBadges.length === 0 ? (
            <p style={{ color: 'var(--warm-brown)' }}>Se încarcă badge-urile...</p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '1.5rem'
            }}>
              {allBadges.map((badge) => {
                const earnedBadge = userBadges.find(ub => ub.badgeId === badge.id);
                const isEarned = !!earnedBadge;

                return (
                  <BadgeCard
                    key={badge.id}
                    badge={badge}
                    earned={isEarned}
                    earnedAt={earnedBadge?.earnedAt || null}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* SECTION 4: PROGRESS BY SUBJECT */}
        {subjectProgress.length > 0 && (
          <div style={{
            background: 'var(--cream)',
            border: '6px solid var(--deep-brown)',
            padding: '2.5rem',
            marginBottom: '2rem',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '12px',
              height: '100%',
              background: 'var(--neon-cyan)'
            }}></div>

            <h2 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '1.5rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              color: 'var(--deep-brown)',
              marginBottom: '1.5rem'
            }}>
              📚 Progres pe Materii
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}>
              {subjectProgress.map((subject, index) => {
                const neonColors = ['var(--neon-pink)', 'var(--neon-cyan)', 'var(--neon-lime)', 'var(--neon-orange)', 'var(--neon-green)'];
                const neonColor = neonColors[index % neonColors.length];

                return (
                  <div
                    key={subject.subjectId}
                    style={{
                      background: 'var(--sand)',
                      border: '5px solid var(--warm-brown)',
                      padding: '2rem',
                      position: 'relative'
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '10px',
                      height: '100%',
                      background: neonColor
                    }}></div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '1.5rem',
                      gap: '1rem'
                    }}>
                      <span style={{ fontSize: '3rem' }}>{subject.subjectIcon}</span>
                      <div>
                        <h3 style={{
                          fontFamily: 'Space Grotesk, sans-serif',
                          fontSize: '1.25rem',
                          fontWeight: 900,
                          color: 'var(--deep-brown)',
                          marginBottom: '0.25rem'
                        }}>
                          {subject.subjectName}
                        </h3>
                        <p style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: '0.875rem',
                          color: 'var(--warm-brown)'
                        }}>
                          {subject.totalQuizzes} quiz-uri
                        </p>
                      </div>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '0.75rem'
                    }}>
                      <div style={{
                        background: 'var(--cream)',
                        border: '3px solid var(--warm-brown)',
                        padding: '0.75rem',
                        textAlign: 'center'
                      }}>
                        <p style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: '0.625rem',
                          textTransform: 'uppercase',
                          color: 'var(--warm-brown)',
                          marginBottom: '0.25rem'
                        }}>
                          Mediu
                        </p>
                        <p style={{
                          fontFamily: 'Space Grotesk, sans-serif',
                          fontSize: '1.5rem',
                          fontWeight: 900,
                          color: 'var(--deep-brown)'
                        }}>
                          {subject.averageScore}%
                        </p>
                      </div>

                      <div style={{
                        background: 'var(--cream)',
                        border: '3px solid var(--warm-brown)',
                        padding: '0.75rem',
                        textAlign: 'center'
                      }}>
                        <p style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: '0.625rem',
                          textTransform: 'uppercase',
                          color: 'var(--warm-brown)',
                          marginBottom: '0.25rem'
                        }}>
                          Maxim
                        </p>
                        <p style={{
                          fontFamily: 'Space Grotesk, sans-serif',
                          fontSize: '1.5rem',
                          fontWeight: 900,
                          color: 'var(--neon-green)'
                        }}>
                          {subject.bestScore}%
                        </p>
                      </div>

                      <div style={{
                        background: 'var(--cream)',
                        border: '3px solid var(--warm-brown)',
                        padding: '0.75rem',
                        textAlign: 'center'
                      }}>
                        <p style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: '0.625rem',
                          textTransform: 'uppercase',
                          color: 'var(--warm-brown)',
                          marginBottom: '0.25rem'
                        }}>
                          Puncte
                        </p>
                        <p style={{
                          fontFamily: 'Space Grotesk, sans-serif',
                          fontSize: '1.5rem',
                          fontWeight: 900,
                          color: 'var(--deep-brown)'
                        }}>
                          {subject.totalPoints}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 5: PROGRESS BY THEME */}
        <div style={{
          background: 'var(--cream)',
          border: '6px solid var(--deep-brown)',
          padding: '2.5rem',
          marginBottom: '2rem',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '12px',
            height: '100%',
            background: 'var(--neon-pink)'
          }}></div>

          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '1.5rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            color: 'var(--deep-brown)',
            marginBottom: '1.5rem'
          }}>
            📈 Progres pe Teme
          </h2>

          {themeProgress.length === 0 ? (
            <p style={{ color: 'var(--warm-brown)' }}>
              Nu ai jucat niciun quiz încă. Mergi la teme!
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {themeProgress.map((theme) => (
                <div
                  key={theme.themeId}
                  style={{
                    background: 'var(--sand)',
                    border: '5px solid var(--warm-brown)',
                    padding: '2rem',
                    position: 'relative'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '10px',
                    height: '100%',
                    background: 'var(--neon-cyan)'
                  }}></div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: '1.5rem',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <div>
                      <h3 style={{
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontSize: '1.25rem',
                        fontWeight: 900,
                        color: 'var(--deep-brown)',
                        marginBottom: '0.5rem'
                      }}>
                        {theme.themeName}
                      </h3>
                      <p style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '0.875rem',
                        color: 'var(--warm-brown)'
                      }}>
                        {theme.totalQuizzes} quiz-uri jucate
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <p style={{
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontSize: '2.5rem',
                        fontWeight: 900,
                        color: 'var(--deep-brown)',
                        lineHeight: 1
                      }}>
                        {theme.averageScore}%
                      </p>
                      <p style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        color: 'var(--warm-brown)'
                      }}>
                        Mediu
                      </p>
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.75rem',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      background: 'var(--cream)',
                      border: '3px solid var(--warm-brown)',
                      padding: '0.75rem',
                      textAlign: 'center'
                    }}>
                      <p style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '0.625rem',
                        textTransform: 'uppercase',
                        color: 'var(--warm-brown)',
                        marginBottom: '0.25rem'
                      }}>
                        Mediu
                      </p>
                      <p style={{
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontSize: '1.25rem',
                        fontWeight: 900,
                        color: 'var(--deep-brown)'
                      }}>
                        {theme.averageScore}%
                      </p>
                    </div>

                    <div style={{
                      background: 'var(--cream)',
                      border: '3px solid var(--warm-brown)',
                      padding: '0.75rem',
                      textAlign: 'center'
                    }}>
                      <p style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '0.625rem',
                        textTransform: 'uppercase',
                        color: 'var(--warm-brown)',
                        marginBottom: '0.25rem'
                      }}>
                        Maxim
                      </p>
                      <p style={{
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontSize: '1.25rem',
                        fontWeight: 900,
                        color: 'var(--neon-green)'
                      }}>
                        {theme.bestScore}%
                      </p>
                    </div>

                    <div style={{
                      background: 'var(--cream)',
                      border: '3px solid var(--warm-brown)',
                      padding: '0.75rem',
                      textAlign: 'center'
                    }}>
                      <p style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '0.625rem',
                        textTransform: 'uppercase',
                        color: 'var(--warm-brown)',
                        marginBottom: '0.25rem'
                      }}>
                        Puncte
                      </p>
                      <p style={{
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontSize: '1.25rem',
                        fontWeight: 900,
                        color: 'var(--deep-brown)'
                      }}>
                        {theme.totalPoints}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {theme.attempts.map((attempt) => {
                      const diffColors = {
                        easy: { bg: 'var(--sage)', emoji: '🟢' },
                        medium: { bg: 'var(--neon-orange)', emoji: '🟡' },
                        hard: { bg: 'var(--neon-pink)', emoji: '🔴' }
                      };
                      const diffColor = diffColors[attempt.difficulty] || diffColors.medium;

                      return (
                        <div
                          key={attempt.difficulty}
                          style={{
                            background: diffColor.bg,
                            color: 'var(--deep-brown)',
                            padding: '0.5rem 1rem',
                            border: '3px solid var(--deep-brown)',
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '0.75rem',
                            fontWeight: 700
                          }}
                        >
                          {diffColor.emoji} {attempt.count} × {attempt.avgScore}%
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 6: QUIZ HISTORY */}
        <div style={{
          background: 'var(--cream)',
          border: '6px solid var(--deep-brown)',
          padding: '2.5rem',
          marginBottom: '2rem',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '12px',
            height: '100%',
            background: 'var(--neon-orange)'
          }}></div>

          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '1.5rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            color: 'var(--deep-brown)',
            marginBottom: '1.5rem'
          }}>
            ⏰ Istoric Quiz-uri
          </h2>

          {quizHistory.length === 0 ? (
            <p style={{ color: 'var(--warm-brown)' }}>
              Nu ai jucat niciun quiz încă.
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'separate',
                borderSpacing: 0
              }}>
                <thead>
                  <tr style={{
                    background: 'var(--deep-brown)',
                    color: 'var(--off-white)'
                  }}>
                    <th style={{
                      textAlign: 'left',
                      padding: '1rem',
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '0.875rem',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      border: '3px solid var(--deep-brown)'
                    }}>
                      Materie
                    </th>
                    <th style={{
                      textAlign: 'left',
                      padding: '1rem',
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '0.875rem',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      border: '3px solid var(--deep-brown)'
                    }}>
                      Temă
                    </th>
                    <th style={{
                      textAlign: 'center',
                      padding: '1rem',
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '0.875rem',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      border: '3px solid var(--deep-brown)'
                    }}>
                      Dificultate
                    </th>
                    <th style={{
                      textAlign: 'center',
                      padding: '1rem',
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '0.875rem',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      border: '3px solid var(--deep-brown)'
                    }}>
                      Scor
                    </th>
                    <th style={{
                      textAlign: 'center',
                      padding: '1rem',
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '0.875rem',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      border: '3px solid var(--deep-brown)'
                    }}>
                      Procent
                    </th>
                    <th style={{
                      textAlign: 'center',
                      padding: '1rem',
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '0.875rem',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      border: '3px solid var(--deep-brown)'
                    }}>
                      Durată
                    </th>
                    <th style={{
                      textAlign: 'left',
                      padding: '1rem',
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '0.875rem',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      border: '3px solid var(--deep-brown)'
                    }}>
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {quizHistory.map((quiz, index) => {
                    const diffColors = {
                      easy: { bg: 'var(--sage)', emoji: '🟢', label: 'Ușor' },
                      medium: { bg: 'var(--neon-orange)', emoji: '🟡', label: 'Mediu' },
                      hard: { bg: 'var(--neon-pink)', emoji: '🔴', label: 'Greu' }
                    };
                    const diffColor = diffColors[quiz.difficulty] || diffColors.medium;

                    return (
                      <tr
                        key={index}
                        style={{
                          background: index % 2 === 0 ? 'var(--sand)' : 'var(--cream)',
                          borderBottom: '2px solid var(--warm-brown)'
                        }}
                      >
                        <td style={{
                          padding: '1rem',
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: '0.75rem',
                          color: 'var(--warm-brown)'
                        }}>
                          {quiz.subjectName}
                        </td>
                        <td style={{
                          padding: '1rem',
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: 'var(--deep-brown)'
                        }}>
                          {quiz.themeName}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <div style={{
                            background: diffColor.bg,
                            color: 'var(--deep-brown)',
                            padding: '0.375rem 0.75rem',
                            border: '2px solid var(--deep-brown)',
                            display: 'inline-block',
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '0.75rem',
                            fontWeight: 700
                          }}>
                            {diffColor.emoji} {diffColor.label}
                          </div>
                        </td>
                        <td style={{
                          padding: '1rem',
                          textAlign: 'center',
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: '1rem',
                          fontWeight: 700,
                          color: 'var(--deep-brown)'
                        }}>
                          {quiz.score}/{quiz.maxScore}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <div style={{
                            background: quiz.percentage >= 80 ? 'var(--neon-green)' :
                                       quiz.percentage >= 60 ? 'var(--neon-orange)' :
                                       'var(--neon-pink)',
                            color: 'var(--deep-brown)',
                            padding: '0.375rem 0.75rem',
                            border: '2px solid var(--deep-brown)',
                            display: 'inline-block',
                            fontFamily: 'Space Grotesk, sans-serif',
                            fontSize: '1rem',
                            fontWeight: 900
                          }}>
                            {quiz.percentage}%
                          </div>
                        </td>
                        <td style={{
                          padding: '1rem',
                          textAlign: 'center',
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: '0.875rem',
                          color: 'var(--warm-brown)'
                        }}>
                          {formatDuration(quiz.duration)}
                        </td>
                        <td style={{
                          padding: '1rem',
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: '0.75rem',
                          color: 'var(--warm-brown)'
                        }}>
                          {quiz.createdAt ? formatDate(quiz.createdAt) : 'N/A'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
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

export { Profile as default };
