import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'

const uri = process.env.MONGODB_URI!

export async function POST(request: NextRequest) {
  try {
    const { fromUserId, toUserId } = await request.json()

    if (!fromUserId || !toUserId) {
      return NextResponse.json({ error: 'ID пользователей обязательны' }, { status: 400 })
    }

    const client = await MongoClient.connect(uri)
    const db = client.db()
    
    // Проверяем нет ли уже заявки или дружбы
    const existingRequest = await db.collection('friend_requests').findOne({
      $or: [
        { from: new ObjectId(fromUserId), to: new ObjectId(toUserId) },
        { from: new ObjectId(toUserId), to: new ObjectId(fromUserId) }
      ]
    })

    if (existingRequest) {
      await client.close()
      return NextResponse.json({ error: 'Заявка уже отправлена' }, { status: 400 })
    }

    // Создаем заявку в друзья
    const result = await db.collection('friend_requests').insertOne({
      from: new ObjectId(fromUserId),
      to: new ObjectId(toUserId),
      status: 'pending', // pending, accepted, rejected
      createdAt: new Date()
    })

    await client.close()

    return NextResponse.json({ 
      message: 'Заявка в друзья отправлена',
      requestId: result.insertedId 
    }, { status: 201 })

  } catch (error) {
    console.error('Friend request error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}