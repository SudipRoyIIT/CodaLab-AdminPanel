import React, { useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Paper,
  Box,
  Button,
} from "@mui/material";
import SimpleCalendar from "./SimpleCalendar";

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  return (
    <Container
      sx={{
        textAlign: "center",
        padding: "20px",
        backgroundColor: "rgba(186, 224, 253, 0.27)",
        height: "124%",
        width: "74%",
        position: "relative",
        top: "-1500px",
        left: "9.6%",
      }}
    >
      <Container
        sx={{
          marginBottom: "40%",
          marginTop: "-11px",
          position: "relative",
          top: "5%",
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: "4rem",
            marginBottom: "15px",
            textAlign: "left",
            fontFamily: "Abhaya Libre",
          }}
        >
          Admin Dashboard
        </Typography>
        <Grid
          container
          spacing={3}
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          <Grid item>
            <Card
              sx={{
                background: "white",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                padding: "1px",
                width: "200px",
                height: "150px",
                textAlign: "center",
                border: "2px solid rgba(33, 148, 242, 0.45)",
              }}
            >
              <CardMedia
                component="img"
                image="https://img.icons8.com/ios7/2x/magazine.png"
                alt="Publications"
                sx={{
                  width: "50px",
                  height: "50px",
                  marginBottom: "-45px",
                  marginRight: "80%",
                }}
              />
              <CardContent>
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: "18px",
                    marginBottom: "38px",
                    paddingBottom: "-50px",
                    fontFamily: "Abhaya Libre SemiBold",
                  }}
                >
                  Publications
                </Typography>
                <Typography variant="body2" sx={{ color: "gray" }}>
                  Manage Publications, Journals, Papers...
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item>
            <Card
              sx={{
                background: "white",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                padding: "1px",
                width: "200px",
                height: "150px",
                textAlign: "center",
                border: "2px solid rgba(33, 148, 242, 0.45)",
              }}
            >
              <CardMedia
                component="img"
                image="https://img.icons8.com/ios7/2x/case-study.png"
                alt="Research"
                sx={{
                  width: "50px",
                  height: "50px",
                  marginBottom: "-45px",
                  marginRight: "80%",
                }}
              />
              <CardContent>
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: "18px",
                    marginBottom: "38px",
                    paddingBottom: "-50px",
                    fontFamily: "Abhaya Libre SemiBold",
                  }}
                >
                  Research
                </Typography>
                <Typography variant="body2" sx={{ color: "gray" }}>
                  Manage Research Areas...
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item>
            <Card
              sx={{
                background: "white",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                padding: "1px",
                width: "200px",
                height: "150px",
                textAlign: "center",
                border: "2px solid rgba(33, 148, 242, 0.45)",
              }}
            >
              <CardMedia
                component="img"
                image="https://img.icons8.com/ios7/2x/project.png"
                alt="Projects"
                sx={{
                  width: "50px",
                  height: "50px",
                  marginBottom: "-45px",
                  marginRight: "80%",
                }}
              />
              <CardContent>
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: "18px",
                    marginBottom: "38px",
                    paddingBottom: "-50px",
                    fontFamily: "Abhaya Libre SemiBold",
                  }}
                >
                  Projects
                </Typography>
                <Typography variant="body2" sx={{ color: "gray" }}>
                  Manage Ongoing and Funded Projects...
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item>
            <Card
              sx={{
                background: "white",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                padding: "1px",
                width: "200px",
                height: "150px",
                textAlign: "center",
                border: "2px solid rgba(33, 148, 242, 0.45)",
              }}
            >
              <CardMedia
                component="img"
                image="https://img.icons8.com/ios7/2x/speaker_1.png"
                alt="News and Announcements"
                sx={{
                  width: "50px",
                  height: "50px",
                  marginBottom: "-45px",
                  marginRight: "80%",
                }}
              />
              <CardContent>
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: "18px",
                    marginBottom: "38px",
                    paddingBottom: "-50px",
                    fontFamily: "Abhaya Libre SemiBold",
                  }}
                >
                  News and Announcements
                </Typography>
                <Typography variant="body2" sx={{ color: "gray" }}>
                  Manage Highlights and Announcements...
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            alignItems: "center",
          }}
        >
          <Paper
            sx={{
              background: "white",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              padding: "20px",
              paddingLeft: "10px",
              paddingRight: "0px",
              marginRight: "40%",
              width: "74%",
              backgroundColor: "rgba(186, 224, 253, 0.27)",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                marginBottom: "10px",
                fontFamily: "Abhaya Libre SemiBold",
              }}
            >
              CALENDAR
            </Typography>
            <hr />
            <SimpleCalendar onDateSelect={handleDateSelect} />
          </Paper>
          {selectedDate && (
            <Box sx={{ marginBottom: "290px", marginRight: "30px" }}>
              <Button
                sx={{
                  backgroundColor: "rgba(186, 224, 253, 0.4)",
                  color: "rgba(0, 0, 0, 1)",
                  border: "2px solid rgba(23, 161, 250, 1)",
                  borderRadius: "4px",
                  textAlign: "center",
                  padding: "1px 20px",
                }}
              >
                {selectedDate.format("DD MMMM YYYY")}
              </Button>
            </Box>
          )}
        </Box>
      </Container>
    </Container>
  );
};

export default Dashboard;
