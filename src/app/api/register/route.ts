import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { setSession } from '@/lib/auth';

export async function POST(req: Request) {
  console.log('API: Registration request received');
  try {
    const { email, username, password } = await req.json();

    if (!email || !username || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email or username already exists' }, { status: 409 });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Check if this is the first user
    const userCount = await prisma.user.count();
    const role = userCount === 0 ? 'ADMIN' : 'USER';

    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
        role,
      },
    });

    // Automatically log them in
    await setSession({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    return NextResponse.json({ 
      message: 'Registration successful!',
      userId: user.id,
      role: user.role
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
