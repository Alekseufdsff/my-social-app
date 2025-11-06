import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'

const uri = process.env.MONGODB_URI!

export async function POST(request: NextRequest) {
  try {
    const { requestId } = await request.json()

    if (!requestId) {
      return NextResponse.json({ error: 'ID заявки обязателен' }, { status: 400 })
    }

    const client = await MongoClient.connect(uri)
    const db = client.db()
    
    // Находим заявку
    const friendRequest = await db.collection('friend_requests').findOne({
      _id: new ObjectId(requestId)
    })

    if (!friendRequest) {
      await client.close()
      return NextResponse.json({ error: 'Заявка не найдена' }, { status: 404 })
    }

    // Обновляем статус заявки
    await db.collection('friend_requests').updateOne(
      { _id: new ObjectId(requestId) },
      { $set: { status: 'accepted', acceptedAt: new Date() } }
    )

    // Добавляем друзей друг другу
    await db.collection('friends').insertOne({
      user1: friendRequest.from,
      user2: friendRequest.to,
      createdAt: new Date()
    })

    await client.close()

    return NextResponse.json({ 
      message: 'Заявка принята, пользователь добавлен в друзья'
    }, { status: 200 })

  } catch (error) {
    console.error('Accept friend error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}