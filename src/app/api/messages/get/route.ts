import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'

const uri = process.env.MONGODB_URI!

export async function POST(request: NextRequest) {
  try {
    const { chatId } = await request.json()

    if (!chatId) {
      return NextResponse.json({ error: 'ID чата обязателен' }, { status: 400 })
    }

    const client = new MongoClient(uri)
    await client.connect()
    const db = client.db()

    const messages = await db.collection('messages')
      .find({ chatId: new ObjectId(chatId) })
      .sort({ timestamp: 1 })
      .toArray()

    await client.close()

    return NextResponse.json({ messages }, { status: 200 })

  } catch (error) {
    console.error('Get messages error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}