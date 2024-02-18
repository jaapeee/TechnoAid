import React, {useState, useEffect, useRef} from 'react';
import { auth, db, storage } from "../firebase";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from 'react-router-dom';

import './style3.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faAddressCard, faEnvelope, faEye, faGreaterThan, faLocationDot, faPhone} from '@fortawesome/free-solid-svg-icons';


function EmployeeProfile() {
  const navigate=useNavigate();
  const [ employeeInfo, setEmployeeInfo ] = useState(null);
  const user = auth.currentUser;
  const [isLoading, setIsLoading] = useState(true);

  const handlePhotoUpload = async (event) => {
    try {
      const storageRef = ref(storage, `profilePictures/${user.uid}`);
      const imageFile = event.target.files[0];
  
      // Upload the image to Firebase Storage
      await uploadBytes(storageRef, imageFile);
  
      // Get the download URL of the uploaded image
      const imageUrl = await getDownloadURL(storageRef);
  
      // Update the document in the EmployeeProfiles collection with the image URL
      const userDocRef = doc(db, 'EmployeeProfiles', user.uid);
      await updateDoc(userDocRef, { profilePhoto: imageUrl });
  
      // Update the state to display the uploaded image
      setEmployeeInfo((prevData) => ({
        ...prevData,
        profilePhoto: imageUrl,
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };
  
  const fetchEmployeeInfo = async () => {
    try {
      if (user) {
        const userDocRef = doc(db, 'EmployeeProfiles', user.uid);
        const docSnapshot = await getDoc(userDocRef);
  
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
  
          // Fetch the download URL for the profile photo if it exists
          if (data.profilePhoto) {
            const profilePhotoRef = ref(storage, `profilePictures/${user.uid}`);
            const imageUrl = await getDownloadURL(profilePhotoRef);
            data.profilePhoto = imageUrl; // Update to 'data.profilePhoto' instead of 'data.profilePhotoUrl'
          }
  
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
                         <a className="nav-filler-profile" href="#"></a>
                      </li>

                      <li className="nav-item">
                        <a className="nav-link link_hover"onClick={()=>navigate('/Home')}>Find Jobs</a>
                      </li>

                      <li className="nav">
                        <a className="nav-filler-eprofile2" href="#"></a>
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

  <div className="profile-info-container">
      <div className="profile-pic" style={{ width: '200px', height: '200px', position: 'relative', overflow: 'hidden' }}>
        <label htmlFor="profile-upload" className="profile-pic-label" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
        {employeeInfo && employeeInfo.profilePhoto ? (
            <img src={employeeInfo.profilePhoto} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div className="profile-placeholder" style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' }}>
              <span className='placeholder-picture'>No Profile Picture</span>
            </div>
          )}
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handlePhotoUpload}
          />
        </label>
      </div>
      <div className="profile-info"></div>


    <div className='user-name'>{employeeInfo && employeeInfo.firstName} {employeeInfo && employeeInfo.lastName}</div>

    <div className='info-logo-divider1'>
        <FontAwesomeIcon icon={faEnvelope} className='profile-logo' size='xl'/>
    </div>
    <div className='profile-info-content'>{employeeInfo && employeeInfo.email}</div>
    
    <div className='info-logo-divider1'>
        <FontAwesomeIcon icon={faAddressCard} className='profile-logo' size='xl'/>
    </div>
    <div className='profile-info-content'>{employeeInfo && employeeInfo.sis}</div>

    <div className='info-logo-divider2'>
        <FontAwesomeIcon icon={faPhone} className='profile-logo' size='xl'/>
    </div>
    <div className='profile-info-content'>{employeeInfo && employeeInfo.number}</div>

    <div className='info-logo-divider2'>
        <FontAwesomeIcon icon={faLocationDot} className='profile-logo' size='xl'/>
    </div>
    <div className='profile-info-content'>{employeeInfo && employeeInfo.city}, {employeeInfo && employeeInfo.province}</div>

    <a button className='edit-profile-btn'onClick={()=>navigate('/EmployeeProfileEdit')}>  Edit Profile  <FontAwesomeIcon icon={faGreaterThan} className='greater-than-btn_1' size='lg'/></a>
    
    <div className='resume-heading_1'>Resume</div>

    <div className='profile-resume-container'>
      <div className='resume-placeholder' onClick={()=>navigate('/Resume')}></div>
        <a className='heading-container' onClick={()=>navigate('/Resume')}><span className='resume-heading_2'>TechnoAid Resume</span><br></br>
        <span className='resume-heading_3'>Updated on January 14, 2024</span><br></br>
        <FontAwesomeIcon icon={faEye} className='resume-logo' size='xl'/>
          <button className='resume-heading_4'>Visible to other employers</button>
        </a>

        <a onClick={()=>navigate('/EmployeeResume')}>
        <button className='resume-heading_4'>
        <FontAwesomeIcon icon={faGreaterThan} className='greater-than-btn_3' size='2xl'/>
        </button>
        </a>
    </div>
  </div>

    



</div>











  )
}

export default EmployeeProfile