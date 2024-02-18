import React, {useState, useEffect} from 'react';
import { auth, db, storage } from "../firebase";
import { getDoc, doc, getDocs, collection, query, where, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faLocationDot, faMagnifyingGlass, faUser, faBell, faEnvelope} from '@fortawesome/free-solid-svg-icons';


function Resume() {
  const navigate=useNavigate();
  const [ employeeInfo, setEmployeeInfo ] = useState(null);
  // const [resumeData, setResumeData] = useState(null);
  const user = auth.currentUser;
  const [isLoading, setIsLoading] = useState(true);
  const [employeeData, setEmployeeData] = useState([]); 

  const [ loader, setLoader ] = useState(false);

  const downloadPDF = async () => {
    const capture = document.querySelector('.row');
    setLoader(true);
  
    html2canvas(capture).then(async (canvas) => {
      const imgData = canvas.toDataURL('img/png');
      const docPdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = 215; // A4 width in mm
      const pdfHeight = 297; // A4 height in mm
      docPdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  
      const pdfBlob = docPdf.output('blob');
  
      // Initialize Firebase Storage
      const storage = getStorage();
  
      // Upload PDF to storage
      const storageRef = ref(storage, `employeeResume/${user.uid}/resume.pdf`);
      await uploadBytes(storageRef, pdfBlob);
  
      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
  
      // Initialize Firebase Firestore
      const db = getFirestore();
  
      // Update the EmployeeProfiles collection with the download URL
      const userDocRef = doc(db, 'EmployeeProfiles', user.uid);
      await setDoc(userDocRef, { resumeURL: downloadURL }, { merge: true });
  
      setLoader(false);
      docPdf.save('resume.pdf');
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getFirestore();
        const employeeResumeQuery = query(collection(db, 'EmployeeResume'));
        const employerResumeSnapshot = await getDocs(employeeResumeQuery);
        const employerResumeData = employerResumeSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setEmployeeData(employerResumeData);
        setIsLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error('Error fetching employee resume data from Firestore:', error);
      }
    };
  
    fetchData();
  }, []);
  
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        if (user) {
          const userDocRef = doc(db, 'EmployeeResume', user.uid);
          const docSnapshot = await getDoc(userDocRef);

          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            setEmployeeData([data]); // Store directly in the array
          } else {
            console.log('Resume document does not exist!');
          }
        }
        setIsLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching employee resume data:', error);
      }
    };

    fetchEmployeeData();
  }, [user]);
  
  const fetchEmployeeInfo = async () => {
    try {
      if (user) {
        const userDocRef = doc(db, 'EmployeeProfiles', user.uid);
        const docSnapshot = await getDoc(userDocRef);
  
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setEmployeeInfo(data);
  
          // Store user information in localStorage
          localStorage.setItem('user', JSON.stringify(data));
        } else {
          console.log('Document does not exist!');
        }
      }
    } catch (error) {
      console.error('Error fetching company information from Firestore:', error);
    } finally {
      setIsLoading(false); // Set loading to false regardless of success or failure
    }
  };
  
    useEffect(() => {

      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setEmployeeInfo(JSON.parse(storedUser));
        setIsLoading(false);
      } 
      
      else {
        fetchEmployeeInfo();
      }
    }, [user]);


    const SignOutHandler = () => {
      // Clear stored credentials on sign out
      localStorage.removeItem('user');
      auth.signOut()
      .then(() => {
        navigate('/'); // Redirect to Landing.js after signout
      })
      .catch(error => {
        console.error('Error signing out:', error);
      });
  };
    console.log(employeeInfo, employeeInfo);

