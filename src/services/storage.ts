export interface Event {
    id: string;
    name: string;
    description: string;
    date: string;
    time: string;
    location: string;
    city: string;
    country: string;
    price: string;
    supply: number;
    minted: number;
    organizer: string;
    organizerAddress: string;
    image: string;
    category: string;
}

export interface Ticket {
    id: string;
    eventId: string;
    eventName: string;
    eventDate: string;
    eventLocation: string;
    eventImage: string;
    qrData: string;
    ownerAddress: string;
    isUsed: boolean;
}

import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where, updateDoc, doc, setDoc, getDoc } from "firebase/firestore";

export interface Event {
    id: string;
    name: string;
    description: string;
    date: string;
    time: string;
    location: string;
    city: string;
    country: string;
    price: string;
    supply: number;
    minted: number;
    organizer: string;
    organizerAddress: string;
    image: string;
    category: string;
}

export interface Ticket {
    id: string;
    eventId: string;
    eventName: string;
    eventDate: string;
    eventLocation: string;
    eventImage: string;
    qrData: string;
    ownerAddress: string;
    isUsed: boolean;
}

export const getEvents = async (): Promise<Event[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, "events"));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
    } catch (error) {
        console.error("Error fetching events from Firebase:", error);
        return [];
    }
};

export const getEventById = async (id: string): Promise<Event | undefined> => {
    try {
        const docRef = doc(db, "events", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Event;
        } else {
            return undefined;
        }
    } catch (error) {
        console.error("Error fetching event from Firebase:", error);
        return undefined;
    }
};

export const saveEvent = async (event: Event) => {
    try {
        // Use setDoc with the event ID to ensure we can easily reference it, or addDoc for auto-ID
        // Here we use the event.id as the document ID if it exists, otherwise addDoc
        if (event.id) {
            await setDoc(doc(db, "events", event.id), event);
        } else {
            await addDoc(collection(db, "events"), event);
        }
        console.log("Event saved to Firebase:", event);
    } catch (error) {
        console.error("Error saving event to Firebase:", error);
    }
};

export const updateEvent = async (updatedEvent: Event) => {
    try {
        const eventRef = doc(db, "events", updatedEvent.id);
        await updateDoc(eventRef, { ...updatedEvent });
        console.log("Event updated in Firebase:", updatedEvent);
    } catch (error) {
        console.error("Error updating event in Firebase:", error);
    }
};

export const getTickets = async (ownerAddress?: string): Promise<Ticket[]> => {
    try {
        let q;
        if (ownerAddress) {
            q = query(collection(db, "tickets"), where("ownerAddress", "==", ownerAddress));
        } else {
            q = collection(db, "tickets");
        }
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ticket));
    } catch (error) {
        console.error("Error fetching tickets from Firebase:", error);
        return [];
    }
};

export const saveTicket = async (ticket: Ticket) => {
    try {
        await addDoc(collection(db, "tickets"), ticket);
        console.log("Ticket saved to Firebase:", ticket);
    } catch (error) {
        console.error("Error saving ticket to Firebase:", error);
    }
};

export const initializeEvents = async (initialEvents: Event[]) => {
    // Check if events exist, if not, seed them
    const existingEvents = await getEvents();
    if (existingEvents.length === 0) {
        console.log("Seeding initial events to Firebase...");
        for (const event of initialEvents) {
            await saveEvent(event);
        }
    }
};
