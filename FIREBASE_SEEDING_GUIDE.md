# Firebase Database Seeding Guide

## 🎯 Overview

This guide explains how to populate your Firebase database with all 25 ChainTicket+ events.

## ✅ What Was Done

### 1. **Created Seeding Scripts**

Two scripts were created in the `scripts/` folder:

- **`seedFirebase.js`** - Main seeding script (Node.js)
- **`seedFirebase.ts`** - TypeScript version (for reference)

### 2. **Added NPM Script**

Added a convenient command to `package.json`:
```json
"seed:firebase": "node scripts/seedFirebase.js"
```

### 3. **Seeded the Database**

✅ **All 25 events have been added to your Firebase database!**

## 📊 Events in Database

Your Firebase now contains:

| ID | Event Name | Category | City | Price (ETH) |
|----|------------|----------|------|-------------|
| 1 | Base Hackathon Pakistan | Hackathon | Lahore | 0.01 |
| 2 | Web3 Summit 2025 | Conference | Islamabad | 0.05 |
| 3 | Sufi Night & Arts Festival | Music & Arts | Karachi | 0.02 |
| 4 | DeFi Summit Dubai | DeFi | Dubai | 0.15 |
| 5 | NFT NYC 2026 | NFTs | New York | 0.2 |
| 6 | Gaming Guild Meetup | Gaming | Lahore | 0.005 |
| 7 | ETH London Hackathon | Hackathon | London | 0.05 |
| 8 | DAO Governance Workshop | DAO | Lahore | 0.01 |
| 9 | Metaverse Fashion Week | NFTs | Karachi | 0.03 |
| 10 | Blockchain Developer Bootcamp | Workshop | Islamabad | 0.08 |
| 11 | Crypto Art Exhibition | Music & Arts | Lahore | 0.025 |
| 12 | Web3 Security Workshop | Workshop | Online | 0.05 |
| 13 | Metaverse Gaming Tournament | Gaming | Karachi | 0.01 |
| 14 | DeFi for Beginners | DeFi | Peshawar | 0.005 |
| 15 | Global DAO Summit | DAO | Islamabad | 0.1 |
| 16 | NFT Marketplace Launch Party | NFTs | Karachi | 0.02 |
| 17 | Blockchain for Social Good | Conference | Lahore | 0.0 (Free) |
| 18 | Crypto Trading Masterclass | Workshop | Islamabad | 0.06 |
| 19 | Web3 Women Empowerment Summit | Networking | Islamabad | 0.0 (Free) |
| 20 | Solana Speedrun Hackathon | Hackathon | Karachi | 0.015 |
| 21 | Metaverse Real Estate Expo | NFTs | Lahore | 0.04 |
| 22 | Smart Contract Security Audit | Workshop | Islamabad | 0.07 |
| 23 | Crypto Music Festival | Music & Arts | Karachi | 0.035 |
| 24 | Layer 2 Scaling Solutions | Conference | Islamabad | 0.08 |
| 25 | Youth Web3 Bootcamp | Workshop | Lahore | 0.0 (Free) |

## 🚀 How to Re-seed (If Needed)

If you ever need to re-populate the database:

```bash
npm run seed:firebase
```

This will:
1. Connect to your Firebase project
2. Add all 25 events to the `events` collection
3. Show progress for each event
4. Display a summary when complete

## 🎨 Features Now Working

With the database populated, all these features now work:

### ✅ Browse Events Page
- Featured carousel with rotating events
- All 25 events displayed in grid
- Search functionality
- Filter by category
- Filter by city/country

### ✅ Personalized Recommendations
- Based on user interests (from onboarding)
- Based on user location
- Shows top 3 recommended events

### ✅ Event Details Pages
- Each event has a dedicated page at `/events/[id]`
- Full event information
- Ticket purchasing
- Event metadata

### ✅ Home Page
- Featured events section
- Shows 3 highlighted events
- Links to full events page

### ✅ Onboarding Flow
- Asks for user interests on first visit
- Requests location permission
- Stores preferences in localStorage
- Uses preferences for recommendations

## 📁 Database Structure

```
Firebase Project: chainticket-5ef44
└── events (collection)
    ├── 1 (document)
    │   ├── id: "1"
    │   ├── name: "Base Hackathon Pakistan"
    │   ├── description: "..."
    │   ├── date: "Dec 15, 2025"
    │   ├── city: "Lahore"
    │   ├── category: "Hackathon"
    │   └── ... (other fields)
    ├── 2 (document)
    └── ... (25 total documents)
```

## 🔧 Technical Details

### Event Schema
Each event document contains:
- `id` - Unique identifier
- `name` - Event name
- `description` - Detailed description
- `date` - Event date
- `time` - Event time
- `location` - Venue name
- `city` - City name
- `country` - Country name
- `price` - Ticket price in ETH
- `supply` - Total tickets available
- `minted` - Tickets already sold
- `organizer` - Organizer name
- `organizerAddress` - Wallet address
- `image` - Tailwind gradient class
- `category` - Event category

### Categories Available
- Hackathon
- Conference
- Music & Arts
- Workshop
- Networking
- Gaming
- DeFi
- NFTs
- DAO

### Cities Covered
- Lahore (Pakistan)
- Islamabad (Pakistan)
- Karachi (Pakistan)
- Peshawar (Pakistan)
- Dubai (UAE)
- London (UK)
- New York (USA)
- Online (Global)

## 🎉 Success!

Your ChainTicket+ platform now has:
- ✅ 25 events in Firebase
- ✅ All features working
- ✅ Personalized recommendations
- ✅ Search and filtering
- ✅ Onboarding flow
- ✅ Event details pages

## 📞 Support

If you need to:
- Add more events: Edit `src/data/mockData.ts` and run `npm run seed:firebase`
- Clear database: Use Firebase Console
- Update events: Modify the script and re-run

---

**Last Updated:** December 6, 2025
**Status:** ✅ Database Seeded Successfully
