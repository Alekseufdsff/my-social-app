import { NextRequest, NextResponse } from 'next/server'
import { Server } from 'socket.io'

export async function GET(request: NextRequest) {
  // Этот файл нужен для инициализации Socket.io
  return NextResponse.json({ message: 'Socket API' })
}