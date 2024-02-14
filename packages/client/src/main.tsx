import ReactDOM from "react-dom/client";
import "./index.css";

import NotFound from "./notFound/404.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./mainWindow/mainWindow.tsx";

const root = ReactDOM.createRoot(document.getElementById('root')!);
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route index element={<Home />} />
      <Route path="*" element={<NotFound />}>
      </Route>
    </Routes>
  </BrowserRouter>
  )
}
root.render(<App />);

export default App;