import React, { FC, ReactElement } from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import { Link } from 'react-router-dom'

export const Footer: FC = (): ReactElement => {
  return (
    <div className="footer-container w-full ">
      <Box
        sx={{
          width: "100%",
          height: "auto",
          // background: {
          //   // xs: 'transparent', 
          //   sm: 'linear-gradient(to bottom, transparent, #5AB2FF)',
          // },
          background: "linear-gradient(to bottom, transparent, #5AB2FF)",
          paddingTop: "1rem",
          paddingBottom: "1rem",
          mt: 10 ,
        }}
      >
        <Container maxWidth="lg" >
          <Grid container direction="column" alignItems="center">
            <Grid item xs={12} sx={{mt:5, }}>
              <Typography color="black" variant="h5">
                Shipping Sea ©
              </Typography>
            </Grid>
            <Grid item xs={12}>
            <Typography color="textSecondary" variant="subtitle1" xs={{mt:20,}}>
                {`${new Date().getFullYear()} | `}
                <a href="https://reactjs.org/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>React</a>
                {` | `}
                <a href="https://vitejs.dev/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Vite</a>
                {` | `}
                <a href="https://reactrouter.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>React Router</a>
                {` | `}
                <a href="https://mui.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Material UI</a>
                {` | `}
                <a href="https://ant.design/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Ant Design</a>
                {` |`}
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
  
    </div>
    
  );
};

export default Footer;