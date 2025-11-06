import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'

const uri = process.env.MONGODB_URI!

export async function POST(request: NextRequest) {
  try {
    const { chatId, senderId, text } = await request.json()

    if (!chatId || !senderId || !text) {
      return NextResponse.json({ error: 'Все поля обязательны' }, { status: 400 })
    }

    const client = new MongoClient(uri)
    await client.connect()
    const db = client.db()

    const message = {
      chatId: new ObjectId(chatId),
      senderId: new ObjectId(senderId),
      text,
      timestamp: new Date(),
      read: false
    }

    const result = await db.collection('messages').insertOne(message)
    await client.close()

    return NextResponse.json({ 
      message: 'Сообщение отправлено',
      messageId: result.insertedId 
    }, { status: 201 })

  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}