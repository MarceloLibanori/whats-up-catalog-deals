
declare global {
  interface Window {
    gapi: {
      load: (api: string, callback: () => void) => void;
      client: {
        init: (config: {
          apiKey: string;
          discoveryDocs: string[];
        }) => Promise<void>;
        getToken: () => { access_token: string } | null;
        setToken: (token: string) => void;
        calendar: {
          calendarList: {
            list: () => Promise<{
              result: {
                items: Array<{
                  id: string;
                  summary: string;
                }>;
              };
            }>;
          };
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
    google: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: any) => void;
          }) => {
            callback: (response: any) => void;
            requestAccessToken: (options?: { prompt?: string }) => void;
          };
          revoke: (token: string, callback: () => void) => void;
        };
      };
    };
  }
}

export {};
