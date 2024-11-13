import "./upload.scss";
import Navbar from "../../components/navbar.tsx";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db, storage } from "../../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

const Upload = ({ inputs = [], title }) => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState({});
  const [path, setPath] = useState("pfps"); // Default path is "pfps/"
  const [per, setPerc] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const uploadFile = () => {
      const name = `${file.name}`;
      const storageRef = ref(storage, `${path}/${name}`); // Use the path state variable
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setPerc(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.error("Upload failed:", error);
          setErrorMessage("Failed to upload image.");
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setData((prev) => ({ ...prev, img: downloadURL }));
            setSuccessMessage("Image uploaded successfully!");
          });
        }
      );
    };

    if (file) {
      uploadFile();
    }
  }, [file, path]); // Include path in the dependency array

  const handleInput = (e) => {
    const { id, value } = e.target;
    setData((prev) => ({ ...prev, [id]: value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await createUserWithEmailAndPassword(auth, data.email, data.password);
      await setDoc(doc(db, "users", res.user.uid), {
        ...data,
        timestamp: serverTimestamp(),
      });
      setSuccessMessage("User created successfully!");
      navigate(-1);
    } catch (err) {
      console.error("Error creating user:", err);
      setErrorMessage("Failed to create user.");
    }
  };

  return (
    <div className="upload">
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt="Uploaded file preview"
            />
          </div>
          <div className="right">
            <form onSubmit={handleAdd}>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>

              <div className="formInput">
                <label htmlFor="path">Upload Path</label>
                <select
                  id="path"
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
                >
                  <option value="pfps">pfps</option>
                  <option value="products">products</option>
                  <option value="ads">ads</option>
                </select>
              </div>

              {inputs.length > 0 && inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label htmlFor={input.id}>{input.label}</label>
                  <input
                    id={input.id}
                    type={input.type}
                    placeholder={input.placeholder}
                    onChange={handleInput}
                  />
                </div>
              ))}
              <button disabled={per !== null && per < 100} type="submit">
                Send
              </button>
            </form>
          </div>
        </div>
        {successMessage && (
          <div className="popup success">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="popup error">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
