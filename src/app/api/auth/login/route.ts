import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const uri = process.env.MONGODB_URI!
const JWT_SECRET = process.env.JWT_SECRET || 'quantum-secret-key'

export async function POST(request: NextRequest) {
  try {
    const { login, password } = await request.json()

    // Валидация
    if (!login || !password) {
      return NextResponse.json({ error: 'Логин и пароль обязательны' }, { status: 400 })
    }

    const client = await MongoClient.connect(uri)
    const db = client.db()
    
    // Ищем пользователя по email, username или phone
    const user = await db.collection('users').findOne({
      $or: [
        { email: login },
        { username: login }, 
        { phone: login }
      ]
    })

    if (!user) {
      await client.close()
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 400 })
    }

    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(password, user.password)
    
    if (!isPasswordValid) {
      await client.close()
      return NextResponse.json({ error: 'Неверный пароль' }, { status: 400 })
    }

    // Создаем JWT токен
    const token = jwt.sign(
      { 
        userId: user._id,
        username: user.username,
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    await client.close()

    return NextResponse.json({ 
      message: 'Вход выполнен успешно',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone
      }
    }, { status: 200 })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}