import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI!

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json({ error: 'Поисковый запрос обязателен' }, { status: 400 })
    }

    const client = await MongoClient.connect(uri)
    const db = client.db()
    
    // Ищем пользователей по имени или email
    const users = await db.collection('users')
      .find({
        $or: [
          { username: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } }
        ]
      })
      .project({ username: 1, email: 1 })
      .limit(10)
      .toArray()

    await client.close()

    return NextResponse.json({ users })

  } catch (error) {
    console.error('User search error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}