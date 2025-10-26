import { NextRequest, NextResponse } from 'next/server'
import { getReplitDb } from '@/lib/database/replit-connection'
import { users } from '@/lib/database/schema'
import { eq } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  try {
    // Check authentication via middleware headers
    const userType = req.headers.get('x-user-type')
    const userId = req.headers.get('x-user-id')
    
    if (!userId || userType !== 'admin') {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 })
    }

    const roleParam = req.nextUrl.searchParams.get('role')
    const db = getReplitDb()
    
    let usersRaw
    if (roleParam) {
      usersRaw = await db
        .select()
        .from(users)
        .where(eq(users.role, roleParam))
    } else {
      usersRaw = await db
        .select()
        .from(users)
    }

    const usersList = usersRaw.map(u => ({
      id: u.id,
      email: u.email,
      fullName: u.fullName,
      role: u.role,
      isActive: u.isActive,
      programId: u.programId,
      yearLevel: u.yearLevel,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }))

    return NextResponse.json({ users: usersList })
  } catch (err: any) {
    console.error('Error fetching users:', err)
    return NextResponse.json(
      { error: err?.message || 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
