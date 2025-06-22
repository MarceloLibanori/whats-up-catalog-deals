
// Configurações do Google Calendar API
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
// NOTA: Com API key, só conseguimos acessar calendários públicos
const listEvents = async (date: string, employeeEmail?: string): Promise<CalendarEvent[]> => {
  try {
    console.log('Google Calendar: Funcionalidade limitada com API key - retornando lista vazia');
    console.log('Para integração completa, seria necessário OAuth2 authentication');
    
    // Com API key, não conseguimos acessar calendários privados
    // Retornamos lista vazia para não bloquear horários incorretamente
    return [];
  } catch (error) {
    console.error('Erro ao buscar eventos do Google Calendar:', error);
    return [];
  }
};

// Criar evento no calendário
// NOTA: Com API key, não é possível criar eventos - requer OAuth2
const createEvent = async (eventData: {
  summary: string;
  description: string;
  start: string;
  end: string;
  attendeeEmail?: string;
}): Promise<CalendarEvent | null> => {
  try {
    console.log('Google Calendar: Criação de eventos requer OAuth2 - não disponível com API key');
    console.log('Evento que seria criado:', eventData);
    
    // Com API key, não conseguimos criar eventos
    // A funcionalidade continua funcionando localmente
    return null;
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
