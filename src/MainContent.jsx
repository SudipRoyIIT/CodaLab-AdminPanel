import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation,Navigate } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Event from "./components/Event";
import News from "./components/News";
import ProtectedRoute from "./components/ProtectedRoute";
import SignIn from "./components/SignIn";
import Journals from "./components/Journals";
import Signup from "./components/Signup";
import Announcement from "./components/Announcement";
import Patents from "./components/Patents";
import Conference from "./components/Conference";
import Workshops from "./components/Workshops";
import Books from "./components/Books";
import Gallery from "./components/Gallery";
import Research from "./components/Research";
import Achievements from "./components/Achievements";
import People from "./components/People";
import PhdStudents from "./components/PhdStudents";
import PhdGraduated from "./components/PhdGraduated";
import MtechStudents from "./components/MtechStudents";
import MtechGraduated from "./components/MtechGraduated";
import Interns from "./components/Interns";
import Project from "./components/Project";
import Activities from "./components/Activities";
import Teachings from "./components/Teaching";
import Awards from "./components/Awards";
import Btech from "./components/Btech";
import NotFound from "./components/Error";
import { useAuth } from "./components/AuthContext";

function MainContent() {
  const { currentUser, userRole, setCurrentUser, setUserRole } = useAuth();
  const [showHeaderAndSidebar, setShowHeaderAndSidebar] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const paths = [
      "/",
      "/event",
      "/news",
      "/signup",
      "/announcement",
      "/achievements",
      "/research",
      "/gallery",
      "/project",
      "/publications/journals",
      "/publications/patents",
      "/publications/conference",
      "/publications/workshops",
      "/publications/books",
      "/current/phd",
      "/graduated/phd",
      "/current/mtech",
      "/graduated/mtech",
      "/interns",
      "/activities",
      "/teaching",
      "/awards",
      "/graduated/btech",
      "/people",
      "/Signup",
    ];

    const isNotMatch = !paths.includes(location.pathname);
    setShowHeaderAndSidebar(!isNotMatch);
  }, [location]);

  if (currentUser === null) {
    return (
      <Routes>
        <Route
          path="/signin"
          element={
            <SignIn setCurrentUser={setCurrentUser} setUserRole={setUserRole} />
          }
        />
        <Route path="*" element={<Navigate to="/signin" />} />
      </Routes>
    );
  }

  return (
    <div>
      {showHeaderAndSidebar && <Header setCurrentUser={setCurrentUser} />}
      {showHeaderAndSidebar && <Sidebar />}
      <div>
        <Routes>
          {userRole === "subadmin" && (
            <>
              <Route
                path="/"
                element={
                  <ProtectedRoute element={Dashboard} requiredRole="subadmin" />
                }
              />
              <Route
                path="/event"
                element={
                  <ProtectedRoute element={Event} requiredRole="admin" />
                }
              />
              <Route
                path="/news"
                element={<ProtectedRoute element={News} requiredRole="admin" />}
              />
              <Route
                path="/signup"
                element={
                  <ProtectedRoute element={Signup} requiredRole="admin" />
                }
              />
              <Route
                path="/announcement"
                element={
                  <ProtectedRoute element={Announcement} requiredRole="admin" />
                }
              />
              <Route
                path="/achievements"
                element={
                  <ProtectedRoute element={Achievements} requiredRole="admin" />
                }
              />
              <Route
                path="/research"
                element={
                  <ProtectedRoute element={Research} requiredRole="admin" />
                }
              />
              <Route
                path="/gallery"
                element={
                  <ProtectedRoute element={Gallery} requiredRole="admin" />
                }
              />
              <Route
                path="/project"
                element={
                  <ProtectedRoute element={Project} requiredRole="admin" />
                }
              />
              <Route
                path="/publications/journals"
                element={
                  <ProtectedRoute element={Journals} requiredRole="subadmin" />
                }
              />
              <Route
                path="/publications/patents"
                element={
                  <ProtectedRoute element={Patents} requiredRole="subadmin" />
                }
              />
              <Route
                path="/publications/conference"
                element={
                  <ProtectedRoute
                    element={Conference}
                    requiredRole="subadmin"
                  />
                }
              />
              <Route
                path="/publications/workshops"
                element={
                  <ProtectedRoute element={Workshops} requiredRole="subadmin" />
                }
              />
              <Route
                path="/publications/books"
                element={
                  <ProtectedRoute element={Books} requiredRole="subadmin" />
                }
              />
              <Route
                path="/current/phd"
                element={
                  <ProtectedRoute
                    element={PhdStudents}
                    requiredRole="subadmin"
                  />
                }
              />
              <Route
                path="/graduated/phd"
                element={
                  <ProtectedRoute
                    element={PhdGraduated}
                    requiredRole="subadmin"
                  />
                }
              />
              <Route
                path="/people"
                element={
                  <ProtectedRoute element={People} requiredRole="subadmin" />
                }
              />
              <Route
                path="/current/mtech"
                element={
                  <ProtectedRoute
                    element={MtechStudents}
                    requiredRole="subadmin"
                  />
                }
              />
              <Route
                path="/graduated/mtech"
                element={
                  <ProtectedRoute
                    element={MtechGraduated}
                    requiredRole="subadmin"
                  />
                }
              />
              <Route
                path="/interns"
                element={
                  <ProtectedRoute element={Interns} requiredRole="subadmin" />
                }
              />
              <Route
                path="/activities"
                element={
                  <ProtectedRoute element={Activities} requiredRole="admin" />
                }
              />
              <Route
                path="/teaching"
                element={
                  <ProtectedRoute element={Teachings} requiredRole="admin" />
                }
              />
              <Route
                path="/awards"
                element={
                  <ProtectedRoute element={Awards} requiredRole="admin" />
                }
              />
              <Route
                path="/graduated/btech"
                element={
                  <ProtectedRoute element={Btech} requiredRole="subadmin" />
                }
              />
            </>
          )}

          {userRole === "admin" && (
            <>
              <Route
                path="/"
                element={
                  <ProtectedRoute element={Dashboard} requiredRole="admin" />
                }
              />
              <Route
                path="/event"
                element={
                  <ProtectedRoute element={Event} requiredRole="admin" />
                }
              />
              <Route
                path="/news"
                element={<ProtectedRoute element={News} requiredRole="admin" />}
              />
              <Route
                path="/signup"
                element={
                  <ProtectedRoute element={Signup} requiredRole="admin" />
                }
              />
              <Route
                path="/announcement"
                element={
                  <ProtectedRoute element={Announcement} requiredRole="admin" />
                }
              />
              <Route
                path="/achievements"
                element={
                  <ProtectedRoute element={Achievements} requiredRole="admin" />
                }
              />
              <Route
                path="/people"
                element={
                  <ProtectedRoute element={People} requiredRole="admin" />
                }
              />
              <Route
                path="/gallery"
                element={
                  <ProtectedRoute element={Gallery} requiredRole="admin" />
                }
              />
              <Route
                path="/research"
                element={
                  <ProtectedRoute element={Research} requiredRole="admin" />
                }
              />
              <Route
                path="/publications/journals"
                element={
                  <ProtectedRoute element={Journals} requiredRole="admin" />
                }
              />
              <Route
                path="/publications/patents"
                element={
                  <ProtectedRoute element={Patents} requiredRole="admin" />
                }
              />
              <Route
                path="/publications/conference"
                element={
                  <ProtectedRoute element={Conference} requiredRole="admin" />
                }
              />
              <Route
                path="/publications/workshops"
                element={
                  <ProtectedRoute element={Workshops} requiredRole="admin" />
                }
              />
              <Route
                path="/publications/books"
                element={
                  <ProtectedRoute element={Books} requiredRole="admin" />
                }
              />
              <Route
                path="/current/phd"
                element={
                  <ProtectedRoute element={PhdStudents} requiredRole="admin" />
                }
              />
              <Route
                path="/graduated/phd"
                element={
                  <ProtectedRoute element={PhdGraduated} requiredRole="admin" />
                }
              />
              <Route
                path="/current/mtech"
                element={
                  <ProtectedRoute
                    element={MtechStudents}
                    requiredRole="admin"
                  />
                }
              />
              <Route
                path="/graduated/mtech"
                element={
                  <ProtectedRoute
                    element={MtechGraduated}
                    requiredRole="admin"
                  />
                }
              />
              <Route
                path="/interns"
                element={
                  <ProtectedRoute element={Interns} requiredRole="admin" />
                }
              />
              <Route
                path="/project"
                element={
                  <ProtectedRoute element={Project} requiredRole="admin" />
                }
              />
              <Route
                path="/activities"
                element={
                  <ProtectedRoute element={Activities} requiredRole="admin" />
                }
              />
              <Route
                path="/teaching"
                element={
                  <ProtectedRoute element={Teachings} requiredRole="admin" />
                }
              />
              <Route
                path="/awards"
                element={
                  <ProtectedRoute element={Awards} requiredRole="admin" />
                }
              />
              <Route
                path="/graduated/btech"
                element={
                  <ProtectedRoute element={Btech} requiredRole="admin" />
                }
              />
            </>
          )}

          <Route path="*" element={<NotFound signin="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default MainContent;
