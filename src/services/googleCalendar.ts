
// Configurações do Google Calendar API
const GOOGLE_API_KEY = 'AIzaSyBq_pcu_fh2r9gN0M5SIP-ArAoqubAZiPs';
const GOOGLE_CLIENT_ID = '503049618761-52qk8affiuq7jhtem3nb6hskug3plk.apps.googleusercontent.com';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar';

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
  initializeAuth: () => Promise<void>;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  isSignedIn: () => boolean;
  listEvents: (date: string, employeeEmail?: string) => Promise<CalendarEvent[]>;
  createEvent: (event: {
    summary: string;
    description: string;
    start: string;
    end: string;
    attendeeEmail?: string;
  }) => Promise<CalendarEvent | null>;
}

let gapi: any;
let tokenClient: any;

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

// Carregar Google Identity Services
const loadGoogleIdentity = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (window.google) {
      resolve(window.google);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = () => {
      console.log('Google Identity Services carregado');
      resolve(window.google);
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// Inicializar Google Calendar API com OAuth2
const initializeAuth = async (): Promise<void> => {
  try {
    console.log('Inicializando Google Calendar API com OAuth2...');
    
    // Carregar Google API
    gapi = await loadGoogleAPI();
    
    // Carregar Google Identity Services
    await loadGoogleIdentity();
    
    // Inicializar cliente da API
    await gapi.client.init({
      apiKey: GOOGLE_API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });
    
    // Inicializar cliente de token OAuth2
    tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: SCOPES,
      callback: (response: any) => {
        console.log('Token OAuth2 recebido:', response);
      },
    });
    
    console.log('Google Calendar API inicializada com sucesso');
  } catch (error) {
    console.error('Erro ao inicializar Google Calendar API:', error);
    throw error;
  }
};

// Fazer login com Google
const signIn = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      tokenClient.callback = (response: any) => {
        if (response.error) {
          reject(response);
          return;
        }
        console.log('Login realizado com sucesso');
        resolve();
      };
      
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      reject(error);
    }
  });
};

// Fazer logout
const signOut = async (): Promise<void> => {
  const token = gapi.client.getToken();
  if (token) {
    window.google.accounts.oauth2.revoke(token.access_token, () => {
      gapi.client.setToken('');
    });
  }
};

// Verificar se está logado
const isSignedIn = (): boolean => {
  const token = gapi?.client?.getToken();
  return !!(token && token.access_token);
};

// Listar eventos do calendário para uma data específica
const listEvents = async (date: string, employeeEmail?: string): Promise<CalendarEvent[]> => {
  try {
    if (!isSignedIn()) {
      console.log('Usuário não autenticado - não é possível buscar eventos');
      return [];
    }

    const startOfDay = new Date(date + 'T00:00:00');
    const endOfDay = new Date(date + 'T23:59:59');

    console.log('Buscando eventos do Google Calendar para:', date);
    
    const response = await gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.result.items || [];
    console.log('Eventos encontrados:', events.length);
    
    return events.map((event: any) => ({
      id: event.id,
      summary: event.summary || 'Sem título',
      start: {
        dateTime: event.start.dateTime || event.start.date,
        date: event.start.date
      },
      end: {
        dateTime: event.end.dateTime || event.end.date,
        date: event.end.date
      },
      attendees: event.attendees || []
    }));
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
    if (!isSignedIn()) {
      console.log('Usuário não autenticado - não é possível criar evento');
      return null;
    }

    console.log('Criando evento no Google Calendar:', eventData);
    
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
      attendees: eventData.attendeeEmail ? [{ email: eventData.attendeeEmail }] : [],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 },
        ],
      },
    };

    const response = await gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });

    console.log('Evento criado com sucesso:', response.result);
    
    return {
      id: response.result.id,
      summary: response.result.summary,
      start: response.result.start,
      end: response.result.end,
      attendees: response.result.attendees || []
    };
  } catch (error) {
    console.error('Erro ao criar evento no Google Calendar:', error);
    return null;
  }
};

export const googleCalendarService: GoogleCalendarService = {
  initializeAuth,
  signIn,
  signOut,
  isSignedIn,
  listEvents,
  createEvent,
};

export { initializeAuth as initializeGoogleCalendar };
