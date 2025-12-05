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

const EVENTS_KEY = "chainticket_events";
const TICKETS_KEY = "chainticket_tickets";

export const getEvents = (): Event[] => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(EVENTS_KEY);
    return stored ? JSON.parse(stored) : [];
};

export const saveEvent = (event: Event) => {
    const events = getEvents();
    events.push(event);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
};

export const updateEvent = (updatedEvent: Event) => {
    const events = getEvents();
    const index = events.findIndex(e => e.id === updatedEvent.id);
    if (index !== -1) {
        events[index] = updatedEvent;
        localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
    }
};

export const getTickets = (ownerAddress?: string): Ticket[] => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(TICKETS_KEY);
    const tickets: Ticket[] = stored ? JSON.parse(stored) : [];
    if (ownerAddress) {
        return tickets.filter(t => t.ownerAddress.toLowerCase() === ownerAddress.toLowerCase());
    }
    return tickets;
};

export const saveTicket = (ticket: Ticket) => {
    const tickets = getTickets();
    tickets.push(ticket);
    localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
};

export const initializeEvents = (initialEvents: Event[]) => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(EVENTS_KEY);
    if (!stored) {
        localStorage.setItem(EVENTS_KEY, JSON.stringify(initialEvents));
    }
};
