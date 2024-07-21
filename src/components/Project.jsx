import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  TextField,
  Divider,
  InputBase,
  InputLabel,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/system";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import DetailsProject from "./DetailsProject.jsx";
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

const Project = () => {
  const userRole = localStorage.getItem("userInfo");
  const afApi = userRole === "admin" ? "Admin" : "Subadmin";
  // console.log(afApi);
  const [currentAction, setCurrentAction] = useState("view");
  const [formData, setFormData] = useState({
    projectTitle: "",
    status: "",
    typeOfProject: "",
    sponsors: "",
    roleInProject: "",
    collaboration: "",
    total_grant_inr: "",
    total_grant_usd: "",
    date: "",
    start_date: "",
    end_date: "",
    additionalInfo: "",
  });
  const [isDelead, setIsDeleted] = useState(false);
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [apiData, setApiData] = useState([]);
  console.log("THis is apit dat", apiData);
  const [id, setID] = useState("");

  const handleButtonClick = () => {
    setInput(search);
    setIsDeleted(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const title = input;
      try {
        const response = await fetch(
          `${BASE_URL}/api/${afApi}/private/getASingleProjectOnBasisProjects/${title}`,
          {
            method: "GET",
            headers: {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const requiredFields = [
      "projectTitle",
      "status",
      "date",
      "start_date",
      "typeOfProject",
      "sponsors",
      "collaboration",
      "total_grant_inr",
      "total_grant_usd",
    ];
    for (let field of requiredFields) {
      if (!formData[field]) {
        showToast(`Please fill out the ${field} field.`, "warning");
        return false;
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
        // var Object = [...formData];

        formData.status = formData.status === "Ongoing Project" ? true : false;

        delete formData["_id"];
        console.log(formData);
        const response = await fetch(
          `${BASE_URL}/api/${afApi}/private/createProject`,
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
            projectTitle: "",
            status: "",
            typeOfProject: "",
            sponsors: "",
            roleInProject: "",
            collaboration: "",
            total_grant_inr: "",
            total_grant_usd: "",
            date: "",
            start_date: "",
            end_date: "",
            additionalInfo: "",
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
        console.log(formData);
        formData.status =
          formData.status === "Ongoing Project" || formData.status === true
            ? true
            : false;
        console.log(formData);
        const response = await fetch(
          `${BASE_URL}/api/${afApi}/private/updateProject/${id}`,
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
        `${BASE_URL}/api/${afApi}/private/DeleteProject/${id}`,
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
      setIsDeleted(true);
      // Assuming response.ok is true, update state

      const updatedData = apiData.DataForUpdate.filter(
        (Project) => Project._id !== id
      );
      setApiData({ DataForUpdate: updatedData });

      showToast("Data deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting data:", error);
      showToast("Failed to delete data", "error");
    }
  };

  const setDataWithID = (data) => {
    setID(data._id);
    data.status =
      data.status === true || data.status == "Ongoing Project"
        ? "Ongoing Project"
        : "Funded Project";
    console.log("This is data about data", data);
    setFormData(data);
    console.log("This is aft", id);
    console.log("This is aft", formData);
  };

  const renderContent = () => {
    if (currentAction === "upload") {
      return (
        <FormContainer>
          <Box sx={{ flex: "1 1 45%" }}>
            <Typography variant="body1" gutterBottom>
              Add Project Title <span style={{ color: "red" }}>*</span>
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="projectTitle"
              value={formData.projectTitle}
              onChange={handleChange}
              required
            />

            <Typography variant="body1" gutterBottom>
              Add Status <span style={{ color: "red" }}>*</span>
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              select
            >
              <MenuItem value="Ongoing Project">Ongoing Project</MenuItem>
              <MenuItem value="Funded Project">Funded Project</MenuItem>
            </FormField>
            <Typography variant="body1" gutterBottom>
              Add Scheme <span style={{ color: "red" }}>*</span>
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="typeOfProject"
              value={formData.typeOfProject}
              onChange={handleChange}
              required
            />

            <Typography variant="body1" gutterBottom>
              Add Sponsors <span style={{ color: "red" }}>*</span>
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="sponsors"
              value={formData.sponsors}
              onChange={handleChange}
              required
            />

            <Typography variant="body1" gutterBottom>
              Add Role in project <span style={{ color: "red" }}>*</span>
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="roleInProject"
              value={formData.roleInProject}
              onChange={handleChange}
              required
              select
            >
              <MenuItem value="PI">PI</MenuItem>
              <MenuItem value="Co-PI">Co-PI</MenuItem>
            </FormField>

            <Typography variant="body1" gutterBottom>
              Add Collaboration With<span style={{ color: "red" }}>*</span>
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="collaboration"
              value={formData.collaboration}
              onChange={handleChange}
            />

            <Typography variant="body1" gutterBottom>
              Add Total Grant INR<span style={{ color: "red" }}>*</span>
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="total_grant_inr"
              value={formData.total_grant_inr}
              onChange={handleChange}
              required
            />

            <Typography variant="body1" gutterBottom>
              Add Total Grant USD<span style={{ color: "red" }}>*</span>
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="total_grant_usd"
              value={formData.total_grant_usd}
              onChange={handleChange}
            />
            <Typography variant="body1" gutterBottom>
              Add Date <span style={{ color: "red" }}>*</span>
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
            <Typography variant="body1" gutterBottom>
              Add Start Date<span style={{ color: "red" }}>*</span>
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="start_date"
              type="date"
              value={formData.start_date}
              onChange={handleChange}
              required
            />
            <Typography variant="body1" gutterBottom>
              Add End Date
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="end_date"
              type="date"
              value={formData.end_date}
              onChange={handleChange}
              required
            />

            <Typography variant="body1" gutterBottom>
              Add any additional info.
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
            />

            <Button
              variant="contained"
              color="primary"
              sx={{ padding: "12px 80px" }}
              onClick={handleSubmit}
            >
              Upload
            </Button>
          </Box>
        </FormContainer>
      );
    }

    if (currentAction === "Edit") {
      return (
        <FormContainer>
          <Box sx={{ flex: "1 1 45%" }}>
            <Typography variant="body1" gutterBottom>
              Edit Project Title
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="projectTitle"
              value={formData.projectTitle}
              onChange={handleChange}
              required
            />
            <Typography variant="body1" gutterBottom>
              Edit Status
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              select
            >
              <MenuItem value="Ongoing Project">Ongoing Project</MenuItem>
              <MenuItem value="Funded Project">Funded Project</MenuItem>
            </FormField>

            <Typography variant="body1" gutterBottom>
              Edit Scheme
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="typeOfProject"
              value={formData.typeOfProject}
              onChange={handleChange}
              required
            />
            <Typography variant="body1" gutterBottom>
              Edit Sponsors
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="sponsors"
              value={formData.sponsors}
              onChange={handleChange}
              required
            />

            <Typography variant="body1" gutterBottom>
              Edit Role in Project
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="roleInProject"
              value={formData.roleInProject}
              onChange={handleChange}
            />

            <Typography variant="body1" gutterBottom>
              Edit Collaboration With
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="collaboration"
              value={formData.collaboration}
              onChange={handleChange}
            />

            <Typography variant="body1" gutterBottom>
              Edit Total Grant INR
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="total_grant_inr"
              value={formData.total_grant_inr}
              onChange={handleChange}
              required
            />

            <Typography variant="body1" gutterBottom>
              Edit Total Grant USD
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="total_grant_usd"
              value={formData.total_grant_usd}
              onChange={handleChange}
            />
            <Typography variant="body1" gutterBottom>
              Edit Date
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
            <Typography variant="body1" gutterBottom>
              Edit Start Date
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="start_date"
              type="date"
              value={formData.start_date}
              onChange={handleChange}
              required
            />
            <Typography variant="body1" gutterBottom>
              Edit End Date
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="end_date"
              type="date"
              value={formData.start_date}
              onChange={handleChange}
              required
            />

            <Typography variant="body1" gutterBottom>
              Add any additional info.
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ padding: "12px 80px" }}
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
          {!isDelead ? (
            <Box sx={{ marginBottom: "20px" }}>
              <div style={{ marginBottom: "10px", width: "59vw" }}>
                {formData.projectTitle !== "" ? (
                  <>
                    {`${formData.typeOfProject} project (${
                      formData.roleInProject
                    }) titled as "${
                      formData.projectTitle
                    }" under the Special Call for the Proposals for the Scheduled Tribes sponsored by ${
                      formData.sponsors
                    }${
                      formData.collaboration !== ""
                        ? ` in collaboration with ${formData.collaboration}`
                        : ""
                    }. ${formData.date}`}
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2 }}
                      onClick={() => handleDelete(formData._id)}
                    >
                      Delete
                    </Button>
                  </>
                ) : (
                  <h3>You have not selected anything</h3>
                )}
              </div>
            </Box>
          ) : (
            <h3>Successfully deleted</h3>
          )}
        </Box>
      );
    }
    if (currentAction === "Search") {
      return (
        <Box
          sx={{
            height: "1000px",
            overflowY: "auto",
            width: "100%",
            p: 2,
          }}
        >
          <div style={{}}>
            <ol style={{ marginLeft: "5%" }}>
              <h1>Ongoing Project</h1>
              {apiData &&
                apiData.DataForUpdate &&
                apiData.DataForUpdate.map(
                  (item, index) =>
                    (item.status === "Ongoing Project" ||
                      item.status === true) && (
                      <div
                        onClick={() => {
                          setDataWithID(item);
                        }}
                        _
                      >
                        <li style={{ marginBottom: "10px", width: "59vw" }}>
                          {item.typeOfProject} project ({item.roleInProject})
                          titled as "{item.projectTitle}" under the Special Call
                          for the Proposals for the Scheduled Tribes sponsored
                          by {item.sponsors}
                          {item.collaboration !== "" &&
                            `India in collaboration with ${item.collaboration}`}
                          .{item.date}
                        </li>
                      </div>
                    )
                )}
            </ol>
            <ol style={{ marginLeft: "5%" }}>
              <h1>Funded Project</h1>
              {apiData &&
                apiData.DataForUpdate &&
                apiData.DataForUpdate.map(
                  (item, index) =>
                    (item.status === "Funded Project" || !item.status) && (
                      <div
                        onClick={() => {
                          setDataWithID(item);
                        }}
                      >
                        <li style={{ marginBottom: "10px", width: "59vw" }}>
                          {item.typeOfProject} project ({item.roleInProject})
                          titled as "{item.projectTitle}" under the Special Call
                          for the Proposals for the Scheduled Tribes sponsored
                          by {item.sponsors}
                          {item.collaboration !== "" &&
                            `India in collaboration with ${item.collaboration}`}
                          .{item.date}
                        </li>
                      </div>
                    )
                )}
            </ol>
          </div>
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
            Projects
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
            onClick={() => handleAction("upload")}
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

export default Project;
