import * as React from 'react';
import { View } from "react-native";
import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";
import { Home } from './fragments/Home';
import { NotFound } from "./fragments/NotFound";
import { Storage } from './storage/Storage';

export const App = React.memo((props: { storage: Storage, onReset: () => void }) => {
  return (
    <View style={{ width: '100vw', height: '100vh', backgroundColor: '#111111', flexDirection: 'column' }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </View>
  );
});
