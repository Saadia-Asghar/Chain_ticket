import { initializeApp } from "firebase/app";
import { getFirestore, collection, setDoc, doc, getDocs } from "firebase/firestore";
import { EVENTS_DATA } from "../src/data/mockData";

const firebaseConfig = {
    apiKey: "AIzaSyAsrI22hKv1GlT156l8IEmDPjnQGiumaHE",
    authDomain: "chainticket-5ef44.firebaseapp.com",
    projectId: "chainticket-5ef44",
    storageBucket: "chainticket-5ef44.firebasestorage.app",
    messagingSenderId: "241741545704",
    appId: "1:241741545704:web:8ca65e8e35f2d2aeaa895d",
    measurementId: "G-FHLXE2PBX1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedEvents() {
    console.log("🌱 Starting to seed Firebase with events...");

    try {
        // Check existing events
        const eventsSnapshot = await getDocs(collection(db, "events"));
        console.log(`📊 Found ${eventsSnapshot.size} existing events`);

        // Seed all events
        let successCount = 0;
        let errorCount = 0;

        for (const event of EVENTS_DATA) {
            try {
                await setDoc(doc(db, "events", event.id), event);
                console.log(`✅ Added event: ${event.name} (ID: ${event.id})`);
                successCount++;
            } catch (error) {
                console.error(`❌ Failed to add event ${event.id}:`, error);
                errorCount++;
            }
        }

        console.log("\n📈 Seeding Summary:");
        console.log(`✅ Successfully added: ${successCount} events`);
        console.log(`❌ Failed: ${errorCount} events`);
        console.log(`📊 Total events in database: ${successCount}`);

        // Verify
        const finalSnapshot = await getDocs(collection(db, "events"));
        console.log(`\n🔍 Verification: ${finalSnapshot.size} events now in Firebase`);

        console.log("\n🎉 Seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error during seeding:", error);
        process.exit(1);
    }
}

// Run the seeding
seedEvents();
