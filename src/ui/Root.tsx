import * as React from 'react';
import { View } from "react-native";
import {
  MemoryRouter,
  Route,
  Routes
} from "react-router-dom";
import { Home } from './fragments/Home';
import { App, AppContext } from '../storage/App';
import { RecoilRoot } from 'recoil';

export const Root = React.memo((props: { app: App, onReset: () => void }) => {
  return (
    <RecoilRoot>
      <AppContext.Provider value={props.app}>
        <View style={{ width: '100vw', height: '100vh', flexDirection: 'column' }}>
          <MemoryRouter>
            <Home />
          </MemoryRouter>
        </View>
      </AppContext.Provider>
    </RecoilRoot>
  );
});
