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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./AuthContext";

import DetailsConference from "./DetailsConference";

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

const Conference = () => {
  const { userRole } = useAuth();
  const afApi = userRole === "admin" ? "Admin" : "Subadmin";
  const [currentAction, setCurrentAction] = useState("view"); // Default action
  const [formData, setFormData] = useState({
    authors: "",
    title: "",
    conference: "",
    date: "",
    location: "",
    pages: "",
    ranking: "",
    DOI: "",
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
          `${BASE_URL}/api/${afApi}/private/getASinglePublication/Conference/${input}`,
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

  const setIDwithDATA = (id, data) => {
    setID(id);
    console.log(id);
    console.log(data);
  };

  useEffect(() => {
    if (apiData.DataForUpdate && apiData.DataForUpdate.length > 0) {
      const conference = apiData.DataForUpdate[0];
      setID(conference._id);
      setFormData({
        authors: conference.authors.join(", "),
        title: conference.title,
        conference: conference.conference,
        date: new Date(conference.date).toISOString().split("T")[0],
        location: conference.location,
        pages: conference.pages,
        ranking: conference.ranking,
        DOI: conference.DOI,
        additionalInfo: conference.additionalInfo,
      });
      console.log(id);
    }
  }, [apiData]);

  const handleAction = (action) => {
    setCurrentAction(action);
    console.log("Selected Action:", action);
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
            const url = `${BASE_URL}/api/${afApi}/private/DeletePublication/Conference/${id}`;
            fetchDeletePublication(url);
          },
        });
      }
      if (currentAction === "upload") {
        const names = formData.authors
          .split(",")
          .map((author) => author.trim());
        const ans = {
          authors: names,
          title: formData.title,
          conference: formData.conference,
          date: formData.date,
          location: formData.location,
          pages: formData.pages,
          ranking: formData.ranking,
          DOI: formData.DOI,
          additionalInfo: formData.additionalInfo,
        };
        const url = `${BASE_URL}/api/${afApi}/private/createPublication/Conference`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
          body: JSON.stringify(ans),
        });

        if (response.ok) {
          toast.success("Data uploaded successfully!", "success");

          setFormData({
            authors: "",
            title: "",
            conference: "",
            date: "",
            location: "",
            pages: "",
            ranking: "",
            DOI: "",
            additionalInfo: "",
          });
        } else {
          throw new Error("Failed to upload data");
        }

        fetchConferences(); // Assuming fetchConferences fetches updated data
      }

      if (currentAction === "Edit") {
        const conference = formData;
        const ans = {
          authors: conference.authors.split(",").map((author) => author.trim()),
          title: conference.title,
          conference: conference.conference,
          date: new Date(conference.date).toISOString(),
          location: conference.location,
          pages: conference.pages,
          ranking: conference.ranking,
          DOI: conference.DOI,
          additionalInfo: conference.additionalInfo,
          updateData: new Date().toISOString(),
        };

        const url = `${BASE_URL}/api/${afApi}/private/UpdatePublication/Conference/${id}`;
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
          body: JSON.stringify(ans),
        });

        if (response.ok) {
          toast.success("Data updated successfully!", "success");

          setFormData({
            authors: "",
            title: "",
            conference: "",
            date: "",
            location: "",
            pages: "",
            ranking: "",
            DOI: "",
            additionalInfo: "",
          });
          fetchConferences(); // Assuming fetchConferences fetches updated data
        }
      } else {
        throw new Error("Failed to upload data");
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
          authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete publication");
      }

      toast.success("Publication deleted successfully");
      fetchConferences(); // Assuming fetchConferences fetches updated data
    } catch (error) {
      console.error("Error:", error);
      // toast.error("An error occurred while deleting publication");
    }
  };
  const fetchConferences = () => {
    // Implement fetchConferences to update data
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
              Add Conference <span style={{ color: "red" }}>*</span>
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="conference"
              value={formData.conference}
              onChange={handleChange}
            />

            <Typography variant="body1" gutterBottom>
              Add Date <span style={{ color: "red" }}>*</span>
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />

            <Typography variant="body1" gutterBottom>
              Add Location<span style={{ color: "red" }}>*</span>
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="location"
              value={formData.location}
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
              Edit Authors
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="authors"
              value={formData.authors}
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
              Edit Conference
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="conference"
              value={formData.conference}
              onChange={handleChange}
            />

            <Typography variant="body1" gutterBottom>
              Edit Date
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              type="date"
              name="date"
              value={formData.date}
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
              Edit Page No.
            </Typography>
            <FormField
              variant="outlined"
              size="small"
              name="pages"
              value={formData.pages}
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
            apiData.DataForUpdate.map((conference) => (
              <Box key={conference._id} sx={{ marginBottom: "20px" }}>
                <DetailsConference {...conference} />
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() =>
                    fetchDeletePublication(`${BASE_URL}/api/${afApi}/private/DeletePublication/Conference/${conference._id}`)
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
              apiData.DataForUpdate.map((conference, index) => (
                <DetailsConference
                  key={conference._id}
                  {...conference}
                  size={index + 1}
                  onClick={() => setIDwithDATA(conference._id, conference)}
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
            Conference
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

export default Conference;
// import React, { useState, useEffect, useCallback } from "react";
// import {
//   Box,
//   Button,
//   Divider,
//   Paper,
//   InputBase,
//   Typography,
//   TextField,
// } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";
// import { styled } from "@mui/system";
// import DetailsConference from "./DetailsConference";

// const BASE_URL =
("http://ec2-65-0-205-116.ap-south-1.compute.amazonaws.com:3001");

// const Input = styled("input")({
//   display: "none",
// });

// const FormContainer = styled(Box)({
//   display: "flex",
//   justifyContent: "space-between",
//   padding: "20px",
//   borderRadius: "10px",
//   flexWrap: "wrap",
// });

// const FormField = styled(TextField)({
//   width: "82%",
//   marginBottom: "20px",
//   backgroundColor: "#fff",
// });

// const Conference = () => {
//   const [currentAction, setCurrentAction] = useState("view"); // Default action
//   const [formData, setFormData] = useState({
//     authors: "",
//     title: "",
//     conference: "",
//     date: "",
//     location: "",
//     pages: "",
//     ranking: "",
//     DOI: "",
//     additionalInfo: "",
//     volume: null,
//   });

//   const [search, setSearch] = useState("");
//   const [input, setInput] = useState("");
//   const [apiData, setApiData] = useState([]);
//   const [id, setID] = useState("");

//   const handleButtonClick = () => {
//     setInput(search);
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(
//           `${BASE_URL}/api/${afApi}/private/getASinglePublication/Conference/${input}`
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch data");
//         }
//         const data = await response.json();
//         setApiData(data);
//         console.log(data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     if (input) {
//       fetchData();
//     }
//   }, [input]);

//   const setIDwithDATA = useCallback((id, data) => {
//     setID(id);
//     setFormData({
//       authors: data.authors.join(", "),
//       title: data.title,
//       conference: data.conference,
//       date: new Date(data.date).toISOString().split("T")[0],
//       location: data.location,
//       pages: data.pages,
//       ranking: data.ranking,
//       DOI: data.DOI,
//       additionalInfo: data.additionalInfo,
//       volume: data.__v,
//     });
//     console.log("ID:", id);
//     console.log("Form Data:", data);
//   }, []);

//   useEffect(() => {
//     if (apiData.DataForUpdate && apiData.DataForUpdate.length > 0) {
//       const conference = apiData.DataForUpdate[0];
//       setIDwithDATA(conference._id, conference);
//     }
//   }, [apiData, setIDwithDATA]);

//   const handleAction = (action) => {
//     setCurrentAction(action);
//     console.log("Selected Action:", action);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (currentAction === "Delete") {
//       const url = `${BASE_URL}/api/${afApi}/private/DeletePublication/Conference/${id}`;
//       try {
//         const response = await fetch(url, {
//           method: "DELETE",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: "Bearer your-token-here",
//           },
//         });

//         if (!response.ok) {
//           throw new Error("Failed to submit data");
//         }

//         const result = await response.json();
//         console.log(result);
//         console.log(id);

//         // clear();
//       } catch (error) {
//         console.error("Error submitting data:", error);
//       }
//     }

//     if (currentAction === "upload") {
//       const url = `${BASE_URL}/api/${afApi}/private/createPublication/Conference`;
//       try {
//         const response = await fetch(url, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             // Add any authorization headers if needed
//             Authorization: "Bearer your-token-here",
//           },
//           body: JSON.stringify(formData),
//         });

//         if (!response.ok) {
//           throw new Error("Failed to submit data");
//         }

//         const result = await response.json();
//         console.log(result);

//         // clear();
//       } catch (error) {
//         console.error("Error submitting data:", error);
//       }
//     }

//     if (currentAction === "Edit") {
//       const conference = formData;
//       const ans = {
//         authors: conference.authors.split(", ").map((author) => author.trim()),
//         title: conference.title,
//         conference: conference.conference,
//         date: new Date(conference.date).toISOString(),
//         location: conference.location,
//         pages: conference.pages,
//         ranking: conference.ranking,
//         DOI: conference.DOI,
//         additionalInfo: conference.additionalInfo,
//         volume: conference.volume,
//         updateData: new Date().toISOString(),
//       };
//       try {
//         const response = await fetch(
//           `${BASE_URL}/api/${afApi}/private/UpdatePublication/Conference/${id}`,
//           {
//             method: "PUT", // or 'PATCH' depending on your API endpoint
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(ans),
//           }
//         );
//         if (!response.ok) {
//           throw new Error("Failed to update post");
//         }
//         alert("Update!!");
//         return await response.json();
//       } catch (error) {
//         console.error("Error updating post:", error);
//         throw error;
//       }
//     }
//   };

//   const renderContent = () => {
//     if (currentAction === "upload") {
//       return (
//         <FormContainer>
//           <Box sx={{ flex: "1 1 45%" }}>
//             <Typography variant="body1" gutterBottom>
//               Add Authors <span style={{ color: "red" }}>*</span>
//             </Typography>
//             <FormField
//               variant="outlined"
//               size="small"
//               name="authors"
//               value={formData.authors}
//               onChange={handleChange}
//             />

//             <Typography variant="body1" gutterBottom>
//               Add Title <span style={{ color: "red" }}>*</span>
//             </Typography>
//             <FormField
//               variant="outlined"
//               size="small"
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//             />

//             <Typography variant="body1" gutterBottom>
//               Add Conference <span style={{ color: "red" }}>*</span>
//             </Typography>
//             <FormField
//               variant="outlined"
//               size="small"
//               name="conference"
//               value={formData.conference}
//               onChange={handleChange}
//             />

//             <Typography variant="body1" gutterBottom>
//               Add Date <span style={{ color: "red" }}>*</span>
//             </Typography>
//             <FormField
//               variant="outlined"
//               size="small"
//               type="date"
//               name="date"
//               value={formData.date}
//               onChange={handleChange}
//             />

//             <Typography variant="body1" gutterBottom>
//               Add Location<span style={{ color: "red" }}>*</span>
//             </Typography>
//             <FormField
//               variant="outlined"
//               size="small"
//               name="location"
//               value={formData.location}
//               onChange={handleChange}
//             />

//             <Typography variant="body1" gutterBottom>
//               Add Page no.
//             </Typography>
//             <FormField
//               variant="outlined"
//               size="small"
//               name="pages"
//               value={formData.pages}
//               onChange={handleChange}
//             />

//             <Typography variant="body1" gutterBottom>
//               Add Ranking
//             </Typography>
//             <FormField
//               variant="outlined"
//               size="small"
//               name="ranking"
//               value={formData.ranking}
//               onChange={handleChange}
//             />

//             <Typography variant="body1" gutterBottom>
//               Add DOI
//             </Typography>
//             <FormField
//               variant="outlined"
//               size="small"
//               name="DOI"
//               value={formData.DOI}
//               onChange={handleChange}
//             />

//             <Typography variant="body1" gutterBottom>
//               Add any additional info.
//             </Typography>
//             <FormField
//               variant="outlined"
//               size="small"
//               name="additionalInfo"
//               value={formData.additionalInfo}
//               onChange={handleChange}
//             />

//             <Typography variant="body1" gutterBottom>
//               Add Volume.
//             </Typography>
//             <FormField
//               variant="outlined"
//               size="small"
//               name="volume"
//               value={formData.volume}
//               onChange={handleChange}
//             />

//             <Button
//               variant="contained"
//               color="primary"
//               size="medium"
//               onClick={handleSubmit}
//             >
//               Submit
//             </Button>
//           </Box>
//         </FormContainer>
//       );
//     } else if (currentAction === "Delete") {
//       return (
//         <div>
//           <Button
//             variant="contained"
//             color="primary"
//             size="medium"
//             onClick={handleSubmit}
//           >
//             Delete
//           </Button>
//         </div>
//       );
//     } else if (currentAction === "Edit") {
//       return (
//         <FormContainer>
//           <Box sx={{ flex: "1 1 45%" }}>
//             <Typography variant="body1" gutterBottom>
//               Authors <span style={{ color: "red" }}>*</span>
//             </Typography>
//             <FormField
//               variant="outlined"
//               size="small"
//               name="authors"
//               value={formData.authors}
//               onChange={handleChange}
//             />

//             <Typography variant="body1" gutterBottom>
//               Title <span style={{ color: "red" }}>*</span>
//             </Typography>
//             <FormField
//               variant="outlined"
//               size="small"
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//             />

//             <Typography variant="body1" gutterBottom>
//               Conference <span style={{ color: "red" }}>*</span>
//             </Typography>
//             <FormField
//               variant="outlined"
//               size="small"
//               name="conference"
//               value={formData.conference}
//               onChange={handleChange}
//             />

//             <Typography variant="body1" gutterBottom>
//               Date <span style={{ color: "red" }}>*</span>
//             </Typography>
//             <FormField
//               variant="outlined"
//               size="small"
//               type="date"
//               name="date"
//               value={formData.date}
//               onChange={handleChange}
//             />

//             <Typography variant="body1" gutterBottom>
//               Location<span style={{ color: "red" }}>*</span>
//             </Typography>
//             <FormField
//               variant="outlined"
//               size="small"
//               name="location"
//               value={formData.location}
//               onChange={handleChange}
//             />

//             <Typography variant="body1" gutterBottom>
//               Page no.
//             </Typography>
//             <FormField
//               variant="outlined"
//               size="small"
//               name="pages"
//               value={formData.pages}
//               onChange={handleChange}
//             />

//             <Typography variant="body1" gutterBottom>
//               Ranking
//             </Typography>
//             <FormField
//               variant="outlined"
//               size="small"
//               name="ranking"
//               value={formData.ranking}
//               onChange={handleChange}
//             />

//             <Typography variant="body1" gutterBottom>
//               DOI
//             </Typography>
//             <FormField
//               variant="outlined"
//               size="small"
//               name="DOI"
//               value={formData.DOI}
//               onChange={handleChange}
//             />

//             <Typography variant="body1" gutterBottom>
//               Any additional info.
//             </Typography>
//             <FormField
//               variant="outlined"
//               size="small"
//               name="additionalInfo"
//               value={formData.additionalInfo}
//               onChange={handleChange}
//             />

//             <Typography variant="body1" gutterBottom>
//               Volume.
//             </Typography>
//             <FormField
//               variant="outlined"
//               size="small"
//               name="volume"
//               value={formData.volume}
//               onChange={handleChange}
//             />

//             <Button
//               variant="contained"
//               color="primary"
//               size="medium"
//               onClick={handleSubmit}
//             >
//               Submit
//             </Button>
//           </Box>
//         </FormContainer>
//       );
//     } else {
//       return null;
//     }
//   };

//   return (
//     <>
//       <Box sx={{ padding: "20px" }}>
//         <Paper
//           component="form"
//           sx={{
//             p: "2px 4px",
//             display: "flex",
//             alignItems: "center",
//             width: "400px",
//           }}
//         >
//           <InputBase
//             sx={{ ml: 1, flex: 1 }}
//             placeholder="Search Conference"
//             inputProps={{ "aria-label": "search conference" }}
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//           <Button
//             type="button"
//             sx={{ p: "10px" }}
//             aria-label="search"
//             onClick={handleButtonClick}
//           >
//             <SearchIcon />
//           </Button>
//         </Paper>
//         <Divider sx={{ my: 2 }} />
//         <DetailsConference
//           conferences={apiData}
//           setIDwithDATA={setIDwithDATA}
//           handleAction={handleAction}
//         />
//         {renderContent()}
//       </Box>
//     </>
//   );
// };

// export default Conference;
