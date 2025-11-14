import { NextResponse, NextRequest } from 'next/server';
import connectMongo from '@/libs/mongoose';
import Lead from '@/models/Lead';

// This route is used to store the leads that are generated from the landing page.
// The API call is initiated by <ButtonLead /> component
// Duplicate emails just return 200 OK
export async function POST(req: NextRequest) {
  await connectMongo();

  const body = await req.json();

  if (!body.email || !body.name || !body.industry) {
    return NextResponse.json(
      {
        error: 'Email, name, and industry are required',
      },
      { status: 400 }
    );
  }

  try {
    // Check if lead already exists
    const existingLead = await Lead.findOne({ email: body.email });

    if (!existingLead) {
      await Lead.create({
        email: body.email,
        name: body.name,
        industry: body.industry,
        source: body.source || 'initial-waitlist',
      });
    } else {
      // Merge latest fields (including source) for existing emails
      await Lead.updateOne(
        { email: body.email },
        {
          $set: {
            name: body.name,
            industry: body.industry,
            ...(body.source ? { source: body.source } : {}),
          },
        }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
