import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
const BASE_URL = import.meta.env.VITE_BASE_URL;
      

const Btech = () => {
  const userRole = localStorage.getItem("userInfo");
  const afApi = userRole === "admin" ? "Admin" : "Subadmin";
  const [name, setName] = useState("");
  const [enrolledIn, setEnrolledIn] = useState("B.Tech");
  const [graduating_year, setGraduating_year] = useState(0);
  const [branch, setBranch] = useState("");
  const [thesis_title, setThesis_title] = useState("");
  const [current_working_status, setCurrent_working_status] = useState("");
  const [activeForm, setActiveForm] = useState(null);
  const [names, setNames] = useState([{ id: 1, value: "" }]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [totalStudents, setTotalStudents] = useState(0);

  const handleEnrolledInChange = (e) => setEnrolledIn(e.target.value);
  const handleGraduating_yearChange = (e) => setGraduating_year(e.target.value);
  const handleBranchChange = (e) => setBranch(e.target.value);
  const handleThesis_titleChange = (e) => setThesis_title(e.target.value);
  const handleCurrent_working_statusChange = (e) =>
    setCurrent_working_status(e.target.value);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredButton, setHoveredButton] = useState(null);
  const [currentDropdownOpen, setCurrentDropdownOpen] = useState(false);
  const [graduatedDropdownOpen, setGraduatedDropdownOpen] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  console.log(selectedData._id);
  const [apiData, setApiData] = useState({});
  const [formData, setFormData] = useState([
    {
      name: "",
      enrolledIn: "",
      current_working_status: "",
      graduating_year: 0,
      thesis_title: "",
      branch: "",
      _id: "",
    },
  ]);
  console.log("This is form data", formData);

  const navigate = useNavigate();

  const [tempSelectedData, setTempSelectedData] = useState(null);

  console.log("This is name", name);
  const handleSelectData = (data) => {
    console.log("This data will selected", data);
    setTempSelectedData(data);
    setName(data.name);
    setEnrolledIn(data.enrolledIn || "");
    setGraduating_year(data.graduating_year || "");
    setThesis_title(data.thesis_title || "");
    setCurrent_working_status(data.current_working_status || "");
    setBranch(data.branch || "");
    setSelectedData(data);
  };
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };
  const fetchData = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/${afApi}/private/getGraduatedStudents?name="B.tech"`,
        {
          method: "GET",
          headers: {
            "authorization": "Bearer " + localStorage.getItem('accessToken'),
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      const btechData = data.filter((data) => data.enrolledIn === "B.Tech");
      setActiveForm(null); // Reset activeForm state
      setSearchPerformed(true);
      setSearchResults(btechData);
      console.log(btechData.length); // Assuming data is an array of data objects matching the search query
      setTotalStudents(btechData.length);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    }
  };

  useEffect(() => {
    let data = [];
    if (
      searchResults &&
      Array.isArray(searchResults) &&
      searchResults.length > 0
    ) {
      searchResults.forEach((result, index) => {
        if (Array.isArray(result.name)) {
          data[index] = {
            name: result.name.join(","),
            enrolledIn: result.enrolledIn,
            current_working_status: result.current_working_status,
            graduating_year: result.graduating_year,
            thesis_title: result.thesis_title,
            branch: result.branch,
            _id: result._id,
          };
        } else {
          data[index] = {
            name: result.name,
            enrolledIn: result.enrolledIn,
            current_working_status: result.current_working_status,
            graduating_year: result.graduating_year,
            thesis_title: result.thesis_title,
            branch: result.branch,
            _id: result._id,
          };
        }
      });
    }

    setFormData(data);
  }, [searchResults]);

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
    if (activeForm === "upload") {
      console.log(names)
      if (
        names &&
        graduating_year &&
        branch &&
        thesis_title &&
        current_working_status &&
        enrolledIn
      ) {
        var namess = [];
        names.map((item) => (
          namess.push(item.value)
        ))
        console.log(namess)
        await uploadData({
          name: namess,
          graduating_year,
          branch,
          thesis_title,
          current_working_status,
          enrolledIn,
        });
        toast.success("Data uploaded successfully");
        setSearchPerformed(false);
        clearForm();
      } else {
        throw new Error("Please fill in all required fields");
      }
    } else if (
      activeForm === "edit" &&
      names &&
      enrolledIn &&
      graduating_year &&
      branch &&
      thesis_title &&
      current_working_status
    ) {
      if (
        names &&
        enrolledIn &&
        graduating_year &&
        branch &&
        thesis_title &&
        current_working_status
      ) {
        await editData(selectedData._id, {
          name: name.split(",").map((name) => name.trim()),
          graduating_year,
          branch,
          thesis_title,
          current_working_status,
          enrolledIn,
        });
        toast.success("Data edited successfully");
        setSearchPerformed(false);
        toast.success("Data edited successfully");
        clearForm();
        alert("Data edited successfully ");
      } else {
        console.log({
          names,
          graduating_year,
          branch,
          thesis_title,
          current_working_status,
          enrolledIn,
        });
        throw new Error("Please fill in all required fields");
      }
    } else if (activeForm === "delete") {
      await deleteData(selectedData._id);
      toast.success("Data deleted successfully");
      clearForm();
      alert("Your data is deleted");
      clearForm();
    } else {
      alert("Please fill in all required fields");
    }
  };

  const uploadData = async (data) => {
    console.log(data)
    try {
      const response = await fetch(
        `${BASE_URL}/api/${afApi}/private/createNewStudent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to upload data");
      }
      return await response.json();
    } catch (error) {
      console.error("Error uploading data:", error);
      throw error;
    }
  };

  const editData = async (id, data) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/${afApi}/private/updateNewStudent/${selectedData._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to edit data");
      }
      return await response.json();
    } catch (error) {
      console.error("Error editing data:", error);
      throw error;
    }
  };

  const deleteData = async (id) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/${afApi}/private/deleteNewStudent/${selectedData._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete data");
      }
      return await response.json();
    } catch (error) {
      console.error("Error deleting data:", error);
      throw error;
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const clearForm = () => {
    setNames([{ id: 1, value: "" }]);
    // setName("");
    // setEnrolledIn("");
    // setGraduating_year("");
    // setBranch("");
    // setThesis_title("");
    // setCurrent_working_status("");
  };

  const addNewNameInput = () => {
    setNames([...names, { id: names.length + 1, value: "" }]);
  };

  const handleNameChange = (index, value) => {
    const newNames = [...names];
    newNames[index].value = value;
    setNames(newNames);
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
                {names.map((name, index) => (
                  <div key={name.id} style={styles.nameInputContainer}>
                    <input
                      type="text"
                      value={name.value}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                      style={styles.input}
                      placeholder={`Name ${index + 1}`}
                    />
                  </div>
                ))}
                <div style={styles.option} onClick={addNewNameInput}>
                  <img
                    src="https://icons.veryicon.com/png/o/miscellaneous/linear-icon-27/plus-circle-12.png"
                    alt="Add"
                    style={styles.addIcon}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="enrolledIn" style={styles.label}>
                  Add EnrolledIn<span style={styles.labelRequired}>*</span>
                </label>
                <input
                  type="text"
                  id="enrolledIn"
                  value={enrolledIn}
                  onChange={handleEnrolledInChange}
                  style={styles.input}
                  disabled
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="graduating_year" style={styles.label}>
                  Add Graduated Year<span style={styles.labelRequired}>*</span>
                </label>
                <input
                  type="number"
                  id="graduating_year"
                  value={graduating_year}
                  onChange={handleGraduating_yearChange}
                  style={styles.input}
                  placeholder="YYYY"
                  min="1900"
                  max={new Date().getFullYear()}
                  step="1"
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="branch" style={styles.label}>
                  Add Branch<span style={styles.labelRequired}>*</span>
                </label>
                <input
                  type="text"
                  id="branch"
                  value={branch}
                  onChange={handleBranchChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="thesis_title" style={styles.label}>
                  Add Thesis Title<span style={styles.labelRequired}>*</span>
                </label>
                <input
                  type="text"
                  id="thesis_title"
                  value={thesis_title}
                  onChange={handleThesis_titleChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="current_working_status" style={styles.label}>
                  Add Current Working Status
                  <span style={styles.labelRequired}>*</span>
                </label>
                <input
                  type="text"
                  id="current_working_status"
                  value={current_working_status}
                  onChange={handleCurrent_working_statusChange}
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
                <label htmlFor="name" style={styles.label}>
                  Edit Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="enrolledIn" style={styles.label}>
                  Edit EnrolledIn
                </label>
                <input
                  type="text"
                  id="enrolledIn"
                  value={"B.Tech"}
                  onChange={handleEnrolledInChange}
                  style={styles.input}
                  disabled
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="graduating_year" style={styles.label}>
                  Edit Graduated Year
                </label>
                <input
                  type="number"
                  id="graduating_year"
                  value={graduating_year}
                  onChange={handleGraduating_yearChange}
                  style={styles.input}
                  placeholder="YYYY"
                  min="1900"
                  max={new Date().getFullYear()}
                  step="1"
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="branch" style={styles.label}>
                  Edit Branch
                </label>
                <input
                  type="text"
                  id="branch"
                  value={branch}
                  onChange={handleBranchChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="thesis_title" style={styles.label}>
                  Edit Thesis Title
                </label>
                <input
                  type="text"
                  id="thesis_title"
                  value={thesis_title}
                  onChange={handleThesis_titleChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="current_working_status" style={styles.label}>
                  Edit Current Working Status
                </label>
                <input
                  type="text"
                  id="current_working_status"
                  value={current_working_status}
                  onChange={handleCurrent_working_statusChange}
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
      default:
        return null;
    }
  };
  return (
    <div className="app">
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
          <span style={styles.head1}> B.Tech Students</span>
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
            onClick={handleSearchSubmit}
          />
          <input
            type="text"
            placeholder="Search"
            style={styles.searchInput}
            onChange={handleSearchInputChange}
          />
        </div>
        <div style={styles.student}>
          <span>Total no. of students: {totalStudents}</span>
        </div>
        <div style={styles.dataContainer}>
          {formData && !activeForm && (
            <div style={styles.scrollableContainer}>
              <div>
                <h2>Search Results:</h2>
                <ul style={styles.resultsList}>
                  {formData.map((data) => (
                    <li
                      key={data.id}
                      onClick={() => handleSelectData(data)}
                      style={styles.resultItem}
                    >
                      <div style={styles.containerbox}>
                        <p>Name: {data.name}</p>
                        <p>Graduating Year: {data.graduating_year}</p>
                        <p>Thesis Title: {data.thesis_title}</p>
                        <p>Branch: {data.branch}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        {renderForm()}
      </div>
      <ToastContainer/>
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

  containerbox: {
    backgroundColor: "rgba(186, 224, 253, 0.19)",
    position: "relative",
    border: "0.5px solid black",
    marginTop: "2px",
    fontFamily: "Abhaya Libre Bold",
  },
  scrollableContainer: {
    maxHeight: "100%", // Adjust as per your layout needs
    overflowY: "auto",
  },
  dataContainer: {
    marginBottom: 10,
    maxHeight: 400, // Example max height for the data container
    overflowY: "auto", // Enable vertical scrolling when content exceeds container height
    padding: 10,
    borderRadius: 4,
    marginLeft: "2rem",
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
    fontSize: "3rem ",

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
    marginLeft: "72%",
    marginBottom: "10%",
  },
  head1: {
    marginLeft: "9px",
  },
  para: {
    display: "flex",
    width: "14%",
    padding: "3px 8px",
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
  addIcon: {
    width: "16px",
    height: "16px",
    verticalAlign: "middle",
  },
  option: {
    padding: "1px",
    cursor: "pointer",
    marginLeft: "5px",
  },
  nameInputContainer: {
    marginTop: "10px",
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
    marginRight: "-60px",
  },

  formGroup: {
    marginLeft: "22%",
    marginBottom: "11px",
  },

  labelRequired: {
    color: "red",
  },

  label: {
    marginLeft: "3px",
    marginBottom: "5px",
    fontSize: "14px",
    color: "#333333",
  },

  heading: {
    fontSize: "15px",
    marginLeft: "70px",
  },

  input: {
    width: "100%",
    padding: "1px",
    border: "1px solid #cccccc",
    borderRadius: "7px",
    fontSize: "14px",
    color: "#333333",
  },
  submit: {
    marginTop: "5px",
    marginLeft: "18px",
    backgroundColor: "#007bff",
    color: "#ffffff",
    padding: "3px 20px",
    border: "none",
    borderRadius: "14px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

export default Btech;
