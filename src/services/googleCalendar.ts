
// Configurações do Google Calendar API
const CALENDAR_ID = 'primary'; // Use o ID do calendário do salão
const API_KEY = ''; // Será configurado pelo usuário

interface CalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime: string;
    date?: string;
  };
  end: {
    dateTime: string;
    date?: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
  }>;
}

interface GoogleCalendarService {
  listEvents: (date: string, employeeEmail?: string) => Promise<CalendarEvent[]>;
  createEvent: (event: {
    summary: string;
    description: string;
    start: string;
    end: string;
    attendeeEmail?: string;
  }) => Promise<CalendarEvent>;
}

// Função para carregar a API do Google
const loadGoogleAPI = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (window.gapi) {
      resolve(window.gapi);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      window.gapi.load('client', () => {
        resolve(window.gapi);
      });
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// Inicializar Google Calendar API
const initializeGoogleCalendar = async (apiKey: string): Promise<void> => {
  const gapi = await loadGoogleAPI();
  
  await gapi.client.init({
    apiKey: apiKey,
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
  });
};

// Listar eventos do calendário para uma data específica
const listEvents = async (date: string, employeeEmail?: string): Promise<CalendarEvent[]> => {
  try {
    const apiKey = localStorage.getItem('google-calendar-api-key');
    if (!apiKey) {
      console.log('Google Calendar API key not configured');
      return [];
    }

    await initializeGoogleCalendar(apiKey);

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const response = await window.gapi.client.calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    let events = response.result.items || [];

    // Filtrar por funcionário se especificado
    if (employeeEmail) {
      events = events.filter((event: CalendarEvent) => 
        event.attendees?.some(attendee => attendee.email === employeeEmail) ||
        event.summary?.toLowerCase().includes(employeeEmail.toLowerCase())
      );
    }

    return events;
  } catch (error) {
    console.error('Error fetching Google Calendar events:', error);
    return [];
  }
};

// Criar evento no calendário
const createEvent = async (eventData: {
  summary: string;
  description: string;
  start: string;
  end: string;
  attendeeEmail?: string;
}): Promise<CalendarEvent | null> => {
  try {
    const apiKey = localStorage.getItem('google-calendar-api-key');
    if (!apiKey) {
      console.log('Google Calendar API key not configured');
      return null;
    }

    await initializeGoogleCalendar(apiKey);

    const event = {
      summary: eventData.summary,
      description: eventData.description,
      start: {
        dateTime: eventData.start,
        timeZone: 'America/Sao_Paulo',
      },
      end: {
        dateTime: eventData.end,
        timeZone: 'America/Sao_Paulo',
      },
      attendees: eventData.attendeeEmail ? [
        { email: eventData.attendeeEmail }
      ] : [],
    };

    const response = await window.gapi.client.calendar.events.insert({
      calendarId: CALENDAR_ID,
      resource: event,
    });

    return response.result;
  } catch (error) {
    console.error('Error creating Google Calendar event:', error);
    return null;
  }
};

export const googleCalendarService: GoogleCalendarService = {
  listEvents,
  createEvent,
};

export { initializeGoogleCalendar };
