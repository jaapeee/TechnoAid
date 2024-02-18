import React, {useState, useEffect} from 'react';
import { auth, db } from "../firebase";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

import './style3.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faAddressCard, faEnvelope, faGreaterThan, faLessThan, faLocationDot, faPhone, faPlus} from '@fortawesome/free-solid-svg-icons';


function EmployeeResume() {
    const navigate=useNavigate();
    const [ employeeInfo, setEmployeeInfo ] = useState(null);
    const user = auth.currentUser;
    const [isLoading, setIsLoading] = useState(true);
    const [textBox, setTextBox] = useState([]);


    const [summaryTextBox, setSummaryTextBox] = useState(['']);
    const [personalInfoTextBox, setPersonalInfoTextBox] = useState(['']);
    const [workExperienceTextBox, setWorkExperienceTextBox] = useState(['']);
    const [educationTextBox, setEducationTextBox] = useState(['']);
    const [skillsTextBox, setSkillsTextBox] = useState(['']);
    const [certificatesTextBox, setCertificatesTextBox] = useState(['']);

    const handleAdd = (setState) => {
        setState(prevState => [...prevState, '']);
    };

    const saveDataResume = async () => {
      try {
        if (user) {
          const userDocRef = doc(db, 'EmployeeResume', user.uid);
          const dataToUpdate = {
            summary: summaryTextBox,
            personalInfo: personalInfoTextBox,
            workExperience: workExperienceTextBox,
            education: educationTextBox,
            skills: skillsTextBox,
            certificates: certificatesTextBox,
          };
  
          await setDoc(userDocRef, dataToUpdate, { merge: true });
          navigate('/Home')
        }
      } catch (error) {
        console.error('Error saving data to Firestore:', error);
      }
    };







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
      } else {
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

  //   const handleAdd = () => {
  //     setTextBox([...textBox, '']);

  // }


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
                         <a className="nav-filler-profile" href="#"></a>
                      </li>

                      <li className="nav-item">
                        <a className="nav-link link_hover"onClick={()=>navigate('/Home')}>Find Jobs</a>
                      </li>

                      <li className="nav">
                        <a className="nav-filler-profile2" href="#"></a>
                      </li>
               
                      <li className="nav">
                        <a className="nav-filler-profile3" href="#"></a>
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
                              <Dropdown.Item onClick={SignOutHandler}>Logout</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                
                      </div>


                    </ul>
          </div>
        </div>
      </nav>
  
  </div>


<a onClick={()=>navigate('/EmployeeProfile')}> <button className='profile-edit-back'><FontAwesomeIcon icon={faLessThan} className='less-than-btn' size='lg'/>Back</button></a>



<div className='resume-border'>
    <div className='resume-name'>{employeeInfo && employeeInfo.firstName} {employeeInfo && employeeInfo.lastName}<button className='edit-profile-btn_2'onClick={()=>navigate('/EmployeeProfileEdit')}> Edit Profile  <FontAwesomeIcon icon={faGreaterThan} className='greater-than-btn_4' size='lg'/></button>
    </div> 

    <div className='resume-info-divider1'>
        <FontAwesomeIcon icon={faEnvelope} className='profile-logo' size='xl'/>
    </div>
    <div className='profile-info-content'>{employeeInfo && employeeInfo.email}</div>

    <div className='resume-info-divider2'>
        <FontAwesomeIcon icon={faAddressCard} className='profile-logo' size='xl'/>
    </div>
    <div className='profile-info-content'>{employeeInfo && employeeInfo.sis}</div>

    <div className='resume-info-divider2'>
        <FontAwesomeIcon icon={faPhone} className='profile-logo' size='xl'/>
    </div>
    <div className='profile-info-content'>{employeeInfo && employeeInfo.number}</div>

    <div className='info-logo-divider2'>
        <FontAwesomeIcon icon={faLocationDot} className='profile-logo' size='xl'/>
    </div>  
    <div className='profile-info-content'>{employeeInfo && employeeInfo.city}, {employeeInfo && employeeInfo.province} </div>


    <div className="resume-info-container">Summary<FontAwesomeIcon icon={faPlus} className='plus' size='xs' onClick={() => handleAdd(setSummaryTextBox)} /></div>
            {summaryTextBox.map((text, index) => (
                <textarea key={index} type="text" className="resume-info-textarea" placeholder='Your summary will appear here'
                    onChange={(e) => {
                        const newTextBox = [...summaryTextBox];
                        newTextBox[index] = e.target.value;
                        setSummaryTextBox(newTextBox);
                    }} />
            ))}

            <div className="resume-info-container-nopadd">Personal Information<FontAwesomeIcon icon={faPlus} className='plus' size='xs' onClick={() => handleAdd(setPersonalInfoTextBox)} /></div>
            {personalInfoTextBox.map((text, index) => (
                <input key={index} type="text" className="resume-info-textbox" placeholder='Your personal information will appear here'
                    onChange={(e) => {
                        const newTextBox = [...personalInfoTextBox];
                        newTextBox[index] = e.target.value;
                        setPersonalInfoTextBox(newTextBox);
                    }} />
            ))}

            <div className="resume-info-container-nopadd">Work Experience<FontAwesomeIcon icon={faPlus} className='plus' size='xs' onClick={() => handleAdd(setWorkExperienceTextBox)} /></div>
            {workExperienceTextBox.map((text, index) => (
                <input key={index} type="text" className="resume-info-textbox" placeholder='Your work experience will appear here'
                    onChange={(e) => {
                        const newTextBox = [...workExperienceTextBox];
                        newTextBox[index] = e.target.value;
                        setWorkExperienceTextBox(newTextBox);
                    }} />
            ))}

            <div className="resume-info-container-nopadd">Education<FontAwesomeIcon icon={faPlus} className='plus' size='xs' onClick={() => handleAdd(setEducationTextBox)} /></div>
            {educationTextBox.map((text, index) => (
                <input key={index} type="text" className="resume-info-textbox" placeholder='Your education will appear here'
                    onChange={(e) => {
                        const newTextBox = [...educationTextBox];
                        newTextBox[index] = e.target.value;
                        setEducationTextBox(newTextBox);
                    }} />
            ))}

            <div className="resume-info-container-nopadd">Skills<FontAwesomeIcon icon={faPlus} className='plus' size='xs' onClick={() => handleAdd(setSkillsTextBox)} /></div>
            {skillsTextBox.map((text, index) => (
                <input key={index} type="text" className="resume-info-textbox" placeholder='Your skills will appear here'
                    onChange={(e) => {
                        const newTextBox = [...skillsTextBox];
                        newTextBox[index] = e.target.value;
                        setSkillsTextBox(newTextBox);
                    }} />
            ))}

            <div className="resume-info-container-nopadd">Certificate and Licenses <FontAwesomeIcon icon={faPlus} className='plus' size='xs' onClick={() => handleAdd(setCertificatesTextBox)} /></div>
            {certificatesTextBox.map((text, index) => (
                <input key={index} type="text" className="resume-info-textbox" placeholder='Your achievements will appear here'
                    onChange={(e) => {
                        const newTextBox = [...certificatesTextBox];
                        newTextBox[index] = e.target.value;
                        setCertificatesTextBox(newTextBox);
                    }} />
            ))}


    
    <button className='save-btn_2'onClick={saveDataResume}>Save</button>
  </div>

  



  </div>







  )
}

export default EmployeeResume