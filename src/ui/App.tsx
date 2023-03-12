import * as React from 'react';
import { View } from "react-native";
import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";
import { Home } from './fragments/Home';
import { Storage } from '../storage/Storage';
import { StorageContext } from '../storage/useStorage';

export const App = React.memo((props: { storage: Storage, onReset: () => void }) => {
  return (
    <StorageContext.Provider value={props.storage}>
      <View style={{ width: '100vw', height: '100vh', backgroundColor: '#111111', flexDirection: 'column' }}>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </View>
    </StorageContext.Provider>
  );
});
