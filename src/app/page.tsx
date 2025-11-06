'use client'
import { useState, useEffect, useRef } from 'react'

export default function TelegramClone() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [activeChat, setActiveChat] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [chats, setChats] = useState<any[]>([])
  const [contacts, setContacts] = useState<any[]>([])
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [currentSection, setCurrentSection] = useState('chats') // chats, contacts, settings
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Загрузка при запуске
  useEffect(() => {
    const savedUser = localStorage.getItem('tg-user')
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
      loadData()
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadData = () => {
    // Тестовые данные как в ТГ
    setChats([
      {
        id: 1,
        name: 'Aleksey',
        username: '@aleksey',
        avatar: '👨',
        lastMessage: 'Привет! Как дела?',
        time: '12:30',
        unread: 2,
        online: true,
        verified: true
      },
      {
        id: 2, 
        name: 'Maria Ivanova',
        username: '@maria',
        avatar: '👩',
        lastMessage: 'Жду тебя завтра в 15:00',
        time: '11:15',
        unread: 0,
        online: false,
        verified: false
      },
      {
        id: 3,
        name: 'Tech Chat',
        username: '@tech',
        avatar: '💻',
        lastMessage: 'Новый код уже в продакшене',
        time: '10:45',
        unread: 5,
        online: true,
        verified: true,
        isGroup: true
      },
      {
        id: 4,
        name: 'Support',
        username: '@support',
        avatar: '🛟',
        lastMessage: 'Ваш вопрос решен',
        time: '09:20',
        unread: 0,
        online: true,
        verified: true
      }
    ])

    setContacts([
      {
        id: 1,
        name: 'Aleksey',
        username: '@aleksey',
        avatar: '👨',
        online: true,
        lastSeen: 'только что',
        phone: '+7 949 340-10-92',
        verified: true
      },
      {
        id: 2,
        name: 'Maria Ivanova', 
        username: '@maria',
        avatar: '👩',
        online: false,
        lastSeen: '2 часа назад',
        phone: '+7 912 345-67-89',
        verified: false
      },
      {
        id: 3,
        name: 'Alexey Tech',
        username: '@alexeytech',
        avatar: '👨‍💻',
        online: true,
        lastSeen: 'онлайн',
        phone: '+7 987 654-32-10',
        verified: true
      },
      {
        id: 4,
        name: 'Anastasia',
        username: '@nastya',
        avatar: '👸',
        online: false,
        lastSeen: 'вчера',
        phone: '+7 911 222-33-44',
        verified: false
      }
    ])

    // Тестовые сообщения
    setMessages([
      { id: 1, text: 'Привет! Как дела?', time: '12:25', isMe: false },
      { id: 2, text: 'Привет! Все отлично, работаю над новым проектом', time: '12:26', isMe: true },
      { id: 3, text: 'Круто! Что за проект?', time: '12:27', isMe: false },
      { id: 4, text: 'Делаю клон Телеграма на Next.js', time: '12:28', isMe: true },
      { id: 5, text: 'Ого! Покажешь когда будет готово?', time: '12:29', isMe: false },
    ])
  }

  const sendMessage = () => {
    if (newMessage.trim() && activeChat) {
      const newMsg = {
        id: Date.now(),
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true
      }
      setMessages(prev => [...prev, newMsg])
      setNewMessage('')
      
      // Обновляем последнее сообщение в чате
      setChats(prev => prev.map(chat => 
        chat.id === activeChat.id ? { ...chat, lastMessage: newMessage, time: 'только что' } : chat
      ))
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleRegister = (userData: any) => {
    const newUser = {
      ...userData,
      id: Date.now(),
      avatar: '👤',
      phone: userData.phone || '+7 XXX XXX-XX-XX'
    }
    setCurrentUser(newUser)
    localStorage.setItem('tg-user', JSON.stringify(newUser))
    loadData()
  }

  const handleLogin = (userData: any) => {
    setCurrentUser(userData)
    localStorage.setItem('tg-user', JSON.stringify(userData))
    loadData()
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setActiveChat(null)
    localStorage.removeItem('tg-user')
  }

  const addContact = () => {
    const newContact = {
      id: Date.now(),
      name: searchQuery || `User${Math.floor(Math.random() * 1000)}`,
      username: `@user${Date.now()}`,
      avatar: '👤',
      online: true,
      lastSeen: 'только что',
      phone: '+7 XXX XXX-XX-XX',
      verified: false
    }
    setContacts(prev => [newContact, ...prev])
    setSearchQuery('')
  }

  const startNewChat = (contact: any) => {
    const existingChat = chats.find(chat => chat.id === contact.id)
    if (existingChat) {
      setActiveChat(existingChat)
    } else {
      const newChat = {
        ...contact,
        lastMessage: 'Чат начат',
        time: 'только что',
        unread: 0
      }
      setChats(prev => [newChat, ...prev])
      setActiveChat(newChat)
    }
    setMessages([
      { id: 1, text: 'Чат начат', time: 'только что', isMe: false, isSystem: true }
    ])
  }

  // КОМПОНЕНТ ГЛАВНОЙ СТРАНИЦЫ
  if (!currentUser) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #3390ec, #5279ab)',
        minHeight: '100vh',
        color: 'white',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        {/* Логотип как в ТГ */}
        <div style={{
          width: '120px',
          height: '120px',
          background: 'white',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '40px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '60px' }}>✈️</div>
        </div>

        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          marginBottom: '10px',
          textAlign: 'center'
        }}>
          Telegram
        </h1>

        <p style={{
          fontSize: '16px',
          opacity: 0.9,
          marginBottom: '50px',
          textAlign: 'center',
          maxWidth: '300px'
        }}>
          Быстрые и безопасные сообщения
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%', maxWidth: '300px' }}>
          <button 
            onClick={() => setShowLogin(true)}
            style={{
              padding: '15px',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)'
            }}
          >
            Войти в аккаунт
          </button>

          <button 
            onClick={() => setShowRegister(true)}
            style={{
              padding: '15px',
              background: 'white',
              color: '#3390ec',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Создать аккаунт
          </button>
        </div>

        {/* Футер */}
        <div style={{
          position: 'absolute',
          bottom: '30px',
          textAlign: 'center',
          fontSize: '14px',
          opacity: 0.7
        }}>
          <div>Самая быстрая коммуникация</div>
          <div style={{ marginTop: '5px' }}>Безопасно • Надежно • Бесплатно</div>
        </div>

        {/* Модалка входа */}
        {showLogin && (
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
              background: 'white',
              padding: '30px',
              borderRadius: '12px',
              width: '90%',
              maxWidth: '400px',
              color: 'black'
            }}>
              <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Вход в Telegram</h2>
              <div style={{ marginBottom: '15px' }}>
                <input 
                  type="text" 
                  placeholder="Телефон, email или @username"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <input 
                  type="password" 
                  placeholder="Пароль"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>
              <button 
                onClick={() => handleLogin({ username: 'User', phone: '+7 XXX XXX-XX-XX' })}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#3390ec',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                Войти
              </button>
              <button 
                onClick={() => setShowLogin(false)}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'transparent',
                  color: '#666',
                  border: 'none',
                  marginTop: '10px',
                  cursor: 'pointer'
                }}
              >
                Отмена
              </button>
            </div>
          </div>
        )}

        {/* Модалка регистрации */}
        {showRegister && (
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
              background: 'white',
              padding: '30px',
              borderRadius: '12px',
              width: '90%',
              maxWidth: '400px',
              color: 'black'
            }}>
              <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Регистрация в Telegram</h2>
              <div style={{ marginBottom: '15px' }}>
                <input 
                  type="text" 
                  placeholder="Имя"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <input 
                  type="text" 
                  placeholder="Фамилия"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <input 
                  type="tel" 
                  placeholder="Телефон"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>
              <button 
                onClick={() => handleRegister({ 
                  username: 'New User', 
                  phone: '+7 XXX XXX-XX-XX',
                  firstName: 'User',
                  lastName: 'New'
                })}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#3390ec',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                Зарегистрироваться
              </button>
              <button 
                onClick={() => setShowRegister(false)}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'transparent',
                  color: '#666',
                  border: 'none',
                  marginTop: '10px',
                  cursor: 'pointer'
                }}
              >
                Отмена
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ИНТЕРФЕЙС МЕССЕНДЖЕРА (КАК В ТГ)
  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      background: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      {/* Левая панель - Список чатов */}
      <div style={{
        width: '400px',
        borderRight: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Хедер левой панели */}
        <div style={{
          padding: '15px 20px',
          borderBottom: '1px solid #e0e0e0',
          background: '#f8f9fa'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>Telegram</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>🔍</button>
              <button style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>⋮</button>
            </div>
          </div>
          
          {/* Поиск */}
          <input 
            type="text"
            placeholder="Поиск"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: 'none',
              borderRadius: '20px',
              background: '#e9ecef',
              fontSize: '14px'
            }}
          />
        </div>

        {/* Табы как в ТГ */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e0e0e0',
          background: '#f8f9fa'
        }}>
          <button 
            onClick={() => setCurrentSection('chats')}
            style={{
              flex: 1,
              padding: '12px',
              background: currentSection === 'chats' ? 'white' : 'transparent',
              border: 'none',
              borderBottom: currentSection === 'chats' ? '2px solid #3390ec' : 'none',
              cursor: 'pointer',
              fontWeight: currentSection === 'chats' ? 'bold' : 'normal'
            }}
          >
            Чаты
          </button>
          <button 
            onClick={() => setCurrentSection('contacts')}
            style={{
              flex: 1,
              padding: '12px',
              background: currentSection === 'contacts' ? 'white' : 'transparent',
              border: 'none',
              borderBottom: currentSection === 'contacts' ? '2px solid #3390ec' : 'none',
              cursor: 'pointer',
              fontWeight: currentSection === 'contacts' ? 'bold' : 'normal'
            }}
          >
            Контакты
          </button>
          <button 
            onClick={() => setCurrentSection('settings')}
            style={{
              flex: 1,
              padding: '12px',
              background: currentSection === 'settings' ? 'white' : 'transparent',
              border: 'none',
              borderBottom: currentSection === 'settings' ? '2px solid #3390ec' : 'none',
              cursor: 'pointer',
              fontWeight: currentSection === 'settings' ? 'bold' : 'normal'
            }}
          >
            Настройки
          </button>
        </div>

        {/* Содержимое табов */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {currentSection === 'chats' && (
            <div>
              {chats.map(chat => (
                <div 
                  key={chat.id}
                  onClick={() => setActiveChat(chat)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 15px',
                    borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    background: activeChat?.id === chat.id ? '#e3f2fd' : 'white'
                  }}
                >
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: '#e9ecef',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    marginRight: '15px',
                    position: 'relative'
                  }}>
                    {chat.avatar}
                    {chat.online && (
                      <div style={{
                        position: 'absolute',
                        bottom: '2px',
                        right: '2px',
                        width: '12px',
                        height: '12px',
                        background: '#4caf50',
                        border: '2px solid white',
                        borderRadius: '50%'
                      }}></div>
                    )}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '15px' }}>
                        {chat.name}
                        {chat.verified && <span style={{ marginLeft: '5px', color: '#3390ec' }}>✓</span>}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>{chat.time}</div>
                    </div>
                    <div style={{ fontSize: '13px', color: '#666', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{chat.lastMessage}</span>
                      {chat.unread > 0 && (
                        <span style={{
                          background: '#3390ec',
                          color: 'white',
                          borderRadius: '10px',
                          padding: '2px 6px',
                          fontSize: '11px',
                          minWidth: '18px',
                          textAlign: 'center'
                        }}>
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentSection === 'contacts' && (
            <div>
              <div style={{ padding: '15px', background: '#f8f9fa' }}>
                <button 
                  onClick={addContact}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#3390ec',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  + Добавить контакт
                </button>
              </div>
              {contacts.map(contact => (
                <div 
                  key={contact.id}
                  onClick={() => startNewChat(contact)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 15px',
                    borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: '#e9ecef',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    marginRight: '15px',
                    position: 'relative'
                  }}>
                    {contact.avatar}
                    {contact.online && (
                      <div style={{
                        position: 'absolute',
                        bottom: '2px',
                        right: '2px',
                        width: '12px',
                        height: '12px',
                        background: '#4caf50',
                        border: '2px solid white',
                        borderRadius: '50%'
                      }}></div>
                    )}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', fontSize: '15px' }}>
                      {contact.name}
                      {contact.verified && <span style={{ marginLeft: '5px', color: '#3390ec' }}>✓</span>}
                    </div>
                    <div style={{ fontSize: '13px', color: '#666' }}>
                      {contact.online ? 'онлайн' : `был(а) ${contact.lastSeen}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentSection === 'settings' && (
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
                <div style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  background: '#3390ec',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  color: 'white',
                  marginRight: '15px'
                }}>
                  {currentUser.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{currentUser.username}</div>
                  <div style={{ color: '#666', fontSize: '14px' }}>{currentUser.phone}</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button style={{
                  padding: '12px',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '15px'
                }}>✏️ Редактировать профиль</button>

                <button style={{
                  padding: '12px',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '15px'
                }}>🔔 Уведомления</button>

                <button style={{
                  padding: '12px',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '15px'
                }}>🛡️ Конфиденциальность</button>

                <button style={{
                  padding: '12px',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '15px'
                }}>💬 Чаты</button>

                <button 
                  onClick={handleLogout}
                  style={{
                    padding: '12px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '15px',
                    color: '#f44336',
                    marginTop: '20px'
                  }}
                >
                  🚪 Выйти
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Правая панель - Чат */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {activeChat ? (
          <>
            {/* Хедер чата */}
            <div style={{
              padding: '15px 20px',
              borderBottom: '1px solid #e0e0e0',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: '45px',
                  height: '45px',
                  borderRadius: '50%',
                  background: '#e9ecef',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  marginRight: '15px'
                }}>
                  {activeChat.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    {activeChat.name}
                    {activeChat.verified && <span style={{ marginLeft: '5px', color: '#3390ec' }}>✓</span>}
                  </div>
                  <div style={{ fontSize: '13px', color: '#666' }}>
                    {activeChat.online ? 'онлайн' : 'был(а) недавно'}
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '15px' }}>
                <button style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>🔍</button>
                <button style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>⋮</button>
              </div>
            </div>

            {/* Сообщения */}
            <div style={{
              flex: 1,
              padding: '20px',
              overflowY: 'auto',
              background: '#e5ddd5',
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%239C92AC\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'
            }}>
              {messages.map(msg => (
                <div key={msg.id} style={{
                  display: 'flex',
                  justifyContent: msg.isMe ? 'flex-end' : 'flex-start',
                  marginBottom: '10px'
                }}>
                  <div style={{
                    maxWidth: '70%',
                    padding: '10px 15px',
                    background: msg.isMe ? '#dcf8c6' : 'white',
                    borderRadius: '15px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    position: 'relative'
                  }}>
                    {msg.isSystem ? (
                      <div style={{ textAlign: 'center', color: '#666', fontSize: '12px' }}>
                        {msg.text}
                      </div>
                    ) : (
                      <>
                        <div style={{ fontSize: '15px', marginBottom: '5px' }}>{msg.text}</div>
                        <div style={{ 
                          fontSize: '11px', 
                          color: '#666', 
                          textAlign: 'right',
                          marginTop: '2px'
                        }}>
                          {msg.time}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Ввод сообщения */}
            <div style={{
              padding: '15px 20px',
              background: 'white',
              borderTop: '1px solid #e0e0e0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>😊</button>
                <button style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>📎</button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Сообщение"
                  style={{
                    flex: 1,
                    padding: '12px 15px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '20px',
                    fontSize: '15px',
                    outline: 'none'
                  }}
                />
                <button 
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  style={{
                    background: '#3390ec',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                    opacity: newMessage.trim() ? 1 : 0.5
                  }}
                >
                  ➤
                </button>
              </div>
            </div>
          </>
        ) : (
          // Экран когда чат не выбран
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8f9fa',
            color: '#666',
            fontSize: '16px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>✈️</div>
              <div>Выберите чат чтобы начать общение</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}