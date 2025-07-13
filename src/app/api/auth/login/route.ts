import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { usernameOrEmail, password } = body

    // Simple backend logic - replace with your actual authentication
    // For now, accept any non-empty credentials
    if (usernameOrEmail && password) {
      // Simulate successful login
      const response = {
        success: true,
        message: 'Login successful',
        user: {
          id: '1',
          name: 'Admin User',
          email: 'admin@istudent.com',
          role: 'admin'
        },
        token: 'mock-jwt-token-' + Date.now()
      }

      return NextResponse.json(response, { status: 200 })
    } else {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Username/email and password are required' 
        },
        { status: 400 }
      )
    }
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

// Handle OPTIONS for CORS (if needed for mobile app)
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