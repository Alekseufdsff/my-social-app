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

    // Создаем запись о дружбе
    const friendship = {
      userId: new ObjectId(userId),
      friendId: new ObjectId(friendId),
      status: 'accepted', // accepted, pending, blocked
      createdAt: new Date()
    }

    const result = await db.collection('friendships').insertOne(friendship)
    await client.close()

    return NextResponse.json({ 
      message: 'Друг добавлен',
      friendshipId: result.insertedId 
    }, { status: 201 })

  } catch (error) {
    console.error('Add friend error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}