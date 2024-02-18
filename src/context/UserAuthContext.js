import { useContext, createContext, useState, useEffect } from "react"
import { createUserWithEmailAndPassword,
        signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth, db } from "../firebase";
import { getDocs, query, where, collection, doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';


const userContext = createContext();

  export const useAuth = () => { return useContext(userContext) }
    const UserAuthContext = ({ children }) => {
        const [currentuser, setCurrentuser] = useState();
        const [error, setError] = useState("");
        const navigate = useNavigate();
        const [loading, setLoading] = useState(true);


        useEffect(() => {
          const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentuser(user);
            setLoading(false);
          });
    
          return () => unsubscribe();
        }, []);



        // Employer Sign in Function 
        const EmployerUserLogin = async (email, password, employerUID) => {
          try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
             // Fetch additional user data, assuming you have a 'users' collection in Firestore
            const userDocRef = doc(db, 'EmployerProfiles', userCredential.user.uid);
            const userDocSnapshot = await getDoc(userDocRef);

            if (userDocSnapshot.exists()) {
                const userData = userDocSnapshot.data();
                if (employerUID !== userData.employerUID) {
                  throw new Error("Invalid employerUID"); 
                } else{
                  alert("Successfully Logged In!")
                }
              setCurrentuser(userCredential.user);
            } else {
              console.error('User document not found in Firestore.');
            }
          } catch (error) {
            console.error('Error logging in:', error);
            throw error;
          }
        };


        //Employee Sign in Function
        const EmployeeUserLogin = async (email, password, sis) => {
          try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            // Fetch additional user data, assuming you have a 'users' collection in Firestore
            const userDocRef = doc(db, 'EmployeeProfiles', userCredential.user.uid);
            const userDocSnapshot = await getDoc(userDocRef);

            if (userDocSnapshot.exists()) {
              const userData = userDocSnapshot.data();
              if (sis !== userData.sis) {
                throw new Error("Invalid SIS"); 
              }else{
                alert("Successfully Logged In!")
              }
              setCurrentuser(userCredential.user);
            } else {
              console.error('User document not found in Firestore.');
            }
          } catch (error) {
            console.error('Error logging in:', error);
            throw error;
          }
        };


        //Employee Sign Up Function
        const EmployeeSignUp = async (email, password, formData) => {
          try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            // Use the uid as the document ID in Firestore
                const employeeProfile = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: user.email,
                number: formData.number,
                sis: formData.sis,
                employeeUID: formData.employeeUID,
                bdate: formData.bdate,
            };
              const docRef = doc(db, "EmployeeProfiles", user.uid);
              await setDoc(docRef, employeeProfile);
            return user;
          } catch (error) {
            console.error('Error signing up:', error);
            throw error;
          }
        };
        

        //Employer Sign Up Function
        const EmployerSignUp = async (email, password, formData) => {
          try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            // Use the uid as the document ID in Firestore
              const employerProfile = {
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: user.email,
              number: formData.number,
              employerUID: formData.employerUID,
            };
              const docRef = doc(db, "EmployerProfiles", user.uid);
              await setDoc(docRef, employerProfile);
            return user;
          } catch (error) {
            console.error('Error signing up:', error);
            throw error;
          }
        };


      // logout Functionllity
      const logout = () => {
        return signOut(auth)
      }

      



const value = {
  EmployeeSignUp,
  EmployerSignUp,
  currentuser,
  EmployerUserLogin,
  EmployeeUserLogin,
  logout,
};


  return (
    <userContext.Provider value={value}>
      {!loading && children}
    </userContext.Provider>

  )
}

export default UserAuthContext