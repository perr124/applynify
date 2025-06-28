# Waitlist Setup Guide

## Overview

This waitlist system allows you to collect emails, names, and industry information from potential users before your product launch. It's environment-controlled, so you can easily switch between the full site and waitlist mode.

## Features

- ✅ Modern, responsive waitlist page
- ✅ Collects name, email, and industry
- ✅ MongoDB storage with Lead model
- ✅ Environment-controlled display
- ✅ Admin panel to view entries
- ✅ CSV export functionality
- ✅ Search and filter capabilities
- ✅ Beautiful UI with success states

## Environment Configuration

### Enable Waitlist Mode

To show only the waitlist page, add this to your `.env.local`:

```bash
NEXT_PUBLIC_WAITLIST_MODE=true
```

### Disable Waitlist Mode

To show the full site, either:

- Remove the environment variable
- Set it to `false`:

```bash
NEXT_PUBLIC_WAITLIST_MODE=false
```

## Database Setup

The waitlist uses the existing `Lead` model with enhanced fields:

- `email` (required)
- `name` (required)
- `industry` (required)
- `createdAt` (automatic timestamp)

## API Endpoints

### Submit Waitlist Entry

- **POST** `/api/lead`
- **Body**: `{ name, email, industry }`
- **Response**: `{ success: true }`

### Admin: Get All Entries

- **GET** `/api/admin/waitlist`
- **Auth**: Required (admin only)
- **Response**: `{ entries: [...] }`

## Admin Access

### View Waitlist Entries

1. Navigate to `/admin/waitlist`
2. Login with your admin account
3. View, search, filter, and export entries

### Admin Authentication

Currently set to allow access for: `perrykankam@gmail.com`

To change the admin email, edit `app/api/admin/waitlist/route.ts`:

```typescript
if (session.user.email !== 'your-email@example.com') {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

## Usage

### Development

```bash
# Show full site
npm run dev

# Show waitlist only
NEXT_PUBLIC_WAITLIST_MODE=true npm run dev
```

### Production

```bash
# Build with waitlist mode
NEXT_PUBLIC_WAITLIST_MODE=true npm run build
npm start
```

## Customization

### Industries List

Edit the industries array in `app/waitlist/page.tsx`:

```typescript
const industries = [
  'Technology',
  'Healthcare',
  // Add your industries...
];
```

### Styling

The waitlist page uses Tailwind CSS and DaisyUI. You can customize:

- Colors in `tailwind.config.js`
- Components in `app/waitlist/page.tsx`
- Form validation and error handling

### Email Notifications

To add email notifications when someone joins:

1. Uncomment the email logic in `app/api/lead/route.ts`
2. Configure your email provider (Mailgun, etc.)

## Security Notes

- Admin routes are protected with authentication
- Email validation is performed on both client and server
- Duplicate emails are handled gracefully
- CSRF protection is built into Next.js

## Troubleshooting

### Waitlist not showing

- Check `NEXT_PUBLIC_WAITLIST_MODE` environment variable
- Ensure the variable is set to `'true'` (string)
- Restart your development server

### Database connection issues

- Verify `MONGODB_URI` is set correctly
- Check MongoDB connection in `libs/mongoose.ts`

### Admin access denied

- Verify you're logged in with the correct email
- Check the admin email in the API route
- Ensure NextAuth is configured properly
