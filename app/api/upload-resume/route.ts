import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/libs/next-auth';
import User from '@/models/User';
import { s3Client } from '@/libs/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import connectMongo from '@/libs/mongoose';

export async function POST(request: Request) {
  try {
    await connectMongo();

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      console.error('Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const isOnboarding = formData.get('isOnboarding') === 'true';

    if (!file) {
      console.error('No file provided');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Generate unique file name
    const fileName = `${session.user.email}/${Date.now()}-${file.name}`;

    // Upload to S3
    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(uploadCommand);

    // Generate the direct S3 URL
    const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    // Create a new resume object
    const newResume = {
      id: Date.now().toString(),
      filename: file.name,
      url: fileUrl,
      uploadedAt: new Date(),
      status: 'active',
    };

    let updateOperation;
    if (isOnboarding) {
      // During onboarding, replace the entire resumes array with the new resume
      updateOperation = {
        $set: {
          resumes: [newResume],
        },
      };
    } else {
      // Outside onboarding, add to the beginning of the array
      updateOperation = {
        $push: {
          resumes: {
            $each: [newResume],
            $position: 0,
          },
        },
      };
    }

    // Update user's resumes array
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      updateOperation,
      { new: true, maxTimeMS: 8000 }
    ).exec();

    if (!updatedUser) {
      console.error('User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Resume uploaded successfully',
      url: fileUrl,
      resume: newResume,
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: 'Error uploading resume: ' + errorMessage }, { status: 500 });
  }
}
