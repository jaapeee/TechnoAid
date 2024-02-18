import React, {useState, useEffect, useRef} from 'react';
import { auth, db } from "../firebase";
import { getDoc, doc, getDocs, collection, query, where, getFirestore, onSnapshot, setDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import styles from './style/Admindashboard.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableList, faTrash, faCircleExclamation, faXmark, faUser, faU } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';

function Admindashboard() {
    const navigate=useNavigate();
    const user = auth.currentUser;
    const [isLoading, setIsLoading] = useState(true);
    const componentPDFemployee = useRef();
    const componentPDFemployer = useRef();
    const componentPDFjoblist= useRef();
    const [activeTab, setActiveTab] = useState(1);
    const [employeeModal, setEmployeeModal] = useState(false);
    const [employerModal, setEmployerModal] = useState(false);
    const [applicantsModal, setApplicantsModal] = useState(false);
    const [hiredModal, setHiredModal] = useState(false);
    const [employees,setEmployees] = useState([]);
    const [employers,setEmployers] = useState([]);
    const [jobPosts,setJobPosts] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedEmployer, setSelectedEmployer] = useState(null);
    const [editEmployeeModal, setEditEmployeeModal] = useState(false);
    const [editEmployerModal, setEditEmployerModal] = useState(false);
    const [editedEmployee, setEditedEmployee] = useState(false);
    const [editedEmployer, setEditedEmployer] = useState(false);
    const [checkboxState, setCheckboxState] = useState({});




    const handleTab = (tabNumber) => {
        setActiveTab(tabNumber);
    };

    const toggleEmployeeModal = () => {
        setEmployeeModal(!employeeModal);
    }

    const toggleEmployerModal = () => {
        setEmployerModal(!employerModal);
    }

    const toggleEditEmployeeModal = () => {
        setEditEmployeeModal(!editEmployeeModal);
        setEmployeeModal(false);
    }

    const toggleEditEmployerModal = () => {
        setEditEmployerModal(!editEmployerModal);
        setEmployerModal(false);
    }


    const toggleApplicantsModal = () => {
        setApplicantsModal(!applicantsModal);
    }

    const toggleHiredModal = () => {
        setHiredModal(!hiredModal);
    }

    const handleViewEmployeeDetails = (employee) => {
        setSelectedEmployee(employee);
        setEmployeeModal(true);
    }

    const handleViewEmployerDetails = (employer) => {
        setSelectedEmployer(employer);
        setEmployerModal(true);
    }

    const generatePDFemployee = useReactToPrint({
        content: () => componentPDFemployee.current,
        documentTitle: "Employee User",
        onAfterPrint: () => ("Data save successfully")
    });

    const generatePDFemployer = useReactToPrint({
        content: () => componentPDFemployer.current,
        documentTitle: "Employee User",
        onAfterPrint: () => ("Data save successfully")
    });


    const generatePDFjoblist = useReactToPrint({
        content: () => componentPDFjoblist.current,
        documentTitle: "Employee User",
        onAfterPrint: () => ("Data save successfully")
    });


    //////READ DATA//////READ DATA//////READ DATA//////READ DATA//////READ DATA//////READ DATA//////READ DATA//////READ DATA//////READ DATA//////READ DATA//////
    //employee
        const fetchEmployee = async () => {
            const querySnapshot = await getDocs(collection(db, 'EmployeeProfiles'));
            const employeeData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setEmployees(employeeData);
        };

    //employer
        const fetchEmployer = async () => {
            const querySnapshot = await getDocs(collection(db, 'EmployerProfiles'));
            const employerData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setEmployers(employerData);
        };
    
    //Job Post



    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const querySnapshot = await getDocs(collection(db, 'EmployerJobPosts'));
    //             const jobpostData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    //             const jobPostsPromises = jobpostData.map(async jobpost => {
    //                 const jobPostSnapshot = await getDocs(collection(db, `EmployerJobPosts/${jobpost.id}/JobPosts`));
    //                 const jobPostsCount = jobPostSnapshot.size;
    //                 return { ...jobpost, jobPostsCount };
    //             });
    
    //             const resolvedJobPosts = await Promise.all(jobPostsPromises);
    //             setJobPosts(resolvedJobPosts);
    //         } catch (error) {
    //             console.error('Error fetching job posts:', error);
    //         }
    //     };
        
    //     fetchData();
    // }, [user]);



            // const fetchJobpost = async (employerjobpostId) => {
            //     try {   
            //         const querySnapshot = await getDocs(collection(db, `EmployerJobPosts/${employerjobpostId}/JobPosts`));
            //         const jobPostData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    
            //         setJobPosts(jobPostData);
            //     } catch (error) {
            //         console.error('Error fetching job posts:', error);
            //     }
            // };



        // useEffect(() => {
        //     const fetchData = async () => {
        //         try {
        //             const querySnapshot = await getDocs(collection(db, 'EmployerJobPosts'));
        //             const jobpostData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
        //             const jobPostsPromises = jobpostData.map(async jobpost => {
        //                 const jobPostSnapshot = await getDocs(collection(db, `EmployerJobPosts/${jobpost.id}/JobPosts/{$}`));
        //                 const jobPostsCount = jobPostSnapshot.size;
        //                 return { ...jobpost, jobPostsCount };
        //             });
    
        //             const resolvedJobPosts = await Promise.all(jobPostsPromises);
        //             setJobPosts(resolvedJobPosts);
        //         } catch (error) {
        //             console.error('Error fetching job posts:', error);
        //         }
        //     };
    
        //     fetchData();
        // }, []);

        useEffect(() => { 
            const fetchJobpost = async () => {
                const db = getFirestore();
                      const employerJobPostsQuery = query(collection(db, 'EmployerJobPosts'));
                      const employerJobPostsSnapshot = await getDocs(employerJobPostsQuery);
                      const employerJobPostsData = employerJobPostsSnapshot.docs.map((doc) => ({
                        ...doc.data(),
                        id: doc.id,
                      }));
                
                      let updatedJobPosts = [];
                
                      for (const employerJobPost of employerJobPostsData) {
                        const jobPostsQuery = query(collection(db, `EmployerJobPosts/${employerJobPost.id}/JobPosts`));
                        const jobPostsSnapshot = await getDocs(jobPostsQuery);
                        const jobPostsData = jobPostsSnapshot.docs.map((doc) => ({
                          ...doc.data(),
                          id: doc.id,
                        }));
                
                        updatedJobPosts = [...updatedJobPosts, ...jobPostsData];
                      }
                      setJobPosts(updatedJobPosts);
                    };
    
                    fetchJobpost();
                }, [user]);
    
    
    
        




    useEffect(() => {
        fetchEmployee();
        fetchEmployer();
    }, []);




    //////DELETE DATA//////DELETE DATA//////DELETE DATA//////DELETE DATA//////DELETE DATA//////DELETE DATA//////DELETE DATA//////DELETE DATA//////DELETE DATA//////DELETE DATA//////


    //employee
        const deleteEmployee = async (employeeId) => {
            try {
                await deleteDoc(doc(db, 'EmployeeProfiles', employeeId));
                fetchEmployee();
            } catch (error) {
                console.error ("Error deleting document: ", error);
                throw error;
            }
        }

        const handleDeleteEmployee = async (employeeId) => {
            try { 
                await deleteEmployee(employeeId);
                console.log("Employee deleted successfully");
            } catch (error) {
                console.log("Error deleting applicant: ", error);
            }
        };

    //employerr

        const handleDeleteEmployer = async (employerId) => {
            try { 
                await deleteDoc(doc(db, 'EmployerProfiles', employerId));
                console.log("Employer deleted successfully");
                fetchEmployer();
            } catch (error) {
                console.log("Error deleting applicant: ", error);
            }
        };






     //////EDIT DATA//////EDIT DATA//////EDIT DATA//////EDIT DATA//////EDIT DATA//////EDIT DATA//////EDIT DATA//////EDIT DATA//////EDIT DATA//////EDIT DATA//////

    //employee
     const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditedEmployee(prevState => ({
            ...prevState,
            [name]: value
        }));
     }

     const handleSaveEmployee = async () => {
        try{
            await updateEmployee(selectedEmployee.id, editedEmployee);
            console.log("Employee details updated successfully!");
            toggleEditEmployeeModal();
        } catch (error) {
            console.error("Error updating employee details: ", error);
        }
     };

     const updateEmployee = async (employeeId, updateDetails) => {
        try{
            const employeeRef = doc(db, 'EmployeeProfiles', employeeId);
            await updateDoc(employeeRef, updateDetails);
            fetchEmployee();
        } catch (error){
            console.error("Error updating employee in Firestore: ". error);
            throw error;
        }
     };


     //employer
     const handleEditEmployerChange = (e) => {
        const { name, value } = e.target;
        setEditedEmployer(prevState => ({
            ...prevState,
            [name]: value
        }));
     }

     const handleSaveEmployer = async () => {
        try{
            await updateEmployer(selectedEmployer.id, editedEmployer);
            console.log("Eployer details updated successfully!");
            toggleEditEmployerModal();
        } catch (error) {
            console.error("Error updating employer details: ", error);
        }
     };

     const updateEmployer = async (employerId, updateDetails) => {
        try{
            const employerRef = doc(db, 'EmployerProfiles', employerId);
            await updateDoc(employerRef, updateDetails);
            fetchEmployer();
        } catch (error){
            console.error("Error updating employer in Firestore: ". error);
            throw error;
        }
     };

     useEffect(() => {
        // Fetch employers from the database and set initial checkbox state
        const fetchData = async () => {
          // Fetch your employers from the database here
          // For each employer, set the initial checkbox state
          const initialState = {};
          employers.forEach((employer) => {
            initialState[employer.id] = employer.isRestricted;
          });
          setCheckboxState(initialState);
        };
    
        fetchData();
      }, [employers]);

     //checkbox
    const handleCheckboxChange = async (employerId) => {
    try {
      // Update local state first to provide immediate feedback to the user
      setCheckboxState((prevState) => ({
        ...prevState,
        [employerId]: !prevState[employerId],
      }));

      // Update the database
      const employerRef = doc(db, 'EmployerProfiles', employerId);
      await updateDoc(employerRef, { isRestricted: !checkboxState[employerId] });
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

     const generateExcelFile = () => {
        // Convert applicants data to array of arrays
        const data = employees.map(employee =>
                 [  employee.sis,
                    employee.employeeUID,
                    employee.firstName,
                    employee.lastName,
                    employee.email,
                    employee.number,
                    employee.bdate,
                    employee.course,
                    employee.streetAddress,
                    employee.city,
                    employee.province,
                    employee.createdAt, 
                    employee.lastSignedIn
                   ]);
    
        // Add header row
        data.unshift(['SIS', 'Non-PUPian UID', 'First Name', 'Last Name', 'Email', 'Contact', 'Birthday' , 'Course',  'Street Address', 'City', 'Province' ,  'Date Created', 'Last Signed In']);
    
        // Create a workbook
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(data);

        ws['!rows'] = [{ hpx: 30, // Set height of header row
                 s: { bold: true, // Make header row bold
                      fill: { patternType: 'solid', fgColor: { rgb: 'FFC0C0C0' } } // Set background color
                    }
              }];
    
        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Employees');
    
        // Save the workbook as an Excel file
        XLSX.writeFile(wb, 'Employee.xlsx');
      };


      const generateExcelFileEmployer = () => {
        // Convert applicants data to array of arrays
        const data = employers.map(employer =>
                 [  employer.employerUID,
                    employer.firstName,
                    employer.lastName,
                    employer.email,
                    employer.company,
                    employer.number,
                    employer.streetAddress,
                    employer.city,
                    employer.province,
                    employer.createdAt, 
                    employer.lastSignedIn
                   ]);
    
        // Add header row
        data.unshift(['UID', 'First Name', 'Last Name', 'Email', 'Company Name', 'Contact' , 'Street Address', 'City', 'Province' ,  'Date Created', 'Last Signed In']);
    
        // Create a workbook
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(data);

        ws['!rows'] = [{ hpx: 30, // Set height of header row
                 s: { bold: true, // Make header row bold
                      fill: { patternType: 'solid', fgColor: { rgb: 'FFC0C0C0' } } // Set background color
                    }
              }];
    
        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Employers');
    
        // Save the workbook as an Excel file
        XLSX.writeFile(wb, 'Employer.xlsx');
      };


      const generateExcelFileJobList = () => {
        // Convert applicants data to array of arrays
        const data = jobPosts.map(jobpost =>
                 [  jobpost.jobTitle,
                    jobpost.companyName,
                    jobpost.commEmail,
                    jobpost.position,
                    jobpost.location,
                   ]);
    
        // Add header row
        data.unshift(['Job Title', 'Company Name', 'Company Email', 'Position', 'Location']);
    
        // Create a workbook
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(data);

        ws['!rows'] = [{ hpx: 30, // Set height of header row
                 s: { bold: true, // Make header row bold
                      fill: { patternType: 'solid', fgColor: { rgb: 'FFC0C0C0' } } // Set background color
                    }
              }];
    
        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(wb, ws, 'JobPosts');
    
        // Save the workbook as an Excel file
        XLSX.writeFile(wb, 'JobLists.xlsx');
      };





  return (
    <div>
        <header className={styles.header}>
            <div className={styles.line}></div>
                <h1 className={styles.title} onClick={() => navigate('/')}> TECHNOAID </h1>
            <div className={styles.navigations}>
                <p onClick={() =>handleTab(1)} className={activeTab === 1 ? styles.textActive : styles.text}> Employee List </p>
                <p onClick={() =>handleTab(2)} className={activeTab === 2 ? styles.textActive : styles.text}> Employer List </p>
                <p onClick={() =>handleTab(3)} className={activeTab === 3 ? styles.textActive : styles.text}> Job Post List </p>
            </div>
        </header>

        {activeTab === 1 && ( 
            <div className={styles.container}>
                <div className={styles.section}>
                    <div className={styles.box}>
                    <div ref={componentPDFemployee}>
                        <table className={styles.table}>
                            <thead className={styles.thead}>
                                <tr className={styles.row1}>
                                    <th className={styles.column1}> Name </th>
                                    <th className={styles.column2}> Created Date </th>
                                    <th className={styles.column3}> Last Signed In Date </th>
                                    <th className={styles.column4} colSpan="2"> Actions </th>
                                </tr>
                            </thead>
                            <tbody className={styles.tbody}>
                                {employees.map((employee) => (
                                <tr key={employee.id} className={styles.row2}>
                                    <td className={styles.column5}> <FontAwesomeIcon icon={faUser} className={styles.icon} />{`${employee.firstName} ${employee.lastName}`}</td>
                                    <td className={styles.column6}> {employee.createdAt} </td>
                                    <td className={styles.column7}> {employee.lastSignedIn} </td>
                                    <td className={styles.column8} onClick={() => handleViewEmployeeDetails(employee)}> <FontAwesomeIcon icon={faTableList} className={styles.icon} /> View Details </td>
                                    <td className={styles.column9} onClick={() => handleDeleteEmployee(employee.id, employee.uid)}> <FontAwesomeIcon icon={faTrash} className={styles.icon} /> Delete </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    </div>
                    <div className={styles.btnctn}>
                        <button className={styles.button} onClick={() => { generateExcelFile(); generatePDFemployee(); }}> Generate Report </button>
                    </div>
                </div>
                </div>
        )}


        {activeTab === 2 && ( 
            <div className={styles.container}>
                <div className={styles.section}>
                    <div className={styles.box}>
                    <div ref={componentPDFemployer}>
                        <table className={styles.table}>
                            <thead className={styles.thead}>
                                <tr className={styles.row1}>
                                    <th className={styles.column1_1}> Company Name </th>
                                    <th className={styles.column2_1}> Created Date </th>
                                    <th className={styles.column3_1}> Last Signed In Date </th>
                                    <th className={styles.column4_1} colSpan="3"> Actions </th>
                                </tr>
                            </thead>
                            <tbody className={styles.tbody}>
                                {/* Sample data lang. isang tr lang need pag mag fefetch ng data galing database */}
                                {employers.map((employer) => (
                                <tr key={employer.id} className={styles.row2}>
                                    <td className={styles.column5_1}> <FontAwesomeIcon icon={faUser} className={styles.icon} /> { employer.companyName}</td>
                                    <td className={styles.column6_1}>  {employer.createdAt} </td>
                                    <td className={styles.column7_1}> {employer.lastSignedIn}</td>
                                    <td className={styles.column8_1} onClick={() => handleViewEmployerDetails(employer)}> <FontAwesomeIcon icon={faTableList} className={styles.icon} /> View Details </td>
                                    <td className={styles.column9_1} onClick={() => handleDeleteEmployer(employer.id, employer.uid)}> <FontAwesomeIcon icon={faTrash} className={styles.icon} /> Delete </td>
                                    <td className={styles.column10_1}> 
                                            <input type="checkbox" 
                                            checked={checkboxState[employer.id]}
                                                    onChange={e => handleCheckboxChange(employer.id, e.target.checked)}/>  
                                        <FontAwesomeIcon icon={faCircleExclamation} className={styles.icon} />Restrictions </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    </div>
                        <div className={styles.btnctn}>
                            <button className={styles.button} onClick={() => { generateExcelFileEmployer(); generatePDFemployer(); }}> Generate Report </button>
                        </div>
                    </div>
            </div>
        )}

        {activeTab === 3 && ( 
            <div className={styles.container}>
                <div className={styles.section}>
                    <div className={styles.box}>
                    <div ref={componentPDFjoblist}>
                        <table className={styles.table}>
                            <thead className={styles.thead}>
                                <tr className={styles.row1}>
                                    <th className={styles.column1_2}> Job Title </th>
                                    <th className={styles.column2_2}> Company </th>
                                    <th className={styles.column3_2}> Position </th>
                                </tr>
                            </thead>
                            <tbody className={styles.tbody}>
                                {/* Sample data lang. isang tr lang need pag mag fefetch ng data galing database */}
                                {jobPosts.map((jobpost) => (
                                <tr key={jobpost.id} className={styles.row2}>
                                    <td className={styles.column6_2}> {jobpost.jobTitle} </td>
                                    <td className={styles.column7_2}> {jobpost.companyName} </td>
                                    <td className={styles.column8_2}> {jobpost.position} </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    </div>
                    <div className={styles.btnctn}>
                        <button className={styles.button} onClick={() => { generateExcelFileJobList(); generatePDFjoblist(); }}> Generate Report </button>
                    </div>
                </div>
            </div>
        )}

        
        {/* employeeModal */}
        { employeeModal && (
            <div className={styles.modal}>
                <div className={styles.overlay}> </div>
                 {/* naka auto yung modal content sa css. dapata naka fix yung height nya */}
                    <div className={styles.modalcontent}>
                        <FontAwesomeIcon icon={faXmark} onClick={toggleEmployeeModal} className={styles.closeIcon} />
                            <h1 className={styles.modaltitle}> Employee Information</h1>
                            
                                <div className={styles.modalbox}>
                                    <table className={styles.modaltable}>
                                        <thead>
                                            <tr className={styles.row1}>
                                                <th className={styles.mcolumn1}> </th>
                                                <th className={styles.mcolumn2}> Details </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className={styles.row2}>
                                                <td className={styles.mcolumn3}>First Name</td>
                                                <td className={styles.mcolumn4}> {selectedEmployee.firstName} </td>
                                            </tr>
                                            <tr className={styles.row2}>
                                                <td className={styles.mcolumn3}>Last Name</td>
                                                <td className={styles.mcolumn4}>{selectedEmployee.lastName} </td>
                                            </tr>
                                            <tr className={styles.row2}>
                                                <td className={styles.mcolumn3}>SIS</td>
                                                <td className={styles.mcolumn4}> {selectedEmployee.sis} </td>
                                            </tr>
                                            <tr className={styles.row2}>
                                                <td className={styles.mcolumn3}>Email</td>
                                                <td className={styles.mcolumn4}> {selectedEmployee.email} </td>
                                            </tr>
                                            <tr className={styles.row2}>
                                                <td className={styles.mcolumn3}>Contact</td>
                                                <td className={styles.mcolumn4}> {selectedEmployee.number} </td>
                                            </tr>
                                            <tr className={styles.row2}>
                                                <td className={styles.mcolumn3}>Street Address</td>
                                                <td className={styles.mcolumn4}>  {selectedEmployee.streetAddress}</td>
                                            </tr>
                                            <tr className={styles.row2}>
                                                <td className={styles.mcolumn3}>City</td>
                                                <td className={styles.mcolumn4}> {selectedEmployee.city} </td>
                                            </tr>
                                            <tr className={styles.row2}>
                                                <td className={styles.mcolumn3}>Province</td>
                                                <td className={styles.mcolumn4}> {selectedEmployee.province} </td>
                                            </tr>
                                            <tr className={styles.row2}>
                                                <td className={styles.mcolumn3}>Postal Code</td>
                                                <td className={styles.mcolumn4}> {selectedEmployee.postalCode} </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className={styles.btnctn}>
                                <button className={styles.button} onClick = {toggleEditEmployeeModal}> Edit </button>
                            <button className={styles.button}> Generate Report </button>
                    </div>
                </div>
            </div>
        )}

        { editEmployeeModal && (
            <div className={styles.modal}>
                <div className={styles.overlay}> </div>
                 {/* naka auto yung modal content sa css. dapata naka fix yung height nya */}
                    <div className={styles.modalcontent}>
                        <FontAwesomeIcon icon={faXmark} onClick={toggleEditEmployeeModal} className={styles.closeIcon} />
                            <h1 className={styles.modaltitle}> Employee Information</h1>
                            
                                <div className={styles.modalbox}>
                                    <table className={styles.modaltable}>
                                        <thead>
                                            <tr className={styles.row1}>
                                                <th className={styles.mcolumn1}> </th>
                                                <th className={styles.mcolumn2}> Details </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className={styles.row2}>
                                                <td className={styles.mcolumn3}>First Name</td>
                                                <td className={styles.mcolumn4}> 
                                                    <input type = "text" name="firstName"
                                                        className={styles.mtextbox}
                                                        value={editedEmployee.firstName || selectedEmployee.firstName}
                                                        onChange={handleEditChange}/>
                                                </td>
                                            </tr>
                                            <tr className={styles.row2}>
                                                <td className={styles.mcolumn3}>Last Name</td>
                                                <td className={styles.mcolumn4}>
                                                    <input type = "text" name="lastName"
                                                            className={styles.mtextbox}
                                                            value={editedEmployee.lastName || selectedEmployee.lastName}
                                                            onChange={handleEditChange}/>
                                                </td>
                                            </tr>
                                            <tr className={styles.row2}>
                                                <td className={styles.mcolumn3}>SIS</td>
                                                <td className={styles.mcolumn4}>
                                                    <input type = "text" name="sis"
                                                            className={styles.mtextbox}
                                                            value={editedEmployee.sis || selectedEmployee.sis}
                                                            onChange={handleEditChange}/>
                                                </td>
                                            </tr>
                                            <tr className={styles.row2}>
                                                <td className={styles.mcolumn3}>Email</td>
                                                <td className={styles.mcolumn4}>
                                                    <input type = "text" name="email"
                                                            className={styles.mtextbox}
                                                            value={editedEmployee.email || selectedEmployee.email}
                                                            onChange={handleEditChange}/>
                                                </td>
                                            </tr>
                                            <tr className={styles.row2}>
                                                <td className={styles.mcolumn3}>Contact</td>
                                                <td className={styles.mcolumn4}>
                                                    <input type = "text" name="number"
                                                            className={styles.mtextbox}
                                                            value={editedEmployee.number || selectedEmployee.number}
                                                            onChange={handleEditChange}/>
                                                </td>
                                            </tr>
                                            <tr className={styles.row2}>
                                                <td className={styles.mcolumn3}>Street Address</td>
                                                <td className={styles.mcolumn4}>
                                                    <input type = "text" name="streetAddress"
                                                            className={styles.mtextbox}
                                                            value={editedEmployee.streetAddress || selectedEmployee.streetAddress}
                                                            onChange={handleEditChange}/>
                                                </td>
                                            </tr>
                                            <tr className={styles.row2}>
                                                <td className={styles.mcolumn3}>City</td>
                                                <td className={styles.mcolumn4}>
                                                    <input type = "text" name="city"
                                                            className={styles.mtextbox}
                                                            value={editedEmployee.city || selectedEmployee.city}
                                                            onChange={handleEditChange}/>
                                                </td>
                                            </tr>
                                            <tr className={styles.row2}>
                                                <td className={styles.mcolumn3}>Province</td>
                                                <td className={styles.mcolumn4}>
                                                    <input type = "text" name="province"
                                                            className={styles.mtextbox}
                                                            value={editedEmployee.province || selectedEmployee.province}
                                                            onChange={handleEditChange}/>
                                                </td>
                                            </tr>
                                            <tr className={styles.row2}>
                                                <td className={styles.mcolumn3}>Postal Code</td>
                                                <td className={styles.mcolumn4}>
                                                    <input type = "text" name="postalCode"
                                                            className={styles.mtextbox}
                                                            value={editedEmployee.postalCode || selectedEmployee.postalCode}
                                                            onChange={handleEditChange}/>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className={styles.btnctn}>
                                <button className={styles.button} onClick={handleSaveEmployee}> Save </button>
                    </div>
                </div>
            </div>
        )}

        
        {/* employerModal */}
        { employerModal && (
            <div className={styles.modal}>
                <div className={styles.overlay}> </div>
                 {/* naka auto yung modal content sa css. dapata naka fix yung height nya */}
                    <div className={styles.modalcontent}>
                        <FontAwesomeIcon icon={faXmark} onClick={toggleEmployerModal} className={styles.closeIcon} />
                            <h1 className={styles.modaltitle}> Employer Information</h1>
                            
                                <div className={styles.modalbox}>
                                    <table className={styles.modaltable}>
                                        <thead>
                                            <tr className={styles.row1}>
                                                <th className={styles.mcolumn1}> </th>
                                                <th className={styles.mcolumn2}> Details </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className={styles.row2}>
                                                <td className={styles.mcolumn3}>First Name</td>
                                                <td className={styles.mcolumn4}> {selectedEmployer.firstName} </td>
                                            </tr>
                                            <tr className={styles.row2}>
                                                <td className={styles.mcolumn3}>Last Name</td>
                                                <td className={styles.mcolumn4}> {selectedEmployer.lastName} </td>
                                            </tr>
                                            <tr className={styles.row2}>
                                                <td className={styles.mcolumn3}>Employer UID</td>
                                                <td className={styles.mcolumn4}> {selectedEmployer.employerUID} </td>
                                            </tr>
                                            <tr className={styles.row2}>
                                                <td className={styles.mcolumn3}>Email</td>
                                                <td className={styles.mcolumn4}> {selectedEmployer.email} </td>
                                            </tr>
                                            <tr className={styles.row2}>
                                                <td className={styles.mcolumn3}>Contact</td>
                                                <td className={styles.mcolumn4}> {selectedEmployer.number} </td>
                                            </tr>
                                            <tr className={styles.row2}>
                                                <td className={styles.mcolumn3}>Street Address</td>
                                                <td className={styles.mcolumn4}> {selectedEmployer.streetAddress} </td>
                                            </tr>
                                            <tr className={styles.row2}>
                                                <td className={styles.mcolumn3}>City</td>
                                                <td className={styles.mcolumn4}> {selectedEmployer.city} </td>
                                            </tr>
                                            <tr className={styles.row2}>
                                                <td className={styles.mcolumn3}>Province</td>
                                                <td className={styles.mcolumn4}> {selectedEmployer.province} </td>
                                            </tr>
                                            <tr className={styles.row2}>
                                                <td className={styles.mcolumn3}>Postal Code</td>
                                                <td className={styles.mcolumn4}> {selectedEmployer.postalCode} </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className={styles.btnctn}>
                                <button className={styles.button} onClick = {toggleEditEmployerModal}> Edit </button>   
                            <button className={styles.button}> Generate Report </button>
                    </div>
                </div>
            </div>
        )}

         { editEmployerModal && (
            <div className={styles.modal}>
                <div className={styles.overlay}> </div>
                 {/* naka auto yung modal content sa css. dapata naka fix yung height nya */}
                    <div className={styles.modalcontent}>
                        <FontAwesomeIcon icon={faXmark} onClick={toggleEditEmployerModal} className={styles.closeIcon} />
                            <h1 className={styles.modaltitle}> Employer Information</h1>
                            
                                <div className={styles.modalbox}>
                                    <table className={styles.modaltable}>
                                        <thead>
                                            <tr className={styles.row1}>
                                                <th className={styles.mcolumn1}> </th>
                                                <th className={styles.mcolumn2}> Details </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className={styles.row2}>
                                                <td className={styles.mcolumn3}>First Name</td>
                                                <td className={styles.mcolumn4}>
                                                    <input type = "text" name="firstName"
                                                            className={styles.mtextbox}
                                                            value={editedEmployer.firstName || selectedEmployer.firstName}
                                                            onChange={handleEditEmployerChange}/>
                                                </td>
                                            </tr>
                                            <tr className={styles.row2}>
                                                <td className={styles.mcolumn3}>Last Name</td>
                                                <td className={styles.mcolumn4}>
                                                    <input type = "text" name="lastName"
                                                            className={styles.mtextbox}
                                                            value={editedEmployer.lastName || selectedEmployer.lastName}
                                                            onChange={handleEditEmployerChange}/>
                                                </td>
                                            </tr>
                                            <tr className={styles.row2}>
                                                <td className={styles.mcolumn3}>Employer UID</td>
                                                <td className={styles.mcolumn4}>
                                                    <input type = "text" name="employerUID"
                                                            className={styles.mtextbox}
                                                            value={editedEmployer.employerUID || selectedEmployer.employerUID}
                                                            onChange={handleEditEmployerChange}/>
                                                </td>
                                            </tr>
                                            <tr className={styles.row2}>
                                                <td className={styles.mcolumn3}>Email</td>
                                                <td className={styles.mcolumn4}>
                                                    <input type = "text" name="email"
                                                            className={styles.mtextbox}
                                                            value={editedEmployer.email || selectedEmployer.email}
                                                            onChange={handleEditEmployerChange}/>
                                                </td>
                                            </tr>
                                            <tr className={styles.row2}>
                                                <td className={styles.mcolumn3}>Contact</td>
                                                <td className={styles.mcolumn4}>
                                                    <input type = "text" name="number"
                                                            className={styles.mtextbox}
                                                            value={editedEmployer.number || selectedEmployer.number}
                                                            onChange={handleEditEmployerChange}/>
                                                </td>
                                            </tr>
                                            <tr className={styles.row2}>
                                                <td className={styles.mcolumn3}>Street Address</td>
                                                <td className={styles.mcolumn4}>
                                                    <input type = "text" name="streetAddress"
                                                            className={styles.mtextbox}
                                                            value={editedEmployer.streetAddress || selectedEmployer.streetAddress}
                                                            onChange={handleEditEmployerChange}/>
                                                </td>
                                            </tr>
                                            <tr className={styles.row2}>
                                                <td className={styles.mcolumn3}>City</td>
                                                <td className={styles.mcolumn4}>
                                                    <input type = "text" name="city"
                                                            className={styles.mtextbox}
                                                            value={editedEmployer.city || selectedEmployer.city}
                                                            onChange={handleEditEmployerChange}/>
                                                </td>
                                            </tr>
                                            <tr className={styles.row2}>
                                                <td className={styles.mcolumn3}>Province</td>
                                                <td className={styles.mcolumn4}>
                                                    <input type = "text" name="province"
                                                            className={styles.mtextbox}
                                                            value={editedEmployer.province || selectedEmployer.province}
                                                            onChange={handleEditEmployerChange}/>
                                                </td>
                                            </tr>
                                            <tr className={styles.row2}>
                                                <td className={styles.mcolumn3}>Postal Code</td>
                                                <td className={styles.mcolumn4}>
                                                    <input type = "text" name="postalCode"
                                                            className={styles.mtextbox}
                                                            value={editedEmployer.postalCode || selectedEmployer.postalCode}
                                                            onChange={handleEditEmployerChange}/>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className={styles.btnctn}>
                                <button className={styles.button} onClick = {handleSaveEmployer}> Save </button>
                    </div>
                </div>
            </div>
        )}

       

         {/* number of applicants modal */}
         { applicantsModal && (
            <div className={styles.modal}>
                <div className={styles.overlay}> </div>
                 {/* naka auto yung modal content sa css. dapata naka fix yung height nya */}
                    <div className={styles.modalcontent}>
                        <FontAwesomeIcon icon={faXmark} onClick={toggleApplicantsModal} className={styles.closeIcon} />
                            <h1 className={styles.modaltitle}> Number of Applicants</h1>
                            
                                <div className={styles.modalbox}>
                                    <table className={styles.modaltable}>
                                        <thead>
                                            <tr className={styles.row1}>
                                                <th className={styles.mcolumn1_1}> First Name </th>
                                                <th className={styles.mcolumn2_1}> Last Name </th>
                                                <th className={styles.mcolumn3_1}> Email </th>
                                                <th className={styles.mcolumn4_1}> Sis </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className={styles.row2}>
                                                <td className={styles.mcolumn5_1}> Ericka Jane</td>
                                                <td className={styles.mcolumn6_1}> Quipot </td>
                                                <td className={styles.mcolumn7_1}> pyxxelated@gmail.com</td>
                                                <td className={styles.mcolumn8_1}> 2016-12805-mn-0</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className={styles.btnctn}>
                            <button className={styles.button}> Generate Report </button>
                    </div>
                </div>
            </div>
        )}


         {/* number of hired modal */}
         { hiredModal && (
            <div className={styles.modal}>
                <div className={styles.overlay}> </div>
                {/* naka auto yung modal content sa css. dapata naka fix yung height nya */}
                    <div className={styles.modalcontent}> 
                        <FontAwesomeIcon icon={faXmark} onClick={toggleHiredModal} className={styles.closeIcon} />
                            <h1 className={styles.modaltitle}> Number of Hired Applicants</h1>
                            
                                <div className={styles.modalbox}> 
                                    <table className={styles.modaltable}> 
                                        <thead>
                                            <tr className={styles.row1}>
                                                <th className={styles.mcolumn1_1}> First Name </th>
                                                <th className={styles.mcolumn2_1}> Last Name </th>
                                                <th className={styles.mcolumn3_1}> Email </th>
                                                <th className={styles.mcolumn4_1}> Sis </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className={styles.row2}>
                                                <td className={styles.mcolumn5_1}> Ericka Jane</td>
                                                <td className={styles.mcolumn6_1}> Quipot </td>
                                                <td className={styles.mcolumn7_1}> pyxxelated@gmail.com</td>
                                                <td className={styles.mcolumn8_1}> 2016-12805-mn-0</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className={styles.btnctn}>
                            <button className={styles.button}> Generate Report </button>
                    </div>
                </div>
            </div>
        )}



        


    
    </div>
  )
}

export default Admindashboard
