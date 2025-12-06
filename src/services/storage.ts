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
        // Start with Mock Data and patch for Demo User
        const allEvents = JSON.parse(JSON.stringify(EVENTS_DATA));
        allEvents[0].organizerAddress = DEMO_ADDRESS;
        allEvents[1].organizerAddress = DEMO_ADDRESS;

        if (typeof window === 'undefined') {
            return allEvents;
        }

        const localEvents = JSON.parse(localStorage.getItem('local_events') || '[]');

        // Non-blocking Firebase Fetch (wait max 3s, else return local/mock)
        // Actually for READS we usually wait, but if "Creating" failed due to write hang, reads might be slow too.
        // We'll keep await here usually, but wrap in try/catch to use fallback.
        try {
            // We can use a timeout for this too if needed, but usually reads are faster.
            // For now, let's trust the try/catch around it.
            const querySnapshot = await getDocs(collection(db, "events"));
            const firebaseEvents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));

            firebaseEvents.forEach(fbEvent => {
                const index = allEvents.findIndex((e: Event) => e.id === fbEvent.id);
                if (index !== -1) allEvents[index] = fbEvent;
                else allEvents.push(fbEvent);
            });
        } catch (fbError) {
            console.warn("Firebase Read Error/Timeout, using fallback", fbError);
        }

        localEvents.forEach((localEvent: Event) => {
            const index = allEvents.findIndex((e: Event) => e.id === localEvent.id);
            if (index !== -1) allEvents[index] = localEvent;
            else allEvents.push(localEvent);
        });

        return allEvents.filter((v: Event, i: number, a: Event[]) => a.findIndex(t => (t.id === v.id)) === i);

    } catch (error) {
        console.warn("General Error in getEvents:", error);
        // Fallback
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
        }
        return patchedEvents;
    }
}

export async function getEventById(id: string): Promise<Event | undefined> {
    const mockEvents = JSON.parse(JSON.stringify(EVENTS_DATA));
    mockEvents[0].organizerAddress = DEMO_ADDRESS;
    mockEvents[1].organizerAddress = DEMO_ADDRESS;

    const mockEvent = mockEvents.find((e: Event) => e.id === id);
    if (mockEvent) return mockEvent;

    if (typeof window !== 'undefined') {
        const localEvents = JSON.parse(localStorage.getItem('local_events') || '[]');
        const localEvent = localEvents.find((e: Event) => e.id === id);
        if (localEvent) return localEvent;
    }

    try {
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

        // Non-blocking Firebase Write
        if (event.id) {
            setDoc(doc(db, "events", event.id), event).catch(e => console.error("BG Firebase Save Error:", e));
        } else {
            addDoc(collection(db, "events"), event).catch(e => console.error("BG Firebase Save Error:", e));
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
        updateDoc(eventRef, { ...updatedEvent }).catch(e => console.error("BG Firebase Update Error:", e));
    } catch (error) {
        console.error("Error updating event:", error);
    }
}

export async function getTickets(ownerAddress?: string): Promise<Ticket[]> {
    if (!ownerAddress) return [];

    if (ownerAddress === DEMO_ADDRESS) {
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
            isUsed: i === 1
        }));

        if (typeof window !== 'undefined') {
            const storedDemoTickets = localStorage.getItem('demo_tickets_initialized');
            if (!storedDemoTickets) {
                const currentLocal = JSON.parse(localStorage.getItem('local_tickets') || '[]');
                // Check if demo tickets are already in local (to avoid dupes on re-init)
                const newDemo = demoTickets.filter(dt => !currentLocal.find((ct: Ticket) => ct.id === dt.id));
                const newLocal = [...currentLocal, ...newDemo];
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
        // We await read here, as we need to show tickets. If it hangs, the UI loader spins.
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
                localTickets.push(updatedTicket);
            }
            localStorage.setItem('local_tickets', JSON.stringify(localTickets));
            window.dispatchEvent(new Event('ticketsUpdated'));
        }

        // Non-blocking Firebase update
        const q = query(collection(db, "tickets"), where("id", "==", updatedTicket.id));
        getDocs(q).then(snapshot => {
            if (!snapshot.empty) {
                const docRef = snapshot.docs[0].ref;
                updateDoc(docRef, { ...updatedTicket });
            }
        }).catch(e => console.error("BG Ticket Update Error:", e));

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

        addDoc(collection(db, "tickets"), ticket).catch(e => console.error("BG Ticket Save Error:", e));
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
                saveEvent(event); // uses non-blocking firebase write now
            }
        }
    } catch (error) {
        console.warn("Could not initialize events in Firebase:", error);
    }
}
