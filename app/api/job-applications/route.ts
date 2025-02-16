import { NextResponse } from 'next/server';
import connectMongo from '@/libs/mongo';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/libs/next-auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const client = await connectMongo;
    const jobApplicationsCollection = client!.db().collection('jobApplications');

    const jobApplication = await jobApplicationsCollection.insertOne({
      ...body,
      userId: session?.user?.id,
      dateApplied: new Date(),
    });

    return NextResponse.json(jobApplication, { status: 201 });
  } catch (error) {
    console.error('Error in job applications API:', error);
    return NextResponse.json({ error: 'Failed to create job application' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const client = await connectMongo;
    const jobApplicationsCollection = client!.db().collection('jobApplications');

    const jobApplications = await jobApplicationsCollection
      .find()
      .sort({ dateApplied: -1 })
      .toArray();

    return NextResponse.json(jobApplications);
  } catch (error) {
    console.error('Error in job applications API:', error);
    return NextResponse.json({ error: 'Failed to fetch job applications' }, { status: 500 });
  }
}
