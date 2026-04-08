import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const thread = await prisma.thread.findUnique({
      where: { id }
    });

    if (!thread) {
      return NextResponse.json({ error: 'Thread not found' }, { status: 404 });
    }

    // Check permissions
    if (thread.authorId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden. You do not have permission to delete this thread.' }, { status: 403 });
    }

    await prisma.thread.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Thread deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting thread:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content } = await req.json();

    const thread = await prisma.thread.findUnique({
      where: { id }
    });

    if (!thread) {
      return NextResponse.json({ error: 'Thread not found' }, { status: 404 });
    }

    // Check permissions
    if (thread.authorId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden. You do not have permission to edit this thread.' }, { status: 403 });
    }

    const updatedThread = await prisma.thread.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(content && { content }),
      }
    });

    return NextResponse.json(updatedThread, { status: 200 });
  } catch (error) {
    console.error('Error patching thread:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
