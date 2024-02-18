// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import {getAuth} from 'firebase/auth'
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

//TechnoAid Main
// const firebaseConfig = {
//   apiKey: "AIzaSyBhCjwrtIZXVgA3XPDLVacfdohIyPIKfUE",
//   authDomain: "technoaid-5f1dd.firebaseapp.com",
//   projectId: "technoaid-5f1dd",
//   storageBucket: "technoaid-5f1dd.appspot.com",
//   messagingSenderId: "15205664746",
//   appId: "1:15205664746:web:9200420db6cb2a59c1d493",
//   measurementId: "G-LZJQ7CKPTC"
// };

//TechnoAid Sub
// const firebaseConfig = {
//   apiKey: "AIzaSyB95lbXIPfTU3EVfLYLUGKz52_oIm5uDbw",
//   authDomain: "technoaid-a1e16.firebaseapp.com",
//   projectId: "technoaid-a1e16",
//   storageBucket: "technoaid-a1e16.appspot.com",
//   messagingSenderId: "384062533639",
//   appId: "1:384062533639:web:d7a90e37c4a9785393faa2",
//   measurementId: "G-EPT2HM4EWF"
// };

//another sub
// const firebaseConfig = {
//   apiKey: "AIzaSyBLE6PztdyWLtI0Tgl0kUzoEu9PvpbkbDM",
//   authDomain: "technoaidsub.firebaseapp.com",
//   projectId: "technoaidsub",
//   storageBucket: "technoaidsub.appspot.com",
//   messagingSenderId: "123218797045",
//   appId: "1:123218797045:web:9bfd7bbe34f204fa7a40bc",
//   measurementId: "G-7ELZ6MCHKL"
// };

//TechnoTechnoAid
// const firebaseConfig = {
//   apiKey: "AIzaSyCM2NAzQLHr0MFgPh7e9Oc0L6cCRvQPqK0",
//   authDomain: "technotechnoaid.firebaseapp.com",
//   projectId: "technotechnoaid",
//   storageBucket: "technotechnoaid.appspot.com",
//   messagingSenderId: "844513919845",
//   appId: "1:844513919845:web:fea25dcab58442b89bd78c",
//   measurementId: "G-CV6FHWQ7FH"
// };

//TechnoAidAid
// const firebaseConfig = {
//   apiKey: "AIzaSyAuqgj1_MbPmZhIAjDnxm-R4_1gECSinF0",
//   authDomain: "technoaidaid.firebaseapp.com",
//   projectId: "technoaidaid",
//   storageBucket: "technoaidaid.appspot.com",
//   messagingSenderId: "748524682408",
//   appId: "1:748524682408:web:b4f72b5b89589af0df569d",
//   measurementId: "G-XKKB0WESPQ"
// };

//BACKUP TechnoTechnoAidAid
const firebaseConfig = {
  apiKey: "AIzaSyCR3xxzQ14ZBn7siGNnb9lUHIHS9crq4Zk",
  authDomain: "technotechnoaidaid.firebaseapp.com",
  projectId: "technotechnoaidaid",
  storageBucket: "technotechnoaidaid.appspot.com",
  messagingSenderId: "32139138663",
  appId: "1:32139138663:web:ce6f304c1e361ec5d9a6c2",
  measurementId: "G-6HYRZ7FE10"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
export {
    db,
    auth,
    storage
}