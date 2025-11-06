import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'

const uri = process.env.MONGODB_URI!

export async function POST(request: NextRequest) {
  try {
    const { from, to, message } = await request.json()

    if (!from || !to || !message) {
      return NextResponse.json({ error: 'Все поля обязательны' }, { status: 400 })
    }

    const client = await MongoClient.connect(uri)
    const db = client.db()
    
    // Сохраняем сообщение
    const result = await db.collection('messages').insertOne({
      from: new ObjectId(from),
      to: new ObjectId(to),
      message,
      timestamp: new Date(),
      read: false
    })

    await client.close()

    return NextResponse.json({ 
      message: 'Сообщение сохранено',
      messageId: result.insertedId 
    }, { status: 201 })

  } catch (error) {
    console.error('Message save error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}