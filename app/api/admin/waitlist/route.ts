import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/next-auth';
import connectMongo from '@/libs/mongoose';
import Lead from '@/models/Lead';

// Admin route to get all waitlist entries
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin (you can customize this logic)
    if (session.user.email !== 'perrykankam@gmail.com') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectMongo();

    // Fetch all waitlist entries, sorted by creation date (newest first)
    const entries = await Lead.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ entries });
  } catch (error) {
    console.error('Error fetching waitlist entries:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Admin route to get waitlist statistics
export async function POST(req: NextRequest) {
  await connectMongo();

  try {
    const totalLeads = await Lead.countDocuments({});

    const industryStats = await Lead.aggregate([
      {
        $group: {
          _id: '$industry',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    const recentLeads = await Lead.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name email industry createdAt')
      .lean();

    return NextResponse.json({
      totalLeads,
      industryStats,
      recentLeads,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
