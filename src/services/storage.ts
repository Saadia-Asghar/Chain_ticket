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

        // Filter duplicates strictly
        return allEvents.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);

    } catch (error) {
        console.warn("Using fallback data (Firebase error):", error);
        if (typeof window !== 'undefined') {
            const localEvents = JSON.parse(localStorage.getItem('local_events') || '[]');
            return [...EVENTS_DATA, ...localEvents].filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);
        }
        return EVENTS_DATA;
    }
};

export const getEventById = async (id: string): Promise<Event | undefined> => {
    // 0. Check Mock Data FIRST (Fastest and relies on static data)
    const mockEvent = EVENTS_DATA.find(e => e.id === id);
    if (mockEvent) return mockEvent;

    // 1. Check Local Storage
    if (typeof window !== 'undefined') {
        const localEvents = JSON.parse(localStorage.getItem('local_events') || '[]');
        const localEvent = localEvents.find((e: Event) => e.id === id);
        if (localEvent) return localEvent;
    }

    try {
        // 2. Check Firebase
        const docRef = doc(db, "events", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Event;
        }

        return undefined;

    } catch (error) {
        console.error("Error fetching event from Firebase:", error);
        return undefined;
    }
};

export const saveEvent = async (event: Event) => {
    try {
        if (typeof window !== 'undefined') {
            const localEvents = JSON.parse(localStorage.getItem('local_events') || '[]');
            const filtered = localEvents.filter((e: Event) => e.id !== event.id);
            filtered.push(event);
            localStorage.setItem('local_events', JSON.stringify(filtered));

            window.dispatchEvent(new Event('eventsUpdated'));
        }

        if (event.id) {
            await setDoc(doc(db, "events", event.id), event);
        } else {
            await addDoc(collection(db, "events"), event);
        }
    } catch (error) {
        console.error("Error saving event:", error);
    }
};

export const updateEvent = async (updatedEvent: Event) => {
    try {
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
    } catch (error) {
        console.error("Error updating event:", error);
    }
};

export const getTickets = async (ownerAddress?: string): Promise<Ticket[]> => {
    if (!ownerAddress) return [];

    let tickets: Ticket[] = [];

    if (typeof window !== 'undefined') {
        const localTickets = JSON.parse(localStorage.getItem('local_tickets') || '[]');
        const userLocalTickets = localTickets.filter((t: Ticket) => t.ownerAddress.toLowerCase() === ownerAddress.toLowerCase());
        tickets = [...userLocalTickets];
    }

    try {
        const q = query(collection(db, "tickets"), where("ownerAddress", "==", ownerAddress));
        const querySnapshot = await getDocs(q);
        const firebaseTickets = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ticket));

        firebaseTickets.forEach(ft => {
            if (!tickets.find(t => t.id === ft.id)) {
                tickets.push(ft);
            }
        });

        return tickets;
    } catch (error) {
        console.error("Error fetching tickets:", error);
        return tickets;
    }
};

export const getTicketById = async (ticketId: string): Promise<Ticket | undefined> => {
    if (typeof window !== 'undefined') {
        const localTickets = JSON.parse(localStorage.getItem('local_tickets') || '[]');
        const localTicket = localTickets.find((t: Ticket) => t.id === ticketId);
        if (localTicket) return localTicket;
    }

    try {
        const q = query(collection(db, "tickets"), where("id", "==", ticketId));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as Ticket;
        }
        return undefined;
    } catch (error) {
        console.error("Error fetching ticket:", error);
        return undefined;
    }
};

export const updateTicket = async (updatedTicket: Ticket) => {
    try {
        if (typeof window !== 'undefined') {
            const localTickets = JSON.parse(localStorage.getItem('local_tickets') || '[]');
            const index = localTickets.findIndex((t: Ticket) => t.id === updatedTicket.id);
            if (index !== -1) {
                localTickets[index] = updatedTicket;
                localStorage.setItem('local_tickets', JSON.stringify(localTickets));
                window.dispatchEvent(new Event('ticketsUpdated'));
            }
        }

        // Find doc in Firebase
        const q = query(collection(db, "tickets"), where("id", "==", updatedTicket.id));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const docRef = querySnapshot.docs[0].ref;
            await updateDoc(docRef, { ...updatedTicket });
        }
    } catch (error) {
        console.error("Error updating ticket:", error);
    }
};

export const saveTicket = async (ticket: Ticket) => {
    try {
        if (typeof window !== 'undefined') {
            const localTickets = JSON.parse(localStorage.getItem('local_tickets') || '[]');
            localTickets.push(ticket);
            localStorage.setItem('local_tickets', JSON.stringify(localTickets));
            window.dispatchEvent(new Event('ticketsUpdated'));
        }

        await addDoc(collection(db, "tickets"), ticket);
    } catch (error) {
        console.error("Error saving ticket:", error);
    }
};

export const initializeEvents = async (initialEvents: Event[]) => {
    try {
        const querySnapshot = await getDocs(collection(db, "events"));
        if (querySnapshot.empty) {
            console.log("Seeding initial events...");
            for (const event of initialEvents) {
                await saveEvent(event);
            }
        }
    } catch (error) {
        console.warn("Could not initialize events in Firebase:", error);
    }
};
