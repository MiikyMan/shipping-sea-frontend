import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link, useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Logo from "../components/mockuppics/ShippingSeaLogo.png";
import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { doSignUpWithEmailAndPassword } from "../firebase/auth"

const defaultTheme = createTheme();

export default function FirebaseSignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  let navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      const additionalData = {
        name,
        photoURL,
        phoneNumber,
        role: 'user', // Default role or get it from input if needed
        rank: 'silver',
      };
      const userCredential = await doSignUpWithEmailAndPassword(email, password, additionalData);
      console.log("Signed up successfully:", userCredential);
      
      // Send verification email and code
      await setVerificationCode(email);
      
      setOpen(true);
    } catch (error) {
      setError(error.message);
      console.error("Error signing up:", error);
    }
  };

  const handleVerificationSubmit = async (event: any) => {
    event.preventDefault();
    try {
      // Verify the code
      // await verifyCode(email, verificationCode);
      console.log("Verification code submitted:", verificationCode);
      setOpen(false);
      navigate('/home');
    } catch (error) {
      setError(error.message);
      console.error("Error verifying code:", error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
        <Paper elevation={12} style={{ padding: '20px', maxWidth: '900px', width: '100%', display: 'flex', flexDirection: 'row' }}>
          <Box className="login-logo" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Link to="/home" >
              <img src={Logo} alt="Logo" />
            </Link>
          </Box>
          <Box sx={{ my: 4, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', width: 420 }}>
            <Typography component="h1" variant="h5" sx={{ ml: -42 }}>
              Sign Up
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                autoFocus
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="new-password"
                onChange={(e) => setPassword(e.target.value)}
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
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="Confirm Password"
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                id="Confirm Password"
                autoComplete="new-password"
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              />
              {password !== confirmPassword && 
              <>
                <div className="text-red-800">
                  Password not match!
                </div>
              </>
              }
              <FormControlLabel
                control={<Checkbox value="agree" color="primary" />}
                label="I agree to the terms and conditions."
              />
              <Button
                disabled={password !== confirmPassword}
                type="submit"
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
                SIGN UP
              </Button>
              {error && <Typography color="error">{error}</Typography>}
              <Grid container justifyContent="center" sx={{ mt: 4 }}>
                <Typography variant="body2" align="center">
                  By signing up, you agree to Shipping Sea's{' '}
                  <Link to="https://help.shopee.co.th/portal/4/article/77241" variant="body2" sx={{ color: '#5AB2FF', '&:hover': { color: '#4798CC' }, textDecoration: 'none' }}>
                    Terms of <br />Service
                  </Link>
                  {' '}&{' '}
                  <Link to="https://help.shopee.co.th/portal/4/article/77248" variant="body2" sx={{ color: '#5AB2FF', '&:hover': { color: '#4798CC' }, textDecoration: 'none' }}>
                    Privacy Policy
                  </Link>
                </Typography>
              </Grid>
              <Grid container justifyContent="center" sx={{ mt: 4 }}>
                <Typography variant="body2">
                  Have an account?
                  <Link to="/signin" variant="body2" sx={{ color: '#5AB2FF', '&:hover': { color: '#4798CC' }, textDecoration: 'none' }}>
                    {" Log In"}
                  </Link>
                </Typography>
              </Grid>
            </Box>
          </Box>
        </Paper>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Enter Verification Code</DialogTitle>
          <DialogContent>
            <Typography>Enter the verification code sent to your email:</Typography>
            <TextField
              required
              id="verificationCode"
              name="verificationCode"
              fullWidth
              onChange={(e) => setVerificationCode(e.target.value)}
              margin="dense"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleVerificationSubmit} color="primary" variant="contained">
              Verify
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </ThemeProvider>
  );
}