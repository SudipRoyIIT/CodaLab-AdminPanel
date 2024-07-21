import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  Paper,
  InputBase,
  Typography,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/system";
import DetailsJournals from "./DetailsJournals";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
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

const Journals = () => {
  const userRole = localStorage.getItem("userInfo");
  const afApi = userRole === "admin" ? "Admin" : "Subadmin";
  console.log("This iournals coming user role form j",userRole)
  const [currentAction, setCurrentAction] = useState("view"); // Default action
  const [formData, setFormData] = useState({
    authors: "",
    title: "",
    journal: "",
    publishedOn: "",
    pages: "",
    DOI: "",
    additionalInfo: "",
    IF: 0,
    SJR: "",
    volume: 0,
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
          `${BASE_URL}/api/${afApi}/private/getASinglePublication/Journal/${input}`,
          {
            method: "GET",
            headers:{
              "Content-Type": "application/json",
              "authorization":'Bearer ' + localStorage.getItem('accessToken'),
            }
   
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

  const setIDwithDATA = (id, data) => {
    setID(id);
  };

  useEffect(() => {
    if (apiData.DataForUpdate && apiData.DataForUpdate.length > 0) {
      const Journals = apiData.DataForUpdate[0];
      setID(Journals._id);
      setFormData({
        authors: Journals.authors.join(", "),
        title: Journals.title,
        journal: Journals.journal,
        publishedOn: new Date(Journals.publishedOn)
          .toISOString()
          .split("T")[0],
        SJR: Journals.SJR,
        pages: Journals.pages,
        IF: Journals.IF,
        DOI: Journals.DOI,
        additionalInfo: Journals.additionalInfo,
        volume: Journals.volume,
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (currentAction === "Delete") {
        // Show confirmation toast
        toast.warn(`Are you sure you want to delete this publication?`, {
          position: "top-center",
          autoClose: false,
          hideProgressBar: true,  
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          onClose: () => {
            // Delete publication
            const url = `${BASE_URL}/api/${afApi}/private/DeletePublication/Journal/${id}`;
            fetchDeletePublication(url);
          },
        });
      }
      if (currentAction === "upload") {
        const names = formData.authors.split(",").map((author) => author.trim());
        const ans = {
          authors: names,
          title: formData.title,
          journal: formData.journal,
          publishedOn: formData.publishedOn,
          SJR: formData.SJR,
          pages: formData.pages,
          IF: formData.IF,
          DOI: formData.DOI,
          additionalInfo: formData.additionalInfo,
          volume: formData.volume,
        };
        const url = `${BASE_URL}/api/${afApi}/private/createPublication/Journal`;
        const response = await fetch(url, {
          method: "POST",
          headers:{
            "Content-Type": "application/json",
            "authorization":'Bearer ' + localStorage.getItem('accessToken'),
          }       ,
          body: JSON.stringify(ans),
        });

if (!response.ok) {
          throw new Error("Failed to create publication");
        }

        toast.success("Publication uploaded successfully");
        setFormData({
          authors: "",
          title: "",
          journal: "",
          publishedOn: "",
          pages: "",
          DOI: "",
          additionalInfo: "",
          IF: 0,
          SJR: "",
          volume: 0,
        }); // Clear form fields
        fetchJournals(); // Assuming fetchJournals fetches updated data
      }

      if (currentAction === "Edit") {
        const Journals = formData;
        const ans = {
          authors: Journals.authors.split(",").map((author) => author.trim()),
          title: Journals.title,
          journal: Journals.journal,
          publishedOn: Journals.publishedOn,
          SJR: Journals.SJR,
          pages: Journals.pages,
          IF: Journals.IF,
          DOI: Journals.DOI,
          additionalInfo: Journals.additionalInfo,
          volume: Journals.volume,
        };
        const response = await fetch(
          `${BASE_URL}/api/${afApi}/private/UpdatePublication/Journal/${id}`,
          {
            method: "PUT",
            headers:{
              "Content-Type": "application/json",
              "authorization":'Bearer ' + localStorage.getItem('accessToken'),
            }
          ,
            body: JSON.stringify(ans),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update publication");
        }

        toast.success("Publication updated successfully");
        fetchJournals(); // Assuming fetchJournals fetches updated data
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  const fetchDeletePublication = async (url) => {
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
         "authorization":'Bearer ' + localStorage.getItem('accessToken'),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete publication");
      }

      toast.success("Publication deleted successfully");
      fetchJournals(); // Assuming fetchJournals fetches updated data
    } catch (error) {
      console.error("Error:", error);
      // toast.error("An error occurred while deleting publication");
    }
  };

  const fetchJournals = () => {
    // Implement fetchJournals to update data
  };

  const renderContent = () => {
    if (currentAction === "upload") {
      return (
        <FormContainer>
          <Box sx={{ flex: "1 1 45%" }}>
            <Typography variant="body1" gutterBottom>
              Add Authors <span style={{ color: "red" }}>*</span>
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="authors"
              value={formData.authors}
              onChange={handleChange}
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
            />

            <Typography variant="body1" gutterBottom>
              Add Journals <span style={{ color: "red" }}>*</span>
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="journal"
              value={formData.journal}
              onChange={handleChange}
            />

            <Typography variant="body1" gutterBottom>
              Add Date <span style={{ color: "red" }}>*</span>
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              type="date"
              name="publishedOn"
              value={formData.publishedOn}
              onChange={handleChange}
            />

            <Typography variant="body1" gutterBottom>
              Add SJR<span style={{ color: "red" }}>*</span>
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="SJR"
              value={formData.SJR}
              onChange={handleChange}
            />

            <Typography variant="body1" gutterBottom>
              Add Page no.
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="pages"
              value={formData.pages}
              onChange={handleChange}
            />

            <Typography variant="body1" gutterBottom>
              Add IF
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="IF"
              value={formData.IF}
              onChange={handleChange}
            />

            <Typography variant="body1" gutterBottom>
              Add DOI
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="DOI"
              value={formData.DOI}
              onChange={handleChange}
            />

            <Typography variant="body1" gutterBottom>
              Add Volume
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="volume"
              value={formData.volume}
              onChange={handleChange}
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
              Edit Authors <span style={{ color: "red" }}>*</span>
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="authors"
              value={formData.authors}
              onChange={handleChange}
            />

            <Typography variant="body1" gutterBottom>
              Edit Title <span style={{ color: "red" }}>*</span>
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />

            <Typography variant="body1" gutterBottom>
              Edit Journals <span style={{ color: "red" }}>*</span>
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="journal"
              value={formData.journal}
              onChange={handleChange}
            />

            <Typography variant="body1" gutterBottom>
              Edit Date <span style={{ color: "red" }}>*</span>
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              type="date"
              name="publishedOn"
              value={formData.publishedOn}
              onChange={handleChange}
            />

            <Typography variant="body1" gutterBottom>
              Edit SJR<span style={{ color: "red" }}>*</span>
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="SJR"
              value={formData.SJR}
              onChange={handleChange}
            />

            <Typography variant="body1" gutterBottom>
              Edit Page no.
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="pages"
              value={formData.pages}
              onChange={handleChange}
            />

            <Typography variant="body1" gutterBottom>
              Edit IF
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="IF"
              value={formData.IF}
              onChange={handleChange}
            />

            <Typography variant="body1" gutterBottom>
              Edit DOI
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="DOI"
              value={formData.DOI}
              onChange={handleChange}
            />

            <Typography variant="body1" gutterBottom>
              Edit Volume
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="volume"
              value={formData.volume}
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
            apiData.DataForUpdate.map((Journals) => (
              <Box key={Journals._id} sx={{ marginBottom: "20px" }}>
                <DetailsJournals {...Journals} />
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() =>
                    fetchDeletePublication(`${BASE_URL}/api/${afApi}/private/DeletePublication/Journal/${Journals._id}`)
                  }
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
              apiData.DataForUpdate.map((Journals, index) => (
                <DetailsJournals
                  key={Journals._id}
                  {...Journals}
                  size={index + 1}
                  onClick={() => setIDwithDATA(Journals._id, Journals)}
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
       <ToastContainer/>
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
            Journals
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

export default Journals;
