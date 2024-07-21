import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
 import { toast, ToastContainer } from "react-toastify"; 
 import "react-toastify/dist/ReactToastify.css";
 import { Delete as DeleteIcon } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';


const BASE_URL = import.meta.env.VITE_BASE_URL;

const PhdStudents = () => {
  const [name, setName] = useState("");
  const [enrolledCourse, setEnrolledCourse] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [areaOfInterest, setAreaOfInterest] = useState("");
  const [researches, setResearches] = useState("");
  const [journal_publications, setJournalPublications] = useState([]); // Initialize as an empty array
  const [conference_publications, setConferencePublications] = useState([]); // Initialize as an empty array
  const [image, setImage] = useState(null);
  const [email, setEmail] = useState("");
  const [linkedIn, setLinkedIn] = useState("");                                                                         
  const [googleScholarLink, setGoogleScholarLink] = useState("");
  const [orcidLink, setOrcidLink] = useState("");
  const [researchGateId, setResearchGateId] = useState("");
  const [overview, setOverview] = useState("");
  const [clickForMore, setClickForMore] = useState("");
  const [activeForm, setActiveForm] = useState(null);
  const [input , setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [apiData, setApiData] = useState([])
  const handleNameChange = (e) => setName(e.target.value);
  const handleEnrolledCourseChange = (e) => setEnrolledCourse(e.target.value);
  const handleSubtitleChange = (e) => setSubtitle(e.target.value);
  const handleAreaOfInterestChange = (e) => setAreaOfInterest(e.target.value);
  const handleOverviewChange = (e) => setOverview(e.target.value);
  const handleResearchesChange = (e) => setResearches(e.target.value);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      console.log(reader.result);
      setImage(reader.result);
    });

    reader.readAsDataURL(file);
  }
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleLinkedInChange = (e) => setLinkedIn(e.target.value);
  const handleGoogleScholarLinkChange = (e) =>
    setGoogleScholarLink(e.target.value);
  const handleOrcidLinkChange = (e) => setOrcidLink(e.target.value);
  const handleResearchGateIdChange = (e) => setResearchGateId(e.target.value);
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [currentDropdownOpen, setCurrentDropdownOpen] = useState(false);
  const [graduatedDropdownOpen, setGraduatedDropdownOpen] = useState(false);
  const [id, setId] = useState("");
  const navigate = useNavigate();
  const handleMouseEnter = (button) => {
    setHoveredButton(button);
    if (button === "Current") {
      setCurrentDropdownOpen(true);
    } else if (button === "Graduated") {
      setGraduatedDropdownOpen(true);
    }
  };
    const handleInput = (val) => {
      setInput(val);
      console.log(val);
    };
  const userRole = localStorage.getItem("userInfo");
  const afApi = userRole === "admin" ? "Admin" : "Subadmin";
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/${afApi}/private/getCurrentStudents?name=${input}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: "Bearer " + localStorage.getItem("accessToken"),
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          const phdStudents = data.filter(
            (student) => student.enrolledCourse === "PhD"
          );
          setApiData(phdStudents);
          console.log(phdStudents);
        } else {
          setApiData([]);
          // console.log("No achievements found");
          toast.error(data.message || "No student found");
        }
      } catch (error) {
        console.error("Error fetching student:", error);
        toast.error("Error fetching student");
      }
    };
    if (input){
      fetchStudents();
    }
  },[input])
  const clearForm = () => {
    setName("");
    setEnrolledCourse("");
    setSubtitle("");
    setAreaOfInterest("");
    setResearches("");
    setOverview("");
    setJournalPublications([]); 
    setConferencePublications([]);
    setImage(null);
    setEmail("");
    setLinkedIn("");
    setGoogleScholarLink("");
    setOrcidLink("");
    setResearchGateId("");
    setClickForMore("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      activeForm === "upload" &&
      name &&
      enrolledCourse &&
      subtitle &&
      areaOfInterest &&
      researches &&
      overview &&
      linkedIn &&
      email &&
      image
    ) {
      const formData = {
        name: name,
        enrolledCourse: enrolledCourse,
        subtitle: subtitle,
        areaOfInterest: areaOfInterest,
        researches: researches,
        publications: {
          journal_publications: journal_publications,
          conference_publications: conference_publications,
        },
        contactInformation: {
          email: email,
          linkedIn: linkedIn,
          orcidLink: orcidLink,
          googleScholarLink: googleScholarLink,
          researchGateId: researchGateId,
          clickForMore: clickForMore,
        },
        urlToImage: image,
        overview: overview,
      };
      try {
        const response = await fetch(
          `${BASE_URL}/api/${afApi}/private/createStudent`,
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
          toast("Data uploaded successfully!", "success");

          clearForm();
        } else {
          throw new Error("Failed to upload data");
        }
      } catch (error) {
        console.error("Error uploading data:", error);
        toast("Failed to upload data", "error");
      }
    } else if (
      activeForm === "edit" &&
      name &&
      enrolledCourse &&
      subtitle &&
      areaOfInterest &&
      researches &&
      overview &&
      linkedIn &&
      email &&
      image
    ) {
      const formData = {
        name: name,
        enrolledCourse: enrolledCourse,
        subtitle: subtitle,
        areaOfInterest: areaOfInterest,
        researches: researches,
        publications: {
          journal_publications: journal_publications,
          conference_publications: conference_publications,
        },
        contactInformation: {
          email: email,
          linkedIn: linkedIn,
          orcidLink: orcidLink,
          googleScholarLink: googleScholarLink,
          researchGateId: researchGateId,
          clickForMore: clickForMore,
        },
        urlToImage: image,
        overview: overview,
      };
      try {
        const response = await fetch(
          `${BASE_URL}/api/${afApi}/private/updateStudent/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              authorization: "Bearer " + localStorage.getItem("accessToken"),
            },
            body: JSON.stringify(formData),
          }-pages
        );
        if (!response.ok) {
          throw new Error("Failed to update post");
        }
        toast("Data updated successfully!", "success");
        return await response.json();
      } catch (error) {
        console.error("Error updating post:", error);
        toast("Failed to update data", "error");
      } finally {
        if (response.ok) {
          clearForm();
        }
      }
    } else if (activeForm === "delete" && name) {
      try {
        const response = await fetch(
          `${BASE_URL}/api/${afApi}/private/deleteStudent/${id}`,
          {
            method: "DELETE",
            headers: {
              authorization: "Bearer " + localStorage.getItem("accessToken"),
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete data");
        }

        //  // Assuming response.ok is true, update state
        //  const updatedData1 = apiData.DataForSpringSemesterCollection.filter(
        //    (Teachings) => Teachings._id !== id
        //  );
        //  const updatedData2 = apiData.DataForautumnSemesterCollection.filter(
        //    (Teachings) => Teachings._id !== id
        //  );
        //  setApiData({
        //    DataForSpringSemesterCollection: updatedData1,
        //    DataForautumnSemesterCollection: updatedData2,
        //  });

        toast("Data deleted successfully!", "success");
        clearForm();
      } catch (error) {
        console.error("Error deleting data:", error);
        toast("Failed to delete data", "error");
      }
    } else {
      alert("Please fill in all required fields");
    }
  };

  const handleJournalPublicationsChange = (index, e) => {
    const values = [...journal_publications];
    values[index] = e.target.value;
    setJournalPublications(values);
  };

  const handleConferencePublicationsChange = (index, e) => {
    const values = [...conference_publications];
    values[index] = e.target.value;
    setConferencePublications(values);
  };

  const addJournalPublication = () => {
    setJournalPublications([...journal_publications, ""]);
  };

  const addConferencePublication = () => {
    setConferencePublications([...conference_publications, ""]);
  };
  const removeJournalPublication = (index) => {
    const values = [...journal_publications];
    values.splice(index, 1);
    setJournalPublications(values);
  };

  const removeConferencePublication = (index) => {
    const values = [...conference_publications];
    values.splice(index, 1);
    setConferencePublications(values);
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
  const setDataWithID = (data) => {
    setId(data._id);
    setName(data.name);
    setEnrolledCourse(data.enrolledCourse);
    setSubtitle(data.subtitle);
    setAreaOfInterest(data.areaOfInterest);
    setResearches(data.researches);
    setOverview(data.overview);
    setJournalPublications(data.publications.journal_publications);
    setConferencePublications(data.publications.conference_publications);
    setImage(data.urlToImage);
    setEmail(data.contactInformation.email);
    setLinkedIn(data.contactInformation.linkedIn);
    setGoogleScholarLink(data.contactInformation.googleScholarLink);
    setOrcidLink(data.contactInformation.orcidLink);
    setResearchGateId(data.contactInformation.researchGateId);
    setClickForMore(data.contactInformation.clickForMore);
    console.log(data.name);
  }
  const renderForm = () => {
    switch (activeForm) {
      case "upload":
        return (
          <div style={styles.formContainer}>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label htmlFor="name" style={styles.label}>
                  Add Name<span style={styles.labelRequired}>*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={handleNameChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="enrolledCourse" style={styles.label}>
                  Add Enrolled Course<span style={styles.labelRequired}>*</span>
                </label>
                <input
                  type="text"
                  id="enrolledCourse"
                  value={enrolledCourse}
                  onChange={handleEnrolledCourseChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="subtitle" style={styles.label}>
                  Add Subtitle<span style={styles.labelRequired}>*</span>
                </label>
                <input
                  type="text"
                  id="subtitle"
                  value={subtitle}
                  onChange={handleSubtitleChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="areaOfInterest" style={styles.label}>
                  Add Area of Interest
                  <span style={styles.labelRequired}>*</span>
                </label>
                <input
                  type="text"
                  id="areaOfInterest"
                  value={areaOfInterest}
                  onChange={handleAreaOfInterestChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="overview" style={styles.label}>
                  Add Overview<span style={styles.labelRequired}>*</span>
                </label>
                <input
                  type="text"
                  id="overview"
                  value={overview}
                  onChange={handleOverviewChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="researches" style={styles.label}>
                  Add Researches<span style={styles.labelRequired}>*</span>
                </label>
                <input
                  type="text"
                  id="researches"
                  value={researches}
                  onChange={handleResearchesChange}
                  style={styles.input}
                />
              </div>
              <h3 style={styles.heading}>Add Publications </h3>
              {journal_publications.map((jp, index) => (
                <div key={index} style={styles.formGroup}>
                  <label htmlFor={`journal_publications_${index}`} style={styles.label}>
                    Journal {index + 1}
                  </label>
                  <input
                    type="text"
                    id={`journal_publications_${index}`}
                    value={jp}
                    onChange={(e) => handleJournalPublicationsChange(index, e)}
                    style={styles.input}
                  />
                  <IconButton onClick={() => removeJournalPublication(index)} style={styles.deleteButton}>
                    <DeleteIcon />
                  </IconButton>
                </div>
              ))}
              <button type="button" onClick={addJournalPublication} style={styles.addButton}>
                + Add Journal Publication
              </button>
              {conference_publications.map((cp, index) => (
                <div key={index} style={styles.formGroup}>
                  <label htmlFor={`conference_publications_${index}`} style={styles.label}>
                    Conference {index + 1}
                  </label>
                  <input
                    type="text"
                    id={`conference_publications_${index}`}
                    value={cp}
                    onChange={(e) => handleConferencePublicationsChange(index, e)}
                    style={styles.input}
                  />
                  <IconButton onClick={() => removeConferencePublication(index)} style={styles.deleteButton}>
                    <DeleteIcon />
                  </IconButton>
                </div>
              ))}
              <button type="button" onClick={addConferencePublication} style={styles.addButton}>
                + Add Conference Publication
              </button>
              <h3 style={styles.heading}>Add Contact Info.</h3>
              <div style={styles.aformGroup}>
                <label htmlFor="email" style={styles.alabel}>
                  Email Id<span style={styles.labelRequired}>*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  style={styles.ainput}
                />
              </div>
              <div style={styles.aformGroup}>
                <label htmlFor="linkedIn" style={styles.alabel}>
                  LinkedIn<span style={styles.labelRequired}>*</span>
                </label>
                <input
                  type="url"
                  id="linkedIn"
                  value={linkedIn}
                  onChange={handleLinkedInChange}
                  style={styles.ainput}
                />
              </div>
              <div style={styles.aformGroup}>
                <label htmlFor="googleScholarLink" style={styles.alabel}>
                  Google Scholar
                </label>
                <input
                  type="url"
                  id="googleScholarLink"
                  value={googleScholarLink}
                  onChange={handleGoogleScholarLinkChange}
                  style={styles.ainput}
                />
              </div>
              <div style={styles.aformGroup}>
                <label htmlFor="orcidLink" style={styles.alabel}>
                  Orcid
                </label>
                <input
                  type="url"
                  id="orcidLink"
                  value={orcidLink}
                  onChange={handleOrcidLinkChange}
                  style={styles.ainput}
                />
              </div>
              <div style={styles.aformGroup}>
                <label htmlFor="researchGateId" style={styles.alabel}>
                  Research Gate
                </label>
                <input
                  type="url"
                  id="researchGateId"
                  value={researchGateId}
                  onChange={handleResearchGateIdChange}
                  style={styles.ainput}
                />
              </div>
              <div style={styles.editImageSection}>
                <div style={styles.formGroup}>
                  <label htmlFor="image" style={styles.label2}>
                    Add Image<span style={styles.labelRequired}>*</span>
                  </label>
                  <div style={styles.imageInputWrapper}>
                    <input
                      type="file"
                      id="image"
                      onChange={handleImageChange}
                      style={styles.imageInput}
                    />
                    <span style={styles.imageInputPlaceholder}>
                      {image ? image.name : "Drag Or Click"}
                    </span>
                  </div>
                </div>
                <div style={styles.formGroup}>
                  <label htmlFor="clickForMore" style={styles.label}>
                    Add Additional info.(if any)
                  </label>
                  <input
                    type="text"
                    id="clickForMore"
                    value={clickForMore}
                    onChange={(e) => setClickForMore(e.target.value)}
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
              </div>
            </form>
          </div>
        );
      case "edit":
        return (
          <div style={styles.formContainer}>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label htmlFor="name" style={styles.label}>
                  Edit Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={handleNameChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="enrolledCourse" style={styles.label}>
                  Edit Enrolled Course
                </label>
                <input
                  type="text"
                  id="enrolledCourse"
                  value={enrolledCourse}
                  onChange={handleEnrolledCourseChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="subtitle" style={styles.label}>
                  Edit Subtitle
                </label>
                <input
                  type="text"
                  id="subtitle"
                  value={subtitle}
                  onChange={handleSubtitleChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="areaOfInterest" style={styles.label}>
                  Edit Area of Interest
                </label>
                <input
                  type="text"
                  id="areaOfInterest"
                  value={areaOfInterest}
                  onChange={handleAreaOfInterestChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="researches" style={styles.label}>
                  Edit Researches
                </label>
                <input
                  type="text"
                  id="researches"
                  value={researches}
                  onChange={handleResearchesChange}
                  style={styles.input}
                />
              </div>
              <h3 style={styles.heading}>Edit Publications</h3>
              {journal_publications &&
                journal_publications.map((jp, index) => (
                  <div key={index} style={styles.formGroup}>
                    <label
                      htmlFor={`journal_publications_${index}`}
                      style={styles.label}
                    >
                      Journal {index + 1}
                    </label>
                    <input
                      type="text"
                      id={`journal_publications_${index}`}
                      value={jp}
                      onChange={(e) =>
                        handleJournalPublicationsChange(index, e)
                      }
                      style={styles.input}
                    />
                  </div>
                ))}
              <button
                type="button"
                onClick={addJournalPublication}
                style={styles.addButton}
              >
                + Edit Journal Publication
              </button>
              {conference_publications &&
                conference_publications.map((cp, index) => (
                  <div key={index} style={styles.formGroup}>
                    <label
                      htmlFor={`conference_publications_${index}`}
                      style={styles.label}
                    >
                      Conference {index + 1}
                    </label>
                    <input
                      type="text"
                      id={`conference_publications_${index}`}
                      value={cp}
                      onChange={(e) =>
                        handleConferencePublicationsChange(index, e)
                      }
                      style={styles.input}
                    />
                  </div>
                ))}
              <button
                type="button"
                onClick={addConferencePublication}
                style={styles.addButton}
              >
                + Edit Conference Publication
              </button>
              <h3 style={styles.heading}>Edit Contact Info.</h3>
              <div style={styles.aformGroup}>
                <label htmlFor="email" style={styles.alabel}>
                  Email Id
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  style={styles.ainput}
                />
              </div>
              <div style={styles.aformGroup}>
                <label htmlFor="linkedIn" style={styles.alabel}>
                  LinkedIn
                </label>
                <input
                  type="url"
                  id="linkedIn"
                  value={linkedIn}
                  onChange={handleLinkedInChange}
                  style={styles.ainput}
                />
              </div>
              <div style={styles.aformGroup}>
                <label htmlFor="googleScholarLink" style={styles.alabel}>
                  Google Scholar
                </label>
                <input
                  type="url"
                  id="googleScholarLink"
                  value={googleScholarLink}
                  onChange={handleGoogleScholarLinkChange}
                  style={styles.ainput}
                />
              </div>
              <div style={styles.aformGroup}>
                <label htmlFor="orcidLink" style={styles.alabel}>
                  Orcid
                </label>
                <input
                  type="url"
                  id="orcidLink"
                  value={orcidLink}
                  onChange={handleOrcidLinkChange}
                  style={styles.ainput}
                />
              </div>
              <div style={styles.aformGroup}>
                <label htmlFor="researchGateId" style={styles.alabel}>
                  Research Gate
                </label>
                <input
                  type="url"
                  id="researchGateId"
                  value={researchGateId}
                  onChange={handleResearchGateIdChange}
                  style={styles.ainput}
                />
              </div>
              <div style={styles.editImageSection}>
                <div style={styles.formGroup}>
                  <label htmlFor="image" style={styles.label2}>
                    Edit Image
                  </label>
                  <div style={styles.imageInputWrapper}>
                    <input
                      type="file"
                      id="image"
                      onChange={handleImageChange}
                      style={styles.imageInput}
                    />
                    <span style={styles.imageInputPlaceholder}>
                      {image ? image.name : "Drag Or Click"}
                    </span>
                  </div>
                </div>
                <div style={styles.formGroup}>
                  <label htmlFor="clickForMore" style={styles.label}>
                    Edit Additional info.
                  </label>
                  <input
                    type="text"
                    id="clickForMore"
                    value={clickForMore}
                    onChange={(e) => setClickForMore(e.target.value)}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <button
                    type="submit"
                    style={{ ...styles.btn, ...styles.submit }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </form>
          </div>
        );
      case "delete":
        return (
          <div style={styles.formContainer}>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <button
                  type="submit"
                  style={{ ...styles.btn, ...styles.submit }}
                >
                  Delete
                </button>
              </div>
            </form>
          </div>
        );
      case "search":
        return (
          <div
            className="post-container"
            style={{
              width: "700px",
              minHeight: "150px",
              maxHeight: "300px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              overflowY: "auto",
              padding: "10px",
              marginLeft: "15%",
            }}
          >
            {apiData != [] &&
              apiData.map((item, index) => (
                <div
                  key={item.index}
                  className="post-card"
                  style={{
                    display: "flex",
                    border: "1px solid #ddd",
                    marginBottom: "10px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    position: "relative",
                  }}
                  onClick={(e) => {
                    setDataWithID(item);
                  }}
                >
                  <img
                    src={item.urlToImage}
                    className="post-image"
                    alt="Post Image"
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                      padding: "3px",
                      borderRadius: "10px",
                      margin: "10px",
                    }}
                  />
                  <div className="post-content" style={{ flex: "1" }}>
                    <p
                      className="post-title"
                      style={{ marginLeft: "5px", marginTop: "10px" }}
                    >
                      <b style={{ fontSize: "16px" }}>Student Name:</b>{" "}
                      {item.name}
                    </p>
                    <p
                      className="post-description"
                      style={{
                        marginLeft: "5px",
                        marginBottom: "8px",
                        marginTop: "10px",
                      }}
                    >
                      <b style={{ fontSize: "16px" }}>Area of Interst:</b>{" "}
                      {item.areaOfInterest}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <ToastContainer/>
      <style>
        {`
           body {
             margin: 0;
            font-family: Abhya Libre Bold;
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

        <div style={styles.para}>
          <span style={styles.head1}> Ph.d Scholars</span>
        </div>

        <div style={styles.buttons}>
          <button
            style={{
              ...styles.btn,
              ...styles.upload,
              ...(hoveredButton === "upload" ? styles.buttonsHover : {}),
            }}
            onClick={() => setActiveForm("upload")}
            onMouseEnter={() => handleMouseEnter("upload")}
            onMouseLeave={handleMouseLeave}
          >
            Upload
          </button>
          <button
            style={{
              ...styles.btn,
              ...styles.edit,
              ...(hoveredButton === "edit" ? styles.buttonsHover : {}),
            }}
            onClick={() => setActiveForm("edit")}
            onMouseEnter={() => handleMouseEnter("edit")}
            onMouseLeave={handleMouseLeave}
          >
            Edit
          </button>
          <button
            style={{
              ...styles.btn,
              ...styles.delete,
              ...(hoveredButton === "delete" ? styles.buttonsHover : {}),
            }}
            onClick={() => setActiveForm("delete")}
            onMouseEnter={() => handleMouseEnter("delete")}
            onMouseLeave={handleMouseLeave}
          >
            Delete
          </button>
        </div>

        <div style={styles.search}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/54/54481.png"
            alt="Search"
            style={styles.searchIcon}
            onClick={() => {
              setActiveForm("search");
              handleInput(searchQuery);
            }}
          />
          <input
            type="text"
            placeholder="Search"
            style={styles.searchInput}
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div style={styles.student}>
          <span style={styles.number}>Total no. of students: {apiData.length}</span>
        </div>
        {renderForm()}
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
    marginLeft: "150px",
    fontFamily: "Abhaya Libre",
    fontSize: "3rem",
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

  buttons: {
    marginLeft: "25px",
    marginBottom: "50px",
    marginTop: "-5px",
    width: "0px",
    //  backgroundColor: "rgba(186, 224, 253, -0.81)",
  },
  search: {
    borderRadius: "5px",
    padding: "5px 10px",

    display: "flex",
    alignItems: "center",
    marginBottom: "150px",
    marginTop: "-18%",
    marginLeft: "70%",
  },
  searchInput: {
    padding: "5px",
    border: "1px solid #ccc",
    borderLeft: "none",
    borderRadius: "0 5px 5px 0",
  },

  searchIcon: {
    backgroundColor: "white",
    padding: "5px",
    borderRadius: "5px 0px 0px 5px ",
    border: "1px solid #ccc",
    width: "30px",
    height: "27px",
  },
  student: {
    fontWeight: "bold",
    marginTop: "-12%",
    marginLeft: "70%",
    marginBottom: "10%",
  },

  head1: {
    marginLeft: "6px",
  },
  para: {
    display: "flex",
    width: "14%",
    padding: "5px 10px",
    fontSize: "15px",
    fontWeight: "bold",
    marginLeft: "10px",
    marginTop: "-45px",
    marginBottom: "20px",
    borderRadius: "26px",

    backgroundColor: "rgba(186, 224, 253, 0.40)",
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
  btn: {
    marginBottom: "5px",

    color: "black",
    border: "none",
    cursor: "pointer",
  },
  buttonsHover: {
    backgroundColor: "rgba(186, 224, 253, 0.40)",
    color: "#212529",
  },
  upload: {
    backgroundColor: "rgba(186, 224, 253, -0.81)",
    color: "#212529",
    padding: "3px 20px",
  },
  addButton: {
    padding: "5px 10px",
    fontSize: "14px",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    marginTop: "10px",
    transition: "background-color 0.3s",
  },
  deleteButton: {
    color: "#ff0000",
    marginLeft: "17rem",
    marginTop: "-3rem",
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
  edit: {
    padding: "3px 30px",
    backgroundColor: "rgba(186, 224, 253, -0.81)",
    color: "#212529",
  },
  delete: {
    backgroundColor: "rgba(186, 224, 253, -0.81)",
    color: "#212529",
    padding: "3px 22px",
  },
  formContainer: {
    top: "-9%",
    left: "13%",
    position: "relative",
    width: "30%",
    display: "flex",
    justifyContent: "space-between",
  },
  form: {
    flex: 1,
    marginRight: "20px",
  },
  editImageSection: {
    top: "-57%",
    width: "100%",
    left: "170%",
    position: "relative",
  },
  formGroup: {
    // display:"flex",
    marginLeft: "22%",
    marginBottom: "11px",
  },
  aformGroup: {
    display: "flex",
    marginLeft: "22%",
    marginBottom: "11px",
  },
  labelRequired: {
    color: "red",
  },
  alabel: {
    width: "150px",
    fontWeight: "bolder",
    marginBottom: "5px",
    fontSize: "14px",
    color: "#333333",
  },
  label: {
    marginLeft: "3px",
    fontWeight: "bolder",
    marginBottom: "5px",
    fontSize: "14px",
    color: "#333333",
  },
  label2: {
    fontWeight: "bolder",
    marginBottom: "5px",
    fontSize: "14px",
    color: "#333333",
  },
  heading: {
    fontSize: "15px",
    marginLeft: "70px",
  },
  ainput: {
    width: "142%",
    padding: "1px",
    border: "1px solid #cccccc",
    borderRadius: "7px",
    fontSize: "14px",
    color: "#333333",
    marginRight: "-66px",
  },
  input: {
    width: "100%",
    padding: "4px",
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
  imageInputWrapper: {
    position: "relative",
    width: "69%",
    height: "132px",
    border: "2px solid #cccccc",
    borderRadius: "14px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
  imageInput: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0,
    cursor: "pointer",
  },
  imageInputPlaceholder: {
    fontSize: "14px",
    color: "#888888",
  },
  submit: {
    marginTop: "7px",
    marginLeft: "21px",
    backgroundColor: "#007bff",
    color: "#ffffff",
    padding: "6px 20px",
    border: "none",
    borderRadius: "14px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

export default PhdStudents;
