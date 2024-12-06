require("dotenv").config();

const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  doc,
  updateDoc,
  collection,
  getDocs,
  getDoc,
} = require("firebase/firestore");

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * User Data:
 *  id : string,
 *  tokenA : number,
 *  tokenB : number,
 */

async function getUsers() {
  const usersCollectionRef = collection(db, "/users");

  try {
    const usersSnapshot = await getDocs(usersCollectionRef);

    return usersSnapshot.docs.map((d) => d.data());
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

async function getUser(id) {
  const userDocRef = doc(db, "/users", id);

  try {
    const userSnapshot = await getDoc(userDocRef);
    if (userSnapshot.exists()) {
      return userSnapshot.data();
    } else {
      console.log("User not found");
      return false;
    }
  } catch (error) {
    console.error(`Error fetching user with id: ${id} \n`, error);
    return false;
  }
}

async function getPool() {
  const poolDocRef = doc(db, "/pool", "pool1");

  try {
    const poolSnapshot = await getDoc(poolDocRef);
    if (poolSnapshot.exists()) {
      return poolSnapshot.data();
    } else {
      console.log("Pool not found");
      return false;
    }
  } catch (error) {
    console.error(`Error fetching pool \n`, error);
    return false;
  }
}

async function updateUser(id, tokenA, tokenB) {
  if (!id) {
    console.error("Error: id is required");
    return false;
  }

  const userDocRef = doc(db, "/users", id);

  try {
    await updateDoc(userDocRef, {
      tokenA,
      tokenB,
    });

    return true;
  } catch (error) {
    console.error(`Error updating user with id: ${id} \n`, error);
    return false;
  }
}

async function initiatePool(tokenA, tokenB, k) {
  const poolDocRef = doc(db, "/pool", "pool1");

  try {
    await updateDoc(poolDocRef, {
      tokenA,
      tokenB,
      k,
    });

    return true;
  } catch (error) {
    console.error(`Error updating pool \n`, error);
    return false;
  }
}

async function updatePool(tokenA, tokenB) {
  const poolDocRef = doc(db, "/pool", "pool1");

  try {
    await updateDoc(poolDocRef, {
      tokenA,
      tokenB,
    });

    return true;
  } catch (error) {
    console.error(`Error updating pool \n`, error);
    return false;
  }
}

// Main function to run the console app
async function main() {
  const users = await getUsers();
  console.log(users);

  const pool = await getPool();
  console.log(pool);

  const updateUserResult = await updateUser("0xabcd", 100, 200);
  if (!updateUserResult) {
    console.error("Error updating user");
    return process.exit(1);
  }

  const user = await getUser("0xabcd");
  if(!user){
    console.error("Error fetching user");
    return process.exit(1);
  }
  console.log(user);

  const initiatePoolResult = await initiatePool(100, 100, 100 * 100);
  if (!initiatePoolResult) {
    console.error("Error initiating pool");
    return process.exit(1);
  }

  const updatePoolResult = await updatePool(100, 200);
  if (!updatePoolResult) {
    console.error("Error updating pool");
    return process.exit(1);
  }

  process.exit(0);
}

main();
