import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email is required' 
        },
        { status: 400 }
      )
    }

    // Simulate sending password reset email
    // In real implementation, you would:
    // 1. Check if email exists in database
    // 2. Generate reset token
    // 3. Send email with reset link
    // 4. Store token in database with expiration

    const response = {
      success: true,
      message: 'If this email exists, you will receive a password reset link shortly.'
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Server error' 
      },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}