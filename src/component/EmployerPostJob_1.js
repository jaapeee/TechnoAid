import React, { useState }from 'react';
import { auth, db, storage } from "../firebase";
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faMinus, faPlus} from '@fortawesome/free-solid-svg-icons';


function EmployerPostJob_1() {
    const navigate=useNavigate();
    const user = auth.currentUser;
    const [logoFile, setLogoFile] = useState(null);
    const [logoURL, setLogoURL] = useState('');
    const [employeeInfo, setEmployerInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(null);

    const [formData, setFormData] = useState({
      user: user.uid,
      jobTitle: '',
      location: '',
      employmentType: '',
      minQualifications: '',
      industry: '',
      interviewer: '',
      position: '',
      workPreference: '',
      educationalAttainment: '',
      salaryRangeFrom: '',
      salaryRangeTo: '',
      frequency: '',
      commEmail: '',
      addResume: '',
      bgCheck: '',
      hiringTime: '',
      summary: '',
      benefits: {
        thirteenthMonthBonus: false,
        hmo: false,
        dentalCare: false,
        internetAllowance: false,
        lifeInsurance: false,
        clothingAllowance: false,
        travelAllowance: false,
        governmentBenefits: false,
        paidOvertime: false,
        paidTimeOff: false,
        gymMembership: false,
        commission: false,
        emailAdd: false,
        landPhone: false,
      },
    });

    const fetchEmployerInfo = async () => {
      try {
        if (user) {
          const userDocRef = doc(db, 'EmployerProfiles', user.uid);
          const docSnapshot = await getDoc(userDocRef);
  
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
  
            // Update the setFormData to include companyName from the fetched data
            setFormData((prevData) => ({
              ...prevData,
              companyName: data.companyName,
            }));
  
            setEmployerInfo(data);
  
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
    fetchEmployerInfo();

    const handleLogoUpload = async (e) => {
      const file = e.target.files[0];
      setLogoFile(file);
  
      const storageRef = ref(storage, `companyLogos/${user.uid}/${user.uid}.${file.name.split('.').pop()}`);
      await uploadBytes(storageRef, file);
  
      const downloadURL = await getDownloadURL(storageRef);
      setLogoURL(downloadURL);
    };


    const handleInputChange = (field, value) => {
      setFormData((prevData) => ({
        ...prevData,
        [field]: value,
      }));
    };
  
    const handleCheckboxChange = (field) => {
      setFormData((prevData) => ({
        ...prevData,
        benefits: {
          ...prevData.benefits,
          [field]: !prevData.benefits[field],
        },
      }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
        // Step 1: Create a reference to the existing document
        const userDocRef = doc(db, "EmployerJobPosts", user.uid); // Assuming the existing document is in the "users" collection

        // Step 2: Set the data in the existing document (if needed)
        await setDoc(userDocRef, { /* existing document data */ }, { merge: true });

        // Step 3: Create a reference to the sub-collection
        const jobPostsCollectionRef = collection(userDocRef, "JobPosts"); // Sub-collection name is "JobPosts"

        const formDataWithLogo = {
          ...formData,
          logoURL: logoURL,
        };

        // Step 4: Add data to the sub-collection
        const newJobPostDocRef = await addDoc(jobPostsCollectionRef, formDataWithLogo);

        console.log('Document written with ID: ', newJobPostDocRef.id);

        // Redirect to the next page or perform other actions after storing data
        navigate('/EmployerDashboard');
      } catch (error) {
        console.error('Error adding document: ', error);
      }
    };

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
          <a onClick={()=>navigate('/')} className="navbar-brand">TECHNOAID</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
             </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                  <ul className="navbar-nav">

                      <li className="nav">
                         <a className="nav-filler" href="#"></a>
                      </li>
               
                      <li className="nav">
                         <a className="nav-filler-employer-post_1" href="#"></a>
                      </li>

                      <li className="nav">
                        <a className="nav-filler-employer-post_2"></a>
                      </li>


                      <div className='dashboard-logo-container' onClick={()=>navigate('/EmployerDashboard')}>
                        
                      </div>

                      <div className='bell-container'>
                        <FontAwesomeIcon icon={faEnvelope} className='envelope' size='xl'/>
                      </div>

                      <div className='divider'>
                      <li className="nav">
                        <a className="nav-filler-profile4" href="#"></a>
                      </li>
                      </div>


                      <div className='dropdown-container'>

                      <Dropdown>
                          <Dropdown.Toggle id="dropdown-basic-button" className='dropdown-button'>
                            Company
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



  <div className='postjob-textbox'></div>

  <form onSubmit={handleSubmit}>

  <div className='basic-information'> Basic Information
    <div class="basic-info-container_1">
      <label class="form-label" for="info_textbox"> Job Title* </label>
      <input type="text" id="info_textbox" class="info-textbox form-control" value={formData.jobTitle} onChange={(e) => handleInputChange('jobTitle', e.target.value)}/>

      <label class="form-label" for="info_textbox"> Location* </label>
      <input type="text" id="info_textbox" class="info-textbox form-control" value={formData.location} onChange={(e) => handleInputChange('location', e.target.value)}/>

      <label class="form-label" for="info_textbox"> Employment Type* </label>
        <select class="info-textbox form-control" value={formData.employmentType} onChange={(e) => handleInputChange('employmentType', e.target.value)}>
          <option class="hidden"  selected disabled> Employment Type </option>
          <option> Full time </option>
          <option> Part time </option>
          <option> Internship </option>
        </select>

      <label class="form-label" for="info_textbox"> Minimum Qualifications* </label>
        <select class="info-textbox form-control" value={formData.minQualifications} onChange={(e) => handleInputChange('minQualifications', e.target.value)}>
          <option class="hidden"  selected disabled> Minimum Qualifications </option>
          <option> No Experience Needed </option>
          <option> 1-3 years experience </option>
          <option> 3-5 years experience </option>
          <option> 5 years and above experience </option>
        </select>

      <label class="form-label" for="info_textbox"> Educational Attainment* </label>
      <select class="info-textbox form-control" value={formData.educationalAttainment} onChange={(e) => handleInputChange('educationalAttainment', e.target.value)}>
          <option class="hidden"  selected disabled> Educational Attainment </option>
          <option> High School Graduate </option>
          <option> Senior High School Graduate </option>
          <option> Associate's Degree </option>
          <option> Bachelor's Degree </option>
        </select>

    </div>


    <div class="basic-info-container_2">
    {/* <label class="form-label" for="info_textbox">Company Name*</label>
      <input type="text" id="info_textbox" class="info-textbox form-control" value={formData.companyName} onChange={(e) => handleInputChange('companyName', e.target.value)}/> */}

      <label class="form-label" for="info_textbox"> Industry* </label>
      <input type="text" id="info_textbox" class="info-textbox form-control" value={formData.industry} onChange={(e) => handleInputChange('industry', e.target.value)}/>

      <label class="form-label" for="info_textbox"> Position* </label>
      <input type="text" id="info_textbox" class="info-textbox form-control" value={formData.position} onChange={(e) => handleInputChange('position', e.target.value)}/>

      <label class="form-label" for="info_textbox"> Work Preference* </label>
        <select class="info-textbox form-control" value={formData.workPreference} onChange={(e) => handleInputChange('workPreference', e.target.value)}>
          <option class="hidden"  selected disabled> Work Preference </option>
          <option> On-site </option>
          <option> Work from Home </option>
          <option> Hybrid </option>
        </select>

    <label class="form-label" for="logo_upload">Upload Company Logo*</label>
      <input type="file" id="logo_upload" class="logo-upload form-control" accept="image/*" onChange={handleLogoUpload}/>
       

    </div>

  </div>

  <div className='basic-information'> Salary and Benefits

    <div class="basic-info-container_3">
      <label class="form-label" for="info_textbox"> Salary Range </label>
      <input type="text" id="info_textbox" class="info-textbox form-control" value={formData.salaryRangeFrom} onChange={(e) => handleInputChange('salaryRangeFrom', e.target.value)}/>
        <FontAwesomeIcon icon={faMinus} className='minus' size='2xl'/>
    </div>

    <div class="basic-info-container_4">
      <input type="text" id="info_textbox" class="info-textbox form-control" value={formData.salaryRangeTo} onChange={(e) => handleInputChange('salaryRangeTo', e.target.value)}/>
    </div>

    <div class="basic-info-container_5">
      <label class="form-label" for="info_textbox"> Frequency </label>
        <select class="info-textbox form-control" value={formData.frequency} onChange={(e) => handleInputChange('frequency', e.target.value)}>
          <option class="hidden"  selected disabled> Frequency </option>
          <option> Weekly </option>
          <option> Bi-weekly</option>
          <option> Monthly </option>
        </select>
    </div>

    <div class="basic-info-container_6">
      Benefits
    </div>

    <div class="basic-info-container_7">
    
      <label class="basic-info-cont">
        <input type="checkbox" checked={formData.benefits.thirteenthMonthBonus} onChange={() => handleCheckboxChange('thirteenthMonthBonus')}/> 13th Month Bonus
        <span class="basic-info-checkmark"></span>
      </label>
      <label class="basic-info-cont">
        <input type="checkbox" checked={formData.benefits.hmo} onChange={() => handleCheckboxChange('hmo')}/> HMO
        <span class="basic-info-checkmark"></span>
      </label>
      <label class="basic-info-cont">
        <input type="checkbox" checked={formData.benefits.dentalCare} onChange={() => handleCheckboxChange('dentalCare')}/> Dental Care
        <span class="basic-info-checkmark"></span>
      </label>
    
    </div>

    <div class="basic-info-container_8">
      
      <label class="basic-info-cont">
        <input type="checkbox" checked={formData.benefits.internetAllowance} onChange={() => handleCheckboxChange('internetAllowance')}/> Internet Allowance
        <span class="basic-info-checkmark"></span>
      </label>
      <label class="basic-info-cont">
        <input type="checkbox" checked={formData.benefits.lifeInsurance} onChange={() => handleCheckboxChange('lifeInsurance')}/> Life Insurance
        <span class="basic-info-checkmark"></span>
      </label>
      <label class="basic-info-cont">
        <input type="checkbox" checked={formData.benefits.clothingAllowance} onChange={() => handleCheckboxChange('clothingAllowance')}/> Clothing Allowance
        <span class="basic-info-checkmark"></span>
      </label>
    
    </div>

    <div class="basic-info-container_9">
   
      <label class="basic-info-cont">
       <input type="checkbox" checked={formData.benefits.travelAllowance} onChange={() => handleCheckboxChange('travelAllowance')}/> Travel Allowance
        <span class="basic-info-checkmark"></span>
      </label>
      <label class="basic-info-cont">
        <input type="checkbox" checked={formData.benefits.governmentBenefits} onChange={() => handleCheckboxChange('governmentBenefits')}/> Government Benefits
        <span class="basic-info-checkmark"></span>
      </label>
      <label class="basic-info-cont">
        <input type="checkbox" checked={formData.benefits.paidOvertime} onChange={() => handleCheckboxChange('paidOvertime')}/> Paid Overtime
        <span class="basic-info-checkmark"></span>
      </label>
   
   
    </div>

    <div class="basic-info-container_10">
    
      <label class="basic-info-cont">
        <input type="checkbox" checked={formData.benefits.paidTimeOff} onChange={() => handleCheckboxChange('paidTimeOff')}/> Paid Time Off
        <span class="basic-info-checkmark"></span>
      </label>
      <label class="basic-info-cont">
        <input type="checkbox" checked={formData.benefits.gymMembership} onChange={() => handleCheckboxChange('gymMembership')}/> Gym Membership
        <span class="basic-info-checkmark"></span>
      </label>
      <label class="basic-info-cont">
        <input type="checkbox" checked={formData.benefits.commission} onChange={() => handleCheckboxChange('commission')}/> Commission
        <span class="basic-info-checkmark"></span>
      </label>

    </div>
    
  

  </div>

  <div className='basic-information_2'> Job Description <br></br> <div className='postjob-p_2'> Communication Preferences </div>
  
  <div className='job-description-container'>
    <label class="form-label" for="info_textbox"> Send daily updates to* </label>
    <input type="text" id="info_textbox" class="job-textbox form-control" value={formData.commEmail} onChange={(e) => handleInputChange('commEmail', e.target.value)}/>
  
    <div className="job-description-container"> <FontAwesomeIcon icon={faPlus} className='add' size='lg'></FontAwesomeIcon> Add Email </div>
    
    <div className="job-description-checkbox-container"> Let potential candidates contact you <br></br><br></br>
    <label class="basic-info-cont">
      <input type="checkbox"checked={formData.benefits.emailAdd} onChange={() => handleCheckboxChange('emailAdd')}/> By email to the address provided
      <span class="basic-info-checkmark"></span>
    </label>
    <label class="basic-info-cont">
      <input type="checkbox" checked={formData.benefits.landPhone} onChange={() => handleCheckboxChange('landPhone')}/> By Landline or Phone 
      <span class="basic-info-checkmark"></span>
    </label>

    </div>


  </div>




  </div>
  
  

  <div className='basic-information_3'> 
    <div className='postjob-p_3'> Application Preference </div>
      <div className='job-description-container'>
        <label class="form-label" for="info_textbox"> Ask potential candidates for a resume? </label>
          <select class="info-textbox form-control" value={formData.addResume} onChange={(e) => handleInputChange('addResume', e.target.value)}>
            <option class="hidden"  selected disabled> Give the option to include a resume </option>
            <option> Yes </option>
            <option> No </option>
          </select>



        <div className='job-description-container'>
        <label class="form-label" for="info_textbox"> Do you require a background check for this job? </label>
          <select class="info-textbox form-control"value={formData.bgCheck} onChange={(e) => handleInputChange('bgCheck', e.target.value)}>
            <option class="hidden"  selected disabled> Give the option to include a resume </option>
            <option> Yes </option>
            <option> No </option>
          </select>
      </div>
        
      </div>
    
    </div>

    <div className='basic-information_4'> 
      <div className='postjob-p_3'> Hire Settings </div>
        <div className='job-description-container'>

          <label class="form-label" for="info_textbox"> Name of Interviewer/Company Representative* </label>
            <input type="text" id="info_textbox" class="job-textbox form-control" value={formData.interviewer} onChange={(e) => handleInputChange('interviewer', e.target.value)}/>

          <label class="form-label" for="info_textbox"> Hiring on Process by how many days/weeks ? </label>
            <select class="info-textbox form-control" value={formData.hiringTime} onChange={(e) => handleInputChange('hiringTime', e.target.value)}>
              <option class="hidden"  selected disabled> Give the option to include a specified period </option>
              <option> 1-2 days </option>
              <option> 1-7 days </option>
              <option> 1-2 weeks </option>
              <option> 2-4 weeks </option>
            </select>
      </div>

    </div>

    
    <div className='basic-information_5'> 
      <div className='postjob-p_3'> Job Summary </div>
        <div className='job-description-container'>

          <label for="job-description" className='description-label'>Please enter a brief description and what to expect about this job posting:</label>

            <textarea id="" class="desc" rows="12" cols="91" value={formData.summary} onChange={(e) => handleInputChange('summary', e.target.value)}>
              Please start typing here..
            </textarea>

      </div>

    </div>





  <button class='continue-btn'  onClick={()=>navigate('/')}> Post </button>
  </form>


</div>


  )
}

export default EmployerPostJob_1