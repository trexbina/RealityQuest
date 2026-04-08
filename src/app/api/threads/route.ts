import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  console.log('API: Fetching threads');
  try {
    const threads = await prisma.thread.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        author: {
          select: { username: true } // In case we need it
        }
      }
    });
    return NextResponse.json(threads);
  } catch (error) {
    console.error('Error fetching threads:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  console.log('API: Creating new thread');
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized. You must be logged in to create a thread.' }, { status: 401 });
    }

    const { title, content } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const thread = await prisma.thread.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        authorName: session.user.username,
      },
      include: {
        author: {
          select: { username: true }
        }
      }
    });

    return NextResponse.json(thread, { status: 201 });
  } catch (error) {
    console.error('Error creating thread:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

