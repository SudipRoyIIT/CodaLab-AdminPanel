import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Event.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Event = () => {
  console.log("Hello world")
  var a =(localStorage.getItem('accessToken'))
  
  const [activeSection, setActiveSection] = useState("");
  const [formData, setFormData] = useState({
    date: "",
    eventDescription: "",
    url: "",
  });

  const [eventsData, setEventsData] = useState([]);
  const [showEventsData, setShowEventsData] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleButtonClick = (section) => {
    setActiveSection(section);
    setShowEventsData(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const clearForm = () => {
    setFormData({
      date: "",
      eventDescription: "",
      url: "",
    });
    
  };

  const fetchEventsData = async (date) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/Admin/private/getselectevents?date=${date}`,{
          method:"GET",
          headers:{
            "Content-Type": "application/json",
            "authorization":'Bearer ' + localStorage.getItem('accessToken'),
          }
        }
      );
      const data = await response.json();
      setEventsData(data);
      setShowEventsData(true);
     
    } catch (error) {
      console.error("Error fetching events data:", error);
    }
  };

  const uploadEventData = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/Admin/private/createEvent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "authorization":'Bearer ' + localStorage.getItem('accessToken'),
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast.success("Event uploaded successfully");
        fetchEventsData(formData.date);
        clearForm();
      
    
      } else {
        toast.error("Failed to upload event");
      }
    } catch (error) {
      console.error("Error uploading event data:", error);
      toast.error("Error uploading event data");
    }
  };

  const deleteEventData = async (eventId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/Admin/private/deleteEvent/${eventId}`,
        {
          method: "DELETE",
          headers:{
            "authorization":'Bearer ' + localStorage.getItem('accessToken'),
          }
 
        }
      );

      if (response.ok) {
        toast.success("Event deleted successfully");
        fetchEventsData(formData.date);

  
      } else {
        toast.error("Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Error deleting event");
    }
  };
 

  const editEventData = async (eventId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/Admin/private/updateEvent/${eventId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "authorization":'Bearer ' + localStorage.getItem('accessToken'),
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast.success("Event updated successfully");
        fetchEventsData(formData.date);
        clearForm();
      } else {
        toast.error("Failed to update event");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Error updating event");
    }
  };
  
  useEffect(() => {
    if (formData.date) {
      fetchEventsData(formData.date);
    }
  }, [formData.date]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      activeSection === "upload" &&
      formData.date &&
      formData.eventDescription &&
      formData.url
    ) {
      uploadEventData();
    } else if (
      activeSection === "edit" &&
      selectedEvent &&
      formData.date &&
      formData.eventDescription &&
      formData.url
    ) {
      editEventData(selectedEvent._id);
    } else if (activeSection === "delete" && selectedEvent) {
      deleteEventData(selectedEvent._id);
    } else {
      
      toast.error("Please fill in all required fields");
    }
  };
  
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setFormData(event);
    setActiveSection("edit");
    toast(`Selected event: ${event.eventDescription}`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <div className="container">
       <ToastContainer />
      <div className="events">
        <div className="eventsHeader">
          <h2>Events</h2>
        </div>

        <hr />

        <div className="eventControls">
          <button
            className="eventBtn"
            onClick={() => handleButtonClick("upload")}
          >
            Upload
          </button>
          <button
            className="eventBtn"
            onClick={() => handleButtonClick("edit")}
          >
            Edit
          </button>
          <button
            className="eventBtn"
            onClick={() => handleButtonClick("delete")}
          >
            Delete
          </button>
          <div className="searchContainer">
            <input
              type="date"
              className="formInput"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              onClick={() => handleButtonClick("Date")}
            />
          </div>
        </div>

        {activeSection && (
          <form className="eventForm" onSubmit={handleSubmit}>
            {(activeSection === "upload" || activeSection === "edit") && (
              <>
                <label className="formLabel">
                  <b>{activeSection === "upload" ? "Add" : "Edit"} Date</b>
                </label>
                <input
                  type="date"
                  className="formInput"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
                <label className="formLabel">
                  <b>
                    {activeSection === "upload" ? "Add" : "Edit"} Description
                  </b>
                </label>
                <textarea
                  className="formInput formTextarea"
                  name="eventDescription"
                  value={formData.eventDescription}
                  onChange={handleInputChange}
                ></textarea>
                <label className="formLabel">
                  <b>{activeSection === "upload" ? "Add" : "Edit"} Link</b>
                </label>
                <input
                  type="url"
                  className="formInput"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                />
                <button type="submit" className="formSubmit">
                  {activeSection === "upload" ? "Upload" : "Edit"}
                </button>
              </>
            )}

            {activeSection === "delete" && (
              <>
               
                <button
                  type="button"
                  className="formButton"
                  color="primary"
                  onClick={() => deleteEventData(selectedEvent._id)}
                  disabled={!selectedEvent}
                >
                  Delete Event
                </button>
              </>
            )}
          </form>
        )}

        {activeSection === "Date" &&
          showEventsData &&
          eventsData.length > 0 && (
            <div className="eventsList">
              <h3>Events on {formData.date}</h3>
              <ul>
                {eventsData.map((event, index) => (
                  <li
                    key={index}
                    onClick={() => handleEventClick(event)}
                    className={
                      selectedEvent && selectedEvent._id === event._id
                        ? "selectedEvent"
                        : ""
                    }
                  >
                    <div>
                      <p>
                        <b>Date:</b> {event.date}
                      </p>
                      <p>
                        <b>Description:</b> {event.eventDescription}
                      </p>
                      <p>
                        <b>Link:</b>{" "}
                        <a
                          href={event.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {event.url}
                        </a>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
      </div>
    </div>
  );
};

export default Event;
