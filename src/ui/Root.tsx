import * as React from 'react';
import { View } from "react-native";
import {
  MemoryRouter,
  Route,
  Routes
} from "react-router-dom";
import { Home } from './Home';
import { App, AppContext } from '../storage/App';
import { RecoilRoot } from 'recoil';
import { ModalProvider } from './components/Modal';

export const Root = React.memo((props: { app: App, onReset: () => void }) => {
  return (
    <RecoilRoot>
      <AppContext.Provider value={props.app}>
        <MemoryRouter>
          <ModalProvider>
            <View style={{ width: '100vw', height: '100vh', flexDirection: 'column' }}>
              <Home />
            </View>
          </ModalProvider>
        </MemoryRouter>
      </AppContext.Provider>
    </RecoilRoot>
  );
});
