import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'

const uri = process.env.MONGODB_URI!

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'ID пользователя обязателен' }, { status: 400 })
    }

    const client = new MongoClient(uri)
    await client.connect()
    const db = client.db()

    const friendships = await db.collection('friendships')
      .find({ 
        userId: new ObjectId(userId),
        status: 'accepted'
      })
      .toArray()

    // Получаем данные друзей
    const friendIds = friendships.map(f => f.friendId)
    const friends = await db.collection('users')
      .find({ _id: { $in: friendIds } })
      .project({ username: 1, email: 1, online: 1 })
      .toArray()

    await client.close()

    return NextResponse.json({ friends }, { status: 200 })

  } catch (error) {
    console.error('Get friends error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}