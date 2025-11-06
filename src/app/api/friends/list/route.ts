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
    
    // Получаем список друзей пользователя
    const friends = await db.collection('friends')
      .aggregate([
        {
          $match: {
            $or: [
              { user1: new ObjectId(userId) },
              { user2: new ObjectId(userId) }
            ]
          }
        },
        {
          $lookup: {
            from: 'users',
            let: { friendId: { $cond: [
              { $eq: ['$user1', new ObjectId(userId)] },
              '$user2',
              '$user1'
            ] } },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$friendId'] } } },
              { $project: { username: 1, email: 1, _id: 1 } }
            ],
            as: 'friendInfo'
          }
        },
        {
          $unwind: '$friendInfo'
        },
        {
          $project: {
            _id: 0,
            friendId: '$friendInfo._id',
            username: '$friendInfo.username',
            email: '$friendInfo.email',
            createdAt: 1
          }
        }
      ])
      .toArray()

    await client.close()

    return NextResponse.json({ friends })

  } catch (error) {
    console.error('Friends list error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}