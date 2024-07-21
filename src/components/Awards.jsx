import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const BASE_URL = import.meta.env.VITE_BASE_URL;
  
const Awards = () => {
  const [field, setField] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [activeForm, setActiveForm] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [categories, setCategories] = useState([
    'Awards and Fellowships',
    'Invited Talks',
  ]);
  const [newCategory, setNewCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState("");
  const [awardsData, setAwardsData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [tempSelectedData, setTempSelectedData] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const fetchAwardsData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/Admin/private/getSelectedAwardsAndTalks?field=${searchQuery}`,{
        method: "GET",
        headers:{
          "authorization":'Bearer ' + localStorage.getItem('accessToken'),
        }
      })
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
   
      const data = await response.json();
      setAwardsData(data);
      setSearchPerformed(true);
      setActiveForm(null); // Reset activeForm state
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleNewCategoryChange = (e) => setNewCategory(e.target.value);
  const handleFieldChange = (e) => setField(e.target.value);
  const handleAdditionalInfoChange = (e) => setAdditionalInfo(e.target.value);
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setDropdownOpen(false);
  };

  const handleMouseEnter = (button) => {
    setHoveredButton(button);
  };

  const handleMouseLeave = () => {
    setHoveredButton(null);
  };

  const handleSelectData = (data) => {
    setTempSelectedData(data);
    toast.info(`Selected data: ${data.field} - ${data.additionalInfo}`, {
      autoClose: false,
      closeOnClick: true,
      onClose: () => setTempSelectedData(null),
      onOpen: () => {
        setSelectedData(data);
        setField(data.field);
        setAdditionalInfo(data.additionalInfo);
      }
    });
  };


const handleSubmit = async (e) => {
  e.preventDefault();
  const a = (selectedOption === "Awards and Fellowships") ? "Awards And Fellowships" : selectedOption;
  if (activeForm === "upload" && selectedOption && additionalInfo) {
    try {
      await fetch(`${BASE_URL}/api/Admin/private/createAwardsAndTalks`, {
        method: 'POST',
        headers: {
          "authorization":'Bearer ' + localStorage.getItem('accessToken'),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          field: a,
          additionalInfo: additionalInfo
        })
      });
      toast.success("Your data is uploaded");
      fetchAwardsData();
      setSelectedOption("");
      setAdditionalInfo("");
      setSearchPerformed(false); // Reset search performed state
    } catch (error) {
      console.error('Error uploading data:', error);
      toast.error('Error uploading data');
    }
  } else if (activeForm === "edit" && selectedData && field && additionalInfo) {
    try {
      await fetch(`${BASE_URL}/api/Admin/private/updateAwardsAndTalks/${selectedData._id}`, {
        method: 'PUT',
        headers: {
          "authorization":'Bearer ' + localStorage.getItem('accessToken'),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          field: field,
          additionalInfo: additionalInfo
        })
      });
      toast.success("Your data is edited");
      fetchAwardsData();
      setField("");
      setAdditionalInfo("");
      setSelectedData(null);
      setSearchPerformed(false); // Reset search performed state
    } catch (error) {
      console.error('Error editing data:', error);
      toast.error('Error editing data');
    }
  } else if (activeForm === "delete" && selectedData) {
    try {
      await fetch(`${BASE_URL}/api/Admin/private/deleteAwardsAndTalks/${selectedData._id}`, {
        method: 'DELETE',
        headers: {
          "authorization":'Bearer ' + localStorage.getItem('accessToken')
        }
      });
      toast.success("Your data is deleted");
      fetchAwardsData();
      setSelectedData(null);
      setSearchPerformed(false); // Reset search performed state
    } catch (error) {
      console.error('Error deleting data:', error);
      toast.error('Error deleting data');
    }
  } else {
    toast.warn("Please fill in all required fields");
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
                  Add Field<span style={styles.labelRequired}>*</span>
                </label>
                <input type="text" value={selectedOption} style={styles.input} readOnly />
                <div style={styles.arrow} onClick={toggleDropdown}>
                  <img src="https://cdn1.iconfinder.com/data/icons/arrows-vol-1-5/24/dropdown_arrow2-512.png" alt="Add" style={styles.addIcond} />
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
                <label htmlFor="additionalInfo" style={styles.label}>
                  Add additionalInfo<span style={styles.labelRequired}>*</span>
                </label>
                <input type="text" id="additionalInfo" value={additionalInfo} onChange={handleAdditionalInfoChange} style={styles.input} />
              </div>
              <div style={styles.formGroup}>
                <button type="submit" style={{ ...styles.btn, ...styles.submit }}>
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
                <label htmlFor="field" style={styles.label}>
                  Edit Field
                </label>
                <input type="text" id="field" value={field} onChange={handleFieldChange} style={styles.input} />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="additionalInfo" style={styles.label}>
                  Edit additionalInfo
                </label>
                <input type="text" id="additionalInfo" value={additionalInfo} onChange={handleAdditionalInfoChange} style={styles.input} />
              </div>
              <div style={styles.formGroup}>
                <button type="submit" style={{ ...styles.btn, ...styles.submit }}>
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
                <button type="submit" style={{ ...styles.btn, ...styles.submit }}>
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
          <h1 style={styles.title}>Awards</h1>
          <div style={styles.date}>
            {new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>
        <div style={styles.buttons}>
          <button style={{ ...styles.btn, ...styles.upload, ...(hoveredButton === "upload" ? styles.buttonsHover : {}) }} onClick={() => setActiveForm("upload")}
            onMouseEnter={() => handleMouseEnter("upload")}
            onMouseLeave={handleMouseLeave}>
            Upload
          </button>
          <button style={{ ...styles.btn, ...styles.edit, ...(hoveredButton === "edit" ? styles.buttonsHover : {}) }} onClick={() => setActiveForm("edit")}
            onMouseEnter={() => handleMouseEnter("edit")}
            onMouseLeave={handleMouseLeave}>
            Edit
          </button>
          <button style={{ ...styles.btn, ...styles.delete, ...(hoveredButton === "delete" ? styles.buttonsHover : {}) }} onClick={() => setActiveForm("delete")}
            onMouseEnter={() => handleMouseEnter("delete")}
            onMouseLeave={handleMouseLeave}>
            Delete
          </button>
        </div>
        <div style={styles.search}>
          <img src="https://cdn-icons-png.flaticon.com/512/54/54481.png" alt="Search" style={styles.searchIcon} onClick={fetchAwardsData} />
          <input type="text" placeholder="Search" style={styles.searchInput} value={searchQuery}
            onChange={handleSearchChange} />
        </div>
        {searchPerformed && !activeForm && (
          <div style={styles.fetched}>
            <h2 style={styles.heading}>Awards Data</h2>
            <ul>
              {awardsData.map(data => (
                <li key={data.field} onClick={() => handleSelectData(data)} style={{ cursor: "pointer", backgroundColor: selectedData?.field === data.field ? "rgba(186, 224, 253, 0.40)" : "transparent" }}>
                  {data.field}: {data.additionalInfo}
                </li>
              ))}
            </ul>
          </div>
        )}
        {renderForm()}
         <ToastContainer />
      </div>
    </div>
  );
};
  const styles = {
    container: {
      height: "88%",
      width: "75%",
      backgroundColor: "rgba(186, 224, 253, 0.19)",
      position:"relative",
      top:"-89%",
      left:"24%",
      fontFamily: "Abhaya Libre Bold",
    },
    header: {
      marginTop:"31px",
      borderBottom: "1px solid #ccc",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
    },
    title: {
      marginLeft:"150px",
      fontFamily: "Abhaya Libre", 
      fontSize: "3rem"
    },
    date: {
      marginBottom:"12px",
      backgroundColor: "#e6f2ff",
      border: "1px solid #007bff",
      padding: "5px 10px",
      borderRadius: "13px",
      marginRight: "10px",
      cursor: "pointer",
      fontSize: "14px",
    },
    buttons: {
      marginLeft:"170px",
      display: "flex",
      gap: "8px",
      marginBottom: "50px",
      marginTop:"-5px", 
    },
    search: {
      borderRadius: '5px',
      padding: '5px 10px',
      display: "flex",
      alignItems: "center",
      marginBottom: "150px",
      marginTop: "-8%",
      marginLeft: "70%",
    },
    
    popupOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    popup: {
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    popupButton: {
      backgroundColor: "#007bff",
      color: "#ffffff",
      padding: "10px 20px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      marginRight: "10px",
    },

  
    searchInput: {
      padding: "5px",
      border: "1px solid #ccc",
      borderLeft:"none",
      borderRadius: "0 5px 5px 0",
    },
    searchIcon: {
      backgroundColor: 'white',
      padding: "5px",
      borderRadius: "5px 0px 0px 5px ",
      border: "1px solid #ccc",
      width: "30px",
      height: "27px",
    },
    buttonHover:{
      backgroundColor: "rgba(186, 224, 253, 0.40)",
      color: "#212529",
    },
    btn: {
      marginBottom:"20px",
      padding: "5px 25px",
      color: "black",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      backgroundColor: "rgba(217, 217, 217, 0.37)",       
    },
    buttonsHover:{
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
      cursor:"pointer",
      marginLeft: '91%',
      marginTop: '-22px',
    },
    dropdown: {
      width:"78%",
      marginLeft:"78px",
      border: '1px solid #ccc',
      borderRadius: '4px',
      backgroundColor: '#fff',
    },
    option: {
      padding: '1px',
      cursor: 'pointer',
    },
    optionHover: {
      backgroundColor: '#f5f5f5',
    },
    addCategoryButton: {
      marginTop: '10px',
      backgroundColor: "#007bff",
      color: "#ffffff",
      padding: "3px 20px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background-color 0.3s",
    },
    addIcond: {
      marginBottom:'8px',
      width: '20px',
      height: '20px',
      marginRight: '15px',
      verticalAlign: 'middle',
    },
    addIcon: {
      width: '16px',
      height: '16px',
      marginRight: '1px',
      verticalAlign: 'middle',
    },
    formContainer: {
      bottom:"11%",
      left:"13%",
      position:"relative",
      width:"30%",
      display: "flex",
      justifyContent: "space-between",
    },
    form: {
      flex: 1,
      marginRight: "-60px",   
    },
    formGroup: {
      marginLeft:"22%",
      marginBottom: "11px",   
    },
    labelRequired :{
      color: "red",
    },
    label: {
      marginLeft:"3px",
      fontWeight: "bold",
      marginBottom: "5px",
      fontSize: "14px",
      color: "#333333",
    },
    heading:{
      fontSize:"15px",
      marginLeft:"70px",
      fontWeight:"bold"
    },
    input: {
      width: "100%",
      padding: "2px",
      border: "1px solid #cccccc",
      borderRadius: "7px",
      fontSize: "14px",
      color: "#333333",
    },
    fetched: {
      position: "relative",
      top: "6%",
      left: "6%",
      width: "95%",
    },
    submit: {
      marginTop:"20px",
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
  
  export default Awards;