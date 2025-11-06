'use client'
import { useEffect } from 'react'
import { io } from 'socket.io-client'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Инициализация Socket.IO будет в компоненте Chat
    // Здесь просто проверяем доступность
    console.log('Layout mounted - Socket.IO ready')
  }, [])

  return (
    <html lang="ru">
      <body>
        {children}
      </body>
    </html>
  )
}