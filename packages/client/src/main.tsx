import React from 'react'
import ReactDOM from 'react-dom/client';
import './index.css';

import NotFound from './notFound/404.tsx'
import Register from './register/register.tsx';
import { BrowserRouter, Routes, Route } from "react-router-dom";


import { io } from 'socket.io-client';

const root = ReactDOM.createRoot(document.getElementById('root')!);
function App() {
  const socket = io(`ws://localhost:3001`, { transports: ['websocket'] });

  socket;

  React;
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Register />}/>
      <Route path="*" element={<NotFound />}>
      </Route>
    </Routes>
  </BrowserRouter>
  )
}
root.render(<App />);

export default App;