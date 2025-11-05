export default function Home() {
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
        <nav style={{ display: 'flex', gap: '15px' }}>
          <button style={{
            padding: '10px 20px',
            background: 'transparent',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '5px'
          }}>
            Вход
          </button>
          <button style={{
            padding: '10px 25px',
            background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            Регистрация
          </button>
        </nav>
      </header>

      {/* Основной контент */}
      <main style={{
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

        <button style={{
          padding: '16px 35px',
          background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '1.1rem',
          cursor: 'pointer',
          marginBottom: '70px'
        }}>
          Начать общение
        </button>

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
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🎥</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Видеозвонки</h3>
            <p style={{ color: '#999', lineHeight: '1.5' }}>Общайтесь лицом к лицу в HD качестве</p>
          </div>
        </div>
      </main>
    </div>
  )
}