import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'

const uri = process.env.MONGODB_URI!

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'ID пользователя обязателен' }, { status: 400 })
    }

    const client = await MongoClient.connect(uri)
    const db = client.db()
    
    // Получаем входящие заявки в друзья
    const requests = await db.collection('friend_requests')
      .aggregate([
        {
          $match: {
            to: new ObjectId(userId),
            status: 'pending'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'from',
            foreignField: '_id',
            as: 'fromUser'
          }
        },
        {
          $unwind: '$fromUser'
        },
        {
          $project: {
            _id: 1,
            fromUserId: '$fromUser._id',
            fromUserName: '$fromUser.username',
            fromUserEmail: '$fromUser.email',
            createdAt: 1
          }
        }
      ])
      .toArray()

    await client.close()

    return NextResponse.json({ requests })

  } catch (error) {
    console.error('Friend requests error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}