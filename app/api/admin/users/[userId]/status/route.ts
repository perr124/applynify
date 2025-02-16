import { NextResponse } from 'next/server';
import connectMongo from '@/libs/mongo';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/libs/next-auth';

export async function PUT(req: Request, { params }: { params: { userId: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const client = await connectMongo;
    const usersCollection = client!.db().collection('users');

    await usersCollection.updateOne(
      { _id: params.userId },
      { $set: { applicationsStatus: body.applicationsStatus } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating user status:', error);
    return NextResponse.json({ error: 'Failed to update user status' }, { status: 500 });
  }
}
