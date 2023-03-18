import * as React from 'react';
import { View } from "react-native";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query'
import { RecoilRoot } from 'recoil';
import { Home } from './Home';
import { App, AppContext } from '../storage/App';
import { ModalProvider } from './components/Modal';

export const Root = React.memo((props: { app: App, onReset: () => void }) => {
  const client = React.useMemo(() => new QueryClient(), []);
  return (
    <RecoilRoot>
      <AppContext.Provider value={props.app}>
        <MemoryRouter>
          <QueryClientProvider client={client}>
            <ModalProvider>
              <View style={{ width: '100vw', height: '100vh', flexDirection: 'column' }}>
                <Home />
              </View>
            </ModalProvider>
          </QueryClientProvider>
        </MemoryRouter>
      </AppContext.Provider>
    </RecoilRoot>
  );
});
