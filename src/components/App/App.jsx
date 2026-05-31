import { Link, Route, Routes } from "react-router-dom";
import LoginForm from "../../forms/LoginForm.jsx";
import SignupForm from "../../forms/SignupForm.jsx";
import HomePage from '../../pages/HomePage.jsx';
import PageNotFound from '../../pages/PageNotFound.jsx';
import Profile from "../../pages/Profile.jsx";
import Navigation from "../Navigation/Navigation";
import ProtectedRoute from "../ProtectedRoute.jsx";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Navigation />
      <h1><Link to="/">PlateScout</Link></h1>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  )
}

export default App;
