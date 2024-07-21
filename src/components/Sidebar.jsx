import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isPublicationsDropdownOpen, setIsPublicationsDropdownOpen] =
    useState(false);

  const togglePublicationsDropdown = () => {
    setIsPublicationsDropdownOpen(!isPublicationsDropdownOpen);
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="profile">
          <img
            src="https://faculty.iitr.ac.in/~sudiproy.fcs/web_files/SudipRoy2022.jpg" 
            alt="Profile"
            className="avatar"
          />
          <div className="para">
            <h2>Dr. Sudip Roy</h2>
            <p>
              <b>Admin</b>
            </p>
          </div>
        </div>
        <div className="buttons">
          <button className="btn1">
            <Link to="/dashboard">CoDa</Link>
          </button>
          <button className="btn2">SR</button>
        </div>
        <nav className="nav">
          <ul>
            <li>
              <Link to="/news">News</Link>
            </li>
            <li>
              <Link to="/event">Events</Link>
            </li>
            <li>
              <Link to="/people">People</Link>
            </li>
            <li>
              <Link to="/gallery">Gallery</Link>
            </li>
            <li>
              <Link to="/research">Research</Link>
            </li>
            <li>
              <Link to="/activities">Activities</Link>
            </li>
            <li>
              <Link to="/project">Projects</Link>
            </li>
            <li>
              <Link to="/teaching">Teachings</Link>
            </li>
            <li
              onClick={togglePublicationsDropdown}
              className="dropdown-toggle"
            >
              Publications
              {isPublicationsDropdownOpen && (
                <ul className="dropdown">
                  <li>
                    <Link to="/publications/journals">Journals</Link>
                  </li>
                  <li>
                    <Link to="/publications/conference">Conference</Link>
                  </li>
                  <li>
                    <Link to="/publications/patents">US Indian Patent</Link>
                  </li>
                  <li>
                    <Link to="/publications/workshops">Workshops</Link>
                  </li>
                  <li>
                    <Link to="/publications/books">Books & Book Chapters</Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <Link to="/achievements">Achievements</Link>
            </li>
            <li>
              <Link to="/announcement">Announcements</Link>
            </li>
            <li>
              <Link to="/awards">Awards and Honours</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <style jsx>{`
        .app {
          display: flex;
        }

        .sidebar {
          width: 18%;
          background-color: #6db9f8;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 1500px;
          position: relative;
          margin-top: 7%;
          margin-left: 6%;
        }

        .profile {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 20px;
        }

        .avatar {
          width: 100px;
          height: 100px;
          background-color: #ccc;
          border-radius: 50%;
          margin-bottom: 10px;
        }

        .para {
          text-align: center;
        }

        .para h2 {
          font-size: 18px;
          margin: 5px 0;
        }

        .para p {
          font-size: 14px;
          margin: 0;
          margin-top: -5px;
        }

        .buttons {
          display: flex;
          gap: 0px;
          margin-bottom: 20px;
          margin-top: -8px;
        }

        .btn1,
        .btn2 {
          padding: 8px 24px;
          margin-top: -2px;
          margin-bottom: 20px;
          border: none;
          border-radius: 0px;
          cursor: pointer;
          font-size: 14px;
        }

        .btn1 {
          background-color: #0073e6;
          color: white;
        }

        .btn2 {
          background-color: #f2f2f2;
          color: black;
          border: 1px solid black;
        }

        .nav ul {
          list-style: none;
          padding: 0;
          margin-top: 15px;
        }

        .nav li {
          padding: 0px 24px;
          text-align: center;
          cursor: pointer;
          margin: 5px;
          border-bottom: 1px solid #ccc;
          background-color: #bae0fd;
        }

        .nav li:hover {
          background-color: #0073e6;
          color: white;
        }

        .nav {
          border: 1px solid gray;
          background-color: #6db9f8;
        }

        p {
          padding-bottom: -10%;
        }

        .nav li a {
          text-decoration: none;
          color: inherit;
          display: block;
          width: 100%;
          height: 100%;
        }

        .dropdown-toggle {
          position: relative;
        }

        .dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          background-color: #6db9f8;
          border: 1px solid gray;
          width: 100%;
          z-index: 1000;
        }

        .dropdown li {
          background-color: #bae0fd;
          border-bottom: 1px solid #ccc;
          text-align: center;
        }

        .dropdown li:hover {
          background-color: #0073e6;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
