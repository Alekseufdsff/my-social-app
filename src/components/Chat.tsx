'use client'
import { useState, useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

interface Message {
  id: string
  from: string
  message: string
  timestamp: Date
}

export default function Chat({ currentUser, activeChat, chatInfo }: { 
  currentUser: any, 
  activeChat: string,
  chatInfo: any 
}) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Загружаем историю сообщений из базы
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await fetch(`/api/messages/${activeChat}`)
        const data = await response.json()
        if (response.ok) {
          setMessages(data.messages)
        }
      } catch (error) {
        console.error('Failed to load messages:', error)
      }
    }

    if (activeChat) {
      loadMessages()
    }
  }, [activeChat])

  useEffect(() => {
    const newSocket = io({
      path: '/api/socket',
    })

    newSocket.on('connect', () => {
      console.log('Connected to chat server')
      newSocket.emit('join_user', currentUser.id)
    })

    newSocket.on('receive_message', (data: Message) => {
      setMessages(prev => [...prev, { ...data, id: Date.now().toString() }])
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [currentUser.id, activeChat])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !socket) return

    try {
      // Сохраняем сообщение в базу
      const saveResponse = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: currentUser.id,
          to: activeChat,
          message: newMessage
        }),
      })

      if (saveResponse.ok) {
        // Отправляем через Socket.IO
        const messageData = {
          to: activeChat,
          from: currentUser.id,
          message: newMessage
        }

        socket.emit('send_message', messageData)
        
        // Добавляем в локальное состояние
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          from: currentUser.id,
          message: newMessage,
          timestamp: new Date()
        }])
        
        setNewMessage('')
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: 'rgba(0,0,0,0.1)'
    }}>
      {/* Шапка чата */}
      <div style={{
        padding: '15px 20px',
        borderBottom: '1px solid #333',
        background: 'rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px'
        }}>
          {chatInfo?.name?.charAt(0)}
        </div>
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
            {chatInfo?.name}
          </div>
          <div style={{ color: '#0f0', fontSize: '12px' }}>
            {chatInfo?.online ? 'online' : 'offline'}
          </div>
        </div>
      </div>

      {/* Область сообщений */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{
            alignSelf: msg.from === currentUser.id ? 'flex-end' : 'flex-start',
            maxWidth: '70%'
          }}>
            <div style={{
              padding: '10px 15px',
              background: msg.from === currentUser.id 
                ? 'linear-gradient(45deg, #8b5cf6, #ec4899)' 
                : 'rgba(255,255,255,0.1)',
              borderRadius: '18px',
              border: msg.from === currentUser.id ? 'none' : '1px solid #333'
            }}>
              <div style={{ marginBottom: '4px' }}>{msg.message}</div>
              <div style={{
                fontSize: '11px',
                color: msg.from === currentUser.id ? 'rgba(255,255,255,0.7)' : '#666',
                textAlign: 'right'
              }}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Панель ввода */}
      <div style={{
        padding: '15px 20px',
        borderTop: '1px solid #333',
        background: 'rgba(0,0,0,0.3)'
      }}>
        <form onSubmit={sendMessage} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Введите сообщение..."
            style={{
              flex: 1,
              padding: '12px 15px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid #444',
              borderRadius: '25px',
              color: 'white',
              fontSize: '14px'
            }}
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            style={{
              padding: '12px 20px',
              background: newMessage.trim() 
                ? 'linear-gradient(45deg, #8b5cf6, #ec4899)' 
                : '#666',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
              fontSize: '14px'
            }}
          >
            Отправить
          </button>
        </form>
      </div>
    </div>
  )
}