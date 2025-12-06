const { initializeApp } = require("firebase/app");
const { getFirestore, collection, setDoc, doc, getDocs } = require("firebase/firestore");

const firebaseConfig = {
    apiKey: "AIzaSyAsrI22hKv1GlT156l8IEmDPjnQGiumaHE",
    authDomain: "chainticket-5ef44.firebaseapp.com",
    projectId: "chainticket-5ef44",
    storageBucket: "chainticket-5ef44.firebasestorage.app",
    messagingSenderId: "241741545704",
    appId: "1:241741545704:web:8ca65e8e35f2d2aeaa895d",
    measurementId: "G-FHLXE2PBX1"
};

// All 25 events data
const EVENTS_DATA = [
    {
        id: "1",
        name: "Base Hackathon Pakistan",
        description: "Join the biggest Web3 hackathon in Pakistan. Build on Base, win prizes, and network with industry leaders. This event focuses on decentralized social, DeFi, and consumer apps. Expect 48 hours of non-stop coding, mentorship sessions, and free food!",
        date: "Dec 15, 2025",
        time: "09:00 AM - 06:00 PM",
        location: "LUMS, Lahore",
        city: "Lahore",
        country: "Pakistan",
        price: "0.01",
        supply: 500,
        minted: 124,
        organizer: "Base Pakistan Community",
        organizerAddress: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        image: "bg-gradient-to-br from-blue-600 to-purple-600",
        category: "Hackathon"
    },
    {
        id: "2",
        name: "Web3 Summit 2025",
        description: "The premier Web3 conference in Islamabad. Featuring keynote speakers from top global protocols, panel discussions on the future of crypto regulation in Pakistan, and exclusive networking opportunities.",
        date: "Jan 20, 2026",
        time: "10:00 AM - 05:00 PM",
        location: "NUST, Islamabad",
        city: "Islamabad",
        country: "Pakistan",
        price: "0.05",
        supply: 1000,
        minted: 850,
        organizer: "Web3 Islamabad",
        organizerAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        image: "bg-gradient-to-br from-indigo-500 to-blue-500",
        category: "Conference"
    },
    {
        id: "3",
        name: "Sufi Night & Arts Festival",
        description: "An evening of soulful Sufi music and digital art exhibitions. Experience the blend of tradition and technology as we auction exclusive NFT art pieces during the concert.",
        date: "Feb 14, 2026",
        time: "07:00 PM - 12:00 AM",
        location: "Arts Council, Karachi",
        city: "Karachi",
        country: "Pakistan",
        price: "0.02",
        supply: 200,
        minted: 45,
        organizer: "Karachi Arts Society",
        organizerAddress: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
        image: "bg-gradient-to-br from-pink-600 to-rose-500",
        category: "Music & Arts"
    },
    {
        id: "4",
        name: "DeFi Summit Dubai",
        description: "Explore the future of decentralized finance in the heart of Dubai. Connect with investors, founders, and developers building the next generation of financial infrastructure.",
        date: "Mar 10, 2026",
        time: "09:00 AM - 05:00 PM",
        location: "Museum of the Future, Dubai",
        city: "Dubai",
        country: "UAE",
        price: "0.15",
        supply: 300,
        minted: 250,
        organizer: "DeFi Alliance",
        organizerAddress: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
        image: "bg-gradient-to-br from-amber-500 to-orange-600",
        category: "DeFi"
    },
    {
        id: "5",
        name: "NFT NYC 2026",
        description: "The leading annual non-fungible token event. Artists, collectors, and enthusiasts gather to celebrate the cultural phenomenon of NFTs.",
        date: "Apr 05, 2026",
        time: "10:00 AM - 08:00 PM",
        location: "Times Square, New York",
        city: "New York",
        country: "USA",
        price: "0.2",
        supply: 5000,
        minted: 4200,
        organizer: "NFT NYC",
        organizerAddress: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
        image: "bg-gradient-to-br from-purple-600 to-pink-500",
        category: "NFTs"
    },
    {
        id: "6",
        name: "Gaming Guild Meetup",
        description: "A casual meetup for blockchain gamers. Discuss play-to-earn strategies, upcoming game launches, and guild management.",
        date: "Jan 25, 2026",
        time: "06:00 PM - 09:00 PM",
        location: "Gaming Zone, Lahore",
        city: "Lahore",
        country: "Pakistan",
        price: "0.005",
        supply: 50,
        minted: 12,
        organizer: "Lahore Gamers Guild",
        organizerAddress: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
        image: "bg-gradient-to-br from-green-500 to-emerald-700",
        category: "Gaming"
    },
    {
        id: "7",
        name: "ETH London Hackathon",
        description: "Build the future of Ethereum in London. A weekend of coding, workshops, and networking with the European Ethereum community.",
        date: "May 15, 2026",
        time: "09:00 AM - 06:00 PM",
        location: "Tobacco Dock, London",
        city: "London",
        country: "UK",
        price: "0.05",
        supply: 800,
        minted: 300,
        organizer: "ETH Global",
        organizerAddress: "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
        image: "bg-gradient-to-br from-slate-700 to-slate-900",
        category: "Hackathon"
    },
    {
        id: "8",
        name: "DAO Governance Workshop",
        description: "Learn how to effectively participate in and manage Decentralized Autonomous Organizations. A hands-on workshop for community managers and contributors.",
        date: "Feb 28, 2026",
        time: "02:00 PM - 05:00 PM",
        location: "Colabs, Lahore",
        city: "Lahore",
        country: "Pakistan",
        price: "0.01",
        supply: 40,
        minted: 35,
        organizer: "DAO Pakistan",
        organizerAddress: "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955",
        image: "bg-gradient-to-br from-cyan-500 to-blue-600",
        category: "DAO"
    },
    {
        id: "9",
        name: "Metaverse Fashion Week",
        description: "Experience the latest in digital fashion. Top brands showcase their virtual collections in an immersive metaverse environment.",
        date: "Mar 20, 2026",
        time: "08:00 PM - 11:00 PM",
        location: "Virtual / Karachi",
        city: "Karachi",
        country: "Pakistan",
        price: "0.03",
        supply: 1000,
        minted: 150,
        organizer: "MetaStyle",
        organizerAddress: "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f",
        image: "bg-gradient-to-br from-fuchsia-500 to-purple-600",
        category: "NFTs"
    },
    {
        id: "10",
        name: "Blockchain Developer Bootcamp",
        description: "A 3-day intensive bootcamp to kickstart your career in blockchain development. Learn Solidity, React, and Web3 integration.",
        date: "Apr 10, 2026",
        time: "09:00 AM - 05:00 PM",
        location: "NIC, Islamabad",
        city: "Islamabad",
        country: "Pakistan",
        price: "0.08",
        supply: 60,
        minted: 55,
        organizer: "Devs Inc.",
        organizerAddress: "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720",
        image: "bg-gradient-to-br from-gray-800 to-black",
        category: "Workshop"
    },
    {
        id: "11",
        name: "Crypto Art Exhibition",
        description: "Showcasing the finest digital art from local and international artists. A unique opportunity to buy rare NFTs.",
        date: "May 20, 2026",
        time: "06:00 PM - 10:00 PM",
        location: "Alhamra Art Center, Lahore",
        city: "Lahore",
        country: "Pakistan",
        price: "0.025",
        supply: 150,
        minted: 40,
        organizer: "Digital Art Collective",
        organizerAddress: "0xArt...Collector",
        image: "bg-gradient-to-br from-yellow-400 to-orange-500",
        category: "Music & Arts"
    },
    {
        id: "12",
        name: "Web3 Security Workshop",
        description: "Learn best practices for smart contract security and how to audit your own code. Essential for every developer.",
        date: "Jun 15, 2026",
        time: "10:00 AM - 02:00 PM",
        location: "Online / Zoom",
        city: "Online",
        country: "Global",
        price: "0.05",
        supply: 100,
        minted: 89,
        organizer: "SecureChain",
        organizerAddress: "0xSecure...Dev",
        image: "bg-gradient-to-br from-red-600 to-red-900",
        category: "Workshop"
    },
    {
        id: "13",
        name: "Metaverse Gaming Tournament",
        description: "Compete in the biggest P2E gaming tournament of the year. Huge prize pool in ETH and exclusive NFTs.",
        date: "Jul 10, 2026",
        time: "04:00 PM - 12:00 AM",
        location: "Arena 51, Karachi",
        city: "Karachi",
        country: "Pakistan",
        price: "0.01",
        supply: 500,
        minted: 320,
        organizer: "GameFi Pro",
        organizerAddress: "0xGame...Fi",
        image: "bg-gradient-to-br from-violet-600 to-indigo-900",
        category: "Gaming"
    },
    {
        id: "14",
        name: "DeFi for Beginners",
        description: "An introductory seminar on Decentralized Finance. Learn about staking, yield farming, and liquidity pools.",
        date: "Aug 05, 2026",
        time: "03:00 PM - 06:00 PM",
        location: "TechHub, Peshawar",
        city: "Peshawar",
        country: "Pakistan",
        price: "0.005",
        supply: 80,
        minted: 15,
        organizer: "DeFi Edu",
        organizerAddress: "0xDeFi...Edu",
        image: "bg-gradient-to-br from-teal-400 to-teal-700",
        category: "DeFi"
    },
    {
        id: "15",
        name: "Global DAO Summit",
        description: "Connecting DAO contributors from around the world. Discuss governance, treasury management, and community building.",
        date: "Sep 12, 2026",
        time: "09:00 AM - 06:00 PM",
        location: "Convention Center, Islamabad",
        city: "Islamabad",
        country: "Pakistan",
        price: "0.1",
        supply: 400,
        minted: 120,
        organizer: "Global DAO Network",
        organizerAddress: "0xDAO...Global",
        image: "bg-gradient-to-br from-blue-400 to-cyan-300",
        category: "DAO"
    },
    {
        id: "16",
        name: "NFT Marketplace Launch Party",
        description: "Celebrate the launch of Pakistan's first NFT marketplace. Meet artists, collectors, and traders. Exclusive early access to premium collections.",
        date: "Oct 15, 2026",
        time: "07:00 PM - 11:00 PM",
        location: "Pearl Continental, Karachi",
        city: "Karachi",
        country: "Pakistan",
        price: "0.02",
        supply: 250,
        minted: 180,
        organizer: "NFT Pakistan",
        organizerAddress: "0xNFT...Market",
        image: "bg-gradient-to-br from-rose-500 to-pink-600",
        category: "NFTs"
    },
    {
        id: "17",
        name: "Blockchain for Social Good",
        description: "Exploring how blockchain can solve real-world problems in healthcare, education, and governance. Panel discussions with government officials.",
        date: "Nov 20, 2026",
        time: "10:00 AM - 04:00 PM",
        location: "Governor House, Lahore",
        city: "Lahore",
        country: "Pakistan",
        price: "0.0",
        supply: 300,
        minted: 85,
        organizer: "Blockchain Pakistan",
        organizerAddress: "0xBlockchain...Social",
        image: "bg-gradient-to-br from-green-600 to-teal-500",
        category: "Conference"
    },
    {
        id: "18",
        name: "Crypto Trading Masterclass",
        description: "Learn advanced trading strategies from professional traders. Technical analysis, risk management, and portfolio diversification.",
        date: "Dec 05, 2026",
        time: "02:00 PM - 06:00 PM",
        location: "Marriott Hotel, Islamabad",
        city: "Islamabad",
        country: "Pakistan",
        price: "0.06",
        supply: 100,
        minted: 92,
        organizer: "CryptoTraders PK",
        organizerAddress: "0xCrypto...Trader",
        image: "bg-gradient-to-br from-yellow-500 to-amber-600",
        category: "Workshop"
    },
    {
        id: "19",
        name: "Web3 Women Empowerment Summit",
        description: "Celebrating women leaders in blockchain and crypto. Inspiring talks, networking, and mentorship opportunities.",
        date: "Jan 08, 2027",
        time: "11:00 AM - 05:00 PM",
        location: "Serena Hotel, Islamabad",
        city: "Islamabad",
        country: "Pakistan",
        price: "0.0",
        supply: 200,
        minted: 145,
        organizer: "Women in Web3 Pakistan",
        organizerAddress: "0xWomen...Web3",
        image: "bg-gradient-to-br from-purple-400 to-pink-400",
        category: "Networking"
    },
    {
        id: "20",
        name: "Solana Speedrun Hackathon",
        description: "48-hour hackathon focused on building high-performance dApps on Solana. Mentorship from Solana Foundation.",
        date: "Feb 12, 2027",
        time: "09:00 AM - 06:00 PM",
        location: "Fast University, Karachi",
        city: "Karachi",
        country: "Pakistan",
        price: "0.015",
        supply: 150,
        minted: 78,
        organizer: "Solana Pakistan",
        organizerAddress: "0xSolana...Speed",
        image: "bg-gradient-to-br from-purple-600 to-indigo-700",
        category: "Hackathon"
    },
    {
        id: "21",
        name: "Metaverse Real Estate Expo",
        description: "Discover virtual land opportunities in top metaverse platforms. Learn about virtual property investment and development.",
        date: "Mar 18, 2027",
        time: "01:00 PM - 07:00 PM",
        location: "Expo Center, Lahore",
        city: "Lahore",
        country: "Pakistan",
        price: "0.04",
        supply: 400,
        minted: 210,
        organizer: "MetaLand Ventures",
        organizerAddress: "0xMeta...Land",
        image: "bg-gradient-to-br from-sky-400 to-blue-600",
        category: "NFTs"
    },
    {
        id: "22",
        name: "Smart Contract Security Audit Workshop",
        description: "Hands-on workshop on auditing smart contracts. Learn to identify vulnerabilities and write secure code.",
        date: "Apr 22, 2027",
        time: "10:00 AM - 05:00 PM",
        location: "PIEAS, Islamabad",
        city: "Islamabad",
        country: "Pakistan",
        price: "0.07",
        supply: 50,
        minted: 48,
        organizer: "SecureWeb3",
        organizerAddress: "0xSecure...Audit",
        image: "bg-gradient-to-br from-red-500 to-orange-600",
        category: "Workshop"
    },
    {
        id: "23",
        name: "Crypto Music Festival",
        description: "A fusion of music and blockchain. Live performances, NFT drops, and exclusive merchandise. Featuring top Pakistani artists.",
        date: "May 30, 2027",
        time: "06:00 PM - 02:00 AM",
        location: "Beach View Park, Karachi",
        city: "Karachi",
        country: "Pakistan",
        price: "0.035",
        supply: 2000,
        minted: 1250,
        organizer: "CryptoBeats",
        organizerAddress: "0xCrypto...Music",
        image: "bg-gradient-to-br from-orange-500 to-red-600",
        category: "Music & Arts"
    },
    {
        id: "24",
        name: "Layer 2 Scaling Solutions Conference",
        description: "Deep dive into Ethereum Layer 2 solutions. Optimism, Arbitrum, zkSync, and more. Technical talks and demos.",
        date: "Jun 25, 2027",
        time: "09:00 AM - 06:00 PM",
        location: "Tech Valley, Islamabad",
        city: "Islamabad",
        country: "Pakistan",
        price: "0.08",
        supply: 300,
        minted: 165,
        organizer: "L2 Pakistan",
        organizerAddress: "0xLayer2...Scale",
        image: "bg-gradient-to-br from-indigo-600 to-purple-700",
        category: "Conference"
    },
    {
        id: "25",
        name: "Youth Web3 Bootcamp",
        description: "Free bootcamp for students aged 16-25. Learn blockchain basics, build your first dApp, and get certified.",
        date: "Jul 15, 2027",
        time: "09:00 AM - 05:00 PM",
        location: "University of Lahore",
        city: "Lahore",
        country: "Pakistan",
        price: "0.0",
        supply: 500,
        minted: 320,
        organizer: "Web3 Youth Pakistan",
        organizerAddress: "0xYouth...Web3",
        image: "bg-gradient-to-br from-lime-400 to-green-600",
        category: "Workshop"
    }
];

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedEvents() {
    console.log("🌱 Starting to seed Firebase with events...\n");

    try {
        // Check existing events
        const eventsSnapshot = await getDocs(collection(db, "events"));
        console.log(`📊 Found ${eventsSnapshot.size} existing events in database\n`);

        // Seed all events
        let successCount = 0;
        let errorCount = 0;

        console.log("Adding events to Firebase:\n");
        for (const event of EVENTS_DATA) {
            try {
                await setDoc(doc(db, "events", event.id), event);
                console.log(`✅ ${event.id.padEnd(3)} | ${event.name}`);
                successCount++;
            } catch (error) {
                console.error(`❌ ${event.id.padEnd(3)} | Failed: ${error.message}`);
                errorCount++;
            }
        }

        console.log("\n" + "=".repeat(60));
        console.log("📈 SEEDING SUMMARY");
        console.log("=".repeat(60));
        console.log(`✅ Successfully added: ${successCount} events`);
        console.log(`❌ Failed: ${errorCount} events`);
        console.log("=".repeat(60));

        // Verify
        const finalSnapshot = await getDocs(collection(db, "events"));
        console.log(`\n🔍 Verification: ${finalSnapshot.size} events now in Firebase database`);

        console.log("\n🎉 Seeding completed successfully!");
        console.log("\n💡 Your ChainTicket+ app now has all 25 events in Firebase!");

        process.exit(0);
    } catch (error) {
        console.error("\n❌ Error during seeding:", error);
        process.exit(1);
    }
}

// Run the seeding
seedEvents();
