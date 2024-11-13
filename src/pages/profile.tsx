import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import { Breadcrumb } from 'antd';
import Footer from "../components/footer";
import SilverRank from "../components/assets/crown-silver.svg";
import GoldRank from "../components/assets/crown-gold.svg";
import PlatinumRank from "../components/assets/crown-platinum.svg";
import DiamondRank from "../components/assets/crown-diamond.svg";
import GodRank from "../components/assets/crown-god.svg";
import Next from "../components/assets/next.svg";
import ProfileIcon from "../components/assets/profile.svg";
import PurchasesIcon from "../components/assets/purchases.svg";
import HeartIcon from "../components/assets/favourite.svg";
import VouchersIcon from "../components/assets/voucher.svg";
import ClockIcon from "../components/assets/clock.svg";
import LogoutIcon from "../components/assets/logout.svg";
import Edit from "../components/assets/edit.svg";
import UserIcon from "../components/assets/user.svg";
import { doSignOut } from '../firebase/auth';
import { useAuth } from '../context/authContext';
import { baseUser, baseURL } from '../components/userIDConfig';
import Purchases from '../components/profiles/purchases';
import ProfileDetail from '../components/profiles/profileDetail';
import Favorites from '../components/profiles/favorites';
import Vouchers from '../components/profiles/vouchers';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import axios from "axios";

async function getData() {
  const res = await fetch(`${baseURL}/users/${uid}`);
  return res.json();
}

interface usersType {
  userID: string,
  name: string,
  email: string,
  role: string,
  profilePicUrl: string,
  rank: number,
}

