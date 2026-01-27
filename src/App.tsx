import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthPage } from "./pages/AuthPage";
import { CreateRoomPage } from "./pages/CreateRoomPage";
import { RoomsListPage } from "./pages/RoomsListPage";
import { RoomDetailsPage } from "./pages/RoomDetailsPage";
import { TopicDetailsPage } from "./pages/TopicDetailsPage";

import "./styles/auth.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />

        <Route path="/rooms" element={<RoomsListPage />} />
        <Route path="/rooms/create" element={<CreateRoomPage />} />
        <Route path="/rooms/:id" element={<RoomDetailsPage />} />
        <Route path="/topics/:id" element={<TopicDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
