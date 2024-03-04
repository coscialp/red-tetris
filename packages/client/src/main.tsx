import ReactDOM from "react-dom/client";
import "./index.css";

import NotFound from "./notFound/404.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./mainWindow/mainWindow.tsx";
import { store } from "./stores";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById("root")!);

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="*" element={<NotFound />}>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

root.render(<App />);

export default App;