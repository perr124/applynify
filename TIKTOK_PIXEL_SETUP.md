# TikTok Pixel Setup Guide

## ✅ Installation Complete

The TikTok Pixel has been successfully installed on your website with ID: `D4IRIABC77UAP3H8RKE0`

## 📍 What's Been Implemented

### 1. **Base Pixel Code**

- Location: `app/layout.tsx` (lines 44-56)
- The TikTok Pixel base code is loaded on every page
- Automatically tracks page views across your entire site
- Uses Next.js `Script` component with `afterInteractive` strategy for optimal performance

### 2. **Utility Library** (Optional - for future use)

- Location: `libs/tiktok.ts`
- TypeScript-friendly helper functions for tracking events
- Includes all standard TikTok events
- Available when you're ready to add custom event tracking

## 📊 Current Tracking

**Automatic Page View Tracking**

- Every page load is automatically tracked
- No additional code needed
- Works across all pages of your site

## 📈 How to Add Custom Event Tracking (Optional)

### Import the utility

```typescript
import { tiktokEvents } from '@/libs/tiktok';
```

### Common event examples:

#### Track button clicks

```typescript
tiktokEvents.clickButton('Get Started');
```

#### Track form submissions

```typescript
tiktokEvents.submitForm('contact-form');
```

#### Track content views

```typescript
tiktokEvents.viewContent('pricing-page', 'Pricing Plans', 99);
```

#### Track payment completion

```typescript
tiktokEvents.completePayment(['Pro Plan'], 89, 'USD');
```

#### Custom events

```typescript
import { trackTikTokEvent } from '@/libs/tiktok';

trackTikTokEvent('CustomEvent', {
  custom_property: 'value',
  another_property: 123,
});
```

## 🔍 Verifying the Installation

### Option 1: TikTok Pixel Helper (Chrome Extension)

1. Install the "TikTok Pixel Helper" Chrome extension
2. Visit your website
3. Click the extension icon - it should show your Pixel ID and events being tracked

### Option 2: Browser Console

1. Open your website
2. Open Developer Tools (F12)
3. Go to Console
4. Type: `window.ttq`
5. You should see the TikTok pixel object

### Option 3: TikTok Events Manager

1. Go to [TikTok Ads Manager](https://ads.tiktok.com)
2. Navigate to Assets → Events
3. Click on your pixel
4. Check "Test Events" to see real-time events

## 📈 Events Currently Tracked

| Event  | Location  | Trigger                | Status    |
| ------ | --------- | ---------------------- | --------- |
| `page` | All pages | Automatic on page load | ✅ Active |

## 🎯 When You're Ready to Add Event Tracking

The base pixel is now collecting data and building audiences. When you want to track specific user actions, you can use the utility library at `libs/tiktok.ts`.

### Example: Track Registration

```typescript
// In your registration page (app/auth/register/page.tsx)
import { tiktokEvents } from '@/libs/tiktok';

// After successful registration
tiktokEvents.completeRegistration('email');
```

### Example: Track Checkout Initiation

```typescript
// In your onboarding page (app/onboarding/page.tsx)
import { tiktokEvents } from '@/libs/tiktok';

// When user proceeds to payment
tiktokEvents.initiateCheckout(['Plan Name'], price);
```

### Example: Track Completed Purchase

```typescript
// In your success/dashboard page
import { tiktokEvents } from '@/libs/tiktok';

tiktokEvents.completePayment(['Plan Name'], amount, 'USD');
```

### Other useful events to track:

- Subscribe to newsletter
- Download resources
- Contact form submissions
- Button clicks on key CTAs

## 🎯 Setting Up Conversion Events in TikTok Ads Manager

1. Go to your Pixel in TikTok Events Manager
2. Click "Manage Events"
3. Set key events as "conversion events"
4. Use these for campaign optimization

## 🐛 Debugging

All TikTok events are logged to the console in development. Check your browser console to see:

- `[TikTok Pixel] Event tracked: EventName`
- `[TikTok Pixel] Page view tracked`

## 🔒 Privacy Considerations

The TikTok Pixel respects user privacy. Consider:

1. Adding cookie consent (if not already present)
2. Updating your privacy policy to mention TikTok tracking
3. Providing opt-out options if required by your jurisdiction

## 📚 Additional Resources

- [TikTok Pixel Documentation](https://ads.tiktok.com/help/article/standard-events-parameters)
- [TikTok Events Manager](https://ads.tiktok.com/help/article/events-manager)
- [TikTok Pixel Helper Extension](https://chrome.google.com/webstore/detail/tiktok-pixel-helper/)

## ⚙️ Configuration

Your Pixel ID: `D4IRIABC77UAP3H8RKE0`

To change the Pixel ID, edit `app/layout.tsx` and update line 52:

```typescript
ttq.load('YOUR_NEW_PIXEL_ID');
```

---

**Last Updated**: $(date)
**Status**: ✅ Active and tracking
