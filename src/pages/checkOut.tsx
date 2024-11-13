import Navbar from "../components/navbar";
import Products from "../components/products";
import { Breadcrumb, Modal, Table, Tabs } from 'antd';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import ButtonMui from '@mui/material/Button';
import Footer from "../components/footer";
import axios from 'axios';
import { baseUser, baseURL } from '../components/userIDConfig';
import { Link, useLocation, useNavigate } from "react-router-dom";
import Goback from "../components/assets/goback.svg"
import { useAuth } from '../context/authContext';
import React, { useContext, useEffect, useRef, useState } from 'react';
import type { GetRef, InputRef, TableProps } from 'antd';
import { Button ,Form, Input, Popconfirm, Select, Space, radio } from 'antd';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

const { confirm } = Modal;
type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
}

interface EditableRowProps {
  index: number;
}

// const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
//   const [form] = Form.useForm();
//   return (
//     <Form form={form} component={false}>
//       <EditableContext.Provider value={form}>
//         <tr {...props} />
//       </EditableContext.Provider>
//     </Form>
//   );
// };

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[{ required: true, message: `${title} is required.` }]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingInlineEnd: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

interface DataType {
  key: React.Key;
  name: string;
  age: string;
  address: string;
}

type ColumnTypes = Exclude<TableProps['columns'], undefined>;

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const CheckOut = () => {
  const { uid, displayName } = useAuth();
  // const [dataSource, setDataSource] = useState([]);
  // console.log("🚀 ~ ShoppingCart ~ dataSource:", dataSource)
  const [selectedRowKeys, setSelectedRowKeys] = useState(1);
  const [subTotal, setSubTotal] = useState(0);
  const [fullPrice, setFullPrice] = useState(0);
  const [vat, setVat] = useState(0);
  const [fee, setFee] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const cartItems = queryParams.get('cartItems');
  const orderSummary = queryParams.get('orderSummary');
  const parsedCartItems = cartItems ? JSON.parse(decodeURIComponent(cartItems)) : {};
  const parsedOrderSummary = cartItems ? JSON.parse(decodeURIComponent(orderSummary)) : {};

  console.log("hello",parsedCartItems);
  console.log("hello2",parsedOrderSummary);

  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  

  const handleCancel = (e: React.MouseEvent<HTMLElement>) => {
    console.log(e);
    setOpen(false);
  };
  const [dataSource, setDataSource] = useState<DataType[]>([]);

  const [count, setCount] = useState(2);

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: '25%',
      render: (_, record) =>
        <>
          <div>{record.fullName}</div>
          <div>{record.phoneNO}</div>
        </>
    },
    {
      title: 'Address details',
      dataIndex: 'address',
      width: '60%',
      align: 'left',
      render: (_, record) =>
        <>
          <div>
            ตำบล{record.tambol} อำเภอ{record.amphure} จังหวัด{record.province} {record.zipCode}
          </div>
        </>
    },
    {
      // title: 'operation',
      dataIndex: 'operation',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
  ];

  const handleAdd = () => {
    const newData: DataType = {
      key: count,
      name: `Edward King ${count}`,
      age: '32',
      address: `London, Park Lane no. ${count}`,
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  // const handleSave = (row: DataType) => {
  //   const newData = [...dataSource];
  //   const index = newData.findIndex((item) => row.key === item.key);
  //   const item = newData[index];
  //   newData.splice(index, 1, {
  //     ...item,
  //     ...row,
  //   });
  //   setDataSource(newData);
  // };

  // const components = {
  //   body: {
  //     row: EditableRow,
  //     cell: EditableCell,
  //   },
  // };

  

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await axios.get(`${baseURL}/carts/${uid}`);
        const cartitems = response.data;
        const combinedData = cartitems.map(data => ({
          key: data.productID,
          ...data
        }));

        // setDataSource(combinedData);
        calculateTotals(selectedRowKeys, combinedData);
      } catch (error) {
        console.error("Error fetching cart data: ", error);
      }
    };

    fetchCartData();
  }, [selectedRowKeys]);

  const [rowClicked, setRowClicked] = useState(false)
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows[0]);
      setRowClicked(true);
    },
  };

  console.log("rowClicked",rowClicked);

  // const handleCheckboxChange = (key: string) => {
  //   setSelectedRowKeys(prev => {
  //     const newSelection = prev.includes(key)
  //       ? prev.filter(k => k !== key)
  //       : [...prev, key];
  //     return newSelection;
  //   });
  // };

  // const handleDelete = async (key) => {
  //   try {
  //     await axios.delete(`${baseURL}/carts/${uid}/${key}/remove`);
  //     const newData = dataSource.filter(item => item.key !== key);
  //     setDataSource(newData);
  //     const newSelectedRowKeys = selectedRowKeys.filter(selectedKey => selectedKey !== key);
  //     setSelectedRowKeys(newSelectedRowKeys);
  //     calculateTotals(newSelectedRowKeys, newData);
  //   } catch (error) {
  //     console.error("Error deleting item: ", error);
  //   }
  // };

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

  // const handleQuantityChange = async (key: any, increment: boolean) => {
  //   const updateQTY = increment ? 1 : -1;
  //   console.log("user", uid);
  //   console.log("key", key);
  //   console.log("updateQTY", updateQTY);
  //   const q = await axios.post(`${baseURL}/carts/${uid}/${key}/${updateQTY}`);
  //   console.log("q", q);

  //   const newData = dataSource.map(item =>
  //     item.productID === key ? { ...item, qty: increment ? item.qty + 1 : item.qty - 1 } : item
  //   );
  //   setDataSource(newData);
  //   calculateTotals(selectedRowKeys, newData);
  // };

  // const columns = [
  //   {
  //     // title: 'Product Name',
  //     width: '30%',
  //     dataIndex: 'productPic',
  //     key: 'productPic',
  //     align: 'left' as const,
  //     render: (_, record) => (
  //       <Link to={`/product/?productID=${record.productID}`} className="record-pic">
  //         <div className="record-pic-text">{record.name}</div>
  //       </Link>
  //     ),
  //   },
  //   {
  //     // title: 'Price',
  //     dataIndex: 'price',
  //     key: 'price',
  //     width: '60%',
  //     align: 'left' as const,
  //     render: (_, record) => `$${record.price.toFixed(2)}`,
  //   },
  //   {
  //     // title: 'Action',
  //     key: 'action',
  //     width: '15%',
  //     align: 'center' as const,
  //     render: (_, record) => (
  //       <Tooltip title="Remove" placement="right">
  //         <Button className="delete-icon-wrapper" onClick={() => showDeleteConfirm(record.key)}>
  //           <DeleteIcon />
  //         </Button>
  //       </Tooltip>
  //     ),
  //   },
  // ];

  console.log("dataSource", dataSource);
  console.log("selectedRowKeys", selectedRowKeys);
  
  const [form] = Form.useForm();

  const onGenderChange = (value: string) => {
    switch (value) {
      case 'male':
        form.setFieldsValue({ note: 'Hi, man!' });
        break;
      case 'female':
        form.setFieldsValue({ note: 'Hi, lady!' });
        break;
      case 'other':
        form.setFieldsValue({ note: 'Hi there!' });
        break;
      default:
    }
  };

  const onFinish = (values: any) => {
    console.log(values);
  };

  const onReset = () => {
    form.resetFields();
  };

  const onFill = () => {
    form.setFieldsValue({ note: 'Hello world!', gender: 'male' });
  };

  const [provinces, setProvinces] = useState([]);
  const [amphures, setAmphures] = useState([]);
  const [tambons, setTambons] = useState([]);
  const [selected, setSelected] = useState({
    province_id: undefined,
    amphure_id: undefined,
    tambon_id: undefined
  });

  console.log("selected",selected);

  useEffect(() => {
    (() => {
      fetch(
        "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json"
      )
        .then((response) => response.json())
        .then((result) => {
          setProvinces(result);
        });
    })();
  }, []);

  const DropdownList = ({
    label,
    id,
    list,
    child,
    childsId = [],
    setChilds = []
  }) => {
    const onChangeHandle = (event) => {
      setChilds.forEach((setChild) => setChild([]));
      const entries = childsId.map((child) => [child, undefined]);
      const unSelectChilds = Object.fromEntries(entries);

      const input = event.target.value;
      const dependId = input ? Number(input) : undefined;
      setSelected((prev) => ({ ...prev, ...unSelectChilds, [id]: dependId }));

      if (!input) return;

      if (child) {
        const parent = list.find((item) => item.id === dependId);
        const { [child]: childs } = parent;
        const [setChild] = setChilds;
        setChild(childs);
      }
    };
    console.log("listhaha",list.filter(item => item.id == selected.tambon_id))
    return (
      <>
        <TextField
          margin="normal"
          select
          label={label}
          value={selected[id] || ""}
          onChange={onChangeHandle}
          fullWidth
          size="small"
          InputProps={{
            style: { fontSize: '14px' } // Change this value as needed
          }}
          InputLabelProps={{style: {fontSize: 14}}} 
          required
        >
          <MenuItem value="" sx={{fontSize:'12px'}}>
            <em>Select ...</em>
          </MenuItem>
          {list &&
            list.map((item) => (
              <MenuItem key={item.id} value={item.id} sx={{fontSize:'12px'}} >
                {`${item.name_th} - ${item.name_en}`}
              </MenuItem>
            ))}
        </TextField>
      </>
    );
  };
  
  const [formPostalCode, setFormPostalCode] = useState();
  const tambolDummy = tambons.filter(item => item.id == selected.tambon_id)
  console.log("tambolDummy",tambolDummy[0]);
  const amphureDummy = amphures.filter(item => item.id == selected.amphure_id)
  console.log("amphureDummy",amphureDummy[0]);
  const provinceDummy = provinces.filter(item => item.id == selected.province_id)
  console.log("provinceDummy",provinceDummy[0]);

  const [formName, setFormName] = useState();
  const [formPhone, setFormPhone] = useState();
  const [formAddressDetails, setFormAddressDetails] = useState();
  const [formSubDistrict, setFormSubDistrict] = useState();
  const [formDistrict, setFormDistrict] = useState();
  const [formProvince, setFormProvince] = useState();

  const [rowData, setRowData] = useState([]);
  const [OKdisable, setOKdisble] = useState(true);

  const checkAddress = () => {
    if(tambolDummy[0] && amphureDummy[0] && provinceDummy[0]){
      const AddressObject = {
        userID: uid,
        phoneNO: formPhone,
        addressDetail: formAddressDetails,
        tambol: tambolDummy[0].name_th,
        amphure: amphureDummy[0].name_th,
        province: provinceDummy[0].name_th,
        zipCode: tambolDummy[0].zip_code,
      }
      console.log("yes", AddressObject);
      setOKdisble(false);
      console.log("is it true:", OKdisable);
    }
  }

  const handleOk = async () => {
    const data = {
      fullName: formName,
      userID: uid,
      phoneNO: formPhone,
      addressDetail: formAddressDetails,
      tambol: tambolDummy[0].name_th,
      amphure: amphureDummy[0].name_th,
      province: provinceDummy[0].name_th,
      zipCode: tambolDummy[0].zip_code,
    };

    setRowData(prevData => [...prevData, data])

    try {
      const response = await axios.post(`${baseURL}/addresses/add`, data);
      console.log('Response from server:', response.data);
    } catch (error) {
      console.error('Error sending request:', error);
    }

    setOpen(false);
  };


  useEffect(() => {
    const getDataSource = async () => {
      try{
        const response = await axios.get(`${baseURL}/addresses/${uid}`);
        setRowData(response.data);
        console.log("responsedata",response.data);
        console.log("responsedatarowData",rowData);
      }catch(error){
        console.log("error",error);
      }
    }
    getDataSource();

  }, [])
  
  const { TabPane } = Tabs;

  const handleInputChange = () => {
    setOKdisble(false);
  }

  useEffect(() => {
    if (formName && formPhone && formAddressDetails && provinceDummy[0] && amphureDummy[0] && tambolDummy[0]) {
      setOKdisble(false);
    } else {
      setOKdisble(true);
    }
  }, [formName, formPhone, formAddressDetails, provinceDummy[0], amphureDummy[0], tambolDummy[0]]);

  const [deliveryClicked, setDeliveryClicked] = useState(0);
  const [shippingFee, setShippingFee] = useState<number>(0);

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
                    href: '/shoppingcart',
                  },
                  {
                    title: 'Check out',
                  },
                ]}
              />
            </div>
            <div className="page-title-bar">
              <div className="page-title">Check Out</div>
              {/* <div className="page-sub-title">({dataSource.length} items)</div> */}
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
          <div className="cart-list max-md:hidden h-fit rounded-none bg-transparent p-0">
            
            {/* <Button type="primary" onClick={showModal}>
              Open Modal with customized button props
            </Button> */}
            <Modal 
              title="Address"
              open={open}
              onOk={handleOk}
              onCancel={handleCancel}
              okButtonProps={{ disabled: OKdisable }}
              width={'700px'}
            >
              <div className="flex justify-center w-full">
                
                <Box component="form" noValidate sx={{ display:'flex',flexDirection: 'column', width: '100%' }}>
                  <Box sx={{ display:'flex', gap:'20px', width: '100%' }}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="name"
                      label="Full name"
                      name="name"
                      autoFocus
                      sx={{ width: '100%'}}
                      size="small"
                      inputProps={{style: {fontSize: 14}}} // font size of input text
                      InputLabelProps={{style: {fontSize: 14}}} 
                      onChange={(e) => setFormName(e.target.value)}
                      />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="phone"
                      label="Phone number"
                      name="phone"
                      autoComplete="phone"
                      sx={{ width: '100%' }}
                      size="small"
                      inputProps={{style: {fontSize: 14}}} // font size of input text
                      InputLabelProps={{style: {fontSize: 14}}}
                      onChange={(e) => setFormPhone(e.target.value)}
                    />
                  </Box >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="Address"
                    label="Address details"
                    name="Address"
                    autoComplete="Address"
                    sx={{ width: '100%' }}
                    size="small"
                    multiline
                    inputProps={{style: {fontSize: 14}}} // font size of input text
                    InputLabelProps={{style: {fontSize: 14}}}
                    onChange={(e) => setFormAddressDetails(e.target.value)}
                  />
                  <Box sx={{ display:'flex', gap:'20px', width: '100%', }}>
                    <DropdownList
                      label="Province"
                      id="province_id"
                      list={provinces}
                      child="amphure"
                      childsId={["amphure_id", "tambon_id"]}
                      setChilds={[setAmphures, setTambons]}
                    />
                    <DropdownList
                      label="District"
                      id="amphure_id"
                      list={amphures}
                      child="tambon"
                      childsId={["tambon_id"]}
                      setChilds={[setTambons]}
                    />
                  </Box >
                  <Box sx={{ display:'flex', gap:'20px', width: '100%', }}>
                    
                    <DropdownList 
                      label="Sub-district" 
                      id="tambon_id" 
                      list={tambons} 
                    />

                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="Postal code"
                      name="email"
                      autoComplete="email"
                      sx={{ width: '100%' }}
                      size="small"
                      inputProps={{style: {fontSize: 14}}} // font size of input text
                      InputLabelProps={{style: {fontSize: 14}}}
                      value={tambolDummy[0]?.zip_code || ''}
                      onChange={handleInputChange}
                    />
                    {console.log("hethte",OKdisable)}
                  </Box >
                </Box>
                  {/* <pre>{JSON.stringify(selected, null, 4)}</pre> */}
                  
              </div>
            </Modal>
            <div className="cart-list bg-white p-4 mb-3">

            <div className="flex justify-between">
              <div className="text-2xl">Address</div>
              <Button onClick={() => showModal()} type="primary" style={{ marginBottom: 16 }}>
                Add a row +
              </Button>
            </div>
                <Table
                rowSelection={{
                  type: 'radio',
                  ...rowSelection,
                }}
                // components={components}
                // bordered
                pagination= {false}
                dataSource={rowData}
                columns={defaultColumns}
                rowKey="addressID"
                scroll={{ y: 450 }}
                />
            </div>
            <div className="w-full bg-white p-4 rounded-2xl mb-3">
              <div className="text-2xl mb-2">Delivery</div>
              <hr className="mb-4 "/>
              <div className="flex gap-4">
                <button 
                  className={shippingFee === 10 ? 'w-1/3 bg-blue-50 rounded-2xl p-4 border-blue-500 border-2' : 'w-1/3 bg-white rounded-2xl p-4 border-black/5 border-2'} 
                  onClick={() => {
                    setShippingFee(10);
                  }}
                >
                  <div className="flex justify-between mb-3">
                    <div className="text-xl">General delivery</div>
                    <div className="text-xl">$10</div>
                  </div>
                  <div className="text-sm text-left">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, error.
                  </div>
                </button>
                <button 
                  className={shippingFee === 20 ? 'w-1/3 bg-blue-50 rounded-2xl p-4 border-blue-500 border-2' : 'w-1/3 bg-white rounded-2xl p-4 border-black/5 border-2'} 
                  onClick={() => {
                    setShippingFee(20);
                  }}
                >
                  <div className="flex justify-between mb-3">
                    <div className="text-xl">Premium delivery</div>
                    <div className="text-xl">$20</div>
                  </div>
                  <div className="text-sm text-left">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, error.
                  </div>
                </button>
              </div>
            </div>
            <div className="w-full bg-white rounded-2xl p-4">
              <div className="text-2xl">Payment Method</div>
              <div className="mt-4">
              <Tabs
                defaultActiveKey="1"
                type="card"
                size="small"
              >
                <TabPane tab='QR code' key='1'>
                  <div className="h-96">

                  </div>
                </TabPane>
                <TabPane tab='Mobile Banking' key='2'>
                  <div className="h-96">

                  </div>
                </TabPane>
                <TabPane tab='Cash' key='-'>
                  <div className="h-96">

                  </div>
                </TabPane>
              </Tabs>
              </div>
            </div>
          </div>
          <div className="check-out max-md:hidden h-fit">
            <div className="check-out-top">
              <div className="check-out-title">Summary</div>
              <div className="check-out-list">
                {parsedCartItems.map((data, index) => (
                  
                  <>
                  <div key={index} className="sub-check-out-list">
                    <div className="listname">
                      <div className="text-base text-black/75">{data.name}</div>
                      <div className="text-sm text-black/75">Quantity: {data.qty}</div>
                    </div>
                    <div className="flex items-center text-base text-black/75">${(data.price)*(data.qty).toFixed(2)}</div>
                    
                  </div>
                  <hr className="h-3"></hr>
                  </>
                ))}
                <div className="sub-check-out-list">
                  <div className="listname">Sub total</div>
                  <div className="listvalue">${parsedOrderSummary.fullPrice.toFixed(2)}</div>
                </div>
                <div className="sub-check-out-list">
                  <div className="listname">Vat</div>
                  <div className="listvalue">${parsedOrderSummary.vat.toFixed(2)}</div>
                </div>
                <div className="sub-check-out-list">
                  <div className="listname">Shipping Fee</div>
                  <div className="listvalue">${parsedOrderSummary.fee+shippingFee}</div>
                </div>
                <div className="sub-check-out-list">
                  <div className="listname">Discount</div>
                  <div className="listdiscount">-${parsedOrderSummary.discount.toFixed(2)}</div>
                </div>
              </div>
            </div>
            <div className="check-out-bottom">
              <div className="check-out-total">
                <div className="totla-listname">Total</div>
                <div className="total-listvalue">${Number(parsedOrderSummary.total.toFixed(2))+shippingFee}</div>
              </div>
              <div className="place-order">
                  <ButtonMui 
                    className="check-out-btn" 
                    variant="contained"
                    disabled={shippingFee === 0 || rowClicked === false}
                    sx={{
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
                    <Link to={`/payment?total=${(Number(parsedOrderSummary.total.toFixed(2))+shippingFee).toFixed(2)}`}>
                    Make payment
                    </Link>
                  </ButtonMui>
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
                Make payment
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

export default CheckOut;
