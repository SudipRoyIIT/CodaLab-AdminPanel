
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  Box,
  Typography,
  Divider,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Achievements = () => {
  const [title, setTitle] = useState("");
  const [organizedBy, setOrganizedBy] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [activeForm, setActiveForm] = useState(null);
  const [achievementsList, setAchievementsList] = useState([]);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleOrganizedByChange = (e) => setOrganizedBy(e.target.value);
  const handleDateChange = (e) => setSelectedDate(e.target.value);
  const handleNameChange = (e) => setName(e.target.value);
  const handleDepartmentChange = (e) => setDepartment(e.target.value);
  const handleAchievementChange = (e) => setAchievement(e.target.value);
  const handleAdditionalInfoChange = (e) => setAdditionalInfo(e.target.value);
  const [input, setInput] = useState("");
  const [id, setId] = useState("");

  const handleInput = (val) => {
    setInput(val);
  };

  const fetchAchievements = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/Admin/private/getSelectedAchievement?title=${input}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setAchievementsList(data);
        // console.log(data);
      } else {
        setAchievementsList([]);
        // console.log("No achievements found");
        toast.error(data.message || "No achievements found");
      }
    } catch (error) {
      console.error("Error fetching achievements:", error);
      toast.error("Error fetching achievements");
    }
  };

  useEffect(() => {
    if (input) {
      fetchAchievements();
    }
  }, [input]);

  const updateAchievement = async (achievementId) => {
    const formData = {
      title,
      organizedBy,
      date: new Date(selectedDate).toISOString(),
      name,
      department,
      additionalInfo,
    };

    // Log the formData.name to check its type and value
    console.log("formData.name:", formData.name, typeof formData.name);

    const ans = {
      achievement: {
        title: formData.title,
        organised_by: formData.organizedBy,
        date: formData.date,
        additionalInfo: formData.additionalInfo,
      },
      // Ensure formData.name is a string before splitting
      name:
        typeof formData.name === "string"
          ? formData.name.split(",").map((author) => author.trim())
          : [],
      department: formData.department,
    };

    try {
      const response = await fetch(
        `${BASE_URL}/api/Admin/private/updateAchievement/${achievementId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
          body: JSON.stringify(ans),
        }
      );

      if (response.ok) {
        toast.success("Achievement updated successfully");
        setTitle("");
        setOrganizedBy("");
        setSelectedDate("");
        setName("");
        setDepartment("");
        setAdditionalInfo("");
        fetchAchievements();
      } else {
        const errorData = await response.json();
        console.error("Failed to update achievement:", errorData);
        toast.error("Failed to update achievement");
      }
    } catch (error) {
      console.error("Error updating achievement:", error);
      toast.error("An error occurred while updating achievement");
    }
  };

  const uploadAchievement = async () => {
    const formData = {
      title,
      organizedBy,
      date: new Date(selectedDate).toISOString(),
      name,
      department,
      additionalInfo,
    };
    const ans = {
      achievement: {
        title: formData.title,
        organised_by: formData.organizedBy,
        date: formData.date,
        additionalInfo: formData.additionalInfo,
      },
      name:
        typeof formData.name === "string"
          ? formData.name.split(",").map((author) => author.trim())
          : [],
      department: formData.department,
    };

    try {
      const response = await fetch(
        `${BASE_URL}/api/Admin/private/createAchievement`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
          body: JSON.stringify(ans),
        }
      );

      if (response.ok) {
        toast.success("Achievement uploaded successfully");
        setTitle("");
        setOrganizedBy("");
        setSelectedDate("");
        setName("");
        setDepartment("");
        setAdditionalInfo("");
        fetchAchievements();
      } else {
        const errorData = await response.json();
        console.error("Failed to upload achievement:", errorData);
        toast.error("Failed to upload achievement");
      }
    } catch (error) {
      console.error("Error uploading achievement:", error);
      toast.error("An error occurred while uploading achievement");
    }
  };
  

  const deleteAchievement = async (achievementId) => {
    const formData = {
      title,
      organizedBy,
      date: new Date(selectedDate).toISOString(),
      name,
      department,
      additionalInfo,
    };
    const ans = {
      achievement: {
        title: formData.title,
        organised_by: formData.organizedBy,
        date: formData.date,
        additionalInfo: formData.additionalInfo,
      },
      name:
        typeof formData.name === "string"
          ? formData.name.split(",").map((author) => author.trim())
          : [],
      department: formData.department,
    };

    try {
      const response = await fetch(
        `${BASE_URL}/api/Admin/private/deleteAchievement/${achievementId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
          body: JSON.stringify(ans),
        }
      );

      if (response.ok) {
        toast.success("Achievement deleted successfully");
        fetchAchievements();
      } else {
        const errorData = await response.json();
        console.error("Failed to delete achievement:", errorData);
        toast.error("Failed to delete achievement");
      }
    } catch (error) {
      console.error("Error deleting achievement:", error);
      toast.error("An error occurred while deleting achievement");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      activeForm === "upload" &&
      title &&
      organizedBy &&
      selectedDate &&
      name &&
      department &&
      additionalInfo
    ) {
      uploadAchievement();
    } else if (
      activeForm === "edit" &&
      title &&
      organizedBy &&
      selectedDate &&
      name &&
      department &&
      additionalInfo
    ) {
      updateAchievement(id);
    } else if (activeForm === "delete" && selectedAchievement) {
      deleteAchievement(selectedAchievement._id);
    } else {
      console.log(activeForm, selectedAchievement);
      toast.error("Please fill in all required fields");
    }
  };

  const handleDeleteClick = (achievement) => {
    setId(achievement._id);
    setTitle(achievement.achievement.title);
    setOrganizedBy(achievement.achievement.organised_by);
    setName(achievement.name);
    setDepartment(achievement.department);
    setSelectedDate(achievement.achievement.date);
    setAdditionalInfo(achievement.achievement.additionalInfo);
  };

  const renderForm = () => {
    switch (activeForm) {
      case "upload":
        return (
          <Box sx={styles.formContainer}>
            <form onSubmit={handleSubmit} style={styles.form}>
              <TextField
                label="Title"
                value={title}
                onChange={handleTitleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Organized By"
                value={organizedBy}
                onChange={handleOrganizedByChange}
                fullWidth
                margin="normal"
              />
              <TextField
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="Name"
                value={name}
                onChange={handleNameChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Department"
                value={department}
                onChange={handleDepartmentChange}
                fullWidth
                margin="normal"
              />
              <TextField
                minRows={3}
                label="Additional Info"
                value={additionalInfo}
                onChange={handleAdditionalInfoChange}
                fullWidth
                margin="normal"
              />
              <Button type="submit" variant="contained" color="primary">
                Upload
              </Button>
            </form>
          </Box>
        );
      case "edit":
        return (
          <Box sx={styles.formContainer}>
            <form onSubmit={handleSubmit} style={styles.form}>
              <TextField
                label="Title"
                value={title}
                onChange={handleTitleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Organized By"
                value={organizedBy}
                onChange={handleOrganizedByChange}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="Name"
                value={name}
                onChange={handleNameChange}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                label="Department"
                value={department}
                onChange={handleDepartmentChange}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                minRows={3}
                label="Additional Info"
                value={additionalInfo}
                onChange={handleAdditionalInfoChange}
                fullWidth
                required
                margin="normal"
              />
              <Button type="submit" variant="contained" color="primary">
                Update
              </Button>
            </form>
          </Box>
        );
      case "delete":
        return (
          <Box sx={styles.formContainer}>
            <form onSubmit={handleSubmit} style={styles.form}>
              <TextField
                label="Title"
                value={title}
                fullWidth
                margin="normal"
                disabled
              />
              <TextField
                label="Organized By"
                value={organizedBy}
                fullWidth
                margin="normal"
                disabled
              />
              <TextField
                type="date"
                value={selectedDate}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                disabled
              />
              <TextField
                label="Name"
                value={name}
                fullWidth
                margin="normal"
                disabled
              />
              <TextField
                label="Department"
                value={department}
                fullWidth
                margin="normal"
                disabled
              />
              <TextField
                minRows={3}
                label="Additional Info"
                value={additionalInfo}
                fullWidth
                margin="normal"
                disabled
              />
              <Button type="submit" variant="contained" color="primary">
                Delete
              </Button>
            </form>
          </Box>
        );
      case "search":
        return (
          <Box sx={styles.achievementsContainer}>
            {achievementsList.length > 0 ? (
              achievementsList.map((achievement) => (
                <Box
                  key={achievement._id}
                  sx={styles.achievementItem}
                  onClick={() => {
                    handleDeleteClick(achievement);
                    setSelectedAchievement(achievement);
                  }}
                >
                  <Typography variant="h6">
                    {achievement.achievement.title}
                  </Typography>
                  <Typography>
                    {achievement.achievement.organised_by}
                  </Typography>
                  <Typography>
                    {new Date(
                      achievement.achievement.date
                    ).toLocaleDateString()}
                  </Typography>
                  <Typography>{achievement.name.join(", ")}</Typography>
                  <Typography>{achievement.department}</Typography>
                  <Typography>
                    {achievement.achievement.additionalInfo}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography>No achievements found</Typography>
            )}
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        width: "73%",
        border: "2px solid #6DB9F8",
        position: "relative",
        marginLeft: "23.5%",
        height: "1500px",
        bottom: "1500px",
        padding: "20px",
      }}
    >
      <ToastContainer />
      <Typography variant="h4" sx={styles.title}>
        Achievements
      </Typography>
      <Box style={{ display: "flex", gap: "30px" }}>
        <Box
          sx={{
            display: "flex",
            gap: "30px",
            justifyContent: "space-evenly",
            width: "70%",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => setActiveForm("upload")}
            sx={styles.button}
          >
            Upload
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setActiveForm("edit")}
            sx={styles.button}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setActiveForm("delete")}
            sx={styles.button}
          >
            Delete
          </Button>
        </Box>
        <Box style={{ marginTop: "-16px" }}>
          <TextField
            label="Search Achievements"
            value={searchQuery}
            onChange={handleSearchChange}
            fullWidth
            margin="normal"
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            handleInput(searchQuery);
            setActiveForm("search");
          }}
          sx={styles.button}
        >
          Search
        </Button>
      </Box>
      {renderForm()}
      {/* <Box sx={styles.achievementsContainer}>
        {achievementsList.length > 0 ? (
          achievementsList.map((achievement) => (
            <Box
              key={achievement._id}
              sx={styles.achievementItem}
              onClick={() => {handleDeleteClick(achievement);setSelectedAchievement(achievement)}}
            >
              <Typography variant="h6">
                {achievement.achievement.title}
              </Typography>
              <Typography>{achievement.achievement.organised_by}</Typography>
              <Typography>
                {new Date(achievement.achievement.date).toLocaleDateString()}
              </Typography>
              <Typography>{achievement.name.join(", ")}</Typography>
              <Typography>{achievement.department}</Typography>
              <Typography>{achievement.achievement.additionalInfo}</Typography>
            </Box>
          ))
        ) : (
          <Typography>No achievements found</Typography>
        )}
      </Box> */}
    </Box>
  );
};

const styles = {
  container: {
    padding: 2,
  },
  title: {
    marginBottom: 2,
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  button: {
    height: "50px",
  },
  formContainer: {
    marginBottom: 2,
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  achievementsContainer: {
    display: "flex",
    flexDirection: "column",
  },
  achievementItem: {
    padding: 2,
    border: "1px solid #ccc",
    borderRadius: 4,
    marginBottom: 1,
    cursor: "pointer",
  },
};

export default Achievements;
