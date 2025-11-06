import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'

const uri = process.env.MONGODB_URI!

export async function POST(request: NextRequest) {
  try {
    const { userId, friendId } = await request.json()

    if (!userId || !friendId) {
      return NextResponse.json({ error: 'ID пользователя и друга обязательны' }, { status: 400 })
    }

    const client = new MongoClient(uri)
    await client.connect()
    const db = client.db()

    // Проверяем есть ли уже чат
    const existingChat = await db.collection('chats').findOne({
      participants: { 
        $all: [
          new ObjectId(userId),
          new ObjectId(friendId)
        ]
      }
    })

    if (existingChat) {
      await client.close()
      return NextResponse.json({ 
        chatId: existingChat._id,
        message: 'Чат уже существует'
      }, { status: 200 })
    }

    // Создаем новый чат
    const chat = {
      participants: [
        new ObjectId(userId),
        new ObjectId(friendId)
      ],
      createdAt: new Date(),
      lastMessage: null,
      unreadCount: 0
    }

    const result = await db.collection('chats').insertOne(chat)
    await client.close()

    return NextResponse.json({ 
      message: 'Чат создан',
      chatId: result.insertedId 
    }, { status: 201 })

  } catch (error) {
    console.error('Create chat error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}