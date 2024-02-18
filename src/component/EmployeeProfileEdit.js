import React, {useState, useEffect} from 'react';
import { auth, db } from "../firebase";
import { getDoc, updateDoc, doc, } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

import './style3.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faDiagramProject, faEnvelope, faEye, faGreaterThan, faHeadset, faLaptopCode, faLessThan, faList, faLocation, faLocationDot, faMagnifyingGlass, faMoneyCheckDollar, faPaperclip, faPenRuler, faPeopleGroup, faPhone, faShop, faTowerCell, faUser, faUserTie} from '@fortawesome/free-solid-svg-icons';


function EmployeeProfileEdit() {
  const navigate=useNavigate();
  const [ employeeInfo, setEmployeeInfo ] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [number, setNumber] = useState('');
  const [course, setCourse] = useState('');
  const [province, setProvince] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [relocation, setRelocation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const user = auth.currentUser;
  
  const fetchEmployeeInfo = async () => {
    try {
      if (user) {
        const userDocRef = doc(db, 'EmployeeProfiles', user.uid);
        const docSnapshot = await getDoc(userDocRef);
  
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setEmployeeInfo(data);
          setFirstName(data.firstName || '');
          setLastName(data.lastName || '');
          setNumber(data.number || '');
          setCourse(data.course || '');
          setProvince(data.province || '');
          setStreetAddress(data.streetAddress || '');
          setCity(data.city || '');
          setPostalCode(data.postalCode || '');
          setRelocation(data.relocation || false);
  
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

  const saveData = async () => {
    try {
      const userDocRef = doc(db, 'EmployeeProfiles', user.uid);

      const updatedData = {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(number && { number }),
        ...(course && { course }),
        ...(province && { province }),
        ...(streetAddress && { streetAddress }),
        ...(city && { city }),
        ...(postalCode && { postalCode }),
        relocation,
      };
      
      await updateDoc(userDocRef, updatedData);
      console.log('Data saved successfully!');
      navigate('/Home')
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };





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


<a onClick={()=>navigate('/EmployeeProfile')}> <button className='profile-edit-back'><FontAwesomeIcon icon={faLessThan} className='less-than-btn' size='lg'/>Back</button></a>

<div className='edit-border-bottom'>


  <div className='edit-contact-info-container_1'>Contact Information
    <div class="fname-edit-container">
        <span class="edit-heading_1">First Name</span><span class='edit-heading_2'>*</span><br></br>
        <input type="text" class="edit-textbox" onChange={(e) => setFirstName(e.target.value)}/>
    </div>
    <div class="fname-edit-container">
        <span class="edit-heading_1">Last Name</span><span class='edit-heading_2'>*</span><br></br>
        <input type="text" class="edit-textbox" onChange={(e) => setLastName(e.target.value)}/>
    </div>
    <div class="fname-edit-container">
        <span class="edit-heading_1">Contact Number</span><span class='edit-heading_2'>*</span><br></br>
        <input type="text" maxlength="11" minlength="11" class="edit-textbox" onChange={(e) => setNumber(e.target.value)}/>
    </div>
    <div class="fname-edit-container">
        <span class="edit-heading_1">Course</span><span class='edit-heading_2'>*</span><br></br>
        <input type="text"  class="edit-textbox" onChange={(e) => setCourse(e.target.value)}/>
    </div>
    
  </div>


  <div className='edit-contact-info-container_2'><span class='address-heading_1'>Address Information</span> <br></br> <span class='address-heading_2'>This helps match you with nearby jobs.</span>
    <div class="fname-edit-container">
        <span class="edit-heading_1">Province</span><br></br>
        <input type="text" class="edit-textbox" onChange={(e) => setProvince(e.target.value)}/>
    </div>
    <div class="fname-edit-container">
        <span class="edit-heading_1">Street Address</span>  <span class='edit-heading_2'>*</span> <br></br> <span class='address-heading_2'>Visible only to you</span> 
        <input type="text" class="edit-textbox" onChange={(e) => setStreetAddress(e.target.value)}/>
    </div>
    <div class="fname-edit-container-redo">
        <span class="edit-heading_1">City</span><span class='edit-heading_2'>*</span><br></br>
        <input type="text" class="edit-textbox" onChange={(e) => setCity(e.target.value)}/>
    </div>

    <div class="fname-edit-container">
        <span class="edit-heading_1">Postal Code</span><span class='edit-heading_2'>*</span><br></br>
        <input type="text" class="edit-textbox" onChange={(e) => setPostalCode(e.target.value)}/>
    </div>

    <div className='edit-relocation-container'>Relocation</div>
    <div class="edit-checkbox-container_2">
          <label class="edit-check-box">Yes, I'm willing to relocate
            <input type="checkbox" checked={relocation} onChange={(e) => setRelocation(e.target.checked)}/> <span class="edit-checkmark"/></label><br></br>
            
          <button class='save-btn' onClick={saveData}>Save</button>
    </div>

    

  </div>


</div>



</div>













  )
}

export default EmployeeProfileEdit