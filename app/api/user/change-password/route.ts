import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/libs/next-auth';
import connectMongo from '@/libs/mongoose';
import User from '@/models/User';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  try {
    console.log('Connecting to database...');
    await connectMongo();

    console.log('Getting user session...');
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();
    console.log('Received password change request for:', session.user.email);

    const user = await User.findOne({ email: session.user.email }).select('+password');
    if (!user) {
      console.log('User not found:', session.user.email);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if password field exists
    if (!user.password) {
      console.log('No password field found for user');
      return NextResponse.json(
        { error: 'Cannot change password for OAuth accounts' },
        { status: 400 }
      );
    }

    // Verify current password
    console.log('Verifying current password...');
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }

    // Update password directly using findOneAndUpdate to bypass the pre-save middleware
    console.log('Updating password...');
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: { password: hashedPassword } }
    );

    console.log('Password updated successfully');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Detailed change password error:', error);
    // Return more specific error message
    const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
