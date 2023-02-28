import { useState } from 'react';
import reactLogo from './assets/react.svg';
import { css } from '@linaria/core';
import { View } from 'react-native';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import './App.css';

// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <Route path="/" element={<Root />}>
//       <Route path="dashboard" element={<Dashboard />} />
//       {/* ... etc. */}
//     </Route>
//   )
// );

const styles = css`
  background-color: blue;
`;


function App() {
  const [count, setCount] = useState(0)

  return (
    <View style={{ backgroundColor: 'yellow', padding: 10 }}>
      <div className={'App ' + styles}>
        <div>
          <a href="https://vitejs.dev" target="_blank">
            <img src="/logo.svg" className="logo" alt="Vite logo" />
          </a>
          <a href="https://reactjs.org" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </View>
  )
}

export default App
