# Nhiệm Vụ Mắt Việt 2025

A gamified mission-based reward application for Mắt Việt (Vietnamese Eyewear) that encourages customer engagement through social media interactions.

## Overview

Campaign "Chinh phục nhiệm vụ – Rinh voucher khủng" (26.10 – 30.10.2026). Customers scan the in-store QR, then follow Mắt Việt on Instagram, Facebook and the Zalo Mini App to earn vouchers worth up to 300,000 VND.

## Features

- **3 Missions** (same order as the poster): Follow Instagram, Follow Facebook, Open the Zalo Mini App
- **Progressive Rewards**: Earn vouchers cumulatively as missions are completed
  - 0 missions: 50K voucher
  - 1 mission: +100K voucher
  - 2 missions: +200K voucher
  - 3 missions: +300K voucher
- **Store-Specific QR Links**: `utm_content` identifies the store; its name is shown in the header
- **Focus-lens progress meter**: a camera-lens dial that turns and clears as missions are completed
- **Progress survives reloads**: mission state is kept in `sessionStorage` while customers switch to Instagram/Facebook/Zalo
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

### Missions, Vouchers and Stores

Campaign data lives in `lib/campaign.ts`:

- `MISSIONS` — platform links (Instagram, Facebook, Zalo Mini App) in display order
- `TIERS` — voucher amounts and minimum order values
- `STORES` — store code → display name (codes come from `utm_content`)
- `CAMPAIGN_PERIOD`, `HOTLINE`, `VOUCHER_VALIDITY`

### UTM Parameters

The application reads the `utm_content` parameter from the URL to determine which store the customer is visiting:

```
https://yourdomain.com/?utm_content=304
```

### Google Form Integration

Customer data is submitted to Google Forms. Update the form URL and entry IDs in the `handleRewardClick` function in `app/page.tsx`.

The mission status field keeps the same 3-slot format as the 2025 version so the sheet does not need changes:

```
{utm_content}-{zaloMiniApp}-{facebook}-{instagram}     e.g. 101-2-2-2
```

Each slot is `0` (not started), `1` (opened, not confirmed) or `2` (done). The slots that used to hold Zalo and Google Review now hold Zalo Mini App and Instagram.

## Project Structure

```
nhiemvumatviet2025/
├── app/
│   ├── globals.css      # Campaign tokens, sunburst backdrop, ticket/button styles
│   ├── layout.tsx       # Fonts (Anton, Be Vietnam Pro, Pacifico) + metadata
│   ├── icon.png         # Favicon (penguin mascot)
│   └── page.tsx         # Screen flow, mission state, Google Sheets/Form calls
├── components/
│   ├── mission/         # Form, mission and success screens, focus lens, ticket, mascots
│   └── ui/              # shadcn/ui components
├── lib/
│   └── campaign.ts      # Missions, voucher tiers, stores, helpers
├── public/
│   ├── penguin.png      # Blue penguin mascot
│   ├── chick.png        # Yellow chick mascot
│   ├── logo.png         # Mắt Việt logo
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

Add the store code and display name to `STORES` in `lib/campaign.ts`, then print the QR with `?utm_content=NEW_CODE`:

```typescript
"NEW_CODE": "AEON Mall Tân Phú",
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