function Profile() {
  const [data, setData] = useState<usersType | null>(null);
  const { userLoggedIn, displayName, photoURL, uid } = useAuth();
  const [sidenavState, setSidenavState] = useState<number>(1);
  const navigate = useNavigate();

  const handleClick = (index: number) => {
    setSidenavState(index);
  };

  const handleSignOut = async () => {
    try {
      await doSignOut();
      navigate('/signin');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`${baseURL}/users/${uid}`);
      if (result && result.length > 0) {
        setData(result[0]);
      }
    };
    fetchData();
  }, []);

  const RankDict: { [key: number]: string } = {
    1: "Silver",
    2: "Gold",
    3: "Platinum",
    4: "Diamond",
    5: "God tier",
  };

  const getRankClass = (rank: number) => {
    switch (rank) {
      case 1:
        return "rank-silver";
      case 2:
        return "rank-gold";
      case 3:
        return "rank-platinum";
      case 4:
        return "rank-diamond";
      case 5:
        return "rank-god";
      default:
        return "";
    }
  };

  const getRankSVGClass = (ranksvg: number) => {
    switch (ranksvg) {
      case 1:
        return SilverRank;
      case 2:
        return GoldRank;
      case 3:
        return PlatinumRank;
      case 4:
        return DiamondRank;
      case 5:
        return GodRank;
      default:
        return "";
    }
  };

  const handleProfilePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      // Assuming you have a function to upload the file and get the URL
      const uploadedUrl = await uploadProfilePhoto(file); // Implement this function
      // Update the user's profile photo URL in your backend and state
      setData(prevData => prevData ? { ...prevData, pfpUrl: uploadedUrl } : null);
    }
  };

  const renderContent = () => {
    switch (sidenavState) {
      case 1:
        return <ProfileDetail />;
      case 2:
        return <Purchases />;
      case 3:
        return <Favorites />;
      case 4:
        return <Vouchers />;
      default:
        return null;
    }
  };

  const renderContentText = () => {
    switch (sidenavState) {
      case 1:
        return 'Profile Detail';
      case 2:
        return 'Purchases';
      case 3:
        return 'Favorites';
      case 4:
        return 'Vouchers';
      case 5:
        return 'History';
      default:
        return null;
    }
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <Navbar />
      <div className="title-bar-container">
        <div className="title-bar-content">
          <div className="bread-nav">
            <Breadcrumb
              separator=">"
              items={[
                {
                  title: 'Home',
                  href: '/',
                },
                {
                  title: 'Profile',
                },
              ]}
            />
          </div>
          <div className="page-title-bar">
            <div className="page-title">Profile</div>
          </div>
        </div>
      </div>
      <div className="page-container">
        <div className="profile-bar">
          <div className="profile-bar-left">
            <div className="profile-bar-avatar">
              <img src={photoURL} className="profile-user-photo" />
              <input id="file-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleProfilePhotoChange} />
            </div>
            <div className="profile-bar-details">
              <div className="profile-bar-details-name">
                {displayName}
              </div>
              <div className={`profile-bar-rank ${getRankClass(data?.rank || 1)}`} onClick={handleOpen}>
                <div className="profile-rank-text">
                  {RankDict[data?.rank || 1]} member
                </div>
                <img src={Next} alt="next" className="profile-rank-next" />
              </div>
              <div className="profile-edit">
                <img src={Edit} className="profile-edit-pen" />
                <div onClick={() => handleClick(1)} className={sidenavState === 1 ? `active` : ``} >
                  &nbsp;Edit Profile
                </div>
              </div>
            </div>
          </div>
          <div className="profile-bar-right">
            <img src={getRankSVGClass(data?.rank || 1)} alt="Rank" className="Rank" onClick={() => setOpen(true)} />
          </div>
        </div>
        <div className="profile-detail">
          <div className="profile-sidenav p-10">
            <li onClick={() => handleClick(1)} className={sidenavState === 1 ? `active` : ``}>
              <img src={ProfileIcon} className="sidenav-icon" alt="Profile Icon" />
              <div className="sidenav-content">
                <div className="sidenav-detail">Profile detail</div>
              </div>
            </li>
            <li onClick={() => handleClick(2)} className={sidenavState === 2 ? `active` : ``}>
              <img src={PurchasesIcon} className="sidenav-icon" alt="Purchases Icon" />
              <div className="sidenav-content">
                <div className="sidenav-detail">Purchases</div>
              </div>
            </li>
            <li onClick={() => handleClick(3)} className={sidenavState === 3 ? `active` : ``}>
              <img src={HeartIcon} className="sidenav-icon" alt="Heart Icon" />
              <div className="sidenav-content">
                <div className="sidenav-detail">Favorites</div>
              </div>
            </li>
            <li onClick={() => handleClick(4)} className={sidenavState === 4 ? `active` : ``}>
              <img src={VouchersIcon} className="sidenav-icon" alt="Vouchers Icon" />
              <div className="sidenav-content">
                <div className="sidenav-detail">Vouchers</div>
              </div>
            </li>
            <li onClick={() => handleClick(5)} className={sidenavState === 5 ? `active` : ``}>
              <img src={ClockIcon} className="sidenav-icon" alt="Clock Icon" />
              <div className="sidenav-content">
                <div className="sidenav-detail">History</div>
              </div>
            </li>
            <li onClick={handleSignOut} className={sidenavState === 6 ? `active` : ``}>
              <img src={LogoutIcon} className="sidenav-icon" alt="Logout Icon" />
              <div className="sidenav-content-logout">
                <div className="sidenav-detail-logout"><div className="sidenav-Logout">Logout</div></div>
              </div>
            </li>
          </div>
          <div className="profile-content">
            <div className="profile-content-navbar p-10">
              <div>
                <span className="profile-content-navbar-text">{renderContentText()}</span>
              </div>
              {renderContent()}
            </div>
          </div>
        </div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={() => setOpen(true)}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={open}>
            <Box sx={style}>
              <Typography id="transition-modal-title" variant="h6" component="h2">
                Member tier list
              </Typography>
              <div>
                <img src={SilverRank} />
                <img src={GoldRank} />
                <img src={PlatinumRank} />
                <img src={DiamondRank} />
                <img src={GodRank} />
              </div>
              <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
              </Typography>
              <Button onClick={handleClose}>
                OK
              </Button>
            </Box>
          </Fade>
        </Modal>
      </div>
      <Footer />
    </>
  );
}

export default Profile;
