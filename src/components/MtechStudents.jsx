import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const BASE_URL = import.meta.env.VITE_BASE_URL;
  
const MtechStudents = () => {
  const [apiData, setApiData] = useState([]);
  const [name, setName] = useState("");
  const [enrolledCourse, setEnrolledCourse] = useState("");
  const [domain, setDomain] = useState("");
  const [subTitle, setSubTitle] = useState(null);
  // setsubTitle;
  const [overview, setOverview] = useState("");
  const [researches, setResearches] = useState("");
  const [thesis_title, setThesisTitle] = useState(null);
  const [graduatingYear, setGraduatingYear] = useState("");
  const [areaOfInterest, setAreaOfInterest] = useState("");
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [image, setImage] = useState(null);
  const [email, setEmail] = useState([]);
  const [linkedIn, setLinkedIn] = useState("");
  const [googleScholarLink, setGoogleScholarLink] = useState("");
  const [orcidLink, setOrcidLink] = useState("");
  const [researchGateId, setResearchGateId] = useState("");
  const [clickForMore, setClickForMore] = useState("");
  const [activeForm, setActiveForm] = useState(null);
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleNameChange = (e) => setName(e.target.value);
  const handleEnrolledCourseChange = (e) => setEnrolledCourse(e.target.value);
  const handleDomainChange = (e) => setDomain(e.target.value);
  const handleSubTitleChange = (e) => setSubTitle(e.target.value);
  const handleOverviewChange = (e) => setOverview(e.target.value);
  const handleResearchesChange = (e) => setResearches(e.target.value);
  const handleThesisTitleChange = (e) => setThesisTitle(e.target.value);
  const handleGraduatingYearChange = (e) => setGraduatingYear(e.target.value);
  const handleAreaOfInterestChange = (e) => setAreaOfInterest(e.target.value);
  const [id, setId] = useState("");
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      console.log(reader.result);
      setImage(reader.result);
    });
    reader.readAsDataURL(file);
  };
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleLinkedInChange = (e) => setLinkedIn(e.target.value);
  const handleGoogleScholarLinkChange = (e) =>
    setGoogleScholarLink(e.target.value);
  const handleOrcidLinkChange = (e) => setOrcidLink(e.target.value);
  const handleResearchGateIdChange = (e) => setResearchGateId(e.target.value);
  const handleClickForMoreChange = (e) => setClickForMore(e.target.value);

  const [hoveredButton, setHoveredButton] = useState(null);
  const [currentDropdownOpen, setCurrentDropdownOpen] = useState(false);
  const [graduatedDropdownOpen, setGraduatedDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const formData = {
    name: "",
    enrolledCourse: "",
    domain: "",
    subtitle: null,
    graduatingYear: "",
    areaOfInterest: "",
    urlToImage: "",
    overview: "",
    researches: "",
    thesis_title: "",
    contactInformation: {
      email: [],
      linkedin: "",
      googleScholar: "",
      orcid: "",
      clickForMore: "",
      researchGateId: "",
    },
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
            (student) => student.enrolledCourse === "M.Tech"
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
    if (input) {
      fetchStudents();
    }
  }, [input]);

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
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      name: name,
      enrolledCourse: enrolledCourse,
      domain: domain,
      subtitle: subTitle,
      graduatingYear: graduatingYear,
      areaOfInterest: areaOfInterest,
      urlToImage: image,
      overview: overview,
      researches: researches,
      thesis_title: thesis_title,
      contactInformation: {
        email: email,
        linkedIn: linkedIn,
        googleScholarLink: googleScholarLink,
        orcidLink: orcidLink,
        clickForMore: clickForMore,
        researchGateId: researchGateId,
      },
    };

    console.log(formData);
    if (
      activeForm === "upload" &&
      name &&
      domain &&
      researches &&
      enrolledCourse &&
      subTitle &&
      overview &&
      areaOfInterest &&
      graduatingYear &&
      areaOfInterest &&
      overview &&
      thesis_title &&
      linkedIn &&
      email &&
      image
    ) {
      const formData = {
        name: name,
        enrolledCourse: enrolledCourse,
        domain: domain,
        subtitle: subTitle,
        graduatingYear: graduatingYear,
        areaOfInterest: areaOfInterest,
        urlToImage: image,
        overview: overview,
        researches: researches,
        thesis_title: thesis_title,
        contactInformation: {
          email: email,
          linkedIn: linkedIn,
          googleScholarLink: googleScholarLink,
          orcidLink: orcidLink,
          clickForMore: clickForMore,
          researchGateId: researchGateId,
        },
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
      domain &&
      enrolledCourse &&
      researches &&
      overview &&
      subTitle &&
      areaOfInterest &&
      graduatingYear &&
      areaOfInterest &&
      overview &&
      thesis_title &&
      linkedIn &&
      email &&
      image
    ) {
      const formData = {
        name: name,
        enrolledCourse: enrolledCourse,
        domain: domain,
        subtitle: subTitle,
        graduatingYear: graduatingYear,
        areaOfInterest: areaOfInterest,
        urlToImage: image,
        overview: overview,
        researches: researches,
        thesis_title: thesis_title,
        contactInformation: {
          email: email,
          linkedIn: linkedIn,
          googleScholarLink: googleScholarLink,
          orcidLink: orcidLink,
          clickForMore: clickForMore,
          researchGateId: researchGateId,
        },
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
          }
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
    } else if (activeForm === "delete") {
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

  const clearForm = () => {
    setName("");
    setEnrolledCourse("");
    setDomain("");
    setSubTitle("");
    setOverview("");
    setResearches("");
    setThesisTitle("");
    setGraduatingYear("");
    setAreaOfInterest("");
    setImage(null);
    setEmail("");
    setLinkedIn("");
    setGoogleScholarLink("");
    setOrcidLink("");
    setResearchGateId("");
    setClickForMore("");
  };

  const setDataWithID = (data) => {
    setId(data._id);
    setName(data.name);
    setEnrolledCourse(data.enrolledCourse);
    setDomain(data.domain);
    setSubTitle(data.subtitle);
    setOverview(data.overview);
    setResearches(data.researches);
    setThesisTitle(data.thesis_title);
    setGraduatingYear(data.graduatingYear);
    setAreaOfInterest(data.areaOfInterest);
    setImage(data.urlToImage);
    setEmail(data.contactInformation.email);
    setLinkedIn(data.contactInformation.linkedIn);
    setGoogleScholarLink(data.contactInformation.googleScholarLink);
    setOrcidLink(data.contactInformation.orcidLink);
    setResearchGateId(data.contactInformation.researchGateId);
    setClickForMore(data.contactInformation.clickForMore);
    console.log(data.name);
  };

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
                <label htmlFor="subTitle" style={styles.label}>
                  Add Subtitle<span style={styles.labelRequired}>*</span>
                </label>
                <input
                  type="text"
                  id="subTitle"
                  value={subTitle}
                  onChange={handleSubTitleChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="domain" style={styles.label}>
                  Add Domain <span style={styles.labelRequired}>*</span>
                </label>
                <input
                  type="text"
                  id="domain"
                  value={domain}
                  onChange={handleDomainChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="graduatingYear" style={styles.label}>
                  Add Graduating Year<span style={styles.labelRequired}>*</span>
                </label>
                <input
                  type="number"
                  id="graduatingYear"
                  value={graduatingYear}
                  onChange={handleGraduatingYearChange}
                  style={styles.input}
                  placeholder="YYYY"
                  min="1900"
                  max="2030"
                  step="1"
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="enrolledCourse" style={styles.label}>
                  Add Enrolled Course{" "}
                  <span style={styles.labelRequired}>*</span>
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
                  Add Overview
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
                <label htmlFor="thesisTitle" style={styles.label}>
                  Add Thesis Title
                </label>
                <input
                  type="text"
                  id="thesisTitle"
                  value={thesis_title}
                  onChange={handleThesisTitleChange}
                  style={styles.linput}
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

                <div style={styles.aformGroup}>
                  <label htmlFor="clickForMore" style={styles.alabel}>
                    Additional Info.
                  </label>
                  <input
                    type="url"
                    id="clickForMore"
                    value={clickForMore}
                    onChange={handleClickForMoreChange}
                    style={styles.ainput}
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
                <label htmlFor="domain" style={styles.label}>
                  Edit Domain
                </label>
                <input
                  type="text"
                  id="domain"
                  value={domain}
                  onChange={handleDomainChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="graduatingYear" style={styles.label}>
                  Edit Graduating Year
                </label>
                <input
                  type="number"
                  id="graduatingYear"
                  value={graduatingYear}
                  onChange={handleGraduatingYearChange}
                  style={styles.input}
                  placeholder="YYYY"
                  min="1900"
                  max="2030"
                  step="1"
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
              <div style={styles.formGroup}>
                <label htmlFor="overview" style={styles.label}>
                  Edit Overview
                </label>
                <input
                  type="text"
                  id="overview"
                  value={overview}
                  onChange={handleOverviewChange}
                  style={styles.input}
                />
              </div>
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
                  <label htmlFor="thesisTitle" style={styles.label}>
                    Edit Thesis Title
                  </label>
                  <input
                    type="text"
                    id="thesisTitle"
                    value={thesis_title}
                    onChange={handleThesisTitleChange}
                    style={styles.linput}
                  />
                </div>
                <div style={styles.aformGroup}>
                  <label htmlFor="clickForMore" style={styles.alabel}>
                    Additional Info.
                  </label>
                  <input
                    type="url"
                    id="clickForMore"
                    value={clickForMore}
                    onChange={handleClickForMoreChange}
                    style={styles.ainput}
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
      <ToastContainer />
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
          <span style={styles.head1}>M.Tech Students</span>
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

  buttons: {
    marginLeft: "25px",
    marginBottom: "50px",
    marginTop: "-5px",
    width: "0px",
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
  dropdownContent: {
    display: "none",
    position: "absolute",
    borderLeft: "1px solid rgb(204, 204, 204)",
    marginLeft: " -19px",
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
    //   fontWeight: "bolder",
    marginBottom: "5px",
    fontSize: "14px",
    color: "#333333",
  },
  label: {
    // fontWeight: "bold",
    marginBottom: "5px",
    fontSize: "14px",
    color: "#333333",
  },
  label2: {
    // fontWeight: "bolder",
    marginBottom: "5px",
    fontSize: "14px",
    color: "#333333",
  },
  heading: {
    fontSize: "15px",
    marginLeft: "70px",
  },
  ainput: {
    width: "152%",
    padding: "1px",
    border: "1px solid #cccccc",
    borderRadius: "7px",
    fontSize: "14px",
    color: "#333333",
    marginRight: "-66px",
  },
  linput: {
    width: "100%",
    padding: "1px",
    border: "1px solid #cccccc",
    borderRadius: "7px",
    fontSize: "14px",
    color: "#333333",
  },
  input: {
    width: "120%",
    padding: "1px",
    border: "1px solid #cccccc",
    borderRadius: "7px",
    fontSize: "14px",
    color: "#333333",
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
    marginTop: "9px",
    marginLeft: "21px",
    backgroundColor: "#007bff",
    color: "#ffffff",
    padding: "3px 20px",
    border: "none",
    borderRadius: "14px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

export default MtechStudents;
