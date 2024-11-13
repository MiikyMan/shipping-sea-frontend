import { doc, getDoc, getDocs, collection, query, where, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db, storage } from "./firebase"; // Ensure storage is imported correctly
import { getDownloadURL, ref as storageRef } from "firebase/storage"; // Import ref as storageRef to avoid collision

// Fetch a specific document example
export const fetchSpecificProduct = async (productId) => {
  try {
    const productDocRef = doc(db, "products", productId);
    const productDoc = await getDoc(productDocRef);

    if (productDoc.exists()) {
      console.log("Product:", productDoc.data());
      return productDoc.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

// This function fetches all documents from the "products" collection
export const doFetchAllProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));

    const productsList = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const productData = doc.data();
        const productPicUrl = productData.productPicUrl;
        const productPicRef = storageRef(storage, productPicUrl);
        const downloadURL = await getDownloadURL(productPicRef);

        return { id: doc.id, ...productData, productPicUrl: downloadURL };
      })
    );

    console.log("Products List:", productsList);
    return productsList;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const doQuerySpecificProducts = async (productID) => {
  try {
    const productRef = collection(db, "products");
    const productQuery = query(productRef, where("productID", "==", productID));
    const querySnapshot = await getDocs(productQuery);
    
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return products;
  } catch (error) {
    console.error("Error querying product:", error);
    return [];
  }
};

export const doQuerySpecificFavourites = async (uID) => {
  try {
    const likeRef = collection(db, "favourites");
    const likeQuery = query(likeRef, where("userID", "==", uID));
    const querySnapshot = await getDocs(likeQuery);

    const favourites = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return favourites;
  } catch (error) {
    console.error("Error querying favourites:", error);
    return [];
  }
};

export const addLike = async (uID, likeData) => {
  try {
    const likeRef = collection(db, "favourites");
    const likeQuery = query(likeRef, where("userID", "==", uID));
    const querySnapshot = await getDocs(likeQuery);

    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, {
        favourite: arrayUnion(likeData)
      });
      console.log("Like added to existing document.");
    } else {
      await setDoc(doc(likeRef), {
        userID: uID,
        favourite: [likeData]
      });
      console.log("New favourite document created.");
    }
  } catch (e) {
    console.error("Error adding like:", e);
    throw e;
  }
};

export const removeLike = async (uID, productID) => {
  try {
    const likeRef = collection(db, "favourites");
    const likeQuery = query(likeRef, where("userID", "==", uID));
    const querySnapshot = await getDocs(likeQuery);

    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      const docSnapshot = await docRef.get();

      if (docSnapshot.exists()) {
        const favouritesData = docSnapshot.data().favourite;
        const updatedFavourites = favouritesData.filter(item => item.productID !== productID);

        await updateDoc(docRef, {
          favourite: updatedFavourites
        });

        console.log("Like removed from document.");
      } else {
        console.log("No such document!");
      }
    } else {
      console.log("No document found for user.");
    }
  } catch (error) {
    console.error("Error removing like:", error);
    throw error;
  }
};
