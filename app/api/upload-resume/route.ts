import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/libs/next-auth';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new NextResponse('No file provided', { status: 400 });
    }

    // Here you would implement your file upload logic
    // This could be to AWS S3, Google Cloud Storage, or another storage service
    // For now, we'll return a mock URL
    const mockUrl = `https://storage.example.com/${Date.now()}-${file.name}`;

    // Create a new resume object
    const newResume = {
      id: Date.now().toString(),
      filename: file.name,
      url: mockUrl,
      uploadedAt: new Date(),
      status: 'active',
    };

    // Update the user's record in the database
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
      return new NextResponse('User not found', { status: 404 });
    }

    return NextResponse.json({ url: mockUrl });
  } catch (error) {
    console.error('Error uploading resume:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
