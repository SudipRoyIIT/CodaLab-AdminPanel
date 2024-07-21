import React, { useState, useEffect } from "react";
const BASE_URL = import.meta.env.VITE_BASE_URL;

import {
  Box,
  Button,
  Divider,
  Paper,
  InputBase,
  Typography,
  TextField,
  Snackbar,
  Alert,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/system";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Granted from "./Granted";
import Filed from "./Filed";
import { useAuth } from "./AuthContext";

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

const Patents = () => {
  const { userRole } = useAuth();
  const afApi = userRole === "admin" ? "Admin" : "Subadmin";
  const [currentAction, setCurrentAction] = useState("view");
  const [formData, setFormData] = useState({
    authors: "",
    title: "",
    date: "",
    patent_number: "",
    application_number: "",
    weblink: "",
    additionalInfo: "",
    status: "granted",
    publisher: "",
    pages: "",
  });

  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [patentCategory, setPatentCategory] = useState("granted");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [id, setID] = useState("");

  useEffect(() => {
    if (currentAction === "Search") {
      fetchData();
    }
  }, [currentAction]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/api/${afApi}/private/getASinglePublication/Patent/${search}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
        }
      );
      // const response = await fetch(`${API_URL}?category=${patentCategory}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        showNotification(
          "Failed to fetch data. Please try again later.",
          "error"
        );
      }
    } catch (error) {
      showNotification("Error fetching data. Please try again later.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (action) => {
    setCurrentAction(action);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (e) => {
    setPatentCategory(e.target.value);
  };

  const validateForm = () => {
    const requiredFields = [
      "authors",
      "title",
      "date",
      "patent_number",
      "application_number",
      "weblink",
      "additionalInfo",
      "status",
      "publisher",
      "pages",
    ];
    for (let field of requiredFields) {
      if (!formData[field]) {
        showNotification(`Please fill out the ${field} field.`, "warning");
        return false;
      }
    }
    return true;
  };

  const showNotification = (message, severity) => {
    setNotifications((prev) => [...prev, { message, severity }]);
    setOpenSnackbar(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.warn("Please fill out all required fields.");
      return;
    }

    if (currentAction === "upload") {
      const names = formData.authors.split(",").map((author) => author.trim());
      const ans = {
        authors: names,
        title: formData.title,
        date: formData.date,
        patent_number: formData.patent_number,
        application_number: formData.application_number,
        weblink: formData.weblink,
        additionalInfo: formData.additionalInfo,
        status: patentCategory === "granted" ? "Granted" : "Filed",
        publisher: formData.publisher,
        pages: formData.pages,
      };
      try {
        const url = `${BASE_URL}/api/${afApi}/private/createPublication/Patent`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
          body: JSON.stringify(ans),
        });

        if (!response.ok) {
          throw new Error("Failed to submit data");
        }

        const result = await response.json();
        console.log(result);
        console.log(ans);
        // Clear form data after successful upload
        setFormData({
          authors: "",
          title: "",
          date: "",
          patent_number: "",
          application_number: "",
          weblink: "",
          additionalInfo: "",
          status: "granted",
          publisher: "",
          pages: "",
        });
        toast.success("Data submitted successfully!");
      } catch (error) {
        console.error("Error submitting data:", error);
        toast.error("Error submitting data. Please try again later.");
      }
    }

    if (currentAction === "Edit") {
      console.log("Edit");
      const ans = {
        authors: Array.isArray(formData.authors)
          ? formData.authors.map((author) => author.trim())
          : formData.authors.split(", ").map((author) => author.trim()),
        title: formData.title,
        date: formData.date,
        patent_number: formData.patent_number,
        application_number: formData.application_number,
        weblink: formData.weblink,
        additionalInfo: formData.additionalInfo,
        status: patentCategory === "granted" ? "Granted" : "Filed",
        publisher: formData.publisher,
        pages: formData.pages,
      };
      try {
        const response = await fetch(
          `${BASE_URL}/api/${afApi}/private/UpdatePublication/Patent/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              authorization: "Bearer " + localStorage.getItem("accessToken"),
            },
            body: JSON.stringify(ans),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to update post");
        }
        toast.success("Data updated successfully!");
        return await response.json();
      } catch (error) {
        console.error("Error updating post:", error);

        toast.error("Error submitting data. Please try again later.");
        throw error;
      }
    }

    if (currentAction === "Delete") {
      const url = `${BASE_URL}/api/${afApi}/private/DeletePublication/Patent/${id}`;
      try {
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
        });

        if (!response.ok) {
          throw new Error("Failed to submit data");
        }

        const result = await response.json();
        console.log(result);
        console.log(id);

        // Clear form data after successful delete
        setFormData({
          authors: "",
          title: "",
          date: "",
          patent_number: "",
          application_number: "",
          weblink: "",
          additionalInfo: "",
          status: "granted",
          publisher: "",
          pages: "",
        });
        toast.success("Data deleted successfully!");
      } catch (error) {
        console.error("Error submitting data:", error);
        toast.error("Error submitting data. Please try again later.");
      }
    }
  };

  const setDataWithID = (data) => {
    setID(data._id);
    setFormData(data);
    console.log(data._id, data);
  };

  const renderContent = () => {
    switch (currentAction) {
      case "upload":
        return (
          <FormContainer>
            <FormControl
              sx={{ top: "-65px", position: "relative" }}
              component="fieldset"
            >
              <RadioGroup
                row
                aria-label="patent category"
                name="patentCategory"
                value={patentCategory}
                onChange={handleCategoryChange}
              >
                <FormControlLabel
                  value="granted"
                  control={<Radio />}
                  label="Granted"
                />
                <FormControlLabel
                  value="filed"
                  control={<Radio />}
                  label="Filed"
                />
              </RadioGroup>
            </FormControl>

            <FormField
              label="Authors"
              name="authors"
              value={formData.authors}
              onChange={handleChange}
            />
            <FormField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
            <FormField
              variant="outlined"
              size="small"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
            <FormField
              label="Patent Number"
              name="patent_number"
              value={formData.patent_number}
              onChange={handleChange}
            />
            <FormField
              label="Application Number"
              name="application_number"
              value={formData.application_number}
              onChange={handleChange}
            />
            <FormField
              label="Weblink"
              name="weblink"
              value={formData.weblink}
              onChange={handleChange}
            />
            <FormField
              label="Additional Information"
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
            />
            <FormField
              label="Publisher"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
            />
            <FormField
              label="Pages"
              name="pages"
              value={formData.pages}
              onChange={handleChange}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ alignSelf: "center", marginTop: "20px" }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </FormContainer>
        );
      case "Edit":
        return (
          <Box>
            <Typography variant="h6">Edit Patent</Typography>
            {renderFormFields()}
          </Box>
        );
      case "Delete":
        return (
          <Button
            variant="contained"
            color="primary"
            sx={{ padding: "12px 80px" }}
            onClick={handleSubmit}
          >
            Delete
          </Button>
        );
      case "Search":
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
              {loading ? (
                <Typography>Loading...</Typography>
              ) : (
                <>
                  {patentCategory === "granted" &&
                    searchResults &&
                    searchResults.DataForUpdate &&
                    searchResults.DataForUpdate.map((Patents, index) => (
                      <Granted
                        key={Patents._id}
                        {...Patents}
                        size={index + 1}
                        onClick={() => {
                          setDataWithID(Patents);
                        }}
                      />
                    ))}

                  {patentCategory === "filed" &&
                    searchResults &&
                    searchResults.DataForUpdate &&
                    searchResults.DataForUpdate.map((Patents, index) => (
                      <Filed
                        key={Patents._id}
                        {...Patents}
                        size={index + 1}
                        onClick={() => {
                          setDataWithID(Patents);
                        }}
                      />
                    ))}
                </>
              )}
            </Box>
          </Box>
        );
      default:
        return (
          <Box>
            <Typography variant="h6">Welcome to Patents Management</Typography>
          </Box>
        );
    }
  };

  const renderFormFields = () => (
    <FormContainer>
      <FormField
        label="Authors"
        name="authors"
        value={formData.authors}
        onChange={handleChange}
      />
      <FormField
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
      />
      <FormField
        label="Date"
        name="date"
        type="date"
        value={formData.date}
        onChange={handleChange}
      />
      <FormField
        label="Patent Number"
        name="patent_number"
        value={formData.patent_number}
        onChange={handleChange}
      />
      <FormField
        label="Application Number"
        name="application_number"
        value={formData.application_number}
        onChange={handleChange}
      />
      <FormField
        label="Weblink"
        name="weblink"
        value={formData.weblink}
        onChange={handleChange}
      />
      <FormField
        label="Additional Information"
        name="additionalInfo"
        value={formData.additionalInfo}
        onChange={handleChange}
      />
      <FormField
        label="Publisher"
        name="publisher"
        value={formData.publisher}
        onChange={handleChange}
      />
      <FormField
        label="Pages"
        name="pages"
        value={formData.pages}
        onChange={handleChange}
      />
      <Button
        variant="contained"
        color="primary"
        sx={{ alignSelf: "center", marginTop: "20px" }}
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </FormContainer>
  );

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
            Patents
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
            Add
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
        </Box>

        <Box
          sx={{
            display: "flex",
            mt: 3,
            mb: 2,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
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
                handleAction("Search");
              }}
              sx={{ p: "10px" }}
              aria-label="search"
            >
              <SearchIcon />
            </Button>
          </Paper>
        </Box>
        {renderContent()}
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

export default Patents;
