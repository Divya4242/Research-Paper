import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, deleteUser } from "firebase/auth";
import { auth, db } from "./FireBase_Config";
import { collection, getDocs, query, where, doc, getDoc, deleteDoc, orderBy, updateDoc } from "firebase/firestore";
import Card from 'react-bootstrap/Card';
import { BsFillPersonFill } from "@react-icons/all-files/bs/BsFillPersonFill";

import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import './index.css';

function MyActivity() {
    const [userEmail, SetuserEmail] = useState("");
    const [EditStatus, SetEditStatus] = useState(false);
    const [allEntry, SetAllentry] = useState([]);
    const [author, SetAuthor] = useState("");
    const [title, SetTitle] = useState("");
    const [updateDocId, SetId] = useState("");
    const [modifiedDate, SetModifiedDate] = useState("");
    const [currentLoggedInUserName, SetName] = useState("");
    const [college, SetCollege] = useState("");
    const [department, SetDepartment] = useState("");
    const [publishedby, SetAddedBy] = useState("");
    const [dateorder, SetDateOrder] = useState("");
    const [date, SetDate] = useState("");
    const [category, SetCategory] = useState("");
    const [abstract, SetAbstarct] = useState("");
    const [edition, SetEdition] = useState("");
    const [totalVolume, SetTotalVolumes] = useState("");
    const [pages, SetPages] = useState("");
    const [chapterNumber, SetChapterNumber] = useState("");
    const [publisher, SetPublisher] = useState("");
    const userDataCollectionRefDocumentData = collection(db, "DocumentData");


    const navigate = useNavigate();
    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                SetuserEmail(user.email);
                SetName(user.displayName);
            }
            else {
                navigate("/loginpage");
            }
        })
    }, [userEmail])

    const GetMyData = async () => {
        console.log("yes");
        try {
            if (dateorder === "Ascending") {
                let q;
                q = query(userDataCollectionRefDocumentData, where('addedBy', '==', currentLoggedInUserName), orderBy("date", "asc"));
                const data = await getDocs(q);
                SetAllentry(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            }
            else if (dateorder === "Descending") {
                let q;
                q = query(userDataCollectionRefDocumentData, where('addedBy', '==', currentLoggedInUserName), orderBy("date", "desc"));
                const data = await getDocs(q);
                SetAllentry(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            }
        }
        catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        GetMyData();
    }, [dateorder])

    const UpdateData = async (id) => {
        let activityDetail = {};
        const docdata = doc(db, `DocumentData`, id);
        const docSnap = await getDoc(docdata);
        activityDetail = docSnap.data();
        console.log(activityDetail);
        SetAuthor(activityDetail.author);
        SetTitle(activityDetail.title);
        SetDepartment(activityDetail.department);
        SetAbstarct(activityDetail.abstract);
        SetPages(activityDetail.pages);
        SetCategory(activityDetail.category);
        SetEdition(activityDetail.edition);
        SetPublisher(activityDetail.publisher);
        SetTotalVolumes(activityDetail.totalVolume);
        SetCollege(activityDetail.college);
        SetDate(activityDetail.date);
        SetId(id);
        SetAddedBy(activityDetail.addedBy);
        SetEditStatus(true);
        if(activityDetail.hasOwnProperty("modifiedDate")){
            SetModifiedDate(activityDetail.modifiedDate);
        }
        else{
            SetModifiedDate(activityDetail.date);
        }
    }

    const DeleteData = async (id) => {
        const docdata = doc(db, "DocumentData", id);
        try {
            await deleteDoc(docdata);
            alert("Data deleted successfully");
            GetMyData();
        } catch (error) {
            console.log(error);
        }
    }

    const onUpdateData = async (e) => {
        e.preventDefault();
        const docdata = doc(db, `DocumentData`, updateDocId);
        let obj = {
            department: department,
            author: author,
            title: title,
            category: category,
            abstract: abstract,
            edition: edition,
            totalVolume: totalVolume,
            pages: pages,
            chapterNumber: chapterNumber,
            publisher: publisher,
            college: college,
            date: date,
            addedBy: currentLoggedInUserName
        }
        let modifieddate = new Date().toString();
        obj.modifiedDate = modifieddate.slice(4,15);
        obj.modifiedBy = currentLoggedInUserName;
        try {
            await updateDoc(docdata, Object.assign({}, obj));
            GetMyData();
            SetEditStatus(false);
        }
        catch (error) {
            console.log(error);
        }

    }

    return (
        <div>
            <section className="background-radial-gradient overflow-hidden">
                <div className="container px-4 py-3 px-md-5 text-center text-lg-start my-5">
                    <div className="row gx-lg-5 align-items-center mb-5">
                        <div className="col-lg-600 mb-500 mb-lg-0" style={{ zIndex: "10" }}>
                            <div className="col-lg-600 mb-500 mb-lg-0 position-relative">
                                <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
                                <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>
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
                                </Card> <br /> <br />
                                <div>
                                    {allEntry.length === 0 ? dateorder === "" ? <> </> :
                                        <Card className="text-center">
                                            <Card.Header>Oops! we can not find any document that were uploaded by you.</Card.Header>
                                        </Card> :
                                        allEntry.map((curdata) => {
                                            return (
                                                <div>
                                                    <Card className="text-center" key={curdata.key}>
                                                        <Card.Header style={{ textTransform: "uppercase" }}><b><i>{curdata.title} - </i></b> <BsFillPersonFill /> {curdata.author} </Card.Header>
                                                        <Card.Body>
                                                            <Card.Text>{curdata.abstract}</Card.Text>
                                                            <Card.Text>{curdata.edition}th edition • {curdata.pages} Page(s) </Card.Text>
                                                            <Card.Text>{curdata.college} • {curdata.department}</Card.Text>
                                                            <a href={curdata.fileUrl} target="_blank" download>Download {curdata.category}</a> <br /> <br />
                                                            <Button style={{ position: "relative", bottom: "10px" }} variant="primary" onClick={() => { UpdateData(curdata.id); }}>Edit</Button> &nbsp;&nbsp;&nbsp;
                                                            <Button style={{ position: "relative", bottom: "10px" }} variant="primary" onClick={() => { DeleteData(curdata.id); }}>Delete</Button>
                                                        </Card.Body>
                                                        <Card.Footer className="text-muted">Category: {curdata.category} • Published by: {curdata.publisher} • Accepted on: {curdata.date} • Added by: {curdata.addedBy} • {curdata.hasOwnProperty("modifiedDate") ? <span>Last modified: {curdata.modifiedDate}</span>: <span>Last modified: {curdata.date}</span> } </Card.Footer>
                                                    </Card>
                                                    <br />
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                {
                                    EditStatus ? <div>
                                        <div className="card bg-glass">
                                            <div className="card-body px-40 py-5 px-md-50">
                                                <form>
                                                <center><h1 style={{ position: "relative", bottom: "20px" }}>General Information</h1></center>
                                                    <div className="row">
                                                        <Form>
                                                            <Form.Control as="select" onChange={(e) => { SetCategory(e.target.value) }} defaultValue="Choose.....">
                                                                <option value="choose">Select Category</option>
                                                                <option value="Book">Book</option>
                                                                <option value="Book Chapter">Book Chapter</option>
                                                                <option value="Conference Paper">Conference Paper</option>
                                                                <option value="Journal Article">Journal Article</option>
                                                                <option value="Research Paper">Research Paper</option>
                                                            </Form.Control>
                                                        </Form> <br /> <br /> <br />
                                                        <div className="col-md-6 mb-4">
                                                            <div className="form-outline">
                                                                <input required="true" type="text" onChange={(e) => { SetTitle(e.target.value) }} value={title} id="titlein" placeholder="Example: Nutritional immunology" className="form-control" />
                                                                <label className="form-label" htmlFor="titlein">Title <span style={{ color: "red" }}>*</span></label>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mb-4">
                                                            <div className="form-outline">
                                                                <textarea type="text" onChange={(e) => { SetAbstarct(e.target.value) }} value={abstract} id="daysin" placeholder="Example: Long-COVID is a syndrome characterized by debilitating symptoms that persist over 3 months after infection with the SARS-CoV-2 virus. It affects 15 to 33% of COVID-19 recovered patients and has no dedicated treatment. First, we found that β-caryophyllene and pregnenolone have a significant synergistic effect in the resolution of LPS-induced sepsis and inflammation in mice. Then we combined these two compounds with seven others and designed a unique dietary supplement formulation to alleviate long COVID inflammatory and neurological disorders. " className="form-control" />
                                                                <label className="form-label" htmlFor="daysin">Abstarct <span style={{ color: "red" }}>*</span></label>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mb-4">
                                                            <div className="form-outline">
                                                                <input disabled="true" type="date" onChange={(e) => { SetDate(e.target.value) }} value={date} id="datein" className="form-control" />
                                                                <label className="form-label" htmlFor="titlein">Date</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mb-4">
                                                            <div className="form-outline">
                                                                <input type="text" onChange={(e) => { SetAuthor(e.target.value) }} value={author} id="featuredin" placeholder="Example: Vida Abedi" className="form-control" />
                                                                <label className="form-label" htmlFor="featuredin">Author <span style={{ color: "red" }}>*</span></label>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mb-4">
                                                            <div className="form-outline">
                                                                <input type="text" onChange={(e) => { SetEdition(e.target.value) }} value={edition} id="daysin" placeholder="Example: 3" className="form-control" />
                                                                <label className="form-label" htmlFor="daysin">Edition </label>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mb-4">
                                                            <div className="form-outline">
                                                                <input type="text" onChange={(e) => { SetTotalVolumes(e.target.value) }} value={totalVolume} id="daysin" placeholder="Example: 7" className="form-control" />
                                                                <label className="form-label" htmlFor="daysin">Total Volume(s)</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mb-4">
                                                            <div className="form-outline">
                                                                <input type="text" onChange={(e) => { SetPages(e.target.value) }} value={pages} id="daysin" placeholder="Example: 20" className="form-control" />
                                                                <label className="form-label" htmlFor="daysin">Pages</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mb-4">
                                                            <div className="form-outline">
                                                                <input type="text" onChange={(e) => { SetPublisher(e.target.value) }} value={publisher} id="daysin" placeholder="Example: Journal Citation Reports" className="form-control" />
                                                                <label className="form-label" htmlFor="daysin">Publisher <span style={{ color: "red" }}>*</span></label>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mb-4">
                                                            <div className="form-outline">
                                                                <input disabled="true" type="text" value={college} id="descriptionin" className="form-control" />
                                                                <label className="form-label" htmlFor="descriptionin">College</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mb-4">
                                                            <div className="form-outline">
                                                                <input type="text" onChange={(e) => { SetDepartment(e.target.value) }} value={department} placeholder="Example: Information Technology" id="daysin" className="form-control" />
                                                                <label className="form-label" htmlFor="daysin">Department <span style={{ color: "red" }}>*</span></label>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mb-4">
                                                            <div className="form-outline">
                                                                <input type="text" disabled="true" value={currentLoggedInUserName} id="daysin" className="form-control" />
                                                                <label className="form-label" htmlFor="daysin">Will be added by</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button type="submit" onClick={(e) => onUpdateData(e)} className="btn btn-primary btn-block mb-4">
                                                        Post
                                                    </button>
                                                </form>
                                            </div>
                                        </div> </div> : <div> </div>
                                }

                            </div>
                        </div>
                    </div>
                </div>
                {
                    allEntry.length === 0 ? <div> . <br /> <br /> <br />  <br /> <br />  <br />  <br /> <br />. </div> : <></>
                }
            </section>
        </div>
    )
}

export default MyActivity;