import { Server } from 'socket.io'

export default function SocketHandler(req, res) {
  if (res.socket.server.io) {
    console.log('Socket уже запущен!')
  } else {
    console.log('Запускаем Socket сервер...')
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on('connection', (socket) => {
      console.log('Пользователь подключился:', socket.id)
      
      // Принимаем сообщения
      socket.on('send-message', (data) => {
        // Отправляем всем пользователям
        io.emit('receive-message', data)
      })

      socket.on('disconnect', () => {
        console.log('Пользователь отключился:', socket.id)
      })
    })
  }
  res.end()
}