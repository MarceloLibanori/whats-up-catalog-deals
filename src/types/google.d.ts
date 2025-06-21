
declare global {
  interface Window {
    gapi: {
      load: (api: string, callback: () => void) => void;
      client: {
        init: (config: {
          apiKey: string;
          discoveryDocs: string[];
        }) => Promise<void>;
        calendar: {
          events: {
            list: (params: {
              calendarId: string;
              timeMin: string;
              timeMax: string;
              singleEvents: boolean;
              orderBy: string;
            }) => Promise<{
              result: {
                items: Array<{
                  id: string;
                  summary: string;
                  start: {
                    dateTime?: string;
                    date?: string;
                  };
                  end: {
                    dateTime?: string;
                    date?: string;
                  };
                  attendees?: Array<{
                    email: string;
                    displayName?: string;
                  }>;
                }>;
              };
            }>;
            insert: (params: {
              calendarId: string;
              resource: any;
            }) => Promise<{
              result: any;
            }>;
          };
        };
      };
    };
  }
}

export {};
