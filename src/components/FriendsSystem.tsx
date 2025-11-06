'use client'
import { useState, useEffect } from 'react'

interface User {
  _id: string
  username: string
  email: string
}

interface FriendRequest {
  _id: string
  fromUserId: string
  fromUserName: string
  fromUserEmail: string
  createdAt: string
}

export default function FriendsSystem({ currentUser, onFriendAdded }: { 
  currentUser: any,
  onFriendAdded?: () => void 
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])
  const [activeTab, setActiveTab] = useState<'search' | 'requests'>('search')

  // Поиск пользователей
  const searchUsers = async () => {
    if (!searchQuery.trim()) return

    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      if (response.ok) {
        setSearchResults(data.users)
      }
    } catch (error) {
      console.error('Search error:', error)
    }
  }

  // Загрузка входящих заявок
  const loadFriendRequests = async () => {
    try {
      const response = await fetch(`/api/friends/requests?userId=${currentUser.id}`)
      const data = await response.json()
      if (response.ok) {
        setFriendRequests(data.requests)
      }
    } catch (error) {
      console.error('Load requests error:', error)
    }
  }

  // Отправка заявки в друзья
  const sendFriendRequest = async (toUserId: string) => {
    try {
      const response = await fetch('/api/friends/send-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromUserId: currentUser.id,
          toUserId: toUserId
        }),
      })

      const data = await response.json()
      
      if (response.ok) {
        alert('Заявка отправлена!')
        // Убираем пользователя из результатов поиска
        setSearchResults(prev => prev.filter(user => user._id !== toUserId))
      } else {
        alert(data.error)
      }
    } catch (error) {
      alert('Ошибка отправки заявки')
    }
  }

  // Принятие заявки
  const acceptFriendRequest = async (requestId: string) => {
    try {
      const response = await fetch('/api/friends/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId: requestId
        }),
      })

      const data = await response.json()
      
      if (response.ok) {
        alert('Заявка принята! Пользователь добавлен в друзья!')
        // Обновляем список заявок
        loadFriendRequests()
        // Вызываем колбэк для обновления списка чатов
        if (onFriendAdded) {
          onFriendAdded()
        }
      } else {
        alert(data.error)
      }
    } catch (error) {
      alert('Ошибка принятия заявки')
    }
  }

  useEffect(() => {
    if (activeTab === 'requests') {
      loadFriendRequests()
    }
  }, [activeTab])

  return (
    <div style={{
      background: 'rgba(0,0,0,0.3)',
      borderRadius: '10px',
      padding: '20px',
      margin: '20px'
    }}>
      {/* Табы */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #333',
        marginBottom: '20px'
      }}>
        <button
          onClick={() => setActiveTab('search')}
          style={{
            padding: '10px 20px',
            background: activeTab === 'search' ? 'rgba(139, 92, 246, 0.3)' : 'transparent',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            borderBottom: activeTab === 'search' ? '2px solid #8b5cf6' : 'none'
          }}
        >
          🔍 Поиск друзей
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          style={{
            padding: '10px 20px',
            background: activeTab === 'requests' ? 'rgba(139, 92, 246, 0.3)' : 'transparent',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            borderBottom: activeTab === 'requests' ? '2px solid #8b5cf6' : 'none'
          }}
        >
          📨 Заявки в друзья {friendRequests.length > 0 && `(${friendRequests.length})`}
        </button>
      </div>

      {/* Поиск пользователей */}
      {activeTab === 'search' && (
        <div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Введите имя или email пользователя..."
              style={{
                flex: 1,
                padding: '10px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid #444',
                borderRadius: '8px',
                color: 'white'
              }}
            />
            <button
              onClick={searchUsers}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Найти
            </button>
          </div>

          {/* Результаты поиска */}
          <div>
            {searchResults.map(user => (
              <div
                key={user._id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '15px',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '8px',
                  marginBottom: '10px',
                  border: '1px solid #333'
                }}
              >
                <div>
                  <div style={{ fontWeight: 'bold' }}>{user.username}</div>
                  <div style={{ color: '#999', fontSize: '14px' }}>{user.email}</div>
                </div>
                <button
                  onClick={() => sendFriendRequest(user._id)}
                  style={{
                    padding: '8px 16px',
                    background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Добавить в друзья
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Входящие заявки */}
      {activeTab === 'requests' && (
        <div>
          {friendRequests.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
              Нет входящих заявок в друзья
            </div>
          ) : (
            friendRequests.map(request => (
              <div
                key={request._id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '15px',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '8px',
                  marginBottom: '10px',
                  border: '1px solid #333'
                }}
              >
                <div>
                  <div style={{ fontWeight: 'bold' }}>{request.fromUserName}</div>
                  <div style={{ color: '#999', fontSize: '14px' }}>{request.fromUserEmail}</div>
                  <div style={{ color: '#666', fontSize: '12px' }}>
                    {new Date(request.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={() => acceptFriendRequest(request._id)}
                  style={{
                    padding: '8px 16px',
                    background: 'linear-gradient(45deg, #10b981, #059669)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Принять
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}