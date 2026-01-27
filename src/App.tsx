import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthPage } from "./pages/AuthPage";
import { CreateRoomPage } from "./pages/CreateRoomPage";

import "./styles/auth.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login / Registro */}
        <Route path="/" element={<AuthPage />} />

        {/* Crear sala (admin) */}
        <Route path="/rooms/create" element={<CreateRoomPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
