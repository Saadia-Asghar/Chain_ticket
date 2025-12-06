import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where, updateDoc, doc, setDoc, getDoc } from "firebase/firestore";
import { EVENTS_DATA } from "@/data/mockData";

export const DEMO_ADDRESS = "0x1111111111111111111111111111111111111111";

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

export async function getEvents(): Promise<Event[]> {
    try {
        // Start with Mock Data
        // Patch Mock Data to assign events to Demo User
        const allEvents = JSON.parse(JSON.stringify(EVENTS_DATA)); // Deep copy to avoid mutation issues
        allEvents[0].organizerAddress = DEMO_ADDRESS;
        allEvents[1].organizerAddress = DEMO_ADDRESS;

        // Check if we're in a browser environment
        if (typeof window === 'undefined') {
            return allEvents;
        }

        // Fetch from Firebase
        const querySnapshot = await getDocs(collection(db, "events"));
        const firebaseEvents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));

        // Get local events
        const localEvents = JSON.parse(localStorage.getItem('local_events') || '[]');

        // Merge Firebase Events (override mock if same ID)
        firebaseEvents.forEach(fbEvent => {
            const index = allEvents.findIndex((e: Event) => e.id === fbEvent.id);
            if (index !== -1) {
                allEvents[index] = fbEvent;
            } else {
                allEvents.push(fbEvent);
            }
        });

        // Merge Local Storage Events (override all if same ID)
        localEvents.forEach((localEvent: Event) => {
            const index = allEvents.findIndex((e: Event) => e.id === localEvent.id);
            if (index !== -1) {
                allEvents[index] = localEvent;
            } else {
                allEvents.push(localEvent);
            }
        });

        // Filter duplicates strictly
        return allEvents.filter((v: Event, i: number, a: Event[]) => a.findIndex(t => (t.id === v.id)) === i);

    } catch (error) {
        console.warn("Using fallback data (Firebase error):", error);
        // Fallback with patched mock data
        const patchedEvents = JSON.parse(JSON.stringify(EVENTS_DATA));
        patchedEvents[0].organizerAddress = DEMO_ADDRESS;
        patchedEvents[1].organizerAddress = DEMO_ADDRESS;

        if (typeof window !== 'undefined') {
            const localEvents = JSON.parse(localStorage.getItem('local_events') || '[]');
            localEvents.forEach((localEvent: Event) => {
                const index = patchedEvents.findIndex((e: Event) => e.id === localEvent.id);
                if (index !== -1) patchedEvents[index] = localEvent;
                else patchedEvents.push(localEvent);
            });
            return patchedEvents;
        }
        return patchedEvents;
    }
}

export async function getEventById(id: string): Promise<Event | undefined> {
    // 0. Check Mock Data FIRST
    const mockEvents = JSON.parse(JSON.stringify(EVENTS_DATA));
    mockEvents[0].organizerAddress = DEMO_ADDRESS;
    mockEvents[1].organizerAddress = DEMO_ADDRESS;

    const mockEvent = mockEvents.find((e: Event) => e.id === id);
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
}

export async function saveEvent(event: Event) {
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
}

export async function updateEvent(updatedEvent: Event) {
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
}

export async function getTickets(ownerAddress?: string): Promise<Ticket[]> {
    if (!ownerAddress) return [];

    // DEMO USER TICKETS
    if (ownerAddress === DEMO_ADDRESS) {
        // Return 3 mock tickets
        const events = EVENTS_DATA.slice(0, 3);
        const demoTickets = events.map((event, i) => ({
            id: `demo-ticket-${i + 1}`,
            eventId: event.id,
            eventName: event.name,
            eventDate: event.date,
            eventLocation: event.location,
            eventImage: event.image,
            qrData: `CTP-${event.id}-demo-${i + 1}`,
            ownerAddress: DEMO_ADDRESS,
            isUsed: i === 1 // Make 2nd ticket 'Used' for testing
        }));

        // Merge with any local modifications for Demo User (e.g. transfers)
        if (typeof window !== 'undefined') {
            const localTickets = JSON.parse(localStorage.getItem('local_tickets') || '[]');
            // If local storage has tickets, prioritize them or merge?
            // Simple logic: if specific ticket ID exists locally, use it (it might be transferred out)
            // But if transferred OUT, it won't be in 'localTickets' filtered by owner.

            // Actually, let's just use local tickets if they exist, else return default demo tickets.
            // But wait, if I transfer a ticket away, I want it GONE.
            // If I haven't touched them, I want them there.

            // Allow "Mock" tickets to be "virtual".
            // If I transfer a mock ticket, I should save the "new state" in local storage.
            // Complex. For now, Demo Tickets are returned STATICALLY unless we implement intricate "Mock State".
            // Let's keep it simple: Demo Tickets are always there for testing, unless overridden locally?

            // To support transfer: checking if this ticket ID is in `local_tickets` with DIFFERENT owner?
            // This is getting complicated for a simple demo. 
            // I'll just return static tickets. Transfers might "look" like they work but on refresh they might come back if I don't persist them locally.
            // I'll persist them locally on first load?

            // Better:
            const storedDemoTickets = localStorage.getItem('demo_tickets_initialized');
            if (!storedDemoTickets) {
                // Initialize demo tickets in local storage
                const currentLocal = JSON.parse(localStorage.getItem('local_tickets') || '[]');
                const newLocal = [...currentLocal, ...demoTickets];
                localStorage.setItem('local_tickets', JSON.stringify(newLocal));
                localStorage.setItem('demo_tickets_initialized', 'true');
                return demoTickets;
            }
        }
    }

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
}

export async function getTicketById(ticketId: string): Promise<Ticket | undefined> {
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
}

export async function updateTicket(updatedTicket: Ticket) {
    try {
        if (typeof window !== 'undefined') {
            const localTickets = JSON.parse(localStorage.getItem('local_tickets') || '[]');
            const index = localTickets.findIndex((t: Ticket) => t.id === updatedTicket.id);
            if (index !== -1) {
                localTickets[index] = updatedTicket;
            } else {
                // If not found (maybe it was a virtual mock ticket being updated/transferred), add it
                localTickets.push(updatedTicket);
            }
            localStorage.setItem('local_tickets', JSON.stringify(localTickets));
            window.dispatchEvent(new Event('ticketsUpdated'));
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
}

export async function saveTicket(ticket: Ticket) {
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
}

export async function initializeEvents(initialEvents: Event[]) {
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
}
