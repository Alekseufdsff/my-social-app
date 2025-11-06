import { NextResponse } from 'next/server'
import { Server } from 'socket.io'

export async function GET() {
  return NextResponse.json({ message: 'Socket.IO endpoint' })
}

// Для WebSocket соединений
export async function POST(request) {
  // Socket.IO будет обрабатывать соединения отдельно
  return NextResponse.json({ status: 'connected' })
}