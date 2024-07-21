import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const Announcement = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [activeForm, setActiveForm] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleLinkChange = (e) => setLink(e.target.value);
  const handleDateChange = (e) => setSelectedDate(e.target.value);
  
  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/Admin/private/getselectedannouncements?date=${selectedDate}`,
        {
          method: "GET",
          headers: {
            authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
        }
      );
      const data = await response.json();
      setAnnouncements(data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  const uploadAnnouncement = async () => {
    const formData = {
      announcementDate: new Date(selectedDate).toISOString(), // Convert date to UTC format
      topicOfAnnouncement: description,
      readMore: link,
    };

    try {
      const response = await fetch(
        `${BASE_URL}/api/Admin/private/createAnnouncement`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast.success("Announcement uploaded successfully");
        setTitle("");
        setDescription("");
        setLink("");
        setSelectedDate(""); // Reset the selected date
        fetchAnnouncements(); // Refresh the announcements
      } else {
        const errorData = await response.json();
        console.error("Failed to upload announcement:", errorData);
        toast.error("Failed to upload announcement");
      }
    } catch (error) {
      console.error("Error uploading announcement:", error);
      toast.error("An error occurred while uploading announcement");
    }
  };

  const deleteAnnouncement = async (announcementId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/Admin/private/deleteAnnouncement/${announcementId}`,
        {
          method: "DELETE",
          headers: {
            authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
        }
      );

      if (response.ok) {
        toast.success("Announcement deleted successfully");
        fetchAnnouncements(); // Refresh the announcements
      } else {
        const errorData = await response.json();
        console.error("Failed to delete announcement:", errorData);
        toast.error("Failed to delete announcement");
      }
    } catch (error) {
      console.error("Error deleting announcement:", error);
      toast.error("An error occurred while deleting announcement");
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeForm === "upload" && selectedDate && description && link) {
      uploadAnnouncement();
    } else if (activeForm === "edit" && selectedDate && description && link) {
      alert("Your data is edited");
    } else if (activeForm === "delete" && selectedAnnouncement) {
      deleteAnnouncement(selectedAnnouncement._id);
    } else {
      toast.error("Please fill in all required fields");
    }
  };
  const handleDeleteClick = (announcement) => {
    setSelectedAnnouncement(announcement);
    toast.info(
      `Selected announcement for deletion: ${announcement.topicOfAnnouncement}`,
      {
        autoClose: 3000, // Close the toast after 3 seconds
        hideProgressBar: false, // Display the progress bar
        closeButton: true, // Show close button
        position: toast.POSITION.TOP_RIGHT, // Position the toast on top right
      }
    );
  };

  useEffect(() => {
    if (selectedDate) {
      fetchAnnouncements();
    }
  }, [selectedDate]);

  const renderForm = () => {
    switch (activeForm) {
      case "upload":
        return (
          <div style={styles.formContainer}>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label htmlFor="date" style={styles.label}>
                  Add Date
                </label>
                <div style={styles.dateInputContainer}>
                  <input
                    type="date"
                    id="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    style={styles.input}
                  />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="description" style={styles.label}>
                  Add Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={handleDescriptionChange}
                  rows="4"
                  style={styles.textarea}
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="link" style={styles.label}>
                  Add Link
                </label>
                <input
                  type="url"
                  id="link"
                  value={link}
                  onChange={handleLinkChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <button
                  type="submit"
                  style={{ ...styles.btn, ...styles.submit }}
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        );
      case "edit":
        return (
          <div style={styles.formContainer}>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label htmlFor="date" style={styles.label}>
                  Edit Date
                </label>
                <div style={styles.dateInputContainer}>
                  <input
                    type="date"
                    id="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    style={styles.input}
                  />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="description" style={styles.label}>
                  Edit Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={handleDescriptionChange}
                  rows="4"
                  style={styles.textarea}
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="link" style={styles.label}>
                  Edit Link
                </label>
                <input
                  type="url"
                  id="link"
                  value={link}
                  onChange={handleLinkChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <button
                  type="submit"
                  style={{ ...styles.btn, ...styles.submit }}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        );
      case "delete":
        return (
          <div style={styles.formContainer}>
            <button
              type="button"
              onClick={() => deleteAnnouncement(selectedAnnouncement._id)}
              style={{ ...styles.btn, ...styles.deleteBtn }}
              disabled={!selectedAnnouncement}
            >
              Delete
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app">
         <ToastContainer />
      <style>
        {`
          body {
            margin: 0;
            font-family: Abhya Libre Bold;
          }
          .app {
            display: flex;
            height: 100vh;
            flex-direction: column;
          }
          @media (max-width: 1200px) {
            .sidebar {
              width: 100%;
              height: auto;
            }
          }
        `}
      </style>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Announcement</h1>
          <div style={styles.date}>
            {new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
        <div style={styles.buttons}>
          <button
            style={{ ...styles.btn, ...styles.upload }}
            onClick={() => setActiveForm("upload")}
          >
            Upload
          </button>
          <button
            style={{ ...styles.btn, ...styles.edit }}
            onClick={() => setActiveForm("edit")}
          >
            Edit
          </button>
          <button
            style={{ ...styles.btn, ...styles.delete }}
            onClick={() => setActiveForm("delete")}
          >
            Delete
          </button>
          <div style={styles.search}>
            <input
              type="date"
              className="forminput"
              name="date"
              value={selectedDate}
              onChange={handleDateChange}
              style={styles.searchInput}
            />
          </div>
        </div>
        {renderForm()}
        {announcements.length > 0 && (
          <div style={styles.announcementsList}>
            <h3>Announcements on {selectedDate}</h3>
            <ul>
              {announcements.map((announcement, index) => (
                <li
                  key={index}
                  onClick={() => handleDeleteClick(announcement)}
                  style={
                    selectedAnnouncement &&
                    selectedAnnouncement._id === announcement._id
                      ? styles.selectedAnnouncement
                      : {}
                  }
                >
                  <p>
                    <b>Date:</b> {announcement.announcementDate}
                  </p>
                  <p>
                    <b>Description:</b> {announcement.topicOfAnnouncement}
                  </p>
                  <p>
                    <b>Link:</b>{" "}
                    <a
                      href={announcement.readMore}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {announcement.readMore}
                    </a>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
const styles = {
  container: {
    height: "89%",
    width: "72%",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "rgba(186, 224, 253, 0.19)",
    position: "relative",
    left: "10%",
    top: "-89%",
    fontFamily: "Abhya Libre Bold",
  },
  header: {
    borderBottom: "1px solid #ccc",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: {
    fontSize: "3rem",
    fontFamily: "Abhaya Libre SemiBold",
  },
  date: {
    backgroundColor: "#e6f2ff",
    border: "1px solid #007bff",
    padding: "5px 10px",
    borderRadius: "13px",
    cursor: "pointer",
    fontSize: "14px",
  },
  buttons: {
    display: "flex",
    gap: "14px",
    marginBottom: "50px",
  },
  search: {
    display: "flex",
    alignItems: "center",
    position: "relative",
    left: "47%",
  },
  searchInput: {
    padding: "5px",
    border: "1px solid #ccc",
    borderRight: "none",
    borderRadius: "4px",
  },
  searchBtn: {
    padding: "5px",
    backgroundColor: "white",
    borderRadius: "0 5px 5px 0",
    cursor: "pointer",
    border: "1px solid #ccc",
    borderLeft: "none",
  },
  btn: {
    padding: "5px 20px",
    color: "black",
    border: "none",
    borderRadius: "15px",
    cursor: "pointer",
    backgroundColor: "#f0f0f0",
  },
  upload: {
    backgroundColor: "rgba(217, 217, 217, 0.37)",
    color: "#212529",
  },
  edit: {
    backgroundColor: "rgba(217, 217, 217, 0.37)",
    color: "#212529",
  },
  delete: {
    backgroundColor: "rgba(217, 217, 217, 0.37)",
    color: "#212529",
  },
  formContainer: {
    width: "50%",
    margin: "0 auto",
  },
  form: {
    flex: 1,
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    fontWeight: "bolder",
    marginBottom: "5px",
    fontSize: "14px",
    color: "#333333",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #cccccc",
    borderRadius: "7px",
    fontSize: "14px",
    color: "#333333",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    border: "1px solid #cccccc",
    borderRadius: "7px",
    fontSize: "14px",
    color: "#333333",
    resize: "vertical",
  },
  dateInputContainer: {
    display: "flex",
    alignItems: "center",
  },
  calendarBtn: {
    marginLeft: "10px",
    backgroundColor: "#007bff",
    color: "#ffffff",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
    padding: "10px",
  },
  hiddenDateInput: {
    position: "absolute",
    visibility: "hidden",
  },
  submit: {
    backgroundColor: "#007bff",
    color: "#ffffff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  announcementsList: {
    marginTop: "20px",
  },
};

export default Announcement;
