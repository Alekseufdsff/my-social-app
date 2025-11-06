import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'

const uri = process.env.MONGODB_URI!

export async function GET(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    const chatId = params.chatId

    const client = await MongoClient.connect(uri)
    const db = client.db()
    
    // Получаем историю сообщений для чата
    const messages = await db.collection('messages')
      .find({
        $or: [
          { from: new ObjectId(chatId), to: new ObjectId(chatId) }
        ]
      })
      .sort({ timestamp: 1 })
      .toArray()

    await client.close()

    return NextResponse.json({ messages })

  } catch (error) {
    console.error('Messages load error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}