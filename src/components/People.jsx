import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const People = () => {
  const [hoveredButton, setHoveredButton] = useState(null);
  const [currentDropdownOpen, setCurrentDropdownOpen] = useState(false);
  const [graduatedDropdownOpen, setGraduatedDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleMouseEnter = (button) => {
    setHoveredButton(button);
    if (button === "Current") {
      setCurrentDropdownOpen(true);
    } else if (button === "Graduated") {
      setGraduatedDropdownOpen(true);
    }
  };

  const handleMouseLeave = () => {
    setHoveredButton(null);
    setCurrentDropdownOpen(false);
    setGraduatedDropdownOpen(false);
  };

  const handleDropdownClick = (path) => {
    navigate(path);
  };

  const handleInternsClick = () => {
    navigate("/interns"); // Change this path to match your route for the Interns component
  };

  return (
    <div className="app">
      <style>
        {`
           body {
             margin: 0;
             font-family: 'Abhaya Libre', serif;
           }
           .app {
             display: flex;
             height: 125vh;
             flex-direction: column;
           }
        `}
      </style>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>People</h1>
          <div style={styles.date}>
            {new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>
        <div style={styles.button}>
          <div
            style={{
              ...styles.btns,
              ...(hoveredButton === "Current" ? styles.buttonHover : {}),
            }}
            onMouseEnter={() => handleMouseEnter("Current")}
            onMouseLeave={handleMouseLeave}
            onClick={() => setCurrentDropdownOpen(!currentDropdownOpen)}
          >
            Current
            <div
              style={{
                ...styles.dropdownContent,
                ...(currentDropdownOpen ? styles.dropdownContentShow : {}),
              }}
            >
              <div
                style={styles.dropdownItem}
                onClick={() => handleDropdownClick("/current/phd")}
              >
                Ph.D Scholars
              </div>
              <div
                style={styles.dropdownItem}
                onClick={() => handleDropdownClick("/current/mtech")}
              >
                M.Tech Students
              </div>
            </div>
          </div>
          <div
            style={{
              ...styles.btns,
              ...(hoveredButton === "Graduated" ? styles.buttonHover : {}),
            }}
            onMouseEnter={() => handleMouseEnter("Graduated")}
            onMouseLeave={handleMouseLeave}
            onClick={() => setGraduatedDropdownOpen(!graduatedDropdownOpen)}
          >
            Graduated
            <div
              style={{
                ...styles.dropdownContent,
                ...(graduatedDropdownOpen ? styles.dropdownContentShow : {}),
              }}
            >
              <div
                style={styles.dropdownItem}
                onClick={() => handleDropdownClick("/graduated/phd")}
              >
                Ph.D Scholars
              </div>
              <div
                style={styles.dropdownItem}
                onClick={() => handleDropdownClick("/graduated/mtech")}
              >
                M.Tech Students
              </div>
              <div
                style={styles.dropdownItem}
                onClick={() => handleDropdownClick("/graduated/btech")}
              >
                B.Tech Students
              </div>
            </div>
          </div>
          <button
            style={{
              ...styles.btns,
              ...(hoveredButton === "Interns" ? styles.buttonHover : {}),
            }}
            onMouseEnter={() => handleMouseEnter("Interns")}
            onMouseLeave={handleMouseLeave}
            onClick={handleInternsClick} // Add the onClick handler here
          >
            Interns
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "88%",
    width: "75%",
    backgroundColor: "rgba(186, 224, 253, 0.19)",
    position: "relative",
    top: "-89%",
    left: "24%",
    fontFamily: "Abhaya Libre Bold",
  },
  header: {
    marginTop: "31px",
    borderBottom: "1px solid #ccc",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: {
    fontSize: "3rem",
    marginLeft: "150px",
  },
  date: {
    marginBottom: "12px",
    backgroundColor: "#e6f2ff",
    border: "1px solid #007bff",
    padding: "5px 10px",
    borderRadius: "13px",
    marginRight: "10px",
    cursor: "pointer",
    fontSize: "14px",
  },
  button: {
    marginLeft: "170px",
    display: "flex",
    gap: "20px",
    marginBottom: "50px",
    marginTop: "-5px",
  },

  btns: {
    marginBottom: "20px",
    padding: "5px 25px",
    color: "black",
    border: "none",
    borderRadius: "15px",
    cursor: "pointer",
    backgroundColor: "rgba(217, 217, 217, 0.37)",
  },
  buttonHover: {
    backgroundColor: "rgba(186, 224, 253, 0.40)",
    color: "#212529",
  },
  dropdownContent: {
    display: "none",
    position: "absolute",
    borderLeft: "1px solid rgb(204, 204, 204)",
    marginLeft: "-19px",
    zIndex: 1,
    marginTop: "2px",
  },
  dropdownContentShow: {
    display: "block",
  },
  dropdownItem: {
    fontSize: "15px",
    padding: "4px",
    cursor: "pointer",
    borderBottom: "1px solid #ccc",
  },
};

export default People;
