import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth, db } from "./FireBase_Config";
import { collection, getDocs, query, where } from "firebase/firestore";
import GoogleButton from "react-google-button";
import { Form } from 'react-bootstrap';
import './index.css';

// Here we have implemented Sign in functionality.
// 2 types of sign in functionality is present here: signInWithEmailAndPassword and signInWithGoogle
// signInWithEmailAndPassword takes 3 parameter same as createUserWithEmailAndPassword.
// signInWithGoogle is google log in functionality.

function Login() {
  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");
  const [error, SetError] = useState("");
  const [userid, Setuid] = useState('');
  const [occupation, SetOccupation] = useState("");
  const [college, SetCollege] = useState("");
  const [access, SetAccess] = useState(true);
  const [googleaccess, SetGoogleAccess] = useState(true);
  const [allEntry, SetAllentry] = useState([]);
  const navigate = useNavigate();
  const userDataCollectionRefAdmin = collection(db, "AdminData");
  const userDataCollectionRefFaculty = collection(db, "FacultyData");
  const userDataCollectionRefStudent = collection(db, "StudentData");
  const userDataCollectionRefCollege = collection(db, "CollegeData");

  const login = async (e) => {
    e.preventDefault();
    try {
      if (occupation === "Admin") {
        let q;
        q = query(userDataCollectionRefAdmin, where('email', '==', email));
        const data = await getDocs(q);
        console.log(data);
        if (data.docs.length === 0) {
          console.log("NO access");
          throw "Error: Invalid Credential";
        }
        else {
          console.log("Access given");
        }
      }
      else if (occupation === "Faculty") {
        let q;
        q = query(userDataCollectionRefFaculty, where('email', '==', email));
        const data = await getDocs(q);
        console.log(data);
        if (data.docs.length === 0) {
          console.log("NO access");
          throw "Error: Invalid Credential";
        }
        else {
          console.log("Access given");
        }
      }
      else if (occupation === "Student") {
        let q;
        q = query(userDataCollectionRefStudent, where('email', '==', email));
        const data = await getDocs(q);
        console.log(data);
        if (data.docs.length === 0) {
          console.log("NO access");
          throw "Error: Invalid Credential";
        }
        else {
          console.log("Access given");
        }
      }
      try {
        const userr = await signInWithEmailAndPassword(auth, email, password);
        // console.log(userr);
        // console.log(userr.user.uid);
        Setuid(userr.user.uid);
        SetEmail("");
        SetPassword("");
        navigate("/");
        localStorage.setItem("Occupation", occupation);
        localStorage.setItem("College", college);
      }
      catch (err) {
        SetError(err.message);
        console.log(err.message);
      }
    }
    catch (error) {
      SetError(error)
      console.log(error)
    }
  }

  const GetData = async () => {
    try {
      const data = await getDocs(userDataCollectionRefCollege);
      SetAllentry(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
      //  console.log(data);
    }
    catch (error) {
      console.log(error.message);
    }
  }

  const provider = new GoogleAuthProvider();

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result);
      SetEmail(result.user.email)
      if (occupation === "Admin") {
        let q;
        q = query(userDataCollectionRefAdmin, where('email', '==', result.user.email));
        const data = await getDocs(q);
        console.log(data);
        if (data.docs.length === 0) {
          await signOut(auth);
          console.log("NO access");
        }
        else {
          SetAccess(false);
          localStorage.setItem("Occupation", occupation);
          localStorage.setItem("College", college);
          console.log("Access given");
          navigate("/");
        }
      }
      else if (occupation === "Faculty") {
        let q;
        q = query(userDataCollectionRefFaculty, where('email', '==', result.user.email));
        const data = await getDocs(q);
        console.log(data);
        if (data.docs.length === 0) {
          await signOut(auth);
          console.log("NO access");
        }
        else {
          localStorage.setItem("Occupation", occupation);
          localStorage.setItem("College", college);
          console.log("Access given");
          navigate("/");
        }
      }
    }
    catch (error) {
      console.log(error);
    }
  }
  // This google auth provider and signinwithgoogle is functionality of adding google authentication in our web.
  // We do not have to memorize everything present here. We just have to understand how it works
  // https://firebase.google.com/docs/auth/web/start?hl=en&authuser=0
  // Using this website reference we can refer to this website in future.

  useEffect(() => {
    if (college && occupation) {
      SetGoogleAccess(false);
    }
}, [college], [occupation])

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
                  <form>
                  <center> <h1 style={{position:"relative", bottom:"20px"}}>Sign in</h1> </center>
                  <Form>
                    <Form.Control as="select" onChange={(e) => { SetOccupation(e.target.value) }} defaultValue="Choose....."> <br /> <br />
                      <label className="form-label" htmlFor="form3Example3">Role <span style={{ color: "red" }}>*</span></label> <br />
                      <option value="choose">Choose Role **</option>
                      <option value="Admin">Admin</option>
                      <option value="Faculty">Faculty</option>
                    </Form.Control>
                  </Form> <br />
                    <Form>
                      <Form.Control as="select" onClick={() => { GetData() }} onChange={(e) => { SetCollege(e.target.value) }} defaultValue="Choose....."> <br />
                        <label className="form-label" htmlFor="form3Example3">Institute <span style={{ color: "red" }}>*</span></label> <br />
                        <option>Select College **</option>
                        {
                          allEntry.map((curele) => {
                            return (
                              <option value={`${curele.college}`}>{curele.college}</option>
                            )
                          })
                        }
                      </Form.Control>
                    </Form> <br />
                    <div className="form-outline mb-4">
                      <input type="email" onChange={(e) => { SetEmail(e.target.value) }} value={email} id="form3Example3" className="form-control" />
                      <label className="form-label" htmlFor="form3Example3">Email address <span style={{ color: "red" }}>*</span></label>
                    </div>
                    <div className="form-outline mb-4">
                      <input type="password" onChange={(e) => { SetPassword(e.target.value) }} value={password} id="form3Example4" className="form-control" />
                      <label className="form-label" htmlFor="form3Example4">Password <span style={{ color: "red" }}>*</span></label>
                    </div>
                    {<span style={{ color: "red" }}>{error}</span>} <br />
                    <div className="col-md-6 mb-2">
                      <button type="submit" onClick={(e) => { login(e); }} className="btn btn-primary btn-block mb-2 ">
                        Login
                      </button> <br />
                      <small>------OR------</small>
                      <GoogleButton disabled={googleaccess} onClick={signInWithGoogle} className="g-btn" type="dark"></GoogleButton>
                      <label className="form-label" htmlFor="form3Example4">To use Google sign in button you must have to fill ** fields.</label>
                    </div>
                    <div className="form-check d-flex justify-content-center mb-0">
                      <label className="form-check-label" htmlFor="form2Example33">
                        <br />  Don't have an Account?&nbsp;
                        <Link to="/registration">Sign Up</Link>
                      </label>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section >
    </body >
  )
}

export default Login;