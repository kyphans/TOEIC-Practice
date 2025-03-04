import { NextResponse } from 'next/server'
import testsData from '../mock/tests.json'

export async function GET() {
  return NextResponse.json(testsData)
}

export async function POST(request: Request) {
  const data = await request.json()
  // TODO: Implement create test logic
  return NextResponse.json({ message: 'Test created successfully' })
}

export async function PUT(request: Request) {
  const data = await request.json()
  // TODO: Implement update test logic
  return NextResponse.json({ message: 'Test updated successfully' })
}

export async function DELETE(request: Request) {
  const data = await request.json()
  // TODO: Implement delete test logic 
  return NextResponse.json({ message: 'Test deleted successfully' })
} 