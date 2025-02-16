import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/libs/next-auth';
import User from '@/models/User';
import { connectMongo } from '@/libs/connectMongo';

export async function GET() {
  try {
    await connectMongo();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return array of resumes, newest first
    return NextResponse.json(user.resumes || []);
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectMongo();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.filename || !data.url) {
      return NextResponse.json({ error: 'Filename and URL are required' }, { status: 400 });
    }

    const newResume = {
      id: Date.now().toString(),
      filename: data.filename,
      url: data.url,
      uploadedAt: data.uploadedAt || new Date().toISOString(),
      status: data.status || 'active',
    };

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $push: {
          resumes: {
            $each: [newResume],
            $position: 0, // Add new resume at the beginning of the array
          },
        },
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Resume added successfully',
      resume: user.resumes[0], // Return the newly added resume
    });
  } catch (error) {
    console.error('Error adding resume:', error);
    return NextResponse.json({ error: 'Failed to add resume' }, { status: 500 });
  }
}
