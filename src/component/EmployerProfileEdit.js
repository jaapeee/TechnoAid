import React, {useState, useEffect} from 'react';
import { auth, db } from "../firebase";
import { getDoc, updateDoc, doc, } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

import './style3.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faDiagramProject, faEnvelope, faEye, faGreaterThan, faHeadset, faLaptopCode, faLessThan, faList, faLocation, faLocationDot, faMagnifyingGlass, faMoneyCheckDollar, faPaperclip, faPenRuler, faPeopleGroup, faPhone, faShop, faTowerCell, faUser, faUserTie} from '@fortawesome/free-solid-svg-icons';


function EmployerProfileEdit() {
    const navigate=useNavigate();
    const [ employerInfo, setEmployerInfo ] = useState(null);
    const [company, setCompany] = useState('');
    const [representative, setRepresentative] = useState('');
    const [number, setNumber] = useState('');
    const [province, setProvince] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const user = auth.currentUser;
    
    const fetchEmployerInfo = async () => {
      try {
        if (user) {
          const userDocRef = doc(db, 'EmployeeProfiles', user.uid);
          const docSnapshot = await getDoc(userDocRef);
    
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            setEmployerInfo(data);
            setCompany(data.company || '');
            setRepresentative(data.representative || '');
            setNumber(data.number || '');
            setProvince(data.province || '');
            setStreetAddress(data.streetAddress || '');
            setCity(data.city || '');
            setPostalCode(data.postalCode || '');
    
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
        setEmployerInfo(JSON.parse(storedUser));
        setIsLoading(false);
      } else {
        fetchEmployerInfo();
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
      const userDocRef = doc(db, 'EmployerProfiles', user.uid);
     
      const updatedData = {
        ...(company && { company }),
        ...(representative && { representative }),
        ...(number && { number }),
        ...(number && { number }),
        ...(streetAddress && { streetAddress }),
        ...(city && { city }),
        ...(postalCode && { postalCode }),
      };

      await updateDoc(userDocRef, updatedData);
      console.log('Data saved successfully!');
      navigate('/EmployerDashboard')
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
          <a onClick={()=>navigate('/')} className="navbar-brand">TECHNOAID</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
             </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                  <ul className="navbar-nav">

                      <li className="nav">
                         <a className="nav-filler-profile" href="#"></a>
                      </li>

                      <li className="nav-item">
                        <a className="nav-link link_hover"onClick={()=>navigate('/EmployerDashboard')}>Home</a>
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
                      <div className="nav-user-name">Hello, {employerInfo && employerInfo.firstName}</div>

                      <div className='dropdown-container'>

                      <Dropdown>
                        <Dropdown.Toggle id="dropdown-basic-button" className='dropdown-button'>
                          User
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={()=>navigate('/EmployerProfile')}>Company</Dropdown.Item>
                            <Dropdown.Item onClick={SignOutHandler}>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>

                      </div>
                    </ul>
          </div>
        </div>
      </nav>
  
  </div>


<a onClick={()=>navigate('/EmployerProfile')}> <button className='profile-edit-back'><FontAwesomeIcon icon={faLessThan} className='less-than-btn' size='lg'/>Back</button></a>

<div className='edit-border-bottom'>


  <div className='edit-contact-info-container_1'>Company Contact Information
    <div class="fname-edit-container">
        <span class="edit-heading_1">Company</span><span class='edit-heading_2'>*</span><br></br>
        <input type="text" class="edit-textbox" onChange={(e) => setCompany(e.target.value)}/>
    </div>
    <div class="fname-edit-container">
        <span class="edit-heading_1">Company representative name</span><span class='edit-heading_2'>*</span><br></br>
        <input type="text" class="edit-textbox" onChange={(e) => setRepresentative(e.target.value)}/>
    </div>
    <div class="fname-edit-container">
        <span class="edit-heading_1">Telephone/Company Number</span><span class='edit-heading_2'>*</span><br></br>
        <input type="text" maxlength="11" minlength="11" class="edit-textbox" onChange={(e) => setNumber(e.target.value)}/>
    </div>

    {/* <div class="edit-checkbox-container_1">
          <label class="edit-check-box">Show company number on TechnoAid
            <input type="checkbox"/> <span class="edit-checkmark" /></label>
    </div>

    <div class="edit-checkbox-description"> 
    By submitting the form with this box checked, you confirm that you are the primary user and subscriber to the phone number provided, and you agree to receive calls and tex messages from employees who use TechnoAid and the phone number you provided above.
    </div> */}

  </div>


  <div className='edit-contact-info-container_2'><span class='address-heading_1'>Company Site Information</span> <br></br> <span class='address-heading_2'>This helps match your company with nearby employees.</span>
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

    <div class="edit-checkbox-container_2">
      
            
          <button class='save-btn' onClick={saveData}>Save</button>
    </div>

    

  </div>


</div>



</div>













  )
}

export default EmployerProfileEdit