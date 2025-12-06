import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where, updateDoc, doc, setDoc, getDoc } from "firebase/firestore";
import { EVENTS_DATA } from "@/data/mockData";

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
        // Check if we're in a browser environment
        if (typeof window === 'undefined') {
            return EVENTS_DATA; // Server-side fallback
        }

        // Fetch from Firebase
        const querySnapshot = await getDocs(collection(db, "events"));
        const firebaseEvents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));

        // Get local events
        const localEvents = JSON.parse(localStorage.getItem('local_events') || '[]');

        // Start with Mock Data
        const allEvents = [...EVENTS_DATA];

        // Merge Firebase Events (override mock if same ID)
        firebaseEvents.forEach(fbEvent => {
            const index = allEvents.findIndex(e => e.id === fbEvent.id);
            if (index !== -1) {
                allEvents[index] = fbEvent;
            } else {
                allEvents.push(fbEvent);
            }
        });

        // Merge Local Storage Events (override all if same ID)
        localEvents.forEach((localEvent: Event) => {
            const index = allEvents.findIndex(e => e.id === localEvent.id);
            if (index !== -1) {
                allEvents[index] = localEvent;
            } else {
                allEvents.push(localEvent);
            }
        });

        return allEvents;
    } catch (error) {
        console.warn("Firebase not available, using fallback data:", error);
        // Fallback to local storage + mock data
        if (typeof window !== 'undefined') {
            const localEvents = JSON.parse(localStorage.getItem('local_events') || '[]');
            return [...EVENTS_DATA, ...localEvents].filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);
        }
        return EVENTS_DATA;
    }
};

export const getEventById = async (id: string): Promise<Event | undefined> => {
    // 1. Check Local Storage first (fastest and contains user-created events)
    if (typeof window !== 'undefined') {
        const localEvents = JSON.parse(localStorage.getItem('local_events') || '[]');
        const localEvent = localEvents.find((e: Event) => e.id === id);
        if (localEvent) return localEvent;
    }

    // 2. Check Mock Data
    const mockEvent = EVENTS_DATA.find(e => e.id === id);

    try {
        // 3. Check Firebase
        const docRef = doc(db, "events", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Event;
        }

        // If not in Firebase, return standard mock event if found
        return mockEvent;

    } catch (error) {
        console.error("Error fetching event from Firebase:", error);
        // Fallback to mock data if Firebase fails
        return mockEvent;
    }
};

export const saveEvent = async (event: Event) => {
    try {
        // Save to Local Storage first for instant update
        if (typeof window !== 'undefined') {
            const localEvents = JSON.parse(localStorage.getItem('local_events') || '[]');
            // Remove existing if updating
            const filtered = localEvents.filter((e: Event) => e.id !== event.id);
            filtered.push(event);
            localStorage.setItem('local_events', JSON.stringify(filtered));

            // Dispatch a custom event to notify listeners (like the Events page)
            window.dispatchEvent(new Event('eventsUpdated'));
        }

        // Use setDoc with the event ID to ensure we can easily reference it, or addDoc for auto-ID
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
        // Update Local Storage
        if (typeof window !== 'undefined') {
            const localEvents = JSON.parse(localStorage.getItem('local_events') || '[]');
            const index = localEvents.findIndex((e: Event) => e.id === updatedEvent.id);
            if (index !== -1) {
                localEvents[index] = updatedEvent;
                localStorage.setItem('local_events', JSON.stringify(localEvents));
                window.dispatchEvent(new Event('eventsUpdated'));
            }
        }

        const eventRef = doc(db, "events", updatedEvent.id);
        await updateDoc(eventRef, { ...updatedEvent });
        console.log("Event updated in Firebase:", updatedEvent);
    } catch (error) {
        console.error("Error updating event in Firebase:", error);
    }
};

export const getTickets = async (ownerAddress?: string): Promise<Ticket[]> => {
    if (!ownerAddress) return [];

    let tickets: Ticket[] = [];

    // 1. Get from Local Storage
    if (typeof window !== 'undefined') {
        const localTickets = JSON.parse(localStorage.getItem('local_tickets') || '[]');
        const userLocalTickets = localTickets.filter((t: Ticket) => t.ownerAddress.toLowerCase() === ownerAddress.toLowerCase());
        tickets = [...userLocalTickets];
    }

    try {
        // 2. Get from Firebase
        const q = query(collection(db, "tickets"), where("ownerAddress", "==", ownerAddress));
        const querySnapshot = await getDocs(q);
        const firebaseTickets = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ticket));

        // Merge (prefer Firebase if ID collision, though unlikely with timestamps)
        firebaseTickets.forEach(ft => {
            if (!tickets.find(t => t.id === ft.id)) {
                tickets.push(ft);
            }
        });

        return tickets;
    } catch (error) {
        console.error("Error fetching tickets from Firebase:", error);
        return tickets; // Return at least local tickets
    }
};

export const getTicketById = async (ticketId: string): Promise<Ticket | undefined> => {
    // 1. Check Local Storage
    if (typeof window !== 'undefined') {
        const localTickets = JSON.parse(localStorage.getItem('local_tickets') || '[]');
        const localTicket = localTickets.find((t: Ticket) => t.id === ticketId);
        if (localTicket) return localTicket;
    }

    try {
        // 2. Check Firebase
        const q = query(collection(db, "tickets"), where("id", "==", ticketId));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as Ticket;
        }
        return undefined;
    } catch (error) {
        console.error("Error fetching ticket from Firebase:", error);
        return undefined;
    }
};

export const updateTicket = async (updatedTicket: Ticket) => {
    try {
        // Update Local Storage
        if (typeof window !== 'undefined') {
            const localTickets = JSON.parse(localStorage.getItem('local_tickets') || '[]');
            const index = localTickets.findIndex((t: Ticket) => t.id === updatedTicket.id);
            if (index !== -1) {
                localTickets[index] = updatedTicket;
                localStorage.setItem('local_tickets', JSON.stringify(localTickets));
                window.dispatchEvent(new Event('ticketsUpdated'));
            }
        }

        // Update Firebase
        const q = query(collection(db, "tickets"), where("id", "==", updatedTicket.id));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const docRef = querySnapshot.docs[0].ref;
            await updateDoc(docRef, { ...updatedTicket });
            console.log("Ticket updated in Firebase:", updatedTicket);
        }
    } catch (error) {
        console.error("Error updating ticket in Firebase:", error);
    }
};

export const saveTicket = async (ticket: Ticket) => {
    try {
        // Save to Local Storage first for instant update
        if (typeof window !== 'undefined') {
            const localTickets = JSON.parse(localStorage.getItem('local_tickets') || '[]');
            localTickets.push(ticket);
            localStorage.setItem('local_tickets', JSON.stringify(localTickets));

            // Dispatch a custom event to notify listeners
            window.dispatchEvent(new Event('ticketsUpdated'));
        }

        await addDoc(collection(db, "tickets"), ticket);
        console.log("Ticket saved to Firebase:", ticket);
    } catch (error) {
        console.error("Error saving ticket to Firebase:", error);
    }
};

export const initializeEvents = async (initialEvents: Event[]) => {
    try {
        // Check if events exist, if not, seed them
        const existingEvents = await getEvents();
        const querySnapshot = await getDocs(collection(db, "events"));
        if (querySnapshot.empty) {
            console.log("Seeding initial events to Firebase...");
            for (const event of initialEvents) {
                await saveEvent(event);
            }
        }
    } catch (error) {
        console.warn("Could not initialize events in Firebase, using local data:", error);
    }
};
