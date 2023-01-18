import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./FireBase_Config";
import Card from 'react-bootstrap/Card';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { FcApproval } from "@react-icons/all-files/fc/FcApproval.esm";
import { BsFillPersonFill } from "@react-icons/all-files/bs/BsFillPersonFill";
import Offcanvas from 'react-bootstrap/Offcanvas';
import { collection, getDocs, query, where, orderBy, updateDoc, doc } from "firebase/firestore";

function Statistics() {
    const [college, SetCollege] = useState("");
    const [userEmail, SetuserEmail] = useState("");
    const [dateorder, SetDateOrder] = useState("");
    const [show, setShow] = useState(false);
    const [isApprove, setIsApprove] = useState(false);
    const [isReject, setIsReject] = useState(false);
    const [allEntry, SetAllentry] = useState([]);
    const [allDocEntry, SetAllDocEntry] = useState([]);
    const [dataOfAdmin, SetDataOfAdmin] = useState([]);
    const userDataCollectionRefFaculty = collection(db, "FacultyData");
    const userDataCollectionRefAdmin = collection(db, "AdminData");
    const userDataCollectionRefDocumentData = collection(db, "DocumentData");
    const navigate = useNavigate();

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                SetuserEmail(user.email);
                const occu = localStorage.getItem("Occupation");
                const coll = localStorage.getItem("College");
                SetCollege(coll);
                if (occu === "Admin") {
                    console.log("Access allowed admin");
                }
                else if (occu === "Faculty") {
                    navigate("/");
                }
                else if (occu === "Student") {
                    navigate("/");
                }
                else if (!occu || !college) {
                    navigate("/");
                }
            }
            else {
                navigate("/loginpage");
            }
        })
    }, [userEmail])

    const GetMyDocumentData = async () => {
        try {
            if (dateorder === "Ascending") {
                let q;
                q = query(userDataCollectionRefDocumentData, where('college', '==', college), orderBy("date", "asc"));
                const data = await getDocs(q);
                SetAllDocEntry(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            }
            else if (dateorder === "Descending") {
                let q;
                q = query(userDataCollectionRefDocumentData, where('college', '==', college), orderBy("date", "desc"));
                const data = await getDocs(q);
                SetAllDocEntry(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            }
        }
        catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        GetMyDocumentData();
    }, [dateorder])

    const GetMemberData = async () => {
        let q, q1;
        q = query(userDataCollectionRefFaculty, where('college', '==', college));
        q1 = query(userDataCollectionRefAdmin, where('college', '==', college));
        try {
            const data = await getDocs(q);
            const adminData = await getDocs(q1);
            if (data.docs.length === 0 && adminData.docs.length === 0) {
                console.log("No data");
            }
            else {
                SetAllentry(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
                SetDataOfAdmin(adminData.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
                // console.log(allEntry);
            }
        }
        catch (error) {
            console.log(error);
        }
        setShow(true);
    };

    const DeleteUser = async (id) => {
        const newid = { id };
        console.log("New id", typeof newid);
        const res = await fetch("/register", {
            method: "POST",
            headers: { "Content-Type": "application/JSON" },
            body: JSON.stringify(newid)
        });
        GetMemberData();
    }

    const onUpdateData = async (id) => {
        console.log(id);
        let status;
        if (isApprove) {
            status = "Approved"
        }
        else {
            status = "Rejected"
        }
        const docdata = doc(db, `DocumentData`, id);
        let obj = {
            dstatus: status
        }
        try {
            await updateDoc(docdata, Object.assign({}, obj));
            GetMyDocumentData();
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <section className="background-radial-gradient overflow-hidden">
                <div className="container px-4 py-2 px-md-5 text-center text-lg-start my-5">
                    <div className="row gx-lg-5 align-items-center mb-5">
                        <div className="col-lg-600 mb-500 mb-lg-0" style={{ zIndex: "10" }}>
                            <div className="col-lg-600 mb-500 mb-lg-0 position-relative">
                                <p className="mb-2 opacity-70" style={{ color: "hsl(218, 81%, 85%)", position: "relative", bottom: "30px", fontSize: "22px" }}>
                                    Here all {college}'s Research Paper will be shown.
                                </p>
                                <Card className='mt-0 mb-0'>
                                    <Card.Body>
                                        <Card.Title>Search for Research Papers by selecting order</Card.Title>
                                        <Form>
                                            <Form.Control as="select" onChange={(e) => { SetDateOrder(e.target.value) }} defaultValue="Choose.....">
                                                <option value="choose">Sort</option>
                                                <option value="Ascending">Ascending</option>
                                                <option value="Descending">Descending</option>
                                            </Form.Control>
                                        </Form>
                                    </Card.Body>
                                </Card> <br />
                                <Button variant="primary" onClick={GetMemberData}>
                                    Manage Team
                                </Button> <br /> <br />
                                <div>
                                    {
                                        allDocEntry.map((curdata) => {
                                            return (
                                                <div>
                                                    <Card className="text-center">
                                                        <Card.Header style={{ textTransform: "uppercase" }}><b><i>{curdata.title} - </i></b> <BsFillPersonFill /> {curdata.author} </Card.Header>
                                                        <Card.Body>
                                                            <Card.Text>{curdata.abstract}</Card.Text>
                                                            <Card.Text>{curdata.edition}th edition • {curdata.pages} Page(s) </Card.Text>
                                                            <Card.Text>{curdata.college} • {curdata.department}</Card.Text>
                                                            <a href={curdata.fileUrl} target="_blank" rel="noreferrer" download>Download {curdata.category}</a>
                                                            <div style={{ position: "relative", top: "10px" }}>
                                                                <input type="checkbox" onChange={(e) => { setIsApprove(!isApprove); }} checked={isApprove} />
                                                                <label className="form-label" htmlFor="daysin">Approve</label> &nbsp; &nbsp;
                                                                <input type="checkbox" onChange={(e) => { setIsReject(!isReject); }} checked={isReject} />
                                                                <label className="form-label" htmlFor="daysin">Reject</label>
                                                            </div>
                                                            <button style={{ position: "relative", top: "20px" }} type="submit" onClick={(e) => onUpdateData(curdata.id)} className="btn btn-primary btn-block mb-4"> Set Status</button>
                                                        </Card.Body>
                                                        <Card.Footer className="text-muted">Category: {curdata.category} • Published by: {curdata.publisher} • Accepted on: {curdata.date} • Added by: {curdata.addedBy} • Status: {(curdata.dstatus === 'Rejected') ? <span style={{ color: "red", fontWeight: 'bolder' }}>{curdata.dstatus}</span> : <span style={{ color: "green", fontWeight: 'bolder' }}>{curdata.dstatus}</span>}</Card.Footer>
                                                    </Card>
                                                    <br />
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <div>
                                    <Offcanvas show={show} onHide={(e) => { setShow(false) }} placement="end">
                                        <Offcanvas.Header closeButton>
                                            <Offcanvas.Title>List of Admin and Faculty from {college} who has access to post data on this site.</Offcanvas.Title>
                                        </Offcanvas.Header>
                                        <Offcanvas.Body variant="light">
                                            {
                                                dataOfAdmin.map((curdata) => {
                                                    return (
                                                        <div>
                                                            <Card className="text-center">
                                                                <Card.Header><b><i>Username: {curdata.displayname} {curdata.firstname} {curdata.lastname} - {curdata.occupation} <FcApproval /></i></b></Card.Header>
                                                                <Card.Header>Email: {curdata.email}</Card.Header>
                                                            </Card>
                                                            <br />
                                                        </div>
                                                    )
                                                })
                                            }
                                            {
                                                allEntry.map((curdata) => {
                                                    return (
                                                        <div>
                                                            <Card className="text-center">
                                                                <Card.Header><b><i>Username: {curdata.displayname} {curdata.firstname} {curdata.lastname} - {curdata.occupation}</i></b></Card.Header>
                                                                <Card.Header>Email: {curdata.email}</Card.Header>
                                                                <Button variant="primary" onClick={() => { DeleteUser(curdata.id); }}>Delete User</Button>
                                                            </Card>
                                                            <br />
                                                        </div>
                                                    )
                                                })
                                            }
                                        </Offcanvas.Body>
                                    </Offcanvas>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    allDocEntry.length === 0 ? <div> . <br /> <br /> <br />  <br /> <br />  <br />  <br /> <br />. </div> : <></>
                }
            </section>
        </div>
    )
}
export default Statistics;