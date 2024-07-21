import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  TextField,
  Divider,
  InputBase,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/system";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DetailsWorkshops from "./DetailsWorkshops";
import { useAuth } from "../components/AuthContext";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Input = styled("input")({
  display: "none",
});

const FormContainer = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  padding: "20px",
  borderRadius: "10px",
  flexWrap: "wrap",
});

const FormField = styled(TextField)({
  width: "82%",
  marginBottom: "20px",
  backgroundColor: "#fff",
});

const Teachings = () => {
  const userRole = localStorage.getItem("userInfo");
  const afApi = userRole === "admin" ? "Admin" : "Subadmin";
  console.log(afApi);
  const [currentAction, setCurrentAction] = useState("view");
  const [formData, setFormData] = useState({
    year: "",
    semester: "",
    courses: [
      {
        subjectCode: "",
        subjectName: "",
        studentsStrength: null,
        additionalInfo: "",
      },
    ],
  });

  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [apiData, setApiData] = useState([]);
  const [id, setID] = useState("");

  const handleButtonClick = () => {
    setInput(search);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/${afApi}/private/getSemester/${input}`,
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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (input) {
      fetchData();
    }
  }, [input]);

  const handleAction = (action) => {
    setCurrentAction(action);
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedValue =
      name === "studentsStrength" ? parseInt(value, 10) : value;

    if (name === "year" || name === "semester") {
      setFormData({ ...formData, [name]: updatedValue });
    } else {
      const updatedCourses = formData.courses.map((course, i) =>
        i === index ? { ...course, [name]: updatedValue } : course
      );
      setFormData({ ...formData, courses: updatedCourses });
    }
  };

  const handleYearChange = (e) => {
    setFormData({ ...formData, year: e.target.value });
  };

  const handleYearBlur = () => {
    const { year } = formData;
    const yearPattern = /^\d{4}-\d{4}$/;
    if (year && !yearPattern.test(year)) {
      showToast("Please enter the year in the format YYYY-YYYY.", "warning");
    } else {
      const [startYear, endYear] = year.split("-").map(Number);
      if (startYear >= endYear) {
        showToast("End year should be greater than start year.", "warning");
      }
    }
  };
  const addCourseField = () => {
    setFormData({
      ...formData,
      courses: [
        ...formData.courses,
        {
          subjectCode: "",
          subjectName: "",
          studentsStrength: "",
          additionalInfo: "",
        },
      ],
    });
  };

  const validateForm = () => {
    const requiredFields = ["year", "semester"];
    for (let field of requiredFields) {
      if (!formData[field]) {
        showToast(`Please fill out the ${field} field.`, "warning");
        return false;
      }
    }

    for (let course of formData.courses) {
      const courseFields = ["subjectCode", "subjectName", "studentsStrength"];
      for (let field of courseFields) {
        if (!course[field]) {
          showToast(
            `Please fill out the ${field} field in all courses.`,
            "warning"
          );
          return false;
        }
      }
    }

    return true;
  };

  const showToast = (message, type) => {
    toast(message, { type });
  };

  const handleSubmit = async () => {
    if (currentAction === "upload") {
      if (!validateForm()) {
        return;
      }
      try {
        delete formData["_id"];
        const sem = formData.semester.split(" ")[0];
        console.log(sem);
        const response = await fetch(
          `${BASE_URL}/api/${afApi}/private/createSemester/${sem}`,
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
          showToast("Data uploaded successfully!", "success");

          // Clear form fields after successful submission
          setFormData({
            year: "",
            semester: "",
            courses: [
              {
                subjectCode: "",
                subjectName: "",
                studentsStrength: null,
                additionalInfo: "",
              },
            ],
          });
        } else {
          throw new Error("Failed to upload data");
        }
      } catch (error) {
        console.error("Error uploading data:", error);
        showToast("Failed to upload data", "error");
      }
    }

    if (currentAction === "Edit") {
      try {
        const sem = formData.semester.split(" ")[0];
        const response = await fetch(
          `${BASE_URL}/api/${afApi}/private/UpdateSelectedSemester/${id}/${sem}`,
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
        showToast("Data updated successfully!", "success");
        return await response.json();
      } catch (error) {
        console.error("Error updating post:", error);
        showToast("Failed to update data", "error");
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/${afApi}/private/deleteSelectedSemester/${id}`,
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

      // Assuming response.ok is true, update state
      const updatedData1 = apiData.DataForSpringSemesterCollection.filter(
        (Teachings) => Teachings._id !== id
      );
      const updatedData2 = apiData.DataForautumnSemesterCollection.filter(
        (Teachings) => Teachings._id !== id
      );
      setApiData({
        DataForSpringSemesterCollection: updatedData1,
        DataForautumnSemesterCollection: updatedData2,
      });

      showToast("Data deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting data:", error);
      showToast("Failed to delete data", "error");
    }
  };

  const setDataWithID = (data, sem) => {
    setID(data._id);
    console.log(data, sem);
    setFormData(data);
    data.semester = sem;
  };

  const renderContent = () => {
    if (currentAction === "upload") {
      return (
        <FormContainer>
          <Box sx={{ flex: "1 1 45%" }}>
            <Typography variant="body1" gutterBottom>
              Add Year<span style={{ color: "red" }}>*</span>
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="year"
              value={formData.year}
              onChange={handleYearChange}
              placeholder="YYYY-YYYY"
              required
            />

            <Typography variant="body1" gutterBottom>
              Add Semester <span style={{ color: "red" }}>*</span>
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              required
              select
            >
              <MenuItem value="springSemester">Spring Semester</MenuItem>
              <MenuItem value="autumnSemester">Autumn Semester</MenuItem>
            </FormField>

            {formData.courses.map((course, index) => (
              <React.Fragment key={index}>
                <Typography variant="body1" gutterBottom>
                  Add Course<span style={{ color: "red" }}>*</span>
                </Typography>
                <FormField
                  variant="outlined"
                  size="small"
                  name="subjectName"
                  value={course.subjectName}
                  onChange={(e) => handleChange(e, index)}
                  required
                />
                <Typography variant="body1" gutterBottom>
                  Add Course Code<span style={{ color: "red" }}>*</span>
                </Typography>
                <FormField
                  variant="outlined"
                  size="small"
                  name="subjectCode"
                  value={course.subjectCode}
                  onChange={(e) => handleChange(e, index)}
                />
                <Typography variant="body1" gutterBottom>
                  Add Students Strength<span style={{ color: "red" }}>*</span>
                </Typography>
                <FormField
                  variant="outlined"
                  size="small"
                  name="studentsStrength"
                  value={course.studentsStrength}
                  type="number"
                  onChange={(e) => handleChange(e, index)}
                  required
                />
                <Typography variant="body1" gutterBottom>
                  Add any additional info.
                </Typography>
                <FormField
                  variant="outlined"
                  size="small"
                  name="additionalInfo"
                  value={course.additionalInfo}
                  onChange={(e) => handleChange(e, index)}
                />
              </React.Fragment>
            ))}
            <Button
              variant="contained"
              color="primary"
              sx={{ padding: "12px 80px", mt: 2 }}
              onClick={addCourseField}
            >
              + Add another course
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ padding: "12px 80px", mt: 2 }}
              onClick={handleSubmit}
            >
              Upload
            </Button>
          </Box>
        </FormContainer>
      );
    }
    // Add similar logic for the Edit action
    if (currentAction === "Edit") {
      return (
        <FormContainer>
          <Box sx={{ flex: "1 1 45%" }}>
            <Typography variant="body1" gutterBottom>
              Edit Year
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="year"
              value={formData.year}
              onChange={handleYearChange}
              placeholder="YYYY-YYYY"
              required
            />
            <Typography variant="body1" gutterBottom>
              Edit Semester
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              // select
              disabled
            ></FormField>
            {formData.courses.map((course, index) => (
              <React.Fragment key={index}>
                <Typography variant="body1" gutterBottom>
                  Edit Course
                </Typography>
                <FormField
                  variant="outlined"
                  size="small"
                  name="subjectName"
                  value={formData.subjectName}
                  onChange={(e) => handleChange(e, index)}
                  required
                />
                <Typography variant="body1" gutterBottom>
                  Edit Course Code
                </Typography>
                <FormField
                  variant="outlined"
                  size="small"
                  name="subjectCode"
                  value={course.subjectCode}
                  onChange={(e) => handleChange(e, index)}
                />
                <Typography variant="body1" gutterBottom>
                  Edit Students Strength
                </Typography>
                <FormField
                  variant="outlined"
                  size="small"
                  name="studentsStrength"
                  value={course.studentsStrength}
                  type="number"
                  onChange={(e) => handleChange(e, index)}
                  required
                />
                <Typography variant="body1" gutterBottom>
                  Edit any additional info.
                </Typography>
                <FormField
                  variant="outlined"
                  size="small"
                  name="additionalInfo"
                  value={course.additionalInfo}
                  onChange={(e) => handleChange(e, index)}
                />
              </React.Fragment>
            ))}

            <Button
              variant="contained"
              color="primary"
              sx={{ padding: "12px 80px", mt: 2 }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Box>
        </FormContainer>
      );
    }

    if (currentAction === "Delete") {
      return (
        <Box sx={{ padding: "20px" }}>
          {apiData &&
            apiData.DataForSpringSemesterCollection &&
            apiData.DataForSpringSemesterCollection.map((item, index) => (
              <div key={index}>
                <h3>Spring Collection</h3>
                <ul style={{ marginBottom: "5px" }}>
                  <div onClick={() => setDataWithID(item, "springSemester")}>
                    <li>
                      <b>{item.year}</b>
                    </li>
                    {item &&
                      item.courses.map((course, idx) => (
                        <p style={{ marginBottom: "0px" }} key={idx}>
                          <span>{course.subjectCode}</span>:{" "}
                          {course.subjectName}
                          {course.additionalInfo && (
                            <span> ({course.additionalInfo})</span>
                          )}
                          {course.studentsStrength && (
                            <p
                              style={{ marginBottom: "0px" }}
                            >{`Student Strength:  ${course.studentsStrength}`}</p>
                          )}
                        </p>
                      ))}
                  </div>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </Button>
                </ul>
              </div>
            ))}
          {apiData &&
            apiData.DataForautumnSemesterCollection &&
            apiData.DataForautumnSemesterCollection.map((item, index) => (
              <div key={index}>
                <h3>Autumn Collection</h3>
                <ul style={{ marginBottom: "5px" }}>
                  <div onClick={() => setDataWithID(item, "autumnSemester")}>
                    <li>
                      <b>{item.year}</b>
                    </li>
                    {item &&
                      item.courses.map((course, idx) => (
                        <p style={{ marginBottom: "0px" }} key={idx}>
                          <span>{course.subjectCode}</span>:{" "}
                          {course.subjectName}
                          {course.additionalInfo && (
                            <span> ({course.additionalInfo})</span>
                          )}
                          {course.studentsStrength && (
                            <p
                              style={{ marginBottom: "0px" }}
                            >{`Student Strength:  ${course.studentsStrength}`}</p>
                          )}
                        </p>
                      ))}
                  </div>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </Button>
                </ul>
              </div>
            ))}
        </Box>
      );
    }
    if (currentAction === "Search") {
      return (
        <Box
          sx={{
            height: "500px",
            overflowY: "auto",
            width: "100%",
            p: 2,
          }}
        >
          <Box style={{ padding: "10px" }}>
            {/* {apiData &&
              Array.isArray(apiData.DataForUpdate) &&
              apiData.DataForUpdate.map((Teachings, index) => (
                <DetailsTeachings
                  key={Teachings._id}
                  {...Teachings}
                  size={index + 1}
                  onClick={() => setDataWithID(Teachings)}
                />
              ))} */}
            {apiData &&
              apiData.DataForSpringSemesterCollection &&
              apiData.DataForSpringSemesterCollection.map((item, index) => (
                <div
                  key={index}
                  onClick={() => setDataWithID(item, "springSemester")}
                >
                  <h3>Spring Collection</h3>
                  <ul style={{ marginBottom: "5px" }}>
                    <div>
                      <li>
                        <b>{item.year}</b>
                      </li>
                      {item &&
                        item.courses.map((course, idx) => (
                          <p style={{ marginBottom: "0px" }} key={idx}>
                            <span>{course.subjectCode}</span>:{" "}
                            {course.subjectName}
                            {course.additionalInfo && (
                              <span> ({course.additionalInfo})</span>
                            )}
                            {course.studentsStrength && (
                              <p
                                style={{ marginBottom: "0px" }}
                              >{`Student Strength:  ${course.studentsStrength}`}</p>
                            )}
                          </p>
                        ))}
                    </div>
                  </ul>
                </div>
              ))}
            {apiData &&
              apiData.DataForautumnSemesterCollection &&
              apiData.DataForautumnSemesterCollection.map((item, index) => (
                <div
                  key={index}
                  onClick={() => setDataWithID(item, "autumnSemester")}
                >
                  <h3>Autumn Collection</h3>
                  <ul style={{ marginBottom: "5px" }}>
                    <div>
                      <li>
                        <b>{item.year}</b>
                      </li>
                      {item &&
                        item.courses.map((course, idx) => (
                          <p style={{ marginBottom: "0px" }} key={idx}>
                            <span>{course.subjectCode}</span>:{" "}
                            {course.subjectName}
                            {course.additionalInfo && (
                              <span> ({course.additionalInfo})</span>
                            )}
                            {course.studentsStrength && (
                              <p
                                style={{ marginBottom: "0px" }}
                              >{`Student Strength:  ${course.studentsStrength}`}</p>
                            )}
                          </p>
                        ))}
                    </div>
                  </ul>
                </div>
              ))}
          </Box>
        </Box>
      );
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        width: "73%",
        border: "2px solid #6DB9F8",
        position: "relative",
        marginLeft: "23.5%",
        height: "1500px",
        bottom: "1500px",
      }}
    >
      <ToastContainer />
      <Box sx={{ flex: 1, backgroundColor: "#e6f2ff", p: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1.5,
          }}
        >
          <Typography sx={{ fontFamily: "Abhaya Libre", fontSize: "3rem" }}>
            Teachings
          </Typography>
          <div style={styles.date}>
            {new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </div>
        </Box>
        <Divider />

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#d9d9d9",
              fontFamily: "Abhaya Libre",
              color: "#000",
            }}
            onClick={() => {
              handleAction("upload");
              setFormData({
                year: "",
                semester: "",
                courses: [
                  {
                    subjectCode: "",
                    subjectName: "",
                    studentsStrength: null,
                    additionalInfo: "",
                  },
                ],
              });
            }}
          >
            Upload
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#d9d9d9",
              fontFamily: "Abhaya Libre",
              color: "#000",
            }}
            onClick={() => handleAction("Edit")}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#d9d9d9",
              fontFamily: "Abhaya Libre",
              color: "#000",
            }}
            onClick={() => handleAction("Delete")}
          >
            Delete
          </Button>
          <Paper
            component="div"
            sx={{ display: "flex", alignItems: "center", ml: "auto" }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search"
              inputProps={{ "aria-label": "search" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button
              onClick={() => {
                handleButtonClick();
                handleAction("Search");
              }}
              sx={{ p: "10px" }}
              aria-label="search"
            >
              <SearchIcon />
            </Button>
          </Paper>
        </Box>

        <Box sx={{ mt: 4 }}>{renderContent()}</Box>
      </Box>
    </Box>
  );
};

const styles = {
  date: {
    backgroundColor: "#e6f2ff",
    border: "1px solid #007bff",
    padding: "5px 10px",
    borderRadius: "13px",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default Teachings;
