import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Products from "../components/products";
import { Breadcrumb, Modal, Table } from 'antd';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Footer from "../components/footer";
import axios from 'axios';
import { baseUser, baseURL } from '../components/userIDConfig';
import { Link, useNavigate } from "react-router-dom";
import Goback from "../components/assets/goback.svg"
const { confirm } = Modal;
import { useAuth } from '../context/authContext';

const ShoppingCart = () => {
  const { uid, displayName } = useAuth();
  const [dataSource, setDataSource] = useState([]);
  console.log("🚀 ~ ShoppingCart ~ dataSource:", dataSource)
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [fullPrice, setFullPrice] = useState(0);
  const [vat, setVat] = useState(0);
  const [fee, setFee] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const sendData = {
    subTotal,
    fullPrice,
    vat,
    fee: 0,
    discount,
    total,
  }
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await axios.get(`${baseURL}/carts/${uid}`);
        const cartitems = response.data;
        const combinedData = cartitems.map(data => ({
          key: data.productID,
          ...data
        }));

        setDataSource(combinedData);
        calculateTotals(selectedRowKeys, combinedData);
      } catch (error) {
        console.error("Error fetching cart data: ", error);
      }
    };

    fetchCartData();
  }, [selectedRowKeys]);

  useEffect(() => {
    calculateTotals(selectedRowKeys, dataSource);
  }, [selectedRowKeys, dataSource]);

  const calculateTotals = (selectedKeys, data) => {
    const selectedRows = data.filter(item => selectedKeys.includes(item.productID));
    const totalSelectedPrice = selectedRows.reduce((total, row) => total + (row.price * row.qty), 0);
    const totalSelectedFullPrice = selectedRows.reduce((total, row) => total + (row.fullPrice * row.qty), 0);
    const totalVat = totalSelectedPrice * 0.07;
    // const totalFee = totalSelectedPrice * 0.01;
    const totalDiscount = selectedRows.reduce((total, row) => {
      const priceDifference = row.fullPrice - row.price;
      return total + (priceDifference * row.qty);
    }, 0);

    setSubTotal(totalSelectedPrice);
    setFullPrice(totalSelectedFullPrice);
    setVat(totalVat);
    // setFee(totalFee);
    setDiscount(totalDiscount);
    setTotal(totalSelectedPrice + totalVat);
    console.log('totalSelectedPrice', totalSelectedPrice)
    // console.log('fullprice', fullPrice)
    // console.log('subtotal',subTotal)
    // console.log('total',total)
    // console.log('discount',discount)
    console.log('totalVat', totalVat)
    // console.log('totalFee', totalFee)
    // console.log('totalSelectedFullPrice',totalSelectedFullPrice)
    
    console.log("sendData",sendData);
  };

  const [test, setTest] = useState([]);
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      calculateTotals(selectedRowKeys, dataSource);
      setTest(dataSource.filter(item => 
        selectedRowKeys.includes(item.key)
      ));
    },
    selectedRowKeys,
  };

  const handleCheckboxChange = (key: string) => {
    setSelectedRowKeys(prev => {
      const newSelection = prev.includes(key)
        ? prev.filter(k => k !== key)
        : [...prev, key];
      return newSelection;
    });
  };

  const handleDelete = async (key) => {
    try {
      await axios.delete(`${baseURL}/carts/${uid}/${key}/remove`);
      const newData = dataSource.filter(item => item.key !== key);
      setDataSource(newData);
      const newSelectedRowKeys = selectedRowKeys.filter(selectedKey => selectedKey !== key);
      setSelectedRowKeys(newSelectedRowKeys);
      calculateTotals(newSelectedRowKeys, newData);
    } catch (error) {
      console.error("Error deleting item: ", error);
    }
  };

  const showDeleteConfirm = (key) => {
    confirm({
      title: 'Are you sure you want to delete this item?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDelete(key);
      },
      onCancel() {
        console.log('Cancel');
      },
      okButtonProps: {
        style: {
          backgroundColor: 'red',
          borderColor: 'red',
          color: 'white'
        },
        onMouseEnter: (e) => {
          e.target.style.backgroundColor = '#ff4d4d';
          e.target.style.borderColor = '#ff4d4d';
        },
        onMouseLeave: (e) => {
          e.target.style.backgroundColor = 'red';
          e.target.style.borderColor = 'red';
        }
      },
      cancelButtonProps: {
        style: {
          color: 'black'
        }
      },
      className: 'custom-modal' // Add a custom class name if needed
    });
  };

  const handleQuantityChange = async (key: any, increment: boolean) => {
    const updateQTY = increment ? 1 : -1;
    console.log("user", uid);
    console.log("key", key);
    console.log("updateQTY", updateQTY);
    const q = await axios.post(`${baseURL}/carts/${uid}/${key}/${updateQTY}`);
    console.log("q", q);

    const newData = dataSource.map(item =>
      item.productID === key ? { ...item, qty: increment ? item.qty + 1 : item.qty - 1 } : item
    );
    setDataSource(newData);
    calculateTotals(selectedRowKeys, newData);
  };

  const columns = [
    {
      title: 'Product Name',
      width: '38%',
      dataIndex: 'productPic',
      key: 'productPic',
      align: 'center' as const,
      render: (_, record) => (
        <Link to={`/product/?productID=${record.productID}`} className="record-pic">
          <img src={record.productPicUrl} />
          <div className="record-pic-text">{record.name}</div>
        </Link>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: '17%',
      align: 'center' as const,
      render: (_, record) => `$${record.price.toFixed(2)}`,
    },
    {
      title: 'Quantity',
      dataIndex: 'qty',
      key: 'qty',
      width: '25%',
      align: 'center' as const,
      render: (_, record) => (
        <div>
          <Button onClick={() => handleQuantityChange(record.productID, false)} disabled={record.qty <= 1}>-</Button>
          <span style={{ margin: '0 8px' }}>{record.qty}</span>
          <Button onClick={() => handleQuantityChange(record.productID, true)}>+</Button>
        </div>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: '15%',
      align: 'center' as const,
      render: (_, record) => (
        <Tooltip title="Remove" placement="right">
          <Button className="delete-icon-wrapper" onClick={() => showDeleteConfirm(record.key)}>
            <DeleteIcon />
          </Button>
        </Tooltip>
      ),
    },
  ];
  console.log("dataSource", dataSource);
  console.log("selectedRowKeys", selectedRowKeys);
  console.log("sending data", test);
  return (
    <>
      <div className="max-md:hidden ">

        <Navbar />
        <div className="title-bar-container ">
          <div className="title-bar-content">
            <div className="bread-nav">
              <Breadcrumb
                separator=">"
                items={[
                  {
                    title: 'Home',
                    href: '/home',
                  },
                  {
                    title: 'Shopping Cart',
                  },
                ]}
              />
            </div>
            <div className="page-title-bar">
              <div className="page-title">Shopping Cart</div>
              <div className="page-sub-title">({dataSource.length} items)</div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center relative overflow-hidden h-16 bg-white shadow-lg md:hidden">
        <div onClick={() => navigate(-1)} className="absolute left-3 w-3 flex m-auto h-full">
          <img src={Goback} />
        </div>
        <div className="flex justify-center items-center flex-2 w-full text-2xl font-semibold">
          My Cart
        </div>
      </div>
      <div className="page-container px-2 w-full max-md:pb-40">
        <div className="shoppingcart-container max-md:flex-col w-full">
          <div className="cart-list max-md:hidden">
            <Table
              rowSelection={{
                type: 'checkbox',
                ...rowSelection,
              }}
              columns={columns}
              dataSource={dataSource}
              pagination={false}
              scroll={{ y: 450 }}
            />
          </div>
          <div className="cart-list flex flex-col gap-3 bg-transparent md:hidden w-full">
            {dataSource.map((data, index) => (
              <div className="flex p-4 bg-white rounded-xl shadow-md gap-4 w-full">
                <input
                  type="checkbox"
                  className="bg-red-100 scale-125"
                  checked={selectedRowKeys.includes(data.key)}
                  onChange={() => handleCheckboxChange(data.key)}
                />
                <img src={data.productPicUrl} className="w-20" />
                <div className="flex flex-col w-full justify-between">
                  <div className="flex justify-between items-center mb-5">
                    <div className="font-semibold">{data.name}</div>
                    <div className="flex">
                      <button className="delete-icon-wrapper " onClick={() => showDeleteConfirm(data.key)}>
                        <DeleteIcon />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end items-end gap-2">
                    <div className="text-lg font-extrabold text-blue-400">${data.price.toFixed(2)}</div>
                    <div className="flex justify-between items-center bg-slate-100 rounded-lg w-20 px-3">
                      <button onClick={() => handleQuantityChange(data.productID, false)} disabled={data.qty <= 1} >-</button>
                      <span className="text-base">{data.qty}</span>
                      <button onClick={() => handleQuantityChange(data.productID, true)}>+</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="check-out max-md:hidden">
            <div className="check-out-top">
              <div className="check-out-title">Summary</div>
              <div className="check-out-list">
                <div className="sub-check-out-list">
                  <div className="listname">Sub total</div>
                  <div className="listvalue">${fullPrice.toFixed(2)}</div>
                </div>
                <div className="sub-check-out-list">
                  <div className="listname">Vat</div>
                  <div className="listvalue">${vat.toFixed(2)}</div>
                </div>
                <div className="sub-check-out-list">
                  {/* <div className="listname">Shipping Fee</div>
                  <div className="listvalue">${fee.toFixed(2)}</div> */}
                </div>
                <div className="sub-check-out-list">
                  <div className="listname">Discount</div>
                  <div className="listdiscount">-${discount.toFixed(2)}</div>
                </div>
              </div>
            </div>
            <div className="check-out-bottom">
              <div className="check-out-total">
                <div className="totla-listname">Total</div>
                <div className="total-listvalue">${total.toFixed(2)}</div>
              </div>
              <div className="place-order" onClick={() => navigate(`/checkout?cartItems=${encodeURIComponent(JSON.stringify(test))}&orderSummary=${encodeURIComponent(JSON.stringify(sendData))}`)}>
                
                <Button className="check-out-btn" variant="contained" sx={{
                  borderRadius: 3,
                  height: 60,
                  fontSize: 20,
                  fontWeight: 'bold',
                  bgcolor: '#5AB2FF',
                  ':hover': {
                    bgcolor: '#4798CC',
                    color: 'white',
                  },
                }}
                >
                  Check out
                </Button>
              </div>
            </div>
          </div>

        </div>

        <div className="check-out px-5 md:hidden fixed bottom-0 z-50 w-full rotate-180 shadow-md rounded-b-3xl rounded-t-none ">
          <div className="flex justify-between rotate-180">
            <div className="bg-transparent flex-col">
              <div className="total-listvalue text-3xl font-semibold">${subTotal.toFixed(2)}</div>
              <div className="totla-listname text-lg font-medium">Subtotal</div>
            </div>
            <div className="">
              <Button className="check-out-btn" variant="contained" sx={{
                borderRadius: 3,
                height: 60,
                width: 160,
                fontSize: 15,
                fontWeight: 'bold',
                bgcolor: '#5AB2FF',
                ':hover': {
                  bgcolor: '#4798CC',
                  color: 'white',
                },
              }}
              >
                Check out
              </Button>
            </div>
          </div>
          <hr className="mt-5 mb-1 border-t-2" />
          <div className="check-out-top rotate-180 mr-auto flex gap-2 items-center text-base h-full ">
            <p className=" h-full mb-1">select your vouchers</p>
            <img src={Goback} className="w-2 rotate-180 h-full" />
          </div>
        </div>
        {/* <Products /> */}
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default ShoppingCart;
