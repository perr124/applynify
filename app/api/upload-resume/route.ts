import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/libs/next-auth';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      console.error('Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('No file provided');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // For now, we'll use a mock URL since we don't have actual file storage
    // In production, you would upload to S3, Google Cloud Storage, etc.
    const mockUrl = `https://storage.example.com/${Date.now()}-${file.name}`;

    // Create a new resume object
    const newResume = {
      id: Date.now().toString(),
      filename: file.name,
      url: mockUrl,
      uploadedAt: new Date(),
      status: 'active',
    };

    // Update user's resumes array
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
      console.error('User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Resume uploaded successfully',
      url: mockUrl,
      resume: newResume,
    });
  } catch (error) {
    console.error('Error uploading resume:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
