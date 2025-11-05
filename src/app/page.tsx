'use client'
import { useState } from 'react'

// Компоненты форм (можно вынести в отдельные файлы позже)
function LoginForm({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Реализовать логику входа
    console.log('Вход:', { email, password })
    alert('Функция входа в разработке!')
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
        padding: '40px',
        borderRadius: '20px',
        border: '1px solid #333',
        minWidth: '400px',
        color: 'white'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Вход в Quantum</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid #444',
                borderRadius: '8px',
                color: 'white',
                fontSize: '16px'
              }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid #444',
                borderRadius: '8px',
                color: 'white',
                fontSize: '16px'
              }}
              required
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              marginBottom: '15px'
            }}
          >
            Войти
          </button>
        </form>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '10px',
            background: 'transparent',
            color: '#999',
            border: '1px solid #444',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Закрыть
        </button>
      </div>
    </div>
  )
}

function RegisterForm({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Реализовать логику регистрации
    console.log('Регистрация:', { username, email, password })
    alert('Функция регистрации в разработке!')
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
        padding: '40px',
        borderRadius: '20px',
        border: '1px solid #333',
        minWidth: '400px',
        color: 'white'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Регистрация в Quantum</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Имя пользователя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid #444',
                borderRadius: '8px',
                color: 'white',
                fontSize: '16px'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid #444',
                borderRadius: '8px',
                color: 'white',
                fontSize: '16px'
              }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid #444',
                borderRadius: '8px',
                color: 'white',
                fontSize: '16px'
              }}
              required
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              marginBottom: '15px'
            }}
          >
            Зарегистрироваться
          </button>
        </form>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '10px',
            background: 'transparent',
            color: '#999',
            border: '1px solid #444',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Закрыть
        </button>
      </div>
    </div>
  )
}

export default function Home() {
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  return (
    <div style={{
      background: 'linear-gradient(135deg, #000000, #1a1a2e, #000000)',
      minHeight: '100vh',
      color: 'white',
      fontFamily: 'Arial'
    }}>
      {/* Хедер */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 50px',
        borderBottom: '1px solid #333',
        background: 'rgba(0,0,0,0.3)',
        backdropFilter: 'blur(10px)'
      }}>
        <h1 style={{
          background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '28px',
          fontWeight: 'bold'
        }}>
          Quantum
        </h1>
        
        <nav style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          {isLoggedIn ? (
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <span>Привет, пользователь!</span>
              <button 
                onClick={() => setIsLoggedIn(false)}
                style={{
                  padding: '8px 16px',
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: '1px solid #444',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Выйти
              </button>
            </div>
          ) : (
            <>
              <button 
                onClick={() => setShowLogin(true)}
                style={{
                  padding: '10px 20px',
                  background: 'transparent',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '5px',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                Вход
              </button>
              <button 
                onClick={() => setShowRegister(true)}
                style={{
                  padding: '10px 25px',
                  background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Регистрация
              </button>
            </>
          )}
        </nav>
      </header>

      {/* Основной контент */}
      <main style={{
        textAlign: 'center',
        padding: '80px 20px'
      }}>
        {isLoggedIn ? (
          // Контент для авторизованных пользователей
          <div>
            <h2 style={{
              fontSize: '3.5rem',
              marginBottom: '20px',
              background: 'linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Добро пожаловать в Quantum!
            </h2>
            <p style={{
              fontSize: '1.3rem',
              color: '#ccc',
              marginBottom: '50px'
            }}>
              Рады видеть вас в нашем сообществе!
            </p>
          </div>
        ) : (
          // Контент для неавторизованных пользователей
          <>
            <h2 style={{
              fontSize: '3.5rem',
              marginBottom: '20px',
              background: 'linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Добро пожаловать в Quantum
            </h2>
            
            <p style={{
              fontSize: '1.3rem',
              color: '#ccc',
              marginBottom: '50px',
              maxWidth: '600px',
              margin: '0 auto 50px'
            }}>
              Общайтесь, находите друзей, делитесь моментами. Всё в одном месте!
            </p>

            <button 
              onClick={() => setShowRegister(true)}
              style={{
                padding: '16px 35px',
                background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1.1rem',
                cursor: 'pointer',
                marginBottom: '70px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.08)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(139, 92, 246, 0.5)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Начать общение
            </button>
          </>
        )}

        {/* Карточки фич */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '25px',
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          {/* Карточка 1 */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            padding: '35px 25px',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.1)',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)'
          }} onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.borderColor = '#8b5cf6';
            e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
          }} onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>💬</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Мгновенные сообщения</h3>
            <p style={{ color: '#999', lineHeight: '1.5' }}>Общайтесь в реальном времени с друзьями</p>
          </div>

          {/* Карточка 2 */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            padding: '35px 25px',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.1)',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)'
          }} onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.borderColor = '#3b82f6';
            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
          }} onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>👥</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Найдите друзей</h3>
            <p style={{ color: '#999', lineHeight: '1.5' }}>Расширяйте свой круг общения</p>
          </div>

          {/* Карточка 3 */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            padding: '35px 25px',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.1)',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)'
          }} onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.borderColor = '#ec4899';
            e.currentTarget.style.background = 'rgba(236, 72, 153, 0.1)';
          }} onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🎥</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Видеозвонки</h3>
            <p style={{ color: '#999', lineHeight: '1.5' }}>Общайтесь лицом к лицу в HD качестве</p>
          </div>
        </div>
      </main>

      {/* Модальные окна */}
      {showLogin && <LoginForm onClose={() => setShowLogin(false)} />}
      {showRegister && <RegisterForm onClose={() => setShowRegister(false)} />}
    </div>
  )
}