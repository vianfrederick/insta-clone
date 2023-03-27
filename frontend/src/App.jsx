import { Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Components/Navbar/Navbar";
import Home from "./Components/Home/Home";
import Footer from "./Components/Footer/Footer";
import AboutUs from "./Components/AboutUs/AboutUs";
import ContactUs from "./Components/ContactUs/ContactUs";
import Signup from "./Components/Authentication/Signup/Signup";
import Login from "./Components/Authentication/Login/Login";
import Profile from "./Components/Profile/Profile";
import IndividualPost from "./Components/IndividualPost/IndividualPost";
import Messages from "./Components/Messages/Messages";
import Notifications from "./Components/Notifications/Notifications";
import PrivacyPolicy from "./Components/PrivacyPolicy/PrivacyPolicy";
import TermsConditions from "./Components/TermsAndConditions/TermsConditions";
import Dashboard from "./Components/Home/HomeLoggedIn.jsx";
import { ToastContainer,toast } from "react-toastify";

function App() {
  return (
    <div className="overall-container">
       <ToastContainer position={toast.POSITION.TOP_RIGHT} />
      <Navbar />
      <main className="main-content-container | bg-clr_base_10">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/about" element={<AboutUs />} />
          <Route exact path="/contact" element={<ContactUs />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route exact path="/user/:id" element={<Profile />} />
          <Route exact path="/posts/:id" element={<IndividualPost />} />
          <Route exact path="/messages" element={<Messages />} /> 
          <Route exact path="/notifications" element={<Notifications />} />
          <Route exact path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route exact path="/terms-and-conditions" element={<TermsConditions />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
