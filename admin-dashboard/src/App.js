import React, { useEffect, useState } from "react";
import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import LoginPage from "./components/screens/loginPage/loginPage";
import DashboardPage from "./components/screens/dashboardPage/dashboardPage";
import AdminsPage from "./components/screens/adminsPage/adminsPage";
import UsersPage from "./components/screens/usersPage/usersPage";
import SheltersPage from "./components/screens/sheltersPage/sheltersPage";
import TOSPage from "./components/screens/tosPage/tosPage";
import Reports from "./components/screens/reportsPage/reports";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingSpinner from "./components/screens/loadingPage/loadingSpinner";
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-datepicker/dist/react-datepicker.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false); // Firebase has finished checking the auth state
    });

    return () => unsubscribe();
  }, [auth]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute element={DashboardPage} user={user} />}
          />
          <Route
            path="/admins"
            element={<ProtectedRoute element={AdminsPage} user={user} />}
          />
          <Route
            path="/users"
            element={<ProtectedRoute element={UsersPage} user={user} />}
          />
          <Route
            path="/shelters"
            element={<ProtectedRoute element={SheltersPage} user={user} />}
          />
          <Route
            path="/tos"
            element={<ProtectedRoute element={TOSPage} user={user} />}
          />
          <Route
            path="/reports"
            element={<ProtectedRoute element={Reports} user={user} />}
          />
        
        </Routes>
      </Router>
    </div>
  );
}

export default App;
