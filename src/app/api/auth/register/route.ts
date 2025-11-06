import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'

const uri = process.env.MONGODB_URI!

export async function POST(request: NextRequest) {
  try {
    const { username, email, phone, password } = await request.json()

    // Валидация
    if (!username || !email || !phone || !password) {
      return NextResponse.json({ error: 'Все поля обязательны' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Пароль должен быть минимум 6 символов' }, { status: 400 })
    }

    const client = new MongoClient(uri)
    await client.connect()
    const db = client.db()
    
    // Проверяем нет ли такого пользователя
    const existingUser = await db.collection('users').findOne({
      $or: [{ email }, { username }, { phone }]
    })

    if (existingUser) {
      await client.close()
      return NextResponse.json({ error: 'Пользователь с таким email, именем или телефоном уже существует' }, { status: 400 })
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 12)

    // Создаем пользователя
    const result = await db.collection('users').insertOne({
      username,
      email,
      phone,
      password: hashedPassword,
      createdAt: new Date()
    })

    await client.close()

    return NextResponse.json({ 
      message: 'Пользователь успешно зарегистрирован',
      userId: result.insertedId 
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}