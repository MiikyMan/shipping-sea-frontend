import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import SpeedDial, { SpeedDialProps } from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import SendIcon from '@mui/icons-material/Send';
import LinkIcon from '@mui/icons-material/Link';
import IosShareIcon from '@mui/icons-material/IosShare';
import XIcon from '@mui/icons-material/X';
import {ShareSocial} from 'react-share-social';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';
import { Height, WidthFull } from '@mui/icons-material';
import { color } from 'framer-motion';

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
  position: 'absolute',
  '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
    bottom: theme.spacing(2),
  },
}));

const actions = [
    { icon: <LinkIcon />, name: 'Copy link', type: 'line' },
    { icon: <SendIcon />, name: 'Send to chat', type: 'telegram' },
    { icon: <InstagramIcon />, name: 'Share to Instargram', type: 'instagram' },
    { icon: <FacebookIcon />, name: 'Share to Facebook', type: 'facebook' },
    { icon: <XIcon />, name: 'Share to X', type: 'twitter' },
];

export default function ControlledOpenSpeedDial() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const title = typeof document !== 'undefined' ? document.title : 'Check out this awesome content!';
    const style = {
      root: {
        borderRadius: 3,
        border: 0,
        // boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        height: '10%',
        
        padding: '0px 0px 10px 0px',
        marginTop: 'auto',
        marginRight: 'auto',
      },
      copyContainer: {
        width: '100%',
        border: '0',
        color: 'black',
        background: '#caf4ffb5',
        marginTop: '-10px',
        
      },
    };

  return (
    
  //   <Box sx={{transform: 'translateZ(0px)', flexGrow: 1 }}>
  //   <SpeedDial
  //       ariaLabel="Share SpeedDial"
  //       sx={{ position: 'absolute', right: 0 }}
  //       icon={<IosShareIcon sx={{color: "#000000"}} />}
  //       onClose={handleClose}
  //       onOpen={handleOpen}
  //       open={open}
  //       direction="down"
  //       FabProps={{
  //           sx: {
  //             bgcolor: '#ffffff',
  //             '&:hover': {
  //               bgcolor: '#eeeeee',
  //             }
  //           },
  //           size: "small"
  //         }}
  //   >
  //     {actions.map((action) => (
  //       // <SpeedDialAction
  //       //     key={action.name}
  //       //     icon={action.icon}
  //       //     tooltipTitle={action.name}
  //       //     onClick={handleClose}
  //       // />
        
  //     ))}
  //   </SpeedDial>
  // </Box>
  <div className=''>
    <ShareSocial
      url ={shareUrl}
      socialTypes= {['facebook','twitter','line','telegram','whatsapp']}
      style={style}
    />
  </div>
    
  );
}