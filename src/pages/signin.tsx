import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Navigate,Link } from 'react-router-dom'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Logo from "../components/mockuppics/ShippingSeaLogo.png";
import { useState } from 'react';
import { doSignInWithEmailAndPassword, doSignInWithGoogle, doSignInWithFacebook } from '../firebase/auth';
import { useAuth } from '../context/authContext';
import GoogleIcon from "../components/assets/google.svg"
import FacebookIcon from "../components/assets/facebook.svg"

const defaultTheme = createTheme();

export default function SignInSide() {
  const [showPassword, setShowPassword] = React.useState(false);
  const { userLoggedIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setErrorMessage('');
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithEmailAndPassword(email, password);
      } catch (error) {
        setErrorMessage(error.message);
        setIsSigningIn(false);
      }
    }
  };

  const onGoogleSignIn = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setErrorMessage('');
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithGoogle();
      } catch (err) {
        setErrorMessage(err.message);
        setIsSigningIn(false);
      }
    }
  };

  const onFacebookSignIn = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setErrorMessage('');
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithFacebook();
      } catch (err) {
        setErrorMessage(err.message);
        setIsSigningIn(false);
      }
    }
  };

  return (
    <>
    {userLoggedIn && <Navigate to="/home" replace={true} />}
    <ThemeProvider theme={defaultTheme}>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: '100vh' }}
      >
        
        <Paper
          elevation={12}
          style={{ padding: '20px', maxWidth: '900px', width: '100%', display: 'flex', flexDirection: 'row' }}
        >
          <Box className="login-logo" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Link to="/home" >
              <img src={Logo} alt="Logo" />
            </Link>
          </Box>
          <Box
            sx={{
              my: 4,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
            }}
          >
            <Typography component="h1" variant="h5">
              Log In
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Phone number / Username / Email"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage('');
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'divider',
                    },
                    '&:hover fieldset': {
                      borderColor: '#5AB2FF',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#5AB2FF',
                      color: '#5AB2FF',
                    },
                  },
                }}
                value={email}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage('');
                }}
                value={password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'divider',
                    },
                    '&:hover fieldset': {
                      borderColor: '#5AB2FF',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#5AB2FF',
                      color: '#5AB2FF',
                    },
                  },
                }}
              />
              {/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              /> */}
              <Button
                type="submit"
                disabled={isSigningIn}
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  fontSize: 18,
                  fontWeight: 'bold',
                  bgcolor: '#5AB2FF',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#4798CC',
                  }
                }}
              >
                {isSigningIn ? 'SIGNING IN...' : 'Sign In'}
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link to="#">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid container justifyContent="space-between" sx={{ mt: 1 }}>
                  <Grid item xs={5}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' ,mt:'10px'}}></Box>
                  </Grid>
                  <Grid item xs={2} container justifyContent="center" sx={{color:'divider'}}>
                    or
                  </Grid>
                  <Grid item xs={5}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' ,mt:'10px'}}></Box>
                  </Grid>
                </Grid>
                  <Grid container justifyContent="space-between">
                    <Button
                      variant="outlined"
                      startIcon={<img src={GoogleIcon} alt="Google" />}
                      size="small"
                      sx={{
                        mt: 2,
                        height: '40px',
                        width: '190px',
                        bgcolor: '#ffffff',
                        borderColor: 'divider',
                        color: '#202020',
                        '&:hover': {
                          bgcolor: '#fafafa',
                          borderColor: '#5AB2FF',
                          color: '#5AB2FF',
                        }
                      }}
                      disabled={isSigningIn}
                      onClick={onGoogleSignIn}
                      className={`google-button`}
                    >
                      {isSigningIn ? 'SIGNING IN...' : 'Google'}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<img src={FacebookIcon} alt="Facebook" />}
                      size="small"
                      bgcolor='#000000'
                      sx={{
                        mt: 2,
                        height: '40px',
                        width: '190px',
                        bgcolor: '#ffffff',
                        borderColor: 'divider',
                        color: '#202020',
                        '&:hover': {
                          bgcolor: '#fafafa',
                          borderColor: '#5AB2FF',
                          color: '#5AB2FF',
                        }
                      }}
                      disabled={isSigningIn}
                      onClick={onFacebookSignIn}
                      className={`facebook-button`}
                    >
                      {isSigningIn ? 'SIGNING IN...' : 'Facebook'}
                    </Button>
                  </Grid>
                <Grid container justifyContent="center" sx={{ mt: 4 }}>
                  <Typography variant="body2">
                    New to Shipping Sea?
                    <Link to="/signup">
                      {" Sign Up"}
                    </Link>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </ThemeProvider>
    </>
  );
}
