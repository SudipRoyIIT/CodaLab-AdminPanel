import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Item from "./Item";

import { updatePost, deletePost, uploadPost } from "./apiServ";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const News = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [activeForm, setActiveForm] = useState(null); // State to manage active form
  const [apiData, setApiData] = useState([]); // State to store fetched API data
  const [show, setShow] = useState(false);
  const [id, setID] = useState(null);

  // Function to handle date change and API call
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setSelectedDate(selectedDate);
    fetchData(selectedDate);
  };
  function setIDwithDATA(id, data) {
    setID(id);
    setTitle(data.newsTopic);
    setDescription(data.newsDescription);
    setLink(data.url);
    setImage(data.urlToImage);
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      console.log(reader.result);
      setImage(reader.result);sure
    });

    reader.readAsDataURL(file);
  };

  const fetchData = async (selectedDate) => {
    const date = new Date(selectedDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    try {
      const response = await fetch(
        `${BASE_URL}/api/Admin/private/getselectnews?date=${year}-${month}-${day}`,
        {
          method: "GET",
          headers:{
            "authorization":'Bearer ' + localStorage.getItem('accessToken'),
          }
 
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setApiData(data);
      console.log(data);
      setShow(true);
    } catch (error) {
      console.error("Error fetching data:", error);
      setShow(false);
    }
  };
  const handleUpdatePost = async (id, updatedData) => {
    try {
      setShow(false);
      await updatePost(id, updatedData);
      toast.success('Post updated successfully!');
      // Handle UI update or state management as needed
    } catch (error) {
      toast.error(`Failed to update post: ${error.message}`);
      console.error('Failed to update post:', error);
      // Handle error gracefully
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost(id);
      toast.success('Post deleted successfully!');
    } catch (error) {
      toast.error(`Failed to delete post: ${error.message}`);
      console.error('Failed to delete post:', error);
    }
  };

  const handleUpload = async (newPost) => {
    try {
      setShow(false);
      await uploadPost(newPost);
      toast.success("Post uploaded successfully!");
      cleanfields();
    } catch (error) {
      toast.error("Failed to upload post: " + error.message);
    } console.error('Failed to upload post:', error);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (activeForm === "edit" && title && description && link) {
      const updatedData = {
        newsTopic: title,
        newsDescription: description,
        url: link,
      };
      if (image) {
        updatedData.urlToImage = image; // Attach the image file to updatedData
      }
      console.log(updatedData);
      handleUpdatePost(id, updatedData);
    }

    if (activeForm === "upload" ) {
      const currentDate = new Date();
      let isoString = currentDate.toISOString().replace("Z", "+00:00");
      const newPost = {
        newsTopic: title,
        newsDescription: description,
        url: link,
        date: isoString,
      };
      if (image) {
        newPost.urlToImage = image; // Attach the image file to updatedData
      }
      handleUpload(newPost);
    }
    // Additional logic for other forms like "upload" and "delete" should follow
  };

  // Function to handle delete action
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleLinkChange = (e) => {
    setLink(e.target.value);
  };

  function cleanfields() {
    setTitle("");
    setDescription("");
    setLink("");
    setImage("");
  }
  const renderForm = () => {
    switch (activeForm) {
      case "upload":
        return (
          <div>
            <div style={styles.formContainer}>
              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                  <label htmlFor="title" style={styles.label}>
                    Add Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={handleTitleChange}
                    style={styles.input}
                  />
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
  
                <div style={styles.editImageSection}>
                  <form onSubmit={handleSubmit} style={styles.editImageForm}>
                    <div style={styles.formGroup}>
                      <label htmlFor="image" style={styles.label2}>
                        Add Image
                      </label>
                      <div style={styles.imageInputWrapper}>
                        <input
                          type="file"
                          id="image"
                          accept="image/*"
                          onChange={handleImageUpload}
                          style={styles.imageInput}
                        />
                        <span style={styles.imageInputPlaceholder}>
                          {image ? image.name : "Drag Or Click"}
                        </span>
                      </div>
                    </div>
                  </form>
                  <div style={styles.formGroup}>
                    <button
                      type="Upload"
                      style={{ ...styles.btn, ...styles.submit }}
                    >
                      Upload
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        );
      case "edit":
        return (
          <div>
            {" "}
            <div style={styles.formContainer}>
              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                  <label htmlFor="title" style={styles.label}>
                    Edit Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={handleTitleChange}
                    style={styles.input}
                  />
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
  
                <div>
                  <div style={styles.editImageSection}>
                    <form onSubmit={handleSubmit} style={styles.editImageForm}>
                      <div style={styles.formGroup}>
                        <label htmlFor="image" style={styles.label2}>
                          Edit Image
                        </label>
                        <div style={styles.imageInputWrapper}>
                          <input
                            type="file"
                            id="image"
                            onChange={handleImageUpload}
                            style={styles.imageInput}
                          />
                          <span style={styles.imageInputPlaceholder}>
                            {image ? image.name : "Drag Or Click"}
                          </span>
                        </div>
                      </div>
                    </form>
                    <div style={styles.formGroup}>
                      <button
                        type="submit"
                        style={{ ...styles.btn, ...styles.submit }}
                      >
                        Submit
                      </button>
                    </div>
                    {/* </form> */}
                  </div>
                </div>
              </form>
            </div>
          </div>
        );
      case "delete":
        return (
          <div style={styles.formContainer}>
            <button
              type="button"
              onClick={handleDelete}
              style={{ ...styles.btn, ...styles.deleteBtn }}
            >
              Delete
            </button>
          </div>
        );
      case "date":
        return show ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <h3 style={{ marginLeft: "31%", marginBottom: "105%" }}>
                Data for {selectedDate}
              </h3>
              <div className="container my-1 d-flex justify-content-center">
                <div
                  className="post-container"
                  style={{
                 
                    width: "400px",
                    height: "270px",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                    overflowY: "auto",
                    padding: "10px",
                    marginTop: "371%",
                    marginLeft: "-23%",
                  }}
                >
                  {apiData &&
                    apiData.map((element) => (
                      <Item
                        {...element}
                        key={element._id}
                        onClick={() => setIDwithDATA(element._id, element)} // Pass the onClick handler
                      ></Item>
                    ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>No data available</>
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
            height: 100vh;
            flex-direction: column;
          }         
            `}
      </style>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>News</h1>
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
            onClick={() => {
              setActiveForm("upload");
              cleanfields();
            }}
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
            onClick={() => {setActiveForm("delete");
              setShow(true);
            }}
          >
            Delete
          </button>
          <div style={styles.search}>
            <input
              type="Date"
              className="forminput"
              name="date"
              value={selectedDate}
              onChange={handleDateChange}
              style={styles.searchInput}
              onClick={() => setActiveForm("date")}
            />
          </div>
        </div>
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
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    fontFamily: "Abhya Libre Bold",
    position: "relative",
    top: "-88%",
    left: "24%",
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
    fontWeight: "bold",
    marginLeft: "68px",
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
    marginLeft: "82px",
    display: "flex",
    gap: "24px",
    marginBottom: "50px",
    marginTop: "-5px",
  },
  search: {
    display: "flex",
    alignItems: "center",
  },
  searchInput: {
    padding: "5px",
    border: "1px solid #ccc",
    borderRight: "none",
    borderRadius: "4px",
    position: "relative",
    left: "290%",
  },

  searchIcon: {
    width: "16px",
    height: "14px",
    borderColor: "#ccc",
  },
  btn: {
    padding: "5px 25px",
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
    padding: "5px 30px",
    backgroundColor: "rgba(217, 217, 217, 0.37)",
    color: "#212529",
  },
  delete: {
    backgroundColor: "rgba(217, 217, 217, 0.37)",
    color: "#212529",
  },

  formContainer: {
    marginLeft: "13px",
    width: "35%",
    display: "flex",
    justifyContent: "space-between",
  },
  form: {
    flex: 1,
    marginRight: "20px",
  },
  editImageSection: {
    marginTop: "-56%",
    width: "80%",
    marginLeft: "164%",
  },
  formGroup: {
    marginLeft: "22%",
    marginBottom: "11px",
  },
  label: {
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

export default News;
