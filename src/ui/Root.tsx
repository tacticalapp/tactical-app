import * as React from 'react';
import { View } from "react-native";
import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";
import { Home } from './fragments/Home';
import { App, AppContext } from '../storage/App';

export const Root = React.memo((props: { app: App, onReset: () => void }) => {
  return (
    <AppContext.Provider value={props.app}>
      <View style={{ width: '100vw', height: '100vh', backgroundColor: '#111111', flexDirection: 'column' }}>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </View>
    </AppContext.Provider>
  );
});
