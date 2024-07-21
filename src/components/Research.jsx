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

const Research = () => {
  const [currentAction, setCurrentAction] = useState("view");
  const [formData, setFormData] = useState({
    researcharea_name: "",
    details: [],
  });
  const [lineInput, setLineInput] = useState("");
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
          `${BASE_URL}/api/Admin/private/getSelectedResearchArea/${input}`,
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
        console.log(data);
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

  const handleLineChange = (e) => {
    setLineInput(e.target.value);
  };

  const addLine = () => {
    if (lineInput.trim()) {
      setFormData({ ...formData, details: [...formData.details, lineInput] });
      setLineInput("");
    }
  };

  const LinesEmpty = () => {
    setFormData({
      researcharea_name: formData.researcharea_name,
      details: [],
    });
  };

  const validateForm = () => {
    if (!formData.researcharea_name) {
      showToast("Please fill out the research title field.", "warning");
      return false;
    }
    return true;
  };

  const showToast = (message, type) => {
    toast(message, { type });
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    console.log(formData);
    const endpoint =
      currentAction === "upload"
        ? `${BASE_URL}/api/Admin/private/createResearchArea`
        : `${BASE_URL}/api/Admin/private/UpdateResearchArea/${id}`;

    const method = currentAction === "upload" ? "POST" : "PUT";

    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          authorization: "Bearer " + localStorage.getItem("accessToken"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to ${currentAction === "upload" ? "upload" : "update"} data`
        );
      }

      showToast(
        `${
          currentAction === "upload" ? "Data uploaded" : "Data updated"
        } successfully!`,
        "success"
      );

      if (currentAction === "upload") {
        setFormData({
          researcharea_name: "",
          details: [],
        });
      }

      return await response.json();
    } catch (error) {
      console.error(
        `Error ${currentAction === "upload" ? "uploading" : "updating"} data:`,
        error
      );
      showToast(
        `Failed to ${currentAction === "upload" ? "upload" : "update"} data`,
        "error"
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/Admin/private/deleteSelectedResearchArea/${id}`,
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

      // Filter out the deleted item from the current state
      const updatedData = apiData.DataForResearchAreaCollection.filter(
        (Research) => Research._id !== id
      );
      setApiData({ DataForResearchAreaCollection: updatedData });

      showToast("Data deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting data:", error);
      showToast("Failed to delete data", "error");
    }
  };

  const setDataWithID = (data) => {
    setID(data._id);
    setFormData({
      researcharea_name: data.researcharea_name,
      details: data.details,
    });

    console.log(data);
  };

  const renderContent = () => {
    if (currentAction === "upload" || currentAction === "Edit") {
      return (
        <FormContainer>
          <Box sx={{ flex: "1 1 45%" }}>
            <Typography variant="body1" gutterBottom>
              {currentAction === "upload" ? "Add" : "Edit"} Research Title{" "}
              
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="researcharea_name"
              value={formData.researcharea_name}
              onChange={handleChange}
              required
            />

            <Typography variant="body1" gutterBottom>
            {currentAction === "upload" ? "Add" : "Edit"} Lines{" "}
              
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="lineInput"
              value={lineInput}
              onChange={handleLineChange}
            />
            <Button onClick={addLine}>Add Line</Button>
            <Button onClick={LinesEmpty}>Reset</Button>

            <ul>
              {formData &&
                formData.details &&
                formData.details.map((line, index) => (
                  <li key={index}>{line}</li>
                ))}
            </ul>

            <Button
              variant="contained"
              color="primary"
              sx={{ padding: "12px 80px" }}
              onClick={handleSubmit}
            >
              {currentAction === "upload" ? "Upload" : "Submit"}
            </Button>
          </Box>
        </FormContainer>
      );
    }
    if (currentAction === "Delete") {
      return (
        <Box style={{ padding: "10px" }}>
          {apiData &&
            apiData.DataForResearchAreaCollection &&
            apiData.DataForResearchAreaCollection.map((item, index) => (
              <div
                onClick={() => setDataWithID(item)}
                key={index}
                style={{ border: "2px solid black", marginBottom: "5%" }}
              >
                <p
                  style={{
                    color: "white",
                    background: "black",
                    textAlign: "center",
                    marginBottom: "2%",
                  }}
                >
                  {item.researcharea_name}
                </p>
                {Array.isArray(item.details) ? (
                  item.details.map((val, valIndex) => (
                    <li key={valIndex}>{val}</li>
                  ))
                ) : (
                  <li>{item.details}</li>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2, marginLeft: "40%", marginBottom: "15px" }}
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </Button>
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
            {apiData &&
              apiData.DataForResearchAreaCollection &&
              apiData.DataForResearchAreaCollection.map((item, index) => (
                <div
                  onClick={() => setDataWithID(item)}
                  key={index}
                  style={{ border: "2px solid black", marginBottom: "5%" }}
                >
                  <p
                    style={{
                      color: "white",
                      background: "black",
                      textAlign: "center",
                      marginBottom: "2%",
                    }}
                  >
                    {item.researcharea_name}
                  </p>
                  {Array.isArray(item.details) ? (
                    item.details.map((val, valIndex) => (
                      <li key={valIndex}>{val}</li>
                    ))
                  ) : (
                    <li>{item.details}</li>
                  )}
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
            Research
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

export default Research;
