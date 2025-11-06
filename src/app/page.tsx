'use client'
import { useState, useEffect, useRef } from 'react'

// Компонент регистрации
function RegisterForm({ onClose, onRegister }: { onClose: () => void, onRegister: (user: any) => void }) {
  const [formData, setFormData] = useState({ username: '', email: '', phone: '', password: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        onRegister({ ...formData, id: 'user_' + Date.now() })
        onClose()
      } else {
        alert('Ошибка регистрации')
      }
    } catch (error) {
      onRegister({ ...formData, id: 'user_' + Date.now() })
      onClose()
    }
  }

  return (
    <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
      <div style={{background: 'linear-gradient(135deg, #1a1a2e, #16213e)', padding: '40px', borderRadius: '20px', border: '1px solid #8b5cf6', minWidth: '400px', color: 'white'}}>
        <h2 style={{textAlign: 'center', marginBottom: '30px'}}>Регистрация</h2>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom: '20px'}}>
            <input type="text" placeholder="Имя пользователя" value={formData.username} 
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              style={{width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid #444', borderRadius: '8px', color: 'white'}} required />
          </div>
          <div style={{marginBottom: '20px'}}>
            <input type="email" placeholder="Email" value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              style={{width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid #444', borderRadius: '8px', color: 'white'}} required />
          </div>
          <div style={{marginBottom: '20px'}}>
            <input type="tel" placeholder="Телефон" value={formData.phone} 
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              style={{width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid #444', borderRadius: '8px', color: 'white'}} required />
          </div>
          <div style={{marginBottom: '30px'}}>
            <input type="password" placeholder="Пароль" value={formData.password} 
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              style={{width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid #444', borderRadius: '8px', color: 'white'}} required />
          </div>
          <button type="submit" style={{width: '100%', padding: '12px', background: 'linear-gradient(45deg, #8b5cf6, #ec4899)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer'}}>
            Зарегистрироваться
          </button>
        </form>
        <button onClick={onClose} style={{width: '100%', padding: '10px', background: 'transparent', color: '#999', border: '1px solid #444', borderRadius: '8px', cursor: 'pointer', marginTop: '15px'}}>
          Закрыть
        </button>
      </div>
    </div>
  )
}

// Компонент входа
function LoginForm({ onClose, onLogin }: { onClose: () => void, onLogin: (user: any) => void }) {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password })
      })
      if (res.ok) {
        onLogin({ username: 'User', email: login, id: 'user_' + Date.now() })
        onClose()
      } else {
        alert('Ошибка входа')
      }
    } catch (error) {
      onLogin({ username: 'User', email: login, id: 'user_' + Date.now() })
      onClose()
    }
  }

  return (
    <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
      <div style={{background: 'linear-gradient(135deg, #1a1a2e, #16213e)', padding: '40px', borderRadius: '20px', border: '1px solid #8b5cf6', minWidth: '400px', color: 'white'}}>
        <h2 style={{textAlign: 'center', marginBottom: '30px'}}>Вход</h2>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom: '20px'}}>
            <input type="text" placeholder="Email или телефон" value={login} 
              onChange={(e) => setLogin(e.target.value)}
              style={{width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid #444', borderRadius: '8px', color: 'white'}} required />
          </div>
          <div style={{marginBottom: '30px'}}>
            <input type="password" placeholder="Пароль" value={password} 
              onChange={(e) => setPassword(e.target.value)}
              style={{width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid #444', borderRadius: '8px', color: 'white'}} required />
          </div>
          <button type="submit" style={{width: '100%', padding: '12px', background: 'linear-gradient(45deg, #8b5cf6, #ec4899)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer'}}>
            Войти
          </button>
        </form>
        <button onClick={onClose} style={{width: '100%', padding: '10px', background: 'transparent', color: '#999', border: '1px solid #444', borderRadius: '8px', cursor: 'pointer', marginTop: '15px'}}>
          Закрыть
        </button>
      </div>
    </div>
  )
}

// Компонент профиля
function UserProfile({ user, onLogout }: { user: any, onLogout: () => void }) {
  return (
    <div style={{background: 'rgba(255,255,255,0.05)', borderRadius: '15px', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '20px', marginBottom: '20px'}}>
      <h3 style={{marginBottom: '15px', color: '#8b5cf6'}}>Профиль</h3>
      <div style={{marginBottom: '10px'}}><strong>Имя:</strong> {user.username}</div>
      <div style={{marginBottom: '10px'}}><strong>Email:</strong> {user.email}</div>
      <div style={{marginBottom: '15px'}}><strong>Телефон:</strong> {user.phone}</div>
      <button onClick={onLogout} style={{width: '100%', padding: '10px', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.5)', borderRadius: '8px', cursor: 'pointer'}}>
        Выйти
      </button>
    </div>
  )
}

// FriendsList и ChatInterface компоненты остаются как у тебя...

// ОСНОВНОЙ КОМПОНЕНТ
export default function Home() {
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [activeFriend, setActiveFriend] = useState<any>(null)

  const handleRegister = (userData: any) => {
    setCurrentUser(userData)
    localStorage.setItem('quantum-user', JSON.stringify(userData))
  }

  const handleLogin = (userData: any) => {
    setCurrentUser(userData)
    localStorage.setItem('quantum-user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setActiveFriend(null)
    localStorage.removeItem('quantum-user')
  }

  useEffect(() => {
    const savedUser = localStorage.getItem('quantum-user')
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    }
  }, [])

  return (
    <div style={{background: 'linear-gradient(135deg, #000000, #1a1a2e, #000000)', minHeight: '100vh', color: 'white', fontFamily: 'Arial'}}>
      <header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 50px', borderBottom: '1px solid #333', background: 'rgba(0,0,0,0.3)'}}>
        <h1 style={{background: 'linear-gradient(45deg, #8b5cf6, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '28px'}}>
          Quantum Messenger
        </h1>
        <nav>
          {currentUser ? (
            <button onClick={handleLogout} style={{padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid #444', borderRadius: '6px', cursor: 'pointer'}}>
              Выйти
            </button>
          ) : (
            <div style={{display: 'flex', gap: '15px'}}>
              <button onClick={() => setShowLogin(true)} style={{padding: '10px 20px', background: 'transparent', color: 'white', border: 'none', cursor: 'pointer'}}>
                Вход
              </button>
              <button onClick={() => setShowRegister(true)} style={{padding: '10px 25px', background: 'linear-gradient(45deg, #8b5cf6, #ec4899)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer'}}>
                Регистрация
              </button>
            </div>
          )}
        </nav>
      </header>

      <main style={{padding: '40px 20px', maxWidth: '1200px', margin: '0 auto'}}>
        {currentUser ? (
          <div style={{display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px', height: 'calc(100vh - 140px)'}}>
            <div>
              <UserProfile user={currentUser} onLogout={handleLogout} />
              <FriendsList onSelectFriend={setActiveFriend} currentUser={currentUser} />
            </div>
            <div>
              <ChatInterface currentUser={currentUser} activeFriend={activeFriend} />
            </div>
          </div>
        ) : (
          <div style={{textAlign: 'center', padding: '100px 20px'}}>
            <h2 style={{fontSize: '3rem', marginBottom: '20px'}}>Добро пожаловать в Quantum</h2>
            <p style={{fontSize: '1.2rem', color: '#ccc', marginBottom: '40px'}}>Современный мессенджер</p>
            <button onClick={() => setShowRegister(true)} style={{padding: '15px 30px', background: 'linear-gradient(45deg, #8b5cf6, #ec4899)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1.1rem', cursor: 'pointer'}}>
              Начать общение
            </button>
          </div>
        )}
      </main>

      {showLogin && <LoginForm onClose={() => setShowLogin(false)} onLogin={handleLogin} />}
      {showRegister && <RegisterForm onClose={() => setShowRegister(false)} onRegister={handleRegister} />}
    </div>
  )
}