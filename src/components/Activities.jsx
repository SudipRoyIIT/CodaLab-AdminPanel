import React, { useState, useEffect } from "react";

import { toast, ToastContainer } from "react-toastify";

const Activities = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [activeForm, setActiveForm] = useState(null);
  const [search, setSearch] = useState("");
  const [hoveredButton, setHoveredButton] = useState(null);
  const [categories, setCategories] = useState([
    "Major Services in IIT Roorkee",
    "Outreach From Research Activities",
    "Professional Memberships and Affiliations",
  ]);
  const [newCategory, setNewCategory] = useState("");
  const [input, setInput] = useState("");
  const [apiData, setApiData] = useState({});
  const [id, setId] = useState("");
  console.log(search);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/Admin/private/getSelectedActivity/?activity_name=${input}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: "Bearer " + localStorage.getItem("accessToken"),
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setApiData(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (input) {
      fetchData();
    }
  }, [input]);

  const updateActivates = async (achievementId) => {
    const ans = {
      activity_name: name,
      details: details,
    };
    try {
      const response = await fetch(
        `${BASE_URL}/api/Admin/private/updateActivity/${achievementId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
          body: JSON.stringify(ans),
        }
      );

      if (response.ok) {
        toast.success("Achievement updated successfully");
        setName("");
        setDetails("");
      } else {
        const errorData = await response.json();
        console.error("Failed to update achievement:", errorData);
        toast.error("Failed to update achievement");
      }
    } catch (error) {
      console.error("Error updating achievement:", error);
      toast.error("An error occurred while updating achievement");
    }
  };

  const uploadActivates = async () => {
    const formData = {
      activity_name: selectedOption,
      details: details,
    };

    console.log("This is from api uplode", formData);
    try {
      const response = await fetch(
        "http://localhost:3001/api/Admin/private/createActivity",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast.success("Achievement uploaded successfully");
        setName("");
        setDetails("");
      } else {
        const errorData = await response.json();
        console.error("Failed to upload achievement:", errorData);
        toast.error("Failed to upload achievement");
      }
    } catch (error) {
      console.error("Error uploading achievement:", error);
      toast.error("An error occurred while uploading achievement");
    }
  };

  const deleteActivates = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/Admin/private/deleteActivity/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast.success("Achievement deleted successfully");
      } else {
        const errorData = await response.json();
        console.error("Failed to delete achievement:", errorData);
        toast.error("Failed to delete achievement");
      }
    } catch (error) {
      console.error("Error deleting achievement:", error);
      toast.error("An error occurred while deleting achievement");
    }
  };

  const handleNameChange = (e) => setName(e.target.value);
  const handleDetailsChange = (e) => setDetails(e.target.value);
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const handleButtonClick = async () => {
    await setInput(search);
    console.log("asdf");
    setActiveForm("search");
    return search;
  };

  const handleDeleteClick = async (activates) => {
    setId(activates._id);
    console.log(activates);
    setName(activates.activity_name);
    setDetails(activates.details);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setDropdownOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (activeForm === "upload" && selectedOption && details) {
      await uploadActivates();
      
    } else if (activeForm === "edit" && name && details) {
      updateActivates(id);
     
    } else if (activeForm === "delete") {
      await deleteActivates(id);
     
    } else {
     
    }
  };

  const renderForm = () => {
    switch (activeForm) {
      case "upload":
        return (
          <div style={styles.formContainer}>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Add Activity name<span style={styles.labelRequired}>*</span>
                </label>
                <input
                  type="text"
                  value={selectedOption}
                  style={styles.input}
                  readOnly
                />
                <div style={styles.arrow} onClick={toggleDropdown}>
                  <img
                    src="https://cdn1.iconfinder.com/data/icons/arrows-vol-1-5/24/dropdown_arrow2-512.png"
                    alt="Add"
                    style={styles.addIcond}
                  />
                </div>
              </div>
              {dropdownOpen && (
                <div style={styles.dropdown}>
                  {categories.map((category) => (
                    <div
                      key={category}
                      style={styles.option}
                      onClick={() => handleOptionClick(category)}
                    >
                      {category}
                    </div>
                  ))}
                </div>
              )}
              <div style={styles.formGroup}>
                <label htmlFor="details" style={styles.label}>
                  Add Details<span style={styles.labelRequired}>*</span>
                </label>
                <input
                  type="text"
                  id="details"
                  value={details}
                  onChange={handleDetailsChange}
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
                <label style={styles.label}>
                  Edit Activity name
                </label>
                <input
                  type="text"
                  value={selectedOption}
                  style={styles.input}
                  readOnly
                />
                <div style={styles.arrow} onClick={toggleDropdown}>
                  <img
                    src="https://cdn1.iconfinder.com/data/icons/arrows-vol-1-5/24/dropdown_arrow2-512.png"
                    alt="Add"
                    style={styles.addIcond}
                  />
                </div>
              </div>
              {dropdownOpen && (
                <div style={styles.dropdown}>
                  {categories.map((category) => (
                    <div
                      key={category}
                      style={styles.option}
                      onClick={() => handleOptionClick(category)}
                    >
                      {category}
                    </div>
                  ))}
                </div>
              )}
              <div style={styles.formGroup}>
                <label htmlFor="details" style={styles.label}>
                  Edit Details
                </label>
                <input
                  type="text"
                  id="details"
                  value={details}
                  onChange={handleDetailsChange}
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
      case "search":
        return (
          <div style={styles.activates}>
            <h3>Activates </h3>
            <ul>
              {Array.isArray(apiData) &&
                apiData.map((activates, index) => (
                  <div
                    onClick={() => handleDeleteClick(activates)}
                    style={{
                      padding: "8px",
                      cursor: "pointer",
                      border: "1px solid black",
                      borderRadius: "10px",
                      margin: "10px",
                    }}
                  >
                    <p key={index}>
                      <p>
                        <b>Title:</b> {activates.activity_name}
                      </p>
                      <p>
                        <b>details :</b> {activates.details}
                      </p>
                    </p>
                  </div>
                ))}
            </ul>
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
        <ToastContainer />
        <div style={styles.header}>
          <h1 style={styles.title}>Activities</h1>
          <div style={styles.date}>
            {new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>
        <div style={styles.buttons}>
          <button
            style={{
              ...styles.btn,
              ...styles.upload,
              ...(hoveredButton === "upload" ? styles.buttonsHover : {}),
            }}
            onClick={() => setActiveForm("upload")}
            // onMouseEnter={() => handleMouseEnter("upload")}
            // onMouseLeave={handleMouseLeave}
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
            // onMouseEnter={() => handleMouseEnter("edit")}
            // onMouseLeave={handleMouseLeave}
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
            // onMouseEnter={() => handleMouseEnter("delete")}
            // onMouseLeave={handleMouseLeave}
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
              handleButtonClick().then((e) => {
                console.log(e);
                console.log("Hello");
              });
            }}
          />
          <input
            type="text"
            placeholder="Search"
            style={styles.searchInput}
            onChange={(e) => setSearch(e.target.value)}
          />
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
  buttons: {
    marginLeft: "170px",
    display: "flex",
    gap: "8px",
    marginBottom: "50px",
    marginTop: "-5px",
  },
  activates: {
    marginBottom: "20px",
    marginLeft: "2rem",
    borderRadius: "2px solid  black",
  },
  search: {
    borderRadius: "5px",
    padding: "5px 10px",

    display: "flex",
    alignItems: "center",
    marginBottom: "150px",
    marginTop: "-8%",
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

  buttonHover: {
    backgroundColor: "rgba(186, 224, 253, 0.40)",
    color: "#212529",
  },
  btn: {
    marginBottom: "20px",
    padding: "5px 25px",
    color: "black",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    backgroundColor: "rgba(217, 217, 217, 0.37)",
  },
  buttonsHover: {
    backgroundColor: "rgba(186, 224, 253, 0.40)",
    color: "#212529",
  },
  upload: {
    color: "#212529",
    padding: "3px 20px",
  },

  edit: {
    padding: "3px 30px",
    color: "#212529",
  },
  delete: {
    color: "#212529",
    padding: "3px 22px",
  },
  arrow: {
    cursor: "pointer",
    marginLeft: "91%",
    marginTop: "-22px",
  },
  dropdown: {
    width: "78%",
    marginLeft: "78px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    backgroundColor: "#fff",
  },
  option: {
    padding: "1px",
    cursor: "pointer",
    // borderBottom: '1px solid #eee',
  },
  optionHover: {
    backgroundColor: "#f5f5f5",
  },
  addCategoryButton: {
    marginTop: "10px",
    backgroundColor: "#007bff",
    color: "#ffffff",
    padding: "3px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  addIcond: {
    marginBottom: "8px",
    width: "20px",
    height: "20px",
    marginRight: "15px",
    verticalAlign: "middle",
  },
  addIcon: {
    width: "16px",
    height: "16px",
    marginRight: "1px",
    verticalAlign: "middle",
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
    //   fontWeight: "bolder",
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
    padding: "2px",
    border: "1px solid #cccccc",
    borderRadius: "7px",
    fontSize: "14px",
    color: "#333333",
  },
  submit: {
    marginTop: "20px",
    marginLeft: "12px",
    backgroundColor: "#007bff",
    color: "#ffffff",
    padding: "3px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

export default Activities;
