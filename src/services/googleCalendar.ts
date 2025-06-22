
// Configurações do Google Calendar API
const CALENDAR_ID = 'primary'; // Use o ID do calendário do salão
const GOOGLE_API_KEY = 'AIzaSyBq_pcu_fh2r9gN0M5SIP-ArAoqubAZiPs'; // Sua chave da API

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
  }) => Promise<CalendarEvent | null>;
}

// Função para carregar a API do Google
const loadGoogleAPI = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (window.gapi) {
      console.log('Google API já carregada');
      resolve(window.gapi);
      return;
    }

    console.log('Carregando Google API...');
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      console.log('Script do Google API carregado');
      window.gapi.load('client', () => {
        console.log('Cliente Google API inicializado');
        resolve(window.gapi);
      });
    };
    script.onerror = (error) => {
      console.error('Erro ao carregar script do Google API:', error);
      reject(error);
    };
    document.head.appendChild(script);
  });
};

// Inicializar Google Calendar API com chave fixa
const initializeGoogleCalendar = async (): Promise<void> => {
  try {
    console.log('Inicializando Google Calendar API com chave fixa...');
    const gapi = await loadGoogleAPI();
    
    await gapi.client.init({
      apiKey: GOOGLE_API_KEY,
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
    });
    
    console.log('Google Calendar API inicializada com sucesso');
  } catch (error) {
    console.error('Erro ao inicializar Google Calendar API:', error);
    throw error;
  }
};

// Listar eventos do calendário para uma data específica
const listEvents = async (date: string, employeeEmail?: string): Promise<CalendarEvent[]> => {
  try {
    console.log('Buscando eventos do Google Calendar para:', date);
    await initializeGoogleCalendar();

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    console.log('Fazendo requisição para Google Calendar...');
    const response = await window.gapi.client.calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    console.log('Resposta do Google Calendar:', response);
    let events = response.result.items || [];

    // Filtrar por funcionário se especificado
    if (employeeEmail) {
      console.log('Filtrando eventos por funcionário:', employeeEmail);
      events = events.filter((event: any) => 
        event.attendees?.some((attendee: any) => attendee.email === employeeEmail) ||
        event.summary?.toLowerCase().includes(employeeEmail.toLowerCase())
      );
    }

    // Converter para o formato esperado
    const calendarEvents: CalendarEvent[] = events.map((event: any) => ({
      id: event.id,
      summary: event.summary || '',
      start: {
        dateTime: event.start.dateTime || event.start.date || '',
        date: event.start.date
      },
      end: {
        dateTime: event.end.dateTime || event.end.date || '',
        date: event.end.date
      },
      attendees: event.attendees || []
    }));

    console.log('Eventos processados:', calendarEvents);
    return calendarEvents;
  } catch (error) {
    console.error('Erro ao buscar eventos do Google Calendar:', error);
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
    console.log('Criando evento no Google Calendar:', eventData);
    await initializeGoogleCalendar();

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

    console.log('Dados do evento para criar:', event);
    const response = await window.gapi.client.calendar.events.insert({
      calendarId: CALENDAR_ID,
      resource: event,
    });

    console.log('Evento criado com sucesso:', response);
    return {
      id: response.result.id,
      summary: response.result.summary || '',
      start: {
        dateTime: response.result.start.dateTime || response.result.start.date || '',
        date: response.result.start.date
      },
      end: {
        dateTime: response.result.end.dateTime || response.result.end.date || '',
        date: response.result.end.date
      },
      attendees: response.result.attendees || []
    };
  } catch (error) {
    console.error('Erro ao criar evento no Google Calendar:', error);
    return null;
  }
};

export const googleCalendarService: GoogleCalendarService = {
  listEvents,
  createEvent,
};

export { initializeGoogleCalendar };
