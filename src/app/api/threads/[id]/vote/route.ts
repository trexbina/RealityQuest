import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type } = await req.json(); // 'UPVOTE' or 'DOWNVOTE'
    if (type !== 'UPVOTE' && type !== 'DOWNVOTE') {
      return NextResponse.json({ error: 'Invalid vote type' }, { status: 400 });
    }

    const thread = await prisma.thread.findUnique({
      where: { id }
    });

    if (!thread) {
      return NextResponse.json({ error: 'Thread not found' }, { status: 404 });
    }

    const userId = session.user.id;
    let upvotedByIds = [...thread.upvotedByIds];
    let downvotedByIds = [...thread.downvotedByIds];

    // Remove existing vote by this user if any
    upvotedByIds = upvotedByIds.filter(id => id !== userId);
    downvotedByIds = downvotedByIds.filter(id => id !== userId);

    // Apply new vote if it's not a toggle-off
    const wasAlreadyUpvoted = thread.upvotedByIds.includes(userId);
    const wasAlreadyDownvoted = thread.downvotedByIds.includes(userId);

    if (type === 'UPVOTE' && !wasAlreadyUpvoted) {
      upvotedByIds.push(userId);
    } else if (type === 'DOWNVOTE' && !wasAlreadyDownvoted) {
      downvotedByIds.push(userId);
    }

    const updatedThread = await prisma.thread.update({
      where: { id },
      data: {
        upvotedByIds,
        downvotedByIds
      }
    });

    return NextResponse.json(updatedThread, { status: 200 });
  } catch (error) {
    console.error('Error voting on thread:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
