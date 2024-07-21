import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  Paper,
  Typography,
  TextField,
  InputBase,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/system";
import DetailsBooks from "./DetailsBooks";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./AuthContext";
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

const initialFormData = {
  authors: "",
  title: "",
  ISBN: "",
  volume: "",
  pages: "",
  publishingDate: "",
  publisher: "",
  weblink: "",
  additionalInfo: "",
};

const Books = () => {
  const { userRole } = useAuth();
  const afApi = userRole === "admin" ? "Admin" : "Subadmin";
  const [currentAction, setCurrentAction] = useState("view");
  const [formData, setFormData] = useState(initialFormData);
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [apiData, setApiData] = useState([]);
  const [id, setID] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = input
          ? `${BASE_URL}/api/${afApi}/private/getASinglePublication/Books/${input}`
          : `${BASE_URL}/api/${afApi}/private/getAllPublications/Books`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setApiData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [input]);

  const setIDwithDATA = (id, books) => {
    setID(id);
    setFormData({
      authors: books.authors.join(", "),
      title: books.title,
      area: books.area || "", // Ensure area is defined
      publishingDate: new Date(books.publishingDate)
        .toISOString()
        .split("T")[0],
      volume: books.volume,
      pages: books.pages,
      ISBN: books.ISBN,
      weblink: books.weblink,
      publisher: books.publisher,
      additionalInfo: books.additionalInfo,
    });
  };

  useEffect(() => {
    if (apiData.DataForUpdate && apiData.DataForUpdate.length > 0) {
      const books = apiData.DataForUpdate[0];
      setID(books._id);
      setFormData({
        authors: books.authors.join(", "),
        title: books.title,
        area: books.area || "",
        publishingDate: new Date(books.publishingDate)
          .toISOString()
          .split("T")[0],
        volume: books.volume,
        pages: books.pages,
        ISBN: books.ISBN,
        weblink: books.weblink,
        publisher: books.publisher,
        additionalInfo: books.additionalInfo,
      });
    }
  }, [apiData]);

  const handleAction = (action) => {
    setCurrentAction(action);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/${afApi}/private/DeletePublication/Books/${id}`,
        {
          method: "DELETE",
          headers: {
            authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
        }
      );

      if (response.ok) {
        setApiData((prevData) =>
          Array.isArray(prevData)
            ? prevData.filter((books) => books._id !== id)
            : []
        );
        showToast("Data deleted successfully!", "success");
      } else {
        throw new Error("Failed to delete data");
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      showToast("Failed to delete data", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentAction === "upload") {
      const names = formData.authors.split(",").map((author) => author.trim());
      const ans = {
        authors: names,
        title: formData.title,
        area: formData.area,
        publishingDate: formData.publishingDate,
        volume: formData.volume,
        pages: formData.pages,
        ISBN: formData.ISBN,
        weblink: formData.weblink,
        publisher: formData.publisher,
        additionalInfo: formData.additionalInfo,
      };
      const url = `${BASE_URL}/api/${afApi}/private/createPublication/Books`;
      try {
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

        showToast("Data uploaded successfully!", "success");
        setFormData(initialFormData); // Clear form fields
      } catch (error) {
        console.error("Error submitting data:", error);
        showToast("Failed to upload data", "error");
      }
    }

    if (currentAction === "Edit") {
      const books = formData;
      const ans = {
        authors: books.authors.split(", ").map((author) => author.trim()),
        title: books.title,
        area: books.area,
        publishingDate: new Date(books.publishingDate)
          .toISOString()
          .split("T")[0],
        volume: books.volume,
        pages: books.pages,
        ISBN: books.ISBN,
        weblink: books.weblink,
        publisher: books.publisher,
        additionalInfo: books.additionalInfo,
      };
      try {
        const response = await fetch(
          `${BASE_URL}/api/${afApi}/private/UpdatePublication/Books/${id}`,
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
        showToast("Data updated successfully!", "success");
        setFormData(initialFormData); // Clear form fields
      } catch (error) {
        console.error("Error updating post:", error);
        showToast("Failed to update data", "error");
      }
    }
  };

  const handleButtonClick = () => {
    setInput(search);
  };

  const showToast = (message, type) => {
    toast(message, { type });
  };

  const renderContent = () => {
    if (currentAction === "upload" || currentAction === "Edit") {
      return (
        <FormContainer>
          <Box sx={{ flex: "1 1 45%" }}>
            <Typography variant="body1" gutterBottom>
              {currentAction === "upload" ? "Add" : "Edit"} Authors{" "}
              <span style={{ color: "red" }}>*</span>
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="authors"
              value={formData.authors}
              onChange={handleChange}
            />

            <Typography variant="body1" gutterBottom>
              {currentAction === "upload" ? "Add" : "Edit"} Topic{" "}
              <span style={{ color: "red" }}>*</span>
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />

            <Typography variant="body1" gutterBottom>
              {currentAction === "upload" ? "Add" : "Edit"} Date{" "}
              <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              variant="outlined"
              size="small"
              type="date"
              name="publishingDate"
              value={formData.publishingDate}
              onChange={handleChange}
              sx={{
                width: "82%",
                marginBottom: "20px",
                backgroundColor: "#fff",
              }}
            />

            <Typography variant="body1" gutterBottom>
              {currentAction === "upload" ? "Add" : "Edit"} ISBN
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="ISBN"
              value={formData.ISBN}
              onChange={handleChange}
            />

            <Typography variant="body1" gutterBottom>
              {currentAction === "upload" ? "Add" : "Edit"} Volume
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="volume"
              value={formData.volume}
              onChange={handleChange}
            />

            <Typography variant="body1" gutterBottom>
              {currentAction === "upload" ? "Add" : "Edit"} Page no.
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="pages"
              value={formData.pages}
              onChange={handleChange}
            />

            <Typography variant="body1" gutterBottom>
              {currentAction === "upload" ? "Add" : "Edit"} Publisher
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
            />

            <Typography variant="body1" gutterBottom>
              {currentAction === "upload" ? "Add" : "Edit"} Weblink
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="weblink"
              value={formData.weblink}
              onChange={handleChange}
            />

            <Typography variant="body1" gutterBottom>
              {currentAction === "upload" ? "Add" : "Edit"} any additional info.
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
              {currentAction === "upload" ? "Upload" : "Submit"}
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
            apiData.DataForUpdate.map((books) => (
              <Box key={books._id} sx={{ marginBottom: "20px" }}>
                <DetailsBooks {...books} />
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => handleDelete(books._id)}
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
              apiData.DataForUpdate.map((books, index) => (
                <DetailsBooks
                  key={books._title}
                  {...books}
                  size={index + 1}
                  onClick={() => setIDwithDATA(books._title, books)}
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
            Books and Book Chapter
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

export default Books;
