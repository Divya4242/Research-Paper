import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./FireBase_Config";
import { collection, addDoc, setDoc, doc, getDocs, query, where } from "firebase/firestore";
import GoogleButton from "react-google-button";
import { Form } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './index.css';

// Here in this page we have implemented Create user functionality.
// User have to register with first Name, Last name, Email and password.

// This is very simple to process to create user.
// Here we have function called  createUserWithEmailAndPassword. This function takes 3 parameters.
// Parameters are: auth, email and password
// This createUserWithEmailAndPassword returns us a promise.
// So due to promise we have written this function in async function along with await.
function Registration() {
    const [firstname, SetFname] = useState("");
    const [lastname, SetLname] = useState("");
    const [college, SetCollege] = useState("");
    const [collegeAddress, SetCollegeAddress] = useState("");
    const [collegeEmail, SetCollegeEmail] = useState("");
    const [collegePhone, SetCollegePhone] = useState("");
    const [email, SetEmail] = useState("");
    const [password, SetPassword] = useState("");
    const [writekey, SetWritekey] = useState("");
    const [readkey, SetReadkey] = useState("");
    const [occupation, SetOccupation] = useState("");
    const [error, SetError] = useState("");
    const [show, setShow] = useState(false);
    const [allEntry, SetAllentry] = useState([]);
    const [googleaccess, SetGoogleAccess] = useState(true);
    const navigate = useNavigate();
    const userDataCollectionRefAdmin = collection(db, "AdminData");
    const userDataCollectionRefFaculty = collection(db, "FacultyData");
    const userDataCollectionRefCollege = collection(db, "CollegeData");

    const handleClose = () => { setShow(false) };
    var myAdminData = {};
    var myFacultyData = {};

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                navigate("/registration");
            }
        })
    }, [])
    let CollegeRegistrationData = {};
    const register = async (e) => {
        e.preventDefault();
        if (occupation === "Admin") {
            if (firstname && lastname && college && email && password && writekey && readkey && occupation) {
                myAdminData = {
                    firstname: firstname,
                    lastname: lastname,
                    college: college,
                    email: email,
                    writekey: writekey,
                    readkey: readkey,
                    occupation: occupation
                }
                CollegeRegistrationData = {
                    college: college,
                    collegeAddress: collegeAddress,
                    collegeEmail: collegeEmail,
                    collegePhone: collegePhone
                }
                try {
                    const userr = await createUserWithEmailAndPassword(auth, email, password);
                    updateProfile(userr.user, { displayName: firstname + " " + lastname });
                    try {
                        //await addDoc(userDataCollectionRefAdmin, myAdminData);
                        await addDoc(userDataCollectionRefCollege, CollegeRegistrationData);
                        await setDoc(doc(userDataCollectionRefAdmin, userr.user.uid), myAdminData);
                        // console.log("Data added successfuly to firestore");
                    } catch (error) {
                        // console.log(error);
                    }
                    SetFname(""); SetLname(""); SetEmail(""); SetPassword(""); SetCollege(""); SetWritekey(""); SetReadkey("");
                    setShow(true);
                    navigate("/");
                    localStorage.setItem("Occupation", occupation);
                    localStorage.setItem("College", college);
                }
                catch (error) {
                    SetError(error.message);
                    // console.log(error);
                }
            }
            else {
                SetError("Please fill the form properly.");
            }
        }
        else if (occupation === "Faculty") {
            try {
                let q;
                q = query(userDataCollectionRefAdmin, where('college', '==', college), where('writekey', '==', writekey));
                const data = await getDocs(q);
                if (data.docs.length === 0) {
                    // console.log("NO access");
                    throw "Error: Invalid Key!"
                }
                else {
                    // console.log(data);
                    // console.log("Access given");
                }
                if (firstname && lastname && college && email && password && writekey && occupation) {
                    myFacultyData = {
                        firstname: firstname,
                        lastname: lastname,
                        college: college,
                        email: email,
                        writekey: writekey,
                        occupation: occupation
                    }
                    try {
                        const userr = await createUserWithEmailAndPassword(auth, email, password);
                        updateProfile(userr.user, { displayName: firstname + " " + lastname });
                        try {
                            //await addDoc(userDataCollectionRefFaculty, myFacultyData);
                            await setDoc(doc(userDataCollectionRefFaculty, userr.user.uid), myFacultyData);
                            // console.log("Data added successfuly to firestore");
                        } catch (error) {
                            // console.log(error);
                        }
                        // console.log(typeof userr);
                        // console.log(userr.user);
                        // console.log(auth.currentUser);
                        //console.log("User ID: " + userr.user.auth.currentUser.uid);
                        SetFname(""); SetLname(""); SetEmail(""); SetPassword(""); SetCollege(""); SetWritekey(""); SetReadkey("");
                        // const result = await fetch("/register", {
                        //     method: "POST",
                        //     headers: {
                        //         "Content-Type": "application/json"
                        //     },
                        //     body: JSON.stringify({
                        //         firstname, lastname, email, password, college, writekey
                        //     })
                        // })
                        // const res = await result.json();
                        // console.log(res);
                        setShow(true);
                        navigate("/");
                        localStorage.setItem("Occupation", occupation);
                        localStorage.setItem("College", college);
                    }
                    catch (error) {
                        SetError(error.message);
                        // console.log(error);
                    }
                }
                else {
                    alert("Please Fill the Form");
                }
            }
            catch (error) {
                SetError(error);
                // console.log(error)
            }
        }
        else {
            alert("Invalid Type");
        }
    }

    useEffect(() => {
        register();
    }, [])

    const GetData = async () => {
        try {
            const data = await getDocs(userDataCollectionRefCollege);
            SetAllentry(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            //  console.log(data);
        }
        catch (error) {
            // console.log(error.message);
        }
    }

    const provider = new GoogleAuthProvider();

    const signInWithGoogle = async (e) => {
        e.preventDefault();
        try {
            const result = await signInWithPopup(auth, provider);
            SetGoogleAccess(true);
        }
        catch (error) {
            // console.log(error);
        }
        if (occupation === "Admin") {
            if (college && writekey && occupation && collegeAddress && collegeEmail && collegePhone) {
                try {
                    const result = await signInWithPopup(auth, provider);
                    try {
                        myAdminData = {
                            displayname: result.user.displayName,
                            college: college,
                            email: result.user.email,
                            writekey: writekey,
                            occupation: occupation
                        }
                        CollegeRegistrationData = {
                            college: college,
                            collegeAddress: collegeAddress,
                            collegeEmail: collegeEmail,
                            collegePhone: collegePhone
                        }
                        await addDoc(userDataCollectionRefCollege, CollegeRegistrationData);
                        await setDoc(doc(userDataCollectionRefAdmin, result.user.uid), myAdminData);
                        // console.log("Data added successfuly to firestore");
                    } catch (error) {
                        // console.log(error);
                    }
                    SetFname(""); SetLname(""); SetEmail(""); SetPassword(""); SetCollege(""); SetWritekey(""); SetReadkey("");
                    setShow(true);
                    navigate("/");
                    localStorage.setItem("Occupation", occupation);
                    localStorage.setItem("College", college);
                }
                catch (error) {
                    SetError(error.message);
                    // console.log(error);
                }
            }
            else {
                SetError("Fill form Properly.")
            }
        }
        else if (occupation === "Faculty") {
            if (college && writekey && occupation) {
                try {
                    const result = await signInWithPopup(auth, provider);
                    try {
                        let q;
                        q = query(userDataCollectionRefAdmin, where('college', '==', college), where('writekey', '==', writekey));
                        const data = await getDocs(q);
                        if (data.docs.length === 0) {
                            // console.log("NO access");
                            await signOut(auth);
                            throw "Error: Invalid Key!"
                        }
                        else {
                            myFacultyData = {
                                displayname: result.user.displayName,
                                college: college,
                                email: result.user.email,
                                writekey: writekey,
                                occupation: occupation
                            }
                            try {
                                //await addDoc(userDataCollectionRefFaculty, myFacultyData);
                                await setDoc(doc(userDataCollectionRefFaculty, result.user.uid), myFacultyData);
                                throw "Error: Error Occured!"
                                // console.log("Data added successfuly to firestore");
                            }
                            catch (error) {
                                // console.log(error);
                            }
                        }
                    }
                    catch (error) {
                        // console.log(error);
                    }
                    SetFname(""); SetLname(""); SetEmail(""); SetPassword(""); SetCollege(""); SetWritekey(""); SetReadkey("");
                    setShow(true);
                    navigate("/");
                    localStorage.setItem("Occupation", occupation);
                    localStorage.setItem("College", college);
                }
                catch (error) {
                    SetError(error.message);
                    // console.log(error);
                }
            }
            else {
                // console.log("fill form properly")
            }
        }
    }

    useEffect(() => {
        if (occupation === "Admin") {
            if (college && writekey && occupation && collegeAddress && collegeEmail && collegePhone) {
                SetGoogleAccess(false);
            }
            else {
                SetGoogleAccess(true);
            }
        }
        else if (occupation === "Faculty") {
            if (college && writekey && occupation) {
                SetGoogleAccess(false);
            }
            else {
                SetGoogleAccess(true);
            }
        }
    }, [college, writekey, occupation, collegeAddress, collegeEmail, collegePhone])
    return (
        <body>
            <section className="background-radial-gradient overflow-hidden">
                <div className="container px-4 py-5 px-md-5 text-center text-lg-start my-5">
                    <div className="row gx-lg-5 align-items-center mb-5">
                        <div className="col-lg-3 mb-5 mb-lg-0" style={{ zIndex: "10" }}> </div>
                        <div className="col-lg-6 mb-5 mb-lg-0 position-relative">
                            <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
                            <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>
                            <div className="card bg-glass">
                                <div className="card-body px-4 py-5 px-md-5">
                                    <form method="POST">
                                        <center> <h1>Create Account</h1> </center>
                                        <div className="row">
                                            <div className="col-md-6 mb-4">
                                                <div className="form-outline">
                                                    <br />
                                                    <input type="text" onChange={(e) => { SetFname(e.target.value) }} value={firstname} id="form3Example1" className="form-control" />
                                                    <label className="form-label" htmlFor="form3Example1">First name <span style={{ color: "red" }}>*</span></label>
                                                </div>
                                            </div>
                                            <div className="col-md-6 mb-4">
                                                <div className="form-outline">
                                                    <br />
                                                    <input type="text" onChange={(e) => { SetLname(e.target.value) }} value={lastname} id="form3Example2" className="form-control" />
                                                    <label className="form-label" htmlFor="form3Example2">Last name <span style={{ color: "red" }}>*</span></label>
                                                </div>
                                            </div>
                                            <Form>
                                                <Form.Control as="select" onChange={(e) => { SetOccupation(e.target.value) }} defaultValue="Choose.....">
                                                    <option value="choose">Choose Role <span style={{ color: "red" }}>**</span></option>
                                                    <option value="Admin">Admin</option>
                                                    <option value="Faculty">Faculty</option>
                                                </Form.Control>
                                            </Form>
                                            {
                                                !occupation ? <h1> </h1> :
                                                    occupation === "Admin" ?
                                                        <div>
                                                            <br />
                                                            <div className="form-outline mb-4">
                                                                <input type="text" onChange={(e) => { SetCollege(e.target.value) }} value={college} id="form3Example5" placeholder="Example: DAIICT" className="form-control" />
                                                                <label className="form-label" htmlFor="form3Example4">College Name<span style={{ color: "red" }}>**</span></label>
                                                            </div>
                                                            <div className="form-outline mb-4">
                                                                <textarea type="text" onChange={(e) => { SetCollegeAddress(e.target.value) }} value={collegeAddress} id="form3Example5" placeholder="Example: Daiict college, Reliance Cross Rd, Gandhinagar, Gujarat 382007" className="form-control" />
                                                                <label className="form-label" htmlFor="form3Example4">College Address<span style={{ color: "red" }}>**</span></label>
                                                            </div>
                                                            <div className="form-outline mb-4">
                                                                <input type="text" onChange={(e) => { SetCollegeEmail(e.target.value) }} value={collegeEmail} placeholder="Example: collegename@gujarat.gov.in" id="form3Example5" className="form-control" />
                                                                <label className="form-label" htmlFor="form3Example4">College Email<span style={{ color: "red" }}>**</span></label>
                                                            </div>
                                                            <div className="form-outline mb-4">
                                                                <input type="text" onChange={(e) => { SetCollegePhone(e.target.value) }} value={collegePhone} placeholder="Example: 07966552233" id="form3Example5" className="form-control" />
                                                                <label className="form-label" htmlFor="form3Example4">College Phone Number<span style={{ color: "red" }}>**</span></label>
                                                            </div>
                                                        </div>
                                                        : occupation === "Faculty" ? <div>
                                                            <br />
                                                            <Form>
                                                                <Form.Control as="select" onClick={() => { GetData() }} onChange={(e) => { SetCollege(e.target.value) }} defaultValue="Choose....."> **
                                                                    <option>Select College <span style={{ color: "red" }}>**</span></option>
                                                                    {
                                                                        allEntry.map((curele) => {
                                                                            return (
                                                                                <option value={`${curele.college}`}>{curele.college}</option>
                                                                            )
                                                                        })
                                                                    }
                                                                </Form.Control>
                                                            </Form>
                                                        </div> : <h1></h1>
                                            }
                                        </div>
                                        <div className="form-outline mb-4">
                                            <br />
                                            <input type="email" onChange={(e) => { SetEmail(e.target.value) }} value={email} id="form3Example4" placeholder="Exmaple: mayur@gmail.com" className="form-control" />
                                            <label className="form-label" htmlFor="form3Example3">Your Email address <span style={{ color: "red" }}>*</span></label>
                                        </div>
                                        <div className="form-outline mb-4">
                                            <input type="password" onChange={(e) => { SetPassword(e.target.value) }} value={password} id="form3Example5" className="form-control" />
                                            <label className="form-label" htmlFor="form3Example4">Password <span style={{ color: "red" }}>*</span></label>
                                        </div>
                                        {
                                            occupation === "Admin" ?
                                                <div>
                                                    <div className="form-outline mb-4">
                                                        <input type="text" onChange={(e) => { SetWritekey(e.target.value) }} value={writekey} placeholder="Example: DAIICTWRITE@123" id="form3Example6" className="form-control" />
                                                        <label className="form-label" htmlFor="form3Example4">Create Write Key <span style={{ color: "red" }}>**</span></label>
                                                    </div>
                                                    <div className="form-outline mb-4">
                                                        <input type="text" onChange={(e) => { SetReadkey(e.target.value) }} value={readkey} placeholder="Example: DAIICTREAD@123" id="form3Example6" className="form-control" />
                                                        <label className="form-label" htmlFor="form3Example4">Create Read Key <span style={{ color: "red" }}>**</span></label>
                                                    </div>
                                                </div> : <div> </div>
                                        }
                                        {
                                            occupation === "Faculty" ?
                                                <div className="form-outline mb-4">
                                                    <input type="text" onChange={(e) => { SetWritekey(e.target.value) }} value={writekey} id="form3Example6" className="form-control" />
                                                    <label className="form-label" htmlFor="form3Example4">Write Key <span style={{ color: "red" }}>**</span></label>
                                                </div> : <div> </div>
                                        }
                                        {<span style={{ color: "red" }}>{error}</span>} <br />
                                        <div className="col-md-6 mb-3">
                                            <button type="submit" onClick={(event) => { register(event); }} className="btn btn-primary btn-block mb-4 ">
                                                Register
                                            </button> <br />
                                            <small>------OR------</small>
                                        </div>
                                        <GoogleButton disabled={googleaccess} onClick={(e) => { signInWithGoogle(e) }} className="g-btn" type="dark"></GoogleButton>
                                        <label className="form-label" htmlFor="form3Example4">To use Google sign in button you must have to fill ** fields.</label>
                                        <div className="form-check d-flex justify-content-center mb-0">
                                            <label className="form-check-label" htmlFor="form2Example33">
                                                <br />
                                                Already have an account?&nbsp;
                                                <Link to="/loginpage">Sign in</Link>
                                            </label>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Your account has been successfully created.</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </body>
    )
}

export default Registration;
