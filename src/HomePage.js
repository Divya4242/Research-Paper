import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./FireBase_Config";
import { collection, getDocs, query, where } from "firebase/firestore";
import img1 from './images/review.svg';
import img2 from './images/security.svg';
import img3 from './images/Add_files.svg';
import './index.css';
import Carousel from 'react-bootstrap/Carousel';
import { MDBFooter } from 'mdb-react-ui-kit'
import { IoMailUnreadOutline } from "@react-icons/all-files/io5/IoMailUnreadOutline.esm";
import { SiInstagram } from "@react-icons/all-files/si/SiInstagram.esm";
import { GoMarkGithub } from "@react-icons/all-files/go/GoMarkGithub.esm";
import { SiLinkedin } from "@react-icons/all-files/si/SiLinkedin.esm";

let temp = 0;
function HomePage() {
    const [UserName, SetUserName] = useState("");
    const [index, setIndex] = useState(0);
    // const [show, setShow] = useState(false);
    const [collegeEntryData, SetCollegeEntryData] = useState([]);
    // const [college, SetCollege] = useState("");
    // const [collegeAddress, SetCollegeAddress] = useState("");
    // const [collegeEmail, SetCollegeEmail] = useState("");
    // const [collegePhone, SetCollegePhone] = useState("");
    const [WhetherUserExist, SetWhetherUserExist] = useState(false);
    const userDataCollectionRefCollege = collection(db, "CollegeData");

    const status = () => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                //console.log(user);
                SetWhetherUserExist(true);
                SetUserName(user.displayName);
            }
            else {
                SetWhetherUserExist(false);
                SetUserName('');
                //console.log(userid);
            }
        })
    }
    useEffect(() => {
        status();
    }, [])

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    useEffect(() => {
        handleShow();
    }, [])

    const handleShow = async () => {
        const coll = localStorage.getItem("College");
        let q;
        q = query(userDataCollectionRefCollege, where('college', '==', coll));
        try {
            const data = await getDocs(q);
            if (data.docs.length === 0) {
                // console.log("No Such data");
            }
            else if (collegeEntryData.length === 0) {
                // console.log("hi");
                temp = 1;
                SetCollegeEntryData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            }
        }
        catch (error) {
            // console.log(error);
        }
    }
    
    return (
        <div>
            <Carousel variant="light" activeIndex={index} onSelect={handleSelect}>
                <Carousel.Item style={{ backgroundColor: "#303a52" }}>
                    <img
                        className="d-block"
                        style={{ height: 400, width: 350 }}
                        src={img3}
                        alt="First slide"
                    />
                    <Carousel.Caption>
                        <h3> Upload Document</h3>
                        <p>Admin and Faculty can upload the citation on behalf of the students.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item style={{ backgroundColor: "#303a52" }}>
                    <img
                        className="d-block"
                        style={{ height: 400, width: 350 }}
                        src={img2}
                        alt="Second slide"
                    />

                    <Carousel.Caption>
                        <h3>Download Document </h3>
                        <p>Admin and Faculty can review the citations. Uploader has access to edit the citation if required</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item style={{ backgroundColor: "#303a52" }}>
                    <img
                        className="d-block"
                        style={{ height: 400, width: 350 }}
                        src={img1}
                        alt="Third slide"
                    />

                    <Carousel.Caption>
                        <h3>Role based Authentication</h3>
                        <p>Secure authentication using Firebase. Admin and Faculty has access to upload the citations. Anyone on internet can review the citations.</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
            <body>
                <section className="background-radial-gradient overflow-hidden">
                    <div className="container px-4 py-0 px-md-5 text-center text-lg-start my-2">
                        <div className="row gx-lg-5 align-items-center mb-5">
                            <div className="col-lg-10 mb-5 mb-lg-0" style={{ zIndex: "10" }}>
                                {
                                    WhetherUserExist ?
                                        <h1 className="my-5 display-5 fw-bold ls-tight" style={{ color: "hsl(218, 81%, 95%)" }}> Hello! {UserName}
                                            <br /><span style={{ color: "hsl(218, 81%, 75%)" }}>Nice to see you.</span>
                                        </h1> :
                                        <p className="mb-2 opacity-70" style={{ color: "hsl(218, 81%, 85%)", position: "relative", top: "30px", fontSize: "22px" }}>
                                            This website is intended to add research paper like Journal article, book chapter, publications
                                            for any institute that can be visible to anyone on internet. <br/> Collection and maintenance of research 
                                            activities conducted at Universities is now very difficult to maintain. 
                                            This type of data has a number of verticals such as publications, books/book chapters, masterclasses etc. 
                                            The maintenance and fetching of the data from individual faculty is a very tedious job,
                                            so to solve this hurdle this website will help you under different heads and helping. 
                                            Research papers can be added only after you have created an account. 
                                        </p>
                                }
                            </div>
                        </div>
                    </div>
                    <div className='container-fluid mx-auto mt-5 mb-5 col-12' style={{ textAlignn: "center" }}>
                        <div className="my-5 display-5 fw-bold ls-tight" style={{ color: "hsl(218, 81%, 95%)" }}>Our Services</div>
                        <div className="row" style={{ justifyContent: "center" }}>
                            <div className="card col-md-3 col-12" style={{ marginBottom: "20px" }}>
                                <div className="card-content">
                                    <div className="card-body"> <img style={{ height: 60, width: 90 }} src={img3} />
                                        <div className="shadow"></div>
                                        <div className="card-title"> Upload Document </div>
                                        <div className="card-subtitle">
                                            <p> <small className="text-muted">Admin and Faculty can upload the citation on behalf of the students. </small> </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <br />
                            <div className="card col-md-3 col-12 ml-2" style={{ marginBottom: "20px" }}>
                                <div className="card-content">
                                    <div className="card-body"> <img style={{ height: 60, width: 90 }} src={img2} />
                                        <div className="card-title"> Download Document </div>
                                        <div className="card-subtitle">
                                            <p> <small className="text-muted">Admin, Faculty and students can review the citations. Uploader has access to edit the citation if required </small> </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card col-md-3 col-12 ml-2" style={{ marginBottom: "20px" }}>
                                <div className="card-content">
                                    <div className="card-body"> <img style={{ height: 60, width: 90 }} src={img1} />
                                        <div className="card-title"> Role based Authentication</div>
                                        <div className="card-subtitle">
                                            <p> <small className="text-muted">Secure authentication using Firebase. Admin and Faculty has access to upload the citations. Anyone on internet can review the citation. </small> </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </body>
            <MDBFooter style={{backgroundColor:"#071e3d"}} className='text-center text-lg-start text-light'>
                <section className='d-flex justify-content-center justify-content-lg-between p-0 border-bottom'>
                </section>
                <div className='text-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
                    Contact Developer <br />
                    Divya Patel <br />
                    <a target="_blank" style={{ position: "relative", right: "6px", color: "white", textDecorationLine: "none" }} href="mailto:divyakpatel42@gmail.com"> <IoMailUnreadOutline style={{ height: "21px", width: "21px" }} />&nbsp; &nbsp;</a>
                    <a target="_blank" style={{ color: "white", textDecorationLine: "none" }} href="https://www.instagram.com/_divyapatel_18/"><SiInstagram /> &nbsp; &nbsp; </a>
                    <a target="_blank" style={{ color: "white", textDecorationLine: "none" }} href="https://github.com/Divya4242"><GoMarkGithub /> &nbsp; &nbsp; </a>
                    <a target="_blank" style={{ color: "white", textDecorationLine: "none" }} href="https://www.linkedin.com/in/divya-patel-07257424a/"><SiLinkedin /> &nbsp; &nbsp; </a>
                </div>
            </MDBFooter>
        </div>
    )
}

export default HomePage