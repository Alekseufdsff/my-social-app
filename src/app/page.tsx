'use client'
import { useState, useEffect } from 'react'
import Chat from '@/components/Chat'
import FriendsSystem from '@/components/FriendsSystem'

// Компоненты форм
function LoginForm({ onClose, onLogin }: { onClose: () => void, onLogin: (user: any) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: email,
          password: password
        }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        onLogin(data.user)
        onClose()
        alert('Вход выполнен успешно!')
      } else {
        alert(data.error)
      }
    } catch (error) {
      alert('Ошибка соединения с сервером')
    } finally {
      setLoading(false)
    }
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
              type="text"
              placeholder="Email, имя пользователя или телефон"
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
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: loading ? '#666' : 'linear-gradient(45deg, #8b5cf6, #ec4899)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '15px',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <button
          onClick={onClose}
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            background: 'transparent',
            color: '#999',
            border: '1px solid #444',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Закрыть
        </button>
      </div>
    </div>
  )
}

function RegisterForm({ onClose, onSwitchToLogin }: { onClose: () => void, onSwitchToLogin: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          email: email,
          phone: phone,
          password: password
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert('Регистрация успешна! Теперь войдите в систему.')
        onClose()
        onSwitchToLogin()
      } else {
        alert(data.error)
      }
    } catch (error) {
      alert('Ошибка соединения с сервером')
    } finally {
      setLoading(false)
    }
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

          <div style={{ marginBottom: '20px' }}>
            <input
              type="tel"
              placeholder="Номер телефона"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
              placeholder="Пароль (минимум 6 символов)"
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
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: loading ? '#666' : 'linear-gradient(45deg, #8b5cf6, #ec4899)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '15px',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>

          {/* Кнопка быстрой регистрации для тестирования */}
          <button
            type="button"
            onClick={() => {
              setUsername('user_' + Math.random().toString(36).substring(2, 8))
              setEmail(`test${Math.random().toString(36).substring(2, 8)}@test.com`)
              setPhone('7999' + Math.floor(1000000 + Math.random() * 9000000))
              setPassword('123456')
            }}
            style={{
              width: '100%',
              padding: '10px',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              border: '1px solid #444',
              borderRadius: '8px',
              cursor: 'pointer',
              marginBottom: '10px'
            }}
          >
            🚀 Быстрая регистрация (тест)
          </button>
        </form>

        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
          <button
            onClick={onSwitchToLogin}
            style={{
              background: 'none',
              border: 'none',
              color: '#8b5cf6',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Уже есть аккаунт? Войти
          </button>
        </div>

        <button
          onClick={onClose}
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            background: 'transparent',
            color: '#999',
            border: '1px solid #444',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer'
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
  const [user, setUser] = useState<any>(null)
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [chats, setChats] = useState<any[]>([])
  const [activeSection, setActiveSection] = useState<'chats' | 'friends'>('chats')

  // Функция загрузки друзей (реальных пользователей)
  const loadFriends = async (userId: string) => {
    try {
      const response = await fetch(`/api/friends/list?userId=${userId}`)
      const data = await response.json()
      if (response.ok && data.friends) {
        // Преобразуем друзей в формат чатов
        const friendChats = data.friends.map((friend: any) => ({
          id: friend.friendId,
          name: friend.username,
          lastMessage: 'Начните общение!',
          unread: 0,
          online: Math.random() > 0.3 // Временный онлайн статус
        }))
        setChats(friendChats)
      } else {
        setChats([]) // Если нет друзей - пустой список
      }
    } catch (error) {
      console.error('Failed to load friends:', error)
      setChats([])
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      setIsLoggedIn(true)
      const userObj = JSON.parse(userData)
      setUser(userObj)
      // Загружаем реальных друзей вместо mock данных
      loadFriends(userObj.id)
    }
  }, [])

  const handleLogin = (userData: any) => {
    setIsLoggedIn(true)
    setUser(userData)
    loadFriends(userData.id)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    setUser(null)
    setActiveChat(null)
    setChats([])
  }

  const switchToLogin = () => {
    setShowRegister(false)
    setShowLogin(true)
  }

  // Функция обновления чатов при добавлении нового друга
  const refreshChats = () => {
    if (user) {
      loadFriends(user.id)
    }
  }

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
        padding: '15px 30px',
        borderBottom: '1px solid #333',
        background: 'rgba(0,0,0,0.3)',
        backdropFilter: 'blur(10px)'
      }}>
        <h1 style={{
          background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '24px',
          fontWeight: 'bold'
        }}>
          Quantum Messenger
        </h1>
        
        <nav style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          {isLoggedIn ? (
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <span style={{ color: '#ccc' }}>{user?.username}</span>
              <button 
                onClick={handleLogout}
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
                  padding: '8px 16px',
                  background: 'transparent',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '5px'
                }}
              >
                Вход
              </button>
              <button 
                onClick={() => setShowRegister(true)}
                style={{
                  padding: '8px 20px',
                  background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
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
        display: 'flex',
        height: 'calc(100vh - 70px)'
      }}>
        {isLoggedIn ? (
          // Интерфейс мессенджера для авторизованных
          <>
            {/* Боковая панель слева */}
            <div style={{
              width: '350px',
              borderRight: '1px solid #333',
              background: 'rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Переключение между чатами и друзьями */}
              <div style={{
                display: 'flex',
                borderBottom: '1px solid #333'
              }}>
                <button
                  onClick={() => setActiveSection('chats')}
                  style={{
                    flex: 1,
                    padding: '15px',
                    background: activeSection === 'chats' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    borderBottom: activeSection === 'chats' ? '2px solid #8b5cf6' : 'none'
                  }}
                >
                  💬 Чаты {chats.length > 0 && `(${chats.length})`}
                </button>
                <button
                  onClick={() => setActiveSection('friends')}
                  style={{
                    flex: 1,
                    padding: '15px',
                    background: activeSection === 'friends' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    borderBottom: activeSection === 'friends' ? '2px solid #8b5cf6' : 'none'
                  }}
                >
                  👥 Друзья
                </button>
              </div>

              {/* Контент боковой панели */}
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {activeSection === 'chats' ? (
                  // Список чатов (реальные друзья)
                  <div>
                    {chats.length > 0 ? (
                      chats.map(chat => (
                        <div
                          key={chat.id}
                          onClick={() => setActiveChat(chat.id)}
                          style={{
                            padding: '15px 20px',
                            borderBottom: '1px solid #333',
                            cursor: 'pointer',
                            background: activeChat === chat.id ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                            borderLeft: activeChat === chat.id ? '3px solid #8b5cf6' : '3px solid transparent',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                          }}
                        >
                          <div style={{
                            width: '45px',
                            height: '45px',
                            borderRadius: '50%',
                            background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px',
                            position: 'relative'
                          }}>
                            {chat.name.charAt(0)}
                            {chat.online && (
                              <div style={{
                                position: 'absolute',
                                bottom: '2px',
                                right: '2px',
                                width: '12px',
                                height: '12px',
                                background: '#10b981',
                                borderRadius: '50%',
                                border: '2px solid #000'
                              }} />
                            )}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: '4px'
                            }}>
                              <span style={{ fontWeight: 'bold', fontSize: '15px' }}>
                                {chat.name}
                              </span>
                              {chat.unread > 0 && (
                                <span style={{
                                  background: '#8b5cf6',
                                  color: 'white',
                                  borderRadius: '10px',
                                  padding: '2px 8px',
                                  fontSize: '12px',
                                  minWidth: '20px',
                                  textAlign: 'center'
                                }}>
                                  {chat.unread}
                                </span>
                              )}
                            </div>
                            <div style={{
                              color: '#999',
                              fontSize: '13px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {chat.lastMessage}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      // Если чатов нет
                      <div style={{
                        padding: '40px 20px',
                        textAlign: 'center',
                        color: '#666'
                      }}>
                        <div style={{ fontSize: '48px', marginBottom: '20px' }}>💬</div>
                        <h3 style={{ marginBottom: '10px' }}>Нет чатов</h3>
                        <p style={{ fontSize: '14px', marginBottom: '20px' }}>
                          Найдите друзей чтобы начать общение!
                        </p>
                        <button 
                          onClick={() => setActiveSection('friends')}
                          style={{
                            padding: '10px 20px',
                            background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer'
                          }}
                        >
                          Найти друзей
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  // Система друзей
                  <FriendsSystem currentUser={user} onFriendAdded={refreshChats} />
                )}
              </div>
            </div>

            {/* Область чата справа */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column'
            }}>
              {activeChat ? (
                // Активный чат с реальным другом
                <Chat 
                  currentUser={user} 
                  activeChat={activeChat}
                  chatInfo={chats.find(chat => chat.id === activeChat)}
                />
              ) : (
                // Приветственный экран
                <div style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(0,0,0,0.1)',
                  color: '#666'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '64px', marginBottom: '20px' }}>💬</div>
                    <h2 style={{ marginBottom: '10px' }}>Добро пожаловать в Quantum!</h2>
                    <p>Выберите чат для начала общения</p>
                    {chats.length === 0 && (
                      <button 
                        onClick={() => setActiveSection('friends')}
                        style={{
                          marginTop: '20px',
                          padding: '12px 24px',
                          background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                      >
                        Найти друзей
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          // Контент для неавторизованных
          <div style={{
            textAlign: 'center',
            padding: '80px 20px'
          }}>
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

            {/* Карточки фич ТОЛЬКО для неавторизованных */}
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
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🎥</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Видеозвонки</h3>
                <p style={{ color: '#999', lineHeight: '1.5' }}>Общайтесь лицом к лицу в HD качестве</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Модальные окна */}
      {showLogin && <LoginForm onClose={() => setShowLogin(false)} onLogin={handleLogin} />}
      {showRegister && <RegisterForm onClose={() => setShowRegister(false)} onSwitchToLogin={switchToLogin} />}
    </div>
  )
}