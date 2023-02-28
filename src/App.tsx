import { View } from "react-native";
import {
  BrowserRouter,
  Route,
  RouterProvider,
  Routes
} from "react-router-dom";
import { Home } from './fragments/Home';
import { NotFound } from "./fragments/NotFound";

function App() {
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
}

export default App
