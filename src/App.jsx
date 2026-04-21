import { Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import AddCourse from "./pages/course/AddCourse";
import CourseDetails from "./pages/course/CourseDetails";

import AddCollage from "./pages/collage/AddCollage";
import AddAgreement from "./pages/agreement/AddAgreement";
import AgreementCollageDetails from "./pages/agreement/AgreementCollageDetails";

import AddEnrolment from "./pages/enrolment/AddEnrolment";
import StudentEnrolmentDetails from "./pages/enrolment/StudentEnrolmentDetails";
import EnrolmentChecklist from "./pages/enrolment/EnrolmentChecklist";

import AddFlyer from "./pages/flyer/AddFlyer";
import FlyersDetails from "./pages/flyer/FlyersDetails";

import Profile from "./pages/profile/Profile";
import ChatPage from "./pages/chat/ChatPage";
import Reports from "./pages/Reports";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";

// =======================
// AUTH CHECK
// =======================
const isAuth = () => {
  return localStorage.getItem("user") ? true : false;
};

// =======================
// PROTECTED ROUTE
// =======================
const ProtectedRoute = ({ children }) => {
  return isAuth() ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Routes>

      {/* ================= PUBLIC ROUTES ================= */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />

      {/* ================= PROTECTED ROUTES ================= */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >

        <Route index element={<Dashboard />} />

        <Route path="dashboard" element={<Dashboard />} />
        <Route path="addcourse" element={<AddCourse />} />
        <Route path="addcollage" element={<AddCollage />} />
        <Route path="addagreement" element={<AddAgreement />} />
        <Route path="addenrolment" element={<AddEnrolment />} />
        <Route path="enrolmentchecklist" element={<EnrolmentChecklist />} />
        <Route path="addflyer" element={<AddFlyer />} />
        <Route path="courses" element={<CourseDetails />} />
        <Route path="agreement" element={<AgreementCollageDetails />} />
        <Route path="enrolment" element={<StudentEnrolmentDetails />} />
        <Route path="flyer" element={<FlyersDetails />} />
        <Route path="profile" element={<Profile />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="reports" element={<Reports />} />
        <Route path="Reports" element={<Navigate to="/reports" replace />} />

      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/login" />} />

    </Routes>
  );
};

export default App;