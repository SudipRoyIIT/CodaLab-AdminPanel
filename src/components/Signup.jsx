import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Container, Snackbar } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {createUserWithEmailAndPassword} from 'firebase/auth'
import { Subadmin } from './firbase';
import 'react-toastify/dist/ReactToastify.css';

// Custom theme with sky blue background
const theme = createTheme({
  palette: {
    primary: {
      main: '#87CEEB', // Sky blue color
    },
  },
});

const Signup = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false); // State for Snackbar visibility
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('')
  const handleSubmit = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(Subadmin, email, password)
    .then((userCredential) => {
      // Signed up 
      const user = userCredential.user;
      console.log(user)
       setOpenSnackbar(true);
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
     toast.error('User already exists!',{
      position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      // ..
    });
    // Simulate successful signup
    // For real use, handle signup logic with API calls or backend integration
    // For demonstration, just showing the Snackbar
  
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          backgroundColor: '#6DB9F8',
          height: '400px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position:'relative',
          left:'42%',
          bottom: '78vw',
          width: '30%',
      
        }}
      >
        <Container maxWidth="xs">
          <Box
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 3,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography variant="h4" align="center" gutterBottom sx={{fontFamily:'Abhya Libre'}}>
              Create a Subadmin
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                margin="normal"
                id="email"
                label="Email"
                variant="outlined"
                type="email"
                required
                onChange={(e)=>{setEmail(e.target.value)}}
              />
              <TextField
                fullWidth
                margin="normal"
                id="password"
                label="Password"
                variant="outlined"
                type="password"
                required
                onChange={(e)=>{setPassword(e.target.value)}}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Sign Up
              </Button>
            </form>
          </Box>
        </Container>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000} // Snackbar will automatically close after 6 seconds
          onClose={handleCloseSnackbar}
          message="Successfully signed up!"
        />
         <ToastContainer />
      </Box>
    </ThemeProvider>
  );
};

export default Signup;
