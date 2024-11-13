import React, { useState, useEffect } from "react";
import { Tabs, Input } from 'antd';
import './profile.scss';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { baseUser, baseURL } from '../userIDConfig';
import Camera from "../assets/camera.svg";
import { useAuth } from '../../context/authContext';
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

const { TabPane } = Tabs;

function ProfileDetail() {
    
    const { uid, displayName } = useAuth();
    console.log("uidss",uid );
    const [data, setData] = useState<usersType | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`${baseURL}/users/${uid}`);
            setData(response.data[0]);
            console.log("response",response);
        };
        fetchData();
    }, []);

    const onChange = (key) => {
        console.log('Tab changed to:', key);
    };

    console.log("data",data);
    return (
        <Tabs defaultActiveKey="1" onChange={onChange}>
            <TabPane tab='Profile' key='1'>
                <div className="profile-container">
                    <div className="title-container">
                        <div className="title">My Profile</div>
                        <div className="sub-title">Manage and protect your account</div>
                    </div>
                    <div className="idk">
                        <div className="all-container">
                            <Tooltip title="File size: maximum 1 MB | File extension: .JPEG, .PNG" placement="right">
                                <div className="img-container">
                                    <img src={data?.profilePicUrl} alt={data?.name} className="profile-user-photo" />
                                    <label className="profile-camera">
                                        <img src={Camera} />
                                    </label>
                                </div>
                            </Tooltip>
                            <label className="select-image">
                                <Tooltip title="File size: maximum 1 MB | File extension: .JPEG, .PNG" placement="right">
                                    <Button variant="outlined" component="label" size="medium" sx={{
                                        borderRadius: 3,
                                        height: 30,
                                        fontSize: 14,
                                    }}
                                    >
                                        Select Image
                                        <input type="file" hidden />
                                    </Button>
                                </Tooltip>
                            </label>
                            <div className="profile-content">
                                <div className="left-title-container">
                                    <div className="left-text">Username</div>
                                    <div className="left-text">Name</div>
                                    <div className="left-text">Email</div>
                                    <div className="left-text">Phone Number</div>
                                    <div className="left-text">Gender</div>
                                    <div className="left-text">Date of birth</div>
                                </div>
                                <div className="right-title-container">
                                    <div className="right-text-username">{displayName}</div>
                                    <div className="right-text-name">
                                        <Input style={{width:'230px'}} value={displayName} />
                                    </div>
                                    <div className="right-text-email">
                                        <div>{data?.email}</div>
                                        <div className="email-change">Change</div>
                                    </div>
                                    <div className="right-text-phone">
                                        <div>********89</div>
                                        <div className="phone-change">Change</div>
                                    </div>
                                    <div className="right-text-gender">
                                        <RadioGroup className="radio-group" row aria-label="gender" name="gender" defaultValue="Male" >
                                            <FormControlLabel value="Male" control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#0f8fff', }, }} />} label="Male" />
                                            <FormControlLabel value="Female" control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#0f8fff', }, }} />} label="Female" />
                                            <FormControlLabel value="Other" control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#0f8fff', }, }} />} label="Other" />
                                        </RadioGroup>
                                    </div>
                                    <div className="right-text-birth">
                                        <div>**/06/20**</div>
                                        <div className="birth-change">Change</div>
                                    </div>
                                </div>
                            </div>
                            <div className="save-button">
                                <Button variant="contained" size="medium" sx={{
                                    borderRadius: 3,
                                    height: 40,
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                    bgcolor: '#5AB2FF',
                                    ':hover': {
                                        bgcolor: '#4798CC',
                                        color: 'white',
                                    },
                                }}>Save</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </TabPane>
            <TabPane tab='Banks & Cards' key='2'>
                coming soon!
            </TabPane>
            <TabPane tab='Addresses' key='3'>
                <div className="profile-container">
                    <div className="title-container">
                        <div className="title">My Addresses</div>
                    </div>
                </div>
            </TabPane>
            <TabPane tab='Change Password' key='4'>
                test 4
            </TabPane>
        </Tabs>
    );
}

export default ProfileDetail;
