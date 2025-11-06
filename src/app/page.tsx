'use client'
import { useState, useEffect, useRef } from 'react'

// ... (компоненты LoginForm и RegisterForm остаются такими же, но обновляем handleSubmit)

// ОБНОВЛЕННЫЙ FriendsList с работой с БД
function FriendsList({ onSelectFriend, currentUser }: { onSelectFriend: (friend: any) => void, currentUser: any }) {
  const [friends, setFriends] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  // Загружаем друзей из БД
  const loadFriends = async () => {
    if (!currentUser?.id) return
    
    try {
      setLoading(true)
      const res = await fetch('/api/friends/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id })
      })
      const data = await res.json()
      if (res.ok) {
        setFriends(data.friends)
      }
    } catch (error) {
      console.error('Error loading friends:', error)
    } finally {
      setLoading(false)
    }
  }

  // Добавляем друга в БД
  const addFriend = async () => {
    if (!search.trim() || !currentUser?.id) return

    try {
      // В реальном приложении здесь был бы поиск пользователя по имени/email
      // Сейчас создаем тестового пользователя
      const newFriend = {
        id: `friend_${Date.now()}`,
        username: search,
        email: `${search}@test.com`,
        online: true,
        avatar: '👤'
      }

      const res = await fetch('/api/friends/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: currentUser.id, 
          friendId: newFriend.id 
        })
      })

      if (res.ok) {
        setFriends(prev => [newFriend, ...prev])
        setSearch('')
      }
    } catch (error) {
      // Заглушка для теста
      const newFriend = {
        id: `friend_${Date.now()}`,
        username: search,
        email: `${search}@test.com`,
        online: true,
        avatar: '👤'
      }
      setFriends(prev => [newFriend, ...prev])
      setSearch('')
    }
  }

  useEffect(() => {
    loadFriends()
  }, [currentUser])

  return (
    <div style={{background: 'rgba(255,255,255,0.05)', borderRadius: '15px', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '20px', overflowY: 'auto'}}>
      <h3 style={{marginBottom: '20px', color: '#8b5cf6', textAlign: 'center'}}>Мои друзья</h3>
      
      {/* Поиск и добавление */}
      <div style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>
        <input 
          type="text" 
          placeholder="Найти пользователя..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addFriend()}
          style={{
            flex: 1, 
            padding: '10px', 
            background: 'rgba(255,255,255,0.1)', 
            border: '1px solid rgba(139, 92, 246, 0.5)', 
            borderRadius: '10px', 
            color: 'white',
            fontSize: '14px'
          }}
        />
        <button 
          onClick={addFriend}
          disabled={loading || !search.trim()}
          style={{
            padding: '10px 15px',
            background: loading || !search.trim() ? 'rgba(255,255,255,0.1)' : 'linear-gradient(45deg, #8b5cf6, #ec4899)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: loading || !search.trim() ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {loading ? '...' : '+'}
        </button>
      </div>

      {/* Список друзей */}
      <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
        {friends.map(friend => (
          <div 
            key={friend.id || friend._id}
            onClick={() => onSelectFriend(friend)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px',
              background: 'rgba(139, 92, 246, 0.1)',
              borderRadius: '10px',
              cursor: 'pointer',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{
              width: '10px',
              height: '10px',
              background: friend.online ? '#10b981' : '#6b7280',
              borderRadius: '50%'
            }}></div>
            <span style={{fontSize: '16px'}}>{friend.avatar} {friend.username}</span>
            <span style={{color: '#999', fontSize: '12px', marginLeft: 'auto'}}>
              {friend.online ? 'online' : 'offline'}
            </span>
          </div>
        ))}
        
        {friends.length === 0 && !loading && (
          <div style={{textAlign: 'center', color: '#666', padding: '20px', fontSize: '14px'}}>
            Начните общение - добавьте первого друга!
          </div>
        )}
        
        {loading && (
          <div style={{textAlign: 'center', color: '#8b5cf6', padding: '20px'}}>
            Загрузка...
          </div>
        )}
      </div>
    </div>
  )
}

// ОБНОВЛЕННЫЙ ChatInterface с работой с БД
function ChatInterface({ currentUser, activeFriend }: { currentUser: any, activeFriend: any }) {
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [chatId, setChatId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Создаем или получаем чат
  const setupChat = async () => {
    if (!currentUser?.id || !activeFriend?.id) return

    try {
      setLoading(true)
      const res = await fetch('/api/chats/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: currentUser.id, 
          friendId: activeFriend.id 
        })
      })
      const data = await res.json()
      if (res.ok) {
        setChatId(data.chatId)
        loadMessages(data.chatId)
      }
    } catch (error) {
      console.error('Error creating chat:', error)
      setLoading(false)
    }
  }

  // Загружаем сообщения из БД
  const loadMessages = async (chatId: string) => {
    try {
      const res = await fetch('/api/messages/get', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId })
      })
      const data = await res.json()
      if (res.ok) {
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      setLoading(false)
    }
  }

  // Отправляем сообщение в БД
  const sendMessage = async () => {
    if (!newMessage.trim() || !chatId || !currentUser?.id) return

    try {
      const messageData = {
        chatId,
        senderId: currentUser.id,
        text: newMessage.trim()
      }

      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
      })

      if (res.ok) {
        // Добавляем сообщение локально
        const newMsg = {
          text: newMessage,
          senderId: currentUser.id,
          username: currentUser.username,
          timestamp: new Date(),
          _id: `temp_${Date.now()}`
        }
        setMessages(prev => [...prev, newMsg])
        setNewMessage('')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      // Заглушка для теста
      const newMsg = {
        text: newMessage,
        senderId: currentUser.id,
        username: currentUser.username,
        timestamp: new Date(),
        _id: `temp_${Date.now()}`
      }
      setMessages(prev => [...prev, newMsg])
      setNewMessage('')
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (activeFriend) {
      setupChat()
    } else {
      setMessages([])
      setChatId(null)
    }
  }, [activeFriend])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  if (!activeFriend) {
    return (
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '15px',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        height: '500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#666',
        fontSize: '16px'
      }}>
        Выберите друга для начала общения
      </div>
    )
  }

  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '15px',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      height: '500px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Заголовок чата */}
      <div style={{
        padding: '15px 20px',
        borderBottom: '1px solid rgba(139, 92, 246, 0.3)',
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '15px 15px 0 0',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <div style={{
          width: '12px',
          height: '12px',
          background: activeFriend.online ? '#10b981' : '#6b7280',
          borderRadius: '50%'
        }}></div>
        <span style={{fontWeight: 'bold', fontSize: '16px'}}>{activeFriend.avatar} {activeFriend.username}</span>
        <span style={{color: '#999', fontSize: '14px', marginLeft: 'auto'}}>
          {activeFriend.online ? 'online' : 'offline'}
        </span>
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
        {loading ? (
          <div style={{textAlign: 'center', color: '#8b5cf6', padding: '20px'}}>
            Загрузка чата...
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div key={msg._id} style={{
                alignSelf: msg.senderId === currentUser.id ? 'flex-end' : 'flex-start',
                background: msg.senderId === currentUser.id 
                  ? 'linear-gradient(45deg, #8b5cf6, #ec4899)' 
                  : 'rgba(255,255,255,0.1)',
                padding: '12px 16px',
                borderRadius: '18px',
                maxWidth: '70%',
                border: msg.senderId === currentUser.id ? 'none' : '1px solid rgba(139, 92, 246, 0.3)'
              }}>
                <div style={{fontSize: '12px', opacity: 0.8, marginBottom: '5px'}}>
                  {msg.username} • {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
                <div style={{fontSize: '14px'}}>{msg.text}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Ввод сообщения */}
      <div style={{
        padding: '15px 20px',
        borderTop: '1px solid rgba(139, 92, 246, 0.3)',
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '0 0 15px 15px'
      }}>
        <div style={{display: 'flex', gap: '10px'}}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Напишите сообщение..."
            disabled={loading}
            style={{
              flex: 1,
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(139, 92, 246, 0.5)',
              borderRadius: '25px',
              color: 'white',
              fontSize: '14px'
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || loading}
            style={{
              padding: '12px 25px',
              background: newMessage.trim() && !loading
                ? 'linear-gradient(45deg, #8b5cf6, #ec4899)' 
                : 'rgba(255,255,255,0.1)',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              cursor: newMessage.trim() && !loading ? 'pointer' : 'not-allowed',
              fontWeight: 'bold',
              minWidth: '100px'
            }}
          >
            {loading ? '...' : 'Отправить'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ... (остальные компоненты UserProfile и основной компонент Home остаются похожими, 
// но обновляем handleRegister и handleLogin для работы с БД)

export default function Home() {
  // ... (логика как в предыдущей версии, но обновляем функции работы с БД)
}