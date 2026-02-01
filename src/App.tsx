import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthPage } from "./pages/AuthPage";
import { CreateRoomPage } from "./pages/CreateRoomPage";
import { RoomsListPage } from "./pages/RoomsListPage";
import { RoomDetailsPage } from "./pages/RoomDetailsPage";
import { TopicDetailsPage } from "./pages/TopicDetailsPage";
import { PrivateRoute } from "./components/PrivateRoute";
import { Topbar } from "./components/Topbar";

import "./styles/auth.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<AuthPage />} />

        {/* PRIVATE */}
        <Route
          path="/rooms/create"
          element={
            <PrivateRoute>
              <>
                <Topbar title="Crear sala" showBack />
                <div className="app-content">
                  <CreateRoomPage />
                </div>
              </>
            </PrivateRoute>
          }
        />

        <Route
          path="/rooms"
          element={
            <PrivateRoute>
              <>
                <Topbar title="Salas" showBack={false} />
                <div className="app-content">
                  <RoomsListPage />
                </div>
              </>
            </PrivateRoute>
          }
        />

        <Route
          path="/rooms/:id"
          element={
            <PrivateRoute>
              <>
                <Topbar title="Sala" showBack />
                <div className="app-content">
                  <RoomDetailsPage />
                </div>
              </>
            </PrivateRoute>
          }
        />

        <Route
          path="/topics/:id"
          element={
            <PrivateRoute>
              <>
                <Topbar title="Topic" showBack />
                <div className="app-content">
                  <TopicDetailsPage />
                </div>
              </>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
