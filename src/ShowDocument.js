import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./FireBase_Config";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import Card from 'react-bootstrap/Card';
import { BsFillPersonFill } from "@react-icons/all-files/bs/BsFillPersonFill";
import { Form } from 'react-bootstrap';
import './index.css';

function ShowDocument() {
    const [userEmail, SetuserEmail] = useState("");
    const [allEntry, SetAllentry] = useState([]);
    const [collegeDropdown, setCollegeDropdown] = useState([]);
    const [college, SetCollege] = useState("");
    const [dateorder, SetDateOrder] = useState("");
    const userDataCollectionRefDocumentData = collection(db, "DocumentData");
    const userDataCollectionRefCollegeData = collection(db, "CollegeData");

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                SetuserEmail(user.email);
                SetCollege(localStorage.getItem("College"));
                console.log(college);
                if (!college) {
                    console.log("No college mentioned");
                }
            }
            else {

            }
        })
    }, [userEmail])

    const GetCollegeData = async () => {
        try {
            const data = await getDocs(userDataCollectionRefCollegeData);
            setCollegeDropdown(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            //  console.log(data);
        }
        catch (error) {
            console.log(error.message);
        }
        console.log("I executed");
    }

    const GetDocumentData = async () => {
        let q;
        try {
            if (dateorder === "Ascending") {
                q = query(userDataCollectionRefDocumentData, where('college', '==', college), orderBy("date", "asc"));
                const data = await getDocs(q);
                console.log(data);
                SetAllentry(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            }
            else if (dateorder === "Descending") {
                q = query(userDataCollectionRefDocumentData, where('college', '==', college), orderBy("date", "desc"));
                const data = await getDocs(q);
                console.log(data);
                SetAllentry(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            }
        }
        catch (error) {
            console.log(error)
        }
        console.log("i executed");
    };

    useEffect(() => {
        GetDocumentData();
    }, [dateorder, college])

    return (
        <div>
            <body>
                <section className="background-radial-gradient overflow-hidden">
                    <div className="container px-4 py-2 px-md-5 text-center text-lg-start my-5">
                        <div className="row gx-lg-5 align-items-center mb-5">
                            <div className="col-lg-600 mb-500 mb-lg-0" style={{ zIndex: "10" }}>
                                <div className="col-lg-600 mb-500 mb-lg-0 position-relative">
                                    <Card className='mt-0 mb-0'>
                                        <Card.Body>
                                            <Card.Title>Search for Research Papers by filtering colleges</Card.Title>
                                            <Form>
                                                {/* <Form.Label className="text-primary font-weight-bold">Select Country</Form.Label> */}
                                                <Form.Control className="mb-3" as="select" onClick={() => { GetCollegeData() }} onChange={(e) => { SetCollege(e.target.value) }} defaultValue="Choose.....">
                                                    <option>Select College</option>
                                                    {
                                                        collegeDropdown.map((curele) => {
                                                            return (
                                                                <option value={`${curele.college}`}>{curele.college}</option>
                                                            )
                                                        })
                                                    }
                                                </Form.Control>
                                                {/* <Form.Label className="text-primary font-weight-bold">Select Country</Form.Label> */}
                                                <Form.Control as="select" onChange={(e) => { SetDateOrder(e.target.value) }} defaultValue="Choose.....">
                                                    <option value="choose">Sort</option>
                                                    <option value="Ascending">Ascending</option>
                                                    <option value="Descending">Descending</option>
                                                </Form.Control>
                                            </Form>
                                        </Card.Body>
                                    </Card> <br /> <br />
                                    <div>
                                        {
                                            allEntry.map((curdata) => {
                                                return (
                                                    <div>
                                                        <Card className="text-center">
                                                            <Card.Header style={{ textTransform: "uppercase" }}><b><i>{curdata.title} - </i></b> <BsFillPersonFill/> {curdata.author} </Card.Header>
                                                            <Card.Body>
                                                                <Card.Text>{curdata.abstract}</Card.Text>
                                                                <Card.Text>{curdata.edition}th edition • {curdata.pages} Page(s) </Card.Text>
                                                                <Card.Text>{curdata.college} • {curdata.department}</Card.Text>
                                                                <a href={curdata.fileUrl} target="_blank" rel="noreferrer" download>Download {curdata.category}</a>
                                                            </Card.Body>
                                                            <Card.Footer className="text-muted">Category: {curdata.category} • Published by: {curdata.publisher} • Accepted on: {curdata.date} • Added by: {curdata.addedBy}  </Card.Footer>
                                                        </Card>
                                                        <br />
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        allEntry.length === 0 ? <div> . <br /> <br /> <br />  <br /> <br />  <br />  <br /> <br />. </div> : <></>
                    }
                </section>
            </body>
        </div>
    )
}

export default ShowDocument;