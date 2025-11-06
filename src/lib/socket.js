import { Server } from 'socket.io'

export default function SocketHandler(req, res) {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on('connection', (socket) => {
      console.log('User connected:', socket.id)
      
      // Присоединение к комнате пользователя
      socket.on('join_user', (userId) => {
        socket.join(userId)
        console.log(`User ${userId} joined room`)
      })

      // Отправка сообщения
      socket.on('send_message', (data) => {
        const { to, message, from } = data
        socket.to(to).emit('receive_message', {
          from,
          message,
          timestamp: new Date()
        })
      })

      // Онлайн статус
      socket.on('user_online', (userId) => {
        socket.broadcast.emit('user_status', {
          userId,
          online: true
        })
      })

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id)
      })
    })
  }
  res.end()
}