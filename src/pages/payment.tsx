import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import generatePayload from 'promptpay-qr';
import { useLocation, useNavigate } from 'react-router-dom';
import Logo from "../components/mockuppics/logo.png";
import { Button } from 'antd';

function Payment() {
  const [phoneNumber, setPhoneNumber] = useState('0929871425');
  const [qrCode, setQrCode] = useState('');
  const [timer, setTimer] = useState(60);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const total = queryParams.get('total');
  const navigate = useNavigate();

  // Ensure amount is a valid number
  const [amount, setAmount] = useState(Number(total) || 0);
  console.log('total', total);

  function generateQRCode() {
    // Remove any hyphens or spaces from the phone number
    const cleanedPhoneNumber = phoneNumber.replace(/[^0-9]/g, '');
    console.log('cleanedPhoneNumber', cleanedPhoneNumber);

    if (cleanedPhoneNumber && amount > 0) {
      const payload = generatePayload(cleanedPhoneNumber, { amount });
      setQrCode(payload);
    } else {
      alert('Please enter a valid phone number and amount.');
    }
  }

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    }
    // } else {
    //   generateQRCode();
    //   setTimer(60); // Reset timer after generating the QR code
    // }
  }, [timer]);

  useEffect(() => {
    generateQRCode();
  }, [phoneNumber, amount]); // Ensure it regenerates when phoneNumber or amount changes

  return (
    <div className='p-5 bg-white w-1/3'>
      <div className='bg-white flex flex-col justify-center items-center gap-5'>
        <img src={Logo} className='w-44'/>
        <div className='w-full '>
            {timer != 0 ? <QRCodeSVG value={qrCode} className='w-80 h-auto m-auto'/> : <p className='text-center text-xl'>QR code expired</p>}
        </div>
        <div className='bg-slate-200 w-full text-center text-4xl font-bold h-20 flex items-center justify-center'>
            Amount: ${total}
        </div>
        <p className='text-xl'>QR code expire in: {timer} seconds</p>
        <Button className='w-full h-12 mt-auto' type="primary" style={{ fontSize: '24px' }} onClick={() => navigate('/home')}>
            Return to home page
        </Button>
      </div>
    </div>
  );
}

export default Payment;
