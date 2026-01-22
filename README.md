# Nhiệm Vụ Mắt Việt 2025

A gamified mission-based reward application for Mắt Việt (Vietnamese Eyewear) that encourages customer engagement through social media interactions.

## Overview

This application allows customers to complete simple missions (follow on Zalo, Facebook, and leave Google Reviews) to earn vouchers worth up to 300,000 VND for purchases at Mắt Việt stores.

## Features

- **3-Step Mission System**: Follow Zalo, Follow Facebook, Leave Google Review
- **Progressive Rewards**: Earn vouchers cumulatively as missions are completed
  - 0 missions: 50K voucher
  - 1 mission: +100K voucher
  - 2 missions: +200K voucher
  - 3 missions: +300K voucher
- **Store-Specific QR Links**: Each store has a unique Google Review link via UTM parameters
- **Phone Verification**: Prevents duplicate entries by checking against Google Sheets
- **Celebration Effects**: Confetti animations on reward collection
- **Responsive Design**: Mobile-first design optimized for in-store use

## Tech Stack

- **Framework**: Next.js 15.2
- **UI Library**: React 19
- **Styling**: Tailwind CSS + Custom CSS animations
- **Animation**: Framer Motion
- **UI Components**: Radix UI (shadcn/ui)
- **Form Handling**: React Hook Form + Zod
- **Effects**: Canvas Confetti
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/SanhVo2023/nhiemvumatviet2025.git

# Navigate to project directory
cd nhiemvumatviet2025

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
npm run build
npm start
```

## Configuration

### Store Google Review Links

Store-specific Google Review links are configured in `app/page.tsx` in the `googleReviewLinks` object:

```typescript
const googleReviewLinks: Record<string, string> = {
  "304": "https://g.page/r/...",
  "512": "https://g.page/r/...",
  // Add more stores here
}
```

### UTM Parameters

The application reads the `utm_content` parameter from the URL to determine which store the customer is visiting:

```
https://yourdomain.com/?utm_content=304
```

### Google Form Integration

Customer data is submitted to Google Forms. Update the form URL and entry IDs in the `handleRewardClick` function:

```typescript
formData.append("entry.1196289321", customerData.name)
formData.append("entry.444309530", customerData.phone)
// ...
```

## Project Structure

```
nhiemvumatviet2025/
├── app/
│   ├── globals.css      # Global styles and animations
│   ├── layout.tsx       # Root layout with metadata
│   └── page.tsx         # Main application page
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── confetti-button.tsx
│   └── theme-provider.tsx
├── public/
│   ├── banner.png       # Header banner
│   ├── logo.png         # Mắt Việt logo
│   ├── mascot.png       # Success page mascot
│   └── [platform icons]
├── styles/
│   └── globals.css
└── package.json
```

## Development

### Dev Mode

Add `?dev` to the URL to bypass phone number checking during development:

```
http://localhost:3000/?dev
```

### Adding New Stores

1. Get the Google Review link for the new store
2. Add the store code and link to `googleReviewLinks` in `app/page.tsx`:

```typescript
"NEW_CODE": "https://g.page/r/NEW_LINK/review"
```

## Deployment

The project is configured for Netlify deployment:

```bash
# Build and deploy
npm run build
```

Or connect your GitHub repository to Netlify for automatic deployments.

## License

Private - Mắt Việt Internal Use

## Support

For technical support, contact the development team.
