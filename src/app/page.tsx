'use client'
import { useState, useEffect, useRef } from 'react'

export default function QuantumMessenger() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [activeChat, setActiveChat] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [chats, setChats] = useState<any[]>([])
  const [contacts, setContacts] = useState<any[]>([])
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [currentSection, setCurrentSection] = useState('chats')
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Загрузка при запуске
  useEffect(() => {
    const savedUser = localStorage.getItem('quantum-user')
    if (savedUser) {
      const user = JSON.parse(savedUser)
      setCurrentUser(user)
      loadData(user)
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadData = (user: any) => {
    // Только реальные контакты (без ботов)
    const userContacts = [
      {
        id: 1,
        name: user.username || 'Aleksey',
        username: '@' + (user.username?.toLowerCase() || 'aleksey'),
        avatar: '👨',
        online: true,
        lastSeen: 'только что',
        phone: user.phone || '+7 949 340-10-92',
        verified: true
      }
    ]

    setContacts(userContacts)

    // Чаты только с реальными контактами
    const userChats = [
      {
        id: 1,
        name: user.username || 'Aleksey',
        username: '@' + (user.username?.toLowerCase() || 'aleksey'),
        avatar: '👨',
        lastMessage: 'Добро пожаловать в Quantum!',
        time: 'только что',
        unread: 0,
        online: true,
        verified: true,
        userId: user.id
      }
    ]

    setChats(userChats)

    // Приветственное сообщение
    setMessages([
      { id: 1, text: 'Добро пожаловать в Quantum Messenger!', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isMe: false, isSystem: true }
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
      
      // Сохраняем в localStorage
      const chatKey = `quantum-chat-${activeChat.userId}`
      const existingMessages = JSON.parse(localStorage.getItem(chatKey) || '[]')
      localStorage.setItem(chatKey, JSON.stringify([...existingMessages, newMsg]))
      
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
      phone: userData.phone || '+7 949 340-10-92',
      username: userData.username || 'Aleksey'
    }
    setCurrentUser(newUser)
    localStorage.setItem('quantum-user', JSON.stringify(newUser))
    loadData(newUser)
  }

  const handleLogin = (userData: any) => {
    const user = {
      ...userData,
      id: Date.now(),
      avatar: '👤',
      phone: userData.phone || '+7 949 340-10-92',
      username: userData.username || 'Aleksey'
    }
    setCurrentUser(user)
    localStorage.setItem('quantum-user', JSON.stringify(user))
    loadData(user)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setActiveChat(null)
    setMessages([])
    localStorage.removeItem('quantum-user')
  }

  const addContact = () => {
    if (!searchQuery.trim()) return

    const newContact = {
      id: Date.now(),
      name: searchQuery,
      username: `@${searchQuery.toLowerCase().replace(/\s+/g, '')}`,
      avatar: '👤',
      online: true,
      lastSeen: 'только что',
      phone: '+7 XXX XXX-XX-XX',
      verified: false
    }
    setContacts(prev => [newContact, ...prev])
    
    // Создаем чат с новым контактом
    const newChat = {
      ...newContact,
      lastMessage: 'Чат начат',
      time: 'только что',
      unread: 0,
      userId: newContact.id
    }
    setChats(prev => [newChat, ...prev])
    setSearchQuery('')
  }

  const startNewChat = (contact: any) => {
    const existingChat = chats.find(chat => chat.userId === contact.id)
    if (existingChat) {
      setActiveChat(existingChat)
      // Загружаем сообщения из localStorage
      const chatKey = `quantum-chat-${contact.id}`
      const savedMessages = JSON.parse(localStorage.getItem(chatKey) || '[]')
      setMessages(savedMessages.length > 0 ? savedMessages : [
        { id: 1, text: 'Чат начат', time: 'только что', isMe: false, isSystem: true }
      ])
    } else {
      const newChat = {
        ...contact,
        lastMessage: 'Чат начат',
        time: 'только что',
        unread: 0,
        userId: contact.id
      }
      setChats(prev => [newChat, ...prev])
      setActiveChat(newChat)
      setMessages([
        { id: 1, text: 'Чат начат', time: 'только что', isMe: false, isSystem: true }
      ])
    }
  }

  // КОМПОНЕНТ ГЛАВНОЙ СТРАНИЦЫ
  if (!currentUser) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
        minHeight: '100vh',
        color: 'white',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        {/* Логотип Quantum */}
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
          <div style={{ 
            fontSize: '48px',
            background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Q</div>
        </div>

        <h1 style={{
          fontSize: '42px',
          fontWeight: 'bold',
          marginBottom: '10px',
          textAlign: 'center',
          background: 'linear-gradient(45deg, #fff, #e0e0e0)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Quantum
        </h1>

        <p style={{
          fontSize: '18px',
          opacity: 0.9,
          marginBottom: '50px',
          textAlign: 'center',
          maxWidth: '300px'
        }}>
          Будущее коммуникаций уже здесь
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
              color: '#8b5cf6',
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
          <div>Следующее поколение мессенджера</div>
          <div style={{ marginTop: '5px' }}>Безопасно • Быстро • Современно</div>
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
              <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Вход в Quantum</h2>
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
                onClick={() => handleLogin({ 
                  username: 'Aleksey', 
                  phone: '+7 949 340-10-92',
                  firstName: 'Aleksey',
                  lastName: 'Quantum'
                })}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
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
              <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Регистрация в Quantum</h2>
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
                  defaultValue="+7 949 340-10-92"
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
                  username: 'Aleksey', 
                  phone: '+7 949 340-10-92',
                  firstName: 'Aleksey',
                  lastName: 'Quantum'
                })}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
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

  // ИНТЕРФЕЙС МЕССЕНДЖЕРА QUANTUM
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
            <h2 style={{ 
              margin: 0, 
              fontSize: '20px', 
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Quantum
            </h2>
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

        {/* Табы */}
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
              borderBottom: currentSection === 'chats' ? '2px solid #8b5cf6' : 'none',
              cursor: 'pointer',
              fontWeight: currentSection === 'chats' ? 'bold' : 'normal',
              color: currentSection === 'chats' ? '#8b5cf6' : '#666'
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
              borderBottom: currentSection === 'contacts' ? '2px solid #8b5cf6' : 'none',
              cursor: 'pointer',
              fontWeight: currentSection === 'contacts' ? 'bold' : 'normal',
              color: currentSection === 'contacts' ? '#8b5cf6' : '#666'
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
              borderBottom: currentSection === 'settings' ? '2px solid #8b5cf6' : 'none',
              cursor: 'pointer',
              fontWeight: currentSection === 'settings' ? 'bold' : 'normal',
              color: currentSection === 'settings' ? '#8b5cf6' : '#666'
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
                  onClick={() => {
                    setActiveChat(chat)
                    // Загружаем сообщения для этого чата
                    const chatKey = `quantum-chat-${chat.userId}`
                    const savedMessages = JSON.parse(localStorage.getItem(chatKey) || '[]')
                    setMessages(savedMessages.length > 0 ? savedMessages : [
                      { id: 1, text: 'Чат начат', time: 'только что', isMe: false, isSystem: true }
                    ])
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 15px',
                    borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    background: activeChat?.id === chat.id ? '#f3e8ff' : 'white'
                  }}
                >
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
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
                        background: '#10b981',
                        border: '2px solid white',
                        borderRadius: '50%'
                      }}></div>
                    )}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '15px' }}>
                        {chat.name}
                        {chat.verified && <span style={{ marginLeft: '5px', color: '#8b5cf6' }}>✓</span>}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>{chat.time}</div>
                    </div>
                    <div style={{ fontSize: '13px', color: '#666', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{chat.lastMessage}</span>
                      {chat.unread > 0 && (
                        <span style={{
                          background: '#8b5cf6',
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
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="text"
                    placeholder="Имя нового контакта"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                  <button 
                    onClick={addContact}
                    style={{
                      padding: '10px 15px',
                      background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    +
                  </button>
                </div>
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
                    background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
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
                        background: '#10b981',
                        border: '2px solid white',
                        borderRadius: '50%'
                      }}></div>
                    )}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', fontSize: '15px' }}>
                      {contact.name}
                      {contact.verified && <span style={{ marginLeft: '5px', color: '#8b5cf6' }}>✓</span>}
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
                  background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
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
                  fontSize: '15px',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0'
                }}>✏️ Редактировать профиль</button>

                <button style={{
                  padding: '12px',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '15px',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0'
                }}>🔔 Уведомления</button>

                <button style={{
                  padding: '12px',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '15px',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0'
                }}>🛡️ Конфиденциальность</button>

                <button style={{
                  padding: '12px',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '15px',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0'
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
                    marginTop: '20px',
                    borderRadius: '8px',
                    border: '1px solid #ffcdd2'
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
                  background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
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
                    {activeChat.verified && <span style={{ marginLeft: '5px', color: '#8b5cf6' }}>✓</span>}
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
              background: 'linear-gradient(135deg, #f3e8ff, #fce7f3)'
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
                    background: msg.isMe ? 'linear-gradient(45deg, #8b5cf6, #ec4899)' : 'white',
                    color: msg.isMe ? 'white' : 'black',
                    borderRadius: '18px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
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
                          color: msg.isMe ? 'rgba(255,255,255,0.8)' : '#666', 
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
                <button style={{ 
                  background: 'none', 
                  border: 'none', 
                  fontSize: '20px', 
                  cursor: 'pointer',
                  color: '#8b5cf6'
                }}>😊</button>
                <button style={{ 
                  background: 'none', 
                  border: 'none', 
                  fontSize: '20px', 
                  cursor: 'pointer',
                  color: '#8b5cf6'
                }}>📎</button>
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
                    borderRadius: '25px',
                    fontSize: '15px',
                    outline: 'none',
                    background: '#f8f9fa'
                  }}
                />
                <button 
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  style={{
                    background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
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
            background: 'linear-gradient(135deg, #f8f9fa, #ffffff)',
            color: '#666'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '64px',
                marginBottom: '20px',
                background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>Q</div>
              <div style={{ fontSize: '18px', marginBottom: '10px' }}>Добро пожаловать в Quantum</div>
              <div style={{ fontSize: '14px', color: '#999' }}>Выберите чат чтобы начать общение</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}