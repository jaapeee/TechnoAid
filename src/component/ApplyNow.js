import React, {useState, useEffect } from 'react';
import { auth, db, storage } from "../firebase";
import { getDoc, doc, collection, setDoc, addDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, listAll  } from "firebase/storage";
import { useNavigate, useParams } from 'react-router-dom';

import './style3.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faAddressCard, faLessThan, faEnvelope, faEye, faGreaterThan, faLocationDot, faPhone} from '@fortawesome/free-solid-svg-icons';
import { upload } from '@testing-library/user-event/dist/upload';


function ApplyNow() {
  const navigate=useNavigate();
  const { selectedJobPostUid, employerJobPostsDocId } = useParams();
  const [ employeeInfo, setEmployeeInfo ] = useState(null);
  const user = auth.currentUser;
  const [isLoading, setIsLoading] = useState(true);
  const [resumeList, setResumeList] = useState([]);
  
  const [showLink, setShowLink] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [answers, setAnswers] = useState({
    expectedSalary: '',
    motivation: '',
    problemExample: ''
  });

    const toggleUpload = () => {
      setShowUpload(!showUpload);
      if (showLink) {
        setShowLink(false);
      }
    };


    const toggleLink = () => {
    setShowLink(!showLink);
    if (showUpload) {
      setShowUpload(false);
    }
  };


  
  const handleInputChange = (field, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Step 1: Create a reference to the JobPosts sub-collection
      const jobPostsCollectionRef = collection(db, 'EmployerJobPosts', selectedJobPostUid, 'JobPosts');
  
      // Step 2: Create a reference to the specific JobPost document
      const jobPostDocRef = doc(jobPostsCollectionRef, employerJobPostsDocId);
  
      // Step 3: Add data to the EmployerAnswers sub-collection with user UID as the document ID
      const answersCollectionRef = collection(
        db,
        'EmployerJobPosts',
        selectedJobPostUid,
        'JobPosts',
        employerJobPostsDocId,
        'EmployerAnswers'
      );
  
      // Step 4: Upload resume to Firebase Storage
      let resumeURL = ''; // Default value if no resume is selected
      const resumeDropdown = document.getElementById('resumeDropdown');
      if (resumeDropdown && resumeDropdown.value !== '') {
        resumeURL = resumeDropdown.value;
      }

       // Step 5: Fetch employee information from EmployeeProfiles
      const userDocRef = doc(db, 'EmployeeProfiles', user.uid);
      const docSnapshot = await getDoc(userDocRef);
  
      if (docSnapshot.exists()) {
        const employeeData = docSnapshot.data();
  
        // Step 6: Store data in the EmployerAnswers sub-collection with user UID as the document ID
        const answersDocRef = await setDoc(doc(answersCollectionRef, user.uid), {
          firstName: employeeData.firstName,
          lastName: employeeData.lastName,
          email: employeeData.email,
          expectedSalary: answers.expectedSalary,
          motivation: answers.motivation,
          problemExample: answers.problemExample,
          resumeURL: resumeURL,
        });
  
        console.log('Document written with ID: ', user.uid);

        // Redirect to the next page or perform other actions after storing data
        navigate('/Home');
      } else {
        console.log('Document does not exist!');
      }
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        // Replace 'resumeSubmit' with your actual storage path
        const storageRef = ref(storage, `employeeResume/${user.uid}`);
        const resumeListResult = await listAll(storageRef);
        
        const resumeURLs = await Promise.all(
          resumeListResult.items.map(async (resumeRef) => {
            const downloadURL = await getDownloadURL(resumeRef);
            return { name: resumeRef.name, downloadURL };
          })
        );

        setResumeList(resumeURLs);
      } catch (error) {
        console.error('Error fetching resumes:', error);
      }
    };

    fetchResumes();
  }, [user.uid]);

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

    console.log("selectedJobPostUid: ", selectedJobPostUid);
    console.log("employerJobPostsDocId: ", employerJobPostsDocId);
  }, [user, selectedJobPostUid, employerJobPostsDocId]);

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
                        <a className="nav-link link_hover"onClick={()=>navigate('/Home')}>Find Jobs </a>
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
  <a onClick={()=>navigate('/Home')}> <button className='applynow-edit-back'><FontAwesomeIcon icon={faLessThan} className='less-than-btn' size='lg'/>Back</button></a>
<div className="applynow-container">
  <form onSubmit={handleSubmit}>
  <p className='applynow-heading'> Answer Employer Questions </p>
    <label class="applynow-textbox">What’s your expected monthly salary? *</label>
    <input type="text" class="applynow-text" placeholder="Enter your answer" value={answers.expectedSalary} onChange={(e) => handleInputChange('expectedSalary', e.target.value)}/>

    <label class="applynow-textbox">What motivated you to apply for this position, and how does it align with your career goals? *</label>
    <textarea class="applynow-text" placeholder="Enter your answer 1-3 sentences" value={answers.motivation} onChange={(e) => handleInputChange('motivation', e.target.value)}/>

    <label class="applynow-textbox">Can you provide an example of a challenging problem you encountered in your previous role and how you approached solving it? *</label>
    <textarea class="applynow-text" placeholder="Enter your answer 3-5 sentences" value={answers.problemExample} onChange={(e) => handleInputChange('problemExample', e.target.value)}/>
  <div>
   
  </div>



<div className='resume-heading_1'>Resume</div>


<div className='resume-upload-container'>

<div className="form-check1">
        <input
          className="form-check-input"
          type="radio"
          name="exampleRadios"
          id="exampleRadios1"
          value="option1"
          onChange={toggleUpload}
        />
        <label className="form-check-label" htmlFor="exampleRadios1">
          Upload my Resume
        </label>
      </div>

      {showUpload && (
        <div className='form-upload1'>
          <input type="file" id="fileInput" className='file-style'/>
        </div>
      )}


<div className="form-check2">
        <input
          className="form-check-input"
          size="lg"
          type="radio"
          name="exampleRadios"
          id="exampleRadios2"
          value="option2"
          onChange={toggleLink}
        />
        <label className="form-check-label" htmlFor="exampleRadios2">
          Select my TechnoAid Resume
        </label>
      </div>

      {showLink && (
        <div>
          <select id="resumeDropdown" name ="Resume" className='selectresume'> 
            <option select>  </option>
            {resumeList.map((resume, index) => (
            <option key={index} value={resume.downloadURL}>  {resume.name} </option>
            ))}
            </select>
        
        </div>
      )}

</div>

<button className='a-btn_1' >Submit</button>

  </form>

</div>
  

    



</div>











  )
}

export default ApplyNow