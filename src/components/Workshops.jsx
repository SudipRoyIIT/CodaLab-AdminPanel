import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  TextField,
  Divider,
  InputBase,
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

const Workshops = () => {
  const { userRole } = useAuth();
  const afApi = userRole === "admin" ? "Admin" : "Subadmin";
  const [currentAction, setCurrentAction] = useState("view");
  const [formData, setFormData] = useState({
    names: "",
    title: "",
    workshop: "",
    pages: "",
    location: "",
    year: "",
    weblink: "",
    awardedBy: "",
    ranking: "",
    additionalInfo: "",
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
          `${BASE_URL}/api/${afApi}/private/getASinglePublication/Workshops/${input}`,
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
    const requiredFields = ["names", "title", "workshop", "year", "weblink"];
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
        console.log(formData);
        delete formData["_id"];
        console.log(formData);
        const response = await fetch(
          `${BASE_URL}/api/${afApi}/private/createPublication/Workshops`,
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
            names: "",
            title: "",
            workshop: "",
            pages: "",
            location: "",
            year: "",
            weblink: "",
            awardedBy: "",
            ranking: "",
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
        const response = await fetch(
          `${BASE_URL}/api/${afApi}/private/UpdatePublication/Workshops/${id}`,
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
        `${BASE_URL}/api/${afApi}/private/DeletePublication/Workshops/${id}`,
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
      const updatedData = apiData.DataForUpdate.filter(
        (workshop) => workshop._id !== id
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
    setFormData(data);
  };

  const renderContent = () => {
    if (currentAction === "upload") {
      return (
        <FormContainer>
          <Box sx={{ flex: "1 1 45%" }}>
            <Typography variant="body1" gutterBottom>
              Add Names <span style={{ color: "red" }}>*</span>
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="names"
              value={formData.names}
              onChange={handleChange}
              required
            />

            <Typography variant="body1" gutterBottom>
              Add Title <span style={{ color: "red" }}>*</span>
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <Typography variant="body1" gutterBottom>
              Add Workshop <span style={{ color: "red" }}>*</span>
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="workshop"
              value={formData.workshop}
              onChange={handleChange}
              required
            />

            <Typography variant="body1" gutterBottom>
              Add Pages
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="pages"
              value={formData.pages}
              onChange={handleChange}
            />

            <Typography variant="body1" gutterBottom>
              Add Location
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />

            <Typography variant="body1" gutterBottom>
              Add Year<span style={{ color: "red" }}>*</span>
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
            />

            <Typography variant="body1" gutterBottom>
              Add Ranking
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="ranking"
              value={formData.ranking}
              onChange={handleChange}
            />
            <Typography variant="body1" gutterBottom>
              Add Awarded By
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="awardedBy"
              value={formData.awardedBy}
              onChange={handleChange}
            />
            <Typography variant="body1" gutterBottom>
              Add Weblink<span style={{ color: "red" }}>*</span>
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="weblink"
              type="url"
              value={formData.weblink}
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
              Edit Names
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="names"
              value={formData.names}
              onChange={handleChange}
            />

            <Typography variant="body1" gutterBottom>
              Edit Title
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />

            <Typography variant="body1" gutterBottom>
              Edit Workshop
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="workshop"
              value={formData.workshop}
              onChange={handleChange}
            />

            <Typography variant="body1" gutterBottom>
              Edit Pages
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="pages"
              value={formData.pages}
              onChange={handleChange}
            />

            <Typography variant="body1" gutterBottom>
              Edit Location
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />

            <Typography variant="body1" gutterBottom>
              Edit Year
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="year"
              value={formData.year}
              onChange={handleChange}
            />

            <Typography variant="body1" gutterBottom>
              Edit Ranking
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="ranking"
              value={formData.ranking}
              onChange={handleChange}
            />
            <Typography variant="body1" gutterBottom>
              Edit Awarded By
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="awardedBy"
              value={formData.awardedBy}
              onChange={handleChange}
            />
            <Typography variant="body1" gutterBottom>
              Edit Weblink
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="weblink"
              value={formData.weblink}
              onChange={handleChange}
            />

            <Typography variant="body1" gutterBottom>
              Edit any additional info.
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
          {apiData &&
            Array.isArray(apiData.DataForUpdate) &&
            apiData.DataForUpdate.map((workshops) => (
              <Box key={workshops._id} sx={{ marginBottom: "20px" }}>
                <DetailsWorkshops {...workshops} />
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => handleDelete(workshops._id)}
                >
                  Delete
                </Button>
              </Box>
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
            {apiData &&
              Array.isArray(apiData.DataForUpdate) &&
              apiData.DataForUpdate.map((workshops, index) => (
                <DetailsWorkshops
                  key={workshops._id}
                  {...workshops}
                  size={index + 1}
                  onClick={() => setDataWithID(workshops)}
                />
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
            Workshop
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

export default Workshops;