return (
    
    <div>
        <div className="nav_border_container">

    <div className="nav_border border-top"></div>
    <nav className="navbar navbar-expand-lg">
      <div className="container container-fluid">
          <a onClick={()=>navigate('/Home')} className="navbar-brand">TECHNOAID</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
             </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                  <ul className="navbar-nav">

                      <li className="nav">
                         <a className="nav-filler" href="#"></a>
                      </li>

                      <li className="nav-item">
                        <a className="nav-link nav-active link_hover" onClick={()=>navigate('/Home')}>Home</a>
                      </li>

                      <li className="nav">
                         <a className="nav-filler-home_1" href="#"></a>
                      </li>

                      {/* <li className="nav-item">
                        {user ? null : (
                          <a className="nav-link link_hover" onClick={() => navigate('/EmployerDashboard')}>Employer / Admin Login</a>
                        )}
                      </li> */}

                      <li className="nav-item2">
                        
                        <a> Employer / Admin Login admin </a> 
                        </li>

                      <li className="nav">
                        <a className="nav-filler-home_2"></a>
                      </li>

                      <div className='divider'>
                      <li className="nav">
                        <a className="nav-filler-profile4" href="#"></a>
                      </li>
                      </div>

                      <div className="nav-user-name">Hello, {employeeInfo && employeeInfo.firstName}</div>

                      <div className='dropdown-container'>

                      <Dropdown>
                          <Dropdown.Toggle id="dropdown-basic-button" className='dropdown-button'>
                            User
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                              <Dropdown.Item onClick={()=>navigate('/EmployeeProfile')}>My Profile</Dropdown.Item>
                              <Dropdown.Item onClick={SignOutHandler} >Logout</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                
                      </div>

                    </ul>
          </div>
        </div>
      </nav>
  
  </div>

<div class="container" style={{marginTop:'5%'}}>
  
<div class="container">
{employeeData.length > 0 && (
  <div class="row">
    <div class="col-lg-8 d-flex">
      <div class="rectangle left d-flex flex-column">
        <div class="r-employee-name-cont">
          <p class="r-employee-name">
            <p class="r-employee-header" style={{paddingLeft:'2%', marginBottom:'2%', fontFamily:'Be Vietnam Pro', fontSize:'35px', fontWeight:'Bold', color:'#40798C', margin:'auto', borderBottom:'3px solid #70A9A1'}}>{employeeInfo && employeeInfo.firstName} {employeeInfo && employeeInfo.lastName}</p></p>
        </div>

        <div class="r-employee-summ-cont flex-grow-1">
          <p class="r-employee-header" style={{paddingLeft:'2%', marginBottom:'2%', fontFamily:'Be Vietnam Pro', fontSize:'30px', fontWeight:'Bold', color:'#40798C', margin:'auto', borderBottom:'3px solid #70A9A1'}}> Summary </p>
          {employeeData.map((employee, index) => (
            <p class="r-employee-summ-desc"style={{paddingLeft:'2%', marginBottom:'2%', fontFamily:'Be Vietnam Pro', fontSize:'20px', fontWeight:'300', color:'#40798C', margin:'auto'}} key={index}>{employee.summary}</p>
          ))}
        </div>

        <div class="r-work-exp-cont">
        <p class="r-employee-header" style={{paddingLeft:'2%', marginBottom:'2%', fontFamily:'Be Vietnam Pro', fontSize:'30px', fontWeight:'Bold', color:'#40798C', margin:'auto', borderBottom:'3px solid #70A9A1'}}> Work Experience </p>
        {employeeData.map((employee, index)  => (
          <ul class="flex-grow-1" key={index}>
            {employee.workExperience.map((workExp, workIndex) => (
              <li >
                <p class="r-work-exp-desc" style={{paddingLeft:'2%', marginBottom:'2%', fontFamily:'Be Vietnam Pro', fontSize:'20px', fontWeight:'300', color:'#40798C', margin:'auto'}} key={workIndex}>{workExp}</p>
              </li>
            ))}
          </ul>
          ))}
        </div>

        <div class="r-educ-cont">
        <p class="r-employee-header" style={{paddingLeft:'2%', marginBottom:'2%', fontFamily:'Be Vietnam Pro', fontSize:'30px', fontWeight:'Bold', color:'#40798C', margin:'auto', borderBottom:'3px solid #70A9A1'}}> Educational Background </p>
        {employeeData.map((employee, index)  => (
          <ul class="flex-grow-1" key={index}>
            {employee.education.map((edu, eduIndex) => (
              <li>
                <p class="r-educ-desc" style={{paddingLeft:'2%', marginBottom:'2%', fontFamily:'Be Vietnam Pro', fontSize:'20px', fontWeight:'300', color:'#40798C', margin:'auto'}} key={eduIndex}>{edu}</p>
              </li>
            ))}
          </ul>
          ))}
        </div>

        <div class="r-certificate-cont">
        <p class="r-employee-header" style={{paddingLeft:'2%', marginBottom:'2%', fontFamily:'Be Vietnam Pro', fontSize:'30px', fontWeight:'Bold', color:'#40798C', margin:'auto', borderBottom:'3px solid #70A9A1'}}> Certificate and Licenses Experience </p>
        {employeeData.map((employee, index)  => (
          <ul class="flex-grow-1" key={index}>
            {employee.certificates.map((certs, certIndex)  => (
              <li>
                <p class="r-educ-desc" style={{paddingLeft:'2%', marginBottom:'2%', fontFamily:'Be Vietnam Pro', fontSize:'20px', fontWeight:'300', color:'#40798C', textAlign:'left'}} key={certIndex}>{certs}</p>
              </li>
            ))}
          </ul>
          ))}
        </div>
      </div>
    </div>

    <div class="col-lg-4 d-flex">
      <div class="rectangle right d-flex flex-column">
      {employeeData.map((employee, index)  => (
          <div class="r-personal-info-cont" key={index}>
            
            <p class="r-employee-header"><p class="r-employee-header" style={{paddingLeft:'2%', marginBottom:'2%', fontFamily:'Be Vietnam Pro', fontSize:'35px', fontWeight:'Bold', color:'#FFFFFF', margin:'auto', borderBottom:'3px solid #70A9A1'}}> Personal Info </p></p>
            {employee.personalInfo.map((personal, personalIndex) => (
            <p class="r-personal-info" style={{paddingLeft:'2%', marginBottom:'2%', fontFamily:'Be Vietnam Pro', fontSize:'20px', fontWeight:'300', color:'#FFFFFF', margin:'auto'}} key={personalIndex}>{personal}</p>
            ))} 
            </div>
        ))}

        <div class="r-skills-cont flex-grow-1">
        <p class="r-employee-header" style={{paddingLeft:'2%', marginBottom:'2%', fontFamily:'Be Vietnam Pro', fontSize:'30px', fontWeight:'Bold', color:'#FFFFFF', margin:'auto', borderBottom:'3px solid #70A9A1'}}> Skills </p>
        {employeeData.map((employee, index)  => (
          <ul class="flex-grow-1"key={index}>
            {employee.skills.map((skill, skillsIndex)  => (
              <li>
                <p class="r-skills-desc" style={{paddingLeft:'2%', marginBottom:'2%', fontFamily:'Be Vietnam Pro', fontSize:'20px', fontWeight:'300', color:'#FFFFFF', textAlign:'left'}} key={skillsIndex}>{skill}</p>
              </li>
            ))}
          </ul>
          ))} 

          
        </div>
      </div>
    </div>
  </div>
  )}

  <div class="r-btn-cont">
    <button class="btn btn-primary r-btn_1" style={{border:'none', }}  
      onClick={downloadPDF} 
          disabled={!(loader===false)}>
            {loader?(
                  <span>Downloading</span>
                ):(
                  <span>Save & Downlad</span>
                )}
                </button>
  </div>
</div>

</div>



  </div>
  )
}

export default Resume