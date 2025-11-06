'use client'
import { useState, useEffect, useRef } from 'react'

export default function Home() {
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [messages, setMessages] = useState<{text: string, user: string, time: string}[]>([])
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages(prev => [...prev, {
        text: newMessage,
        user: 'Вы',
        time: new Date().toLocaleTimeString()
      }])
      setNewMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  if (showLogin) {
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', 
        justifyContent: 'center', zIndex: 1000
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e, #16213e)', padding: '40px',
          borderRadius: '20px', border: '1px solid #333', minWidth: '400px', color: 'white'
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Вход в Quantum</h2>
          <div style={{ marginBottom: '20px' }}>
            <input type="email" placeholder="Email" 
              style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', 
              border: '1px solid #444', borderRadius: '8px', color: 'white', fontSize: '16px' }} />
          </div>
          <div style={{ marginBottom: '30px' }}>
            <input type="password" placeholder="Пароль" 
              style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', 
              border: '1px solid #444', borderRadius: '8px', color: 'white', fontSize: '16px' }} />
          </div>
          <button onClick={() => { setIsLoggedIn(true); setShowLogin(false); }} 
            style={{ width: '100%', padding: '12px', 
            background: 'linear-gradient(45deg, #8b5cf6, #ec4899)', color: 'white', 
            border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', marginBottom: '15px' }}>
            Войти
          </button>
          <button onClick={() => setShowLogin(false)} style={{ width: '100%', padding: '10px', 
            background: 'transparent', color: '#999', border: '1px solid #444', 
            borderRadius: '8px', cursor: 'pointer' }}>
            Закрыть
          </button>
        </div>
      </div>
    )
  }

  if (showRegister) {
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', 
        justifyContent: 'center', zIndex: 1000
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e, #16213e)', padding: '40px',
          borderRadius: '20px', border: '1px solid #333', minWidth: '400px', color: 'white'
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Регистрация в Quantum</h2>
          <div style={{ marginBottom: '20px' }}>
            <input type="text" placeholder="Имя пользователя" 
              style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', 
              border: '1px solid #444', borderRadius: '8px', color: 'white', fontSize: '16px' }} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <input type="email" placeholder="Email" 
              style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', 
              border: '1px solid #444', borderRadius: '8px', color: 'white', fontSize: '16px' }} />
          </div>
          <div style={{ marginBottom: '30px' }}>
            <input type="password" placeholder="Пароль" 
              style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', 
              border: '1px solid #444', borderRadius: '8px', color: 'white', fontSize: '16px' }} />
          </div>
          <button onClick={() => { setIsLoggedIn(true); setShowRegister(false); }} 
            style={{ width: '100%', padding: '12px', 
            background: 'linear-gradient(45deg, #8b5cf6, #ec4899)', color: 'white', 
            border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', marginBottom: '15px' }}>
            Зарегистрироваться
          </button>
          <button onClick={() => setShowRegister(false)} style={{ width: '100%', padding: '10px', 
            background: 'transparent', color: '#999', border: '1px solid #444', 
            borderRadius: '8px', cursor: 'pointer' }}>
            Закрыть
          </button>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #000000, #1a1a2e, #000000)',
        minHeight: '100vh',
        color: 'white',
        fontFamily: 'Arial',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h1 style={{
          background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '48px',
          fontWeight: 'bold',
          marginBottom: '20px'
        }}>
          Quantum Messenger
        </h1>
        <p style={{ fontSize: '18px', color: '#ccc', marginBottom: '40px' }}>
          Самый современный мессенджер
        </p>
        <button 
          onClick={() => setShowRegister(true)}
          style={{
            padding: '15px 30px',
            background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Начать общение
        </button>
      </div>
    )
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #000000, #1a1a2e, #000000)',
      minHeight: '100vh',
      color: 'white',
      fontFamily: 'Arial'
    }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 50px',
        borderBottom: '1px solid #333',
        background: 'rgba(0,0,0,0.3)'
      }}>
        <h1 style={{
          background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '28px',
          fontWeight: 'bold'
        }}>
          Quantum Messenger
        </h1>
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
      </header>

      <main style={{
        padding: '40px 20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '300px 1fr',
          gap: '20px',
          height: 'calc(100vh - 140px)'
        }}>
          {/* Боковая панель с друзьями */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '15px',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '20px',
            overflowY: 'auto'
          }}>
            <h3 style={{ marginBottom: '20px', color: '#8b5cf6' }}>Друзья</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px',
                background: 'rgba(139, 92, 246, 0.2)',
                borderRadius: '10px',
                cursor: 'pointer'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  background: '#10b981',
                  borderRadius: '50%'
                }}></div>
                <span>Aleksey</span>
                <span style={{ color: '#999', fontSize: '12px', marginLeft: 'auto' }}>online</span>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '10px',
                cursor: 'pointer'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  background: '#6b7280',
                  borderRadius: '50%'
                }}></div>
                <span>Maria</span>
                <span style={{ color: '#999', fontSize: '12px', marginLeft: 'auto' }}>offline</span>
              </div>
            </div>
          </div>

          {/* Основной чат */}
          <div style={{
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '15px',
              border: '1px solid rgba(255,255,255,0.1)',
              height: '500px',
              display: 'flex',
              flexDirection: 'column',
              margin: '20px 0'
            }}>
              {/* Заголовок чата */}
              <div style={{
                padding: '15px 20px',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '15px 15px 0 0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '10px',
                    height: '10px',
                    background: '#10b981',
                    borderRadius: '50%'
                  }}></div>
                  <span style={{ fontWeight: 'bold' }}>Aleksey</span>
                  <span style={{ color: '#999', fontSize: '14px' }}>online</span>
                </div>
              </div>

              {/* Сообщения */}
              <div style={{
                flex: 1,
                padding: '20px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
              }}>
                {messages.map((msg, index) => (
                  <div key={index} style={{
                    alignSelf: msg.user === 'Вы' ? 'flex-end' : 'flex-start',
                    background: msg.user === 'Вы' 
                      ? 'linear-gradient(45deg, #8b5cf6, #ec4899)' 
                      : 'rgba(255,255,255,0.1)',
                    padding: '10px 15px',
                    borderRadius: '15px',
                    maxWidth: '70%',
                    border: msg.user === 'Вы' ? 'none' : '1px solid rgba(255,255,255,0.2)'
                  }}>
                    <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '5px' }}>
                      {msg.user} • {msg.time}
                    </div>
                    <div>{msg.text}</div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Ввод сообщения */}
              <div style={{
                padding: '15px 20px',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '0 0 15px 15px'
              }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Напишите сообщение..."
                    style={{
                      flex: 1,
                      padding: '12px 15px',
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '25px',
                      color: 'white',
                      fontSize: '14px'
                    }}
                  />
                  <button
                    onClick={sendMessage}
                    style={{
                      padding: '12px 25px',
                      background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '25px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    Отправить
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}