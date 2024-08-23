import React from "react";
import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LoginPage from "./components/loginPage/loginPage";
import Dashboard from "./components/dashboard/dashboardPage";
import AdminsPage from "./components/screens/adminsPage/adminsPage";
import UsersPage from "./components/screens/usersPage/usersPage";
import SheltersPage from "./components/screens/sheltersPage/sheltersPage";
import TOSPage from "./components/screens/tosPage/tosPage";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admins" element={<AdminsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/shelters" element={<SheltersPage />} />
          <Route path="/tos" element={<TOSPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
