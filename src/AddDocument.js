import React, { useState, useEffect } from "react";
import ProgressBar from 'react-bootstrap/ProgressBar';
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./FireBase_Config";
import { collection, addDoc } from "firebase/firestore";
import { Form } from 'react-bootstrap';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import './index.css';


function AddDocument() {
    const [userName, SetuserName] = useState("");
    const [author, SetAuthor] = useState("");
    const [title, SetTitle] = useState("");
    const [file, setFile] = useState()
    const [college, SetCollege] = useState("");
    const [department, SetDepartment] = useState("");
    const [date, SetDate] = useState("");
    const [status, SetStatus] = useState("");
    const [category, SetCategory] = useState("");
    const [abstract, SetAbstarct] = useState("");
    const [edition, SetEdition] = useState("");
    const [totalVolume, SetTotalVolumes] = useState("");
    const [pages, SetPages] = useState("");
    const [chapterNumber, SetChapterNumber] = useState("");
    const [publisher, SetPublisher] = useState("");
    const [show, setShow] = useState(false);
    const [UploadProgress, SetUploadProgress] = useState(0);
    const userDataCollectionRefDocumentData = collection(db, "DocumentData");

    const navigate = useNavigate();
    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                SetuserName(user.displayName);
                const occu = localStorage.getItem("Occupation");
                console.log(occu)
                SetCollege(localStorage.getItem("College"));
                if (occu === "Admin") {
                    console.log("Access allowed admin");
                    SetStatus("Approved")
                }
                else if (occu === "Faculty") {
                    console.log("Access allowed Faculty");
                    SetStatus("Pending")
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
    }, [userName])
    var mydata = {};
    const CreateData = async (e) => {
        e.preventDefault();
        console.log(e);
        console.log(file);
        const getFileUploadedPath = await uploadfile();
        console.log("---------------------------------------");
        console.log("---------------------------------------");
        console.log(getFileUploadedPath);
        console.log("---------------------------------------");
        console.log("---------------------------------------");
        if (author && title && college && department && date) {
            mydata = {
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
                fileUrl: getFileUploadedPath,
                addedBy: userName,
                dstatus: status
            }
            try {
                await addDoc(userDataCollectionRefDocumentData, mydata);
                setShow(true);
                SetUploadProgress(0)
                //alert("Data added Successfully");
            }
            catch (error) {
                console.log(error);
            }
            SetAuthor(""); SetCollege(""); setFile(); SetTitle(""); SetDepartment(""); SetDate(""); SetEdition(""); SetAbstarct(""); SetCategory(""); SetPages(""); SetPublisher("");
            console.log(mydata);
        }
        else {
            alert("Please Fill the Form");
        }
    }

    const uploadfile = () => {
        return new Promise((resolve, reject) => {
            const storage = getStorage();
            const storageRef = ref(storage, `${college}/${file.name}`);

            const uploadTask = uploadBytesResumable(storageRef, file);

            // Register three observers:
            // 1. 'state_changed' observer, called any time the state changes
            // 2. Error observer, called on failure
            // 3. Completion observer, called on successful completion
            uploadTask.on('state_changed',
                (snapshot) => {
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    SetUploadProgress(progress);
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                    }
                },
                (error) => {
                    // Handle unsuccessful uploads
                    console.log("rejected rejected rejected");
                    reject();
                },
                () => {
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log('File available at', downloadURL);
                        resolve(downloadURL);
                    });
                }
            );
        })
    }


    function handleChange(event) {
        console.log(event.target.files[0]);
        setFile(event.target.files[0]);
    }

    return (
        <div>
            <body>
                <section className="background-radial-gradient overflow-hidden">
                    <div className="container px-4 py-3 px-md-5 text-center text-lg-start my-5">
                        <div className="row gx-lg-5 align-items-center mb-5">
                            <div className="col-lg-600 mb-500 mb-lg-0" style={{ zIndex: "10" }}>
                                <div className="col-lg-600 mb-500 mb-lg-0 position-relative">
                                    <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
                                    <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>
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
                                                            <input type="date" onChange={(e) => { SetDate(e.target.value) }} value={date} id="datein" className="form-control" />
                                                            <label className="form-label" htmlFor="titlein">Date <span style={{ color: "red" }}>*</span></label>
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
                                                            <label className="form-label" htmlFor="daysin">Edition</label>
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
                                                    {
                                                        category === "Book Chapter" ?
                                                            <div className="col-md-6 mb-4">
                                                                <div className="form-outline">
                                                                    <input type="text" onChange={(e) => { SetChapterNumber(e.target.value) }} value={chapterNumber} id="daysin" placeholder="Example: 3" className="form-control" />
                                                                    <label className="form-label" htmlFor="daysin">Chapter Number <span style={{ color: "red" }}>*</span></label>
                                                                </div>
                                                            </div> : <> </>
                                                    }
                                                    <div className="col-md-6 mb-4">
                                                        <div className="form-outline">
                                                            <input type="text" onChange={(e) => { SetPublisher(e.target.value) }} value={publisher} id="daysin" placeholder="Example: Journal Citation Reports / John" className="form-control" />
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
                                                            <input type="file" onChange={handleChange} className="form-control" />
                                                            <label className="form-label" htmlFor="daysin">Document <span style={{ color: "red" }}>*</span></label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6 mb-4">
                                                        <div className="form-outline">
                                                            <input type="text" disabled="true" value={userName} id="daysin" className="form-control" />
                                                            <label className="form-label" htmlFor="daysin">Will be added by</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <ProgressBar animated now={UploadProgress} variant="success" label={`Data uploaded ${UploadProgress}%`} />
                                                <button type="submit" onClick={(e) => { CreateData(e); }} className="btn btn-primary btn-block mb-4">
                                                    Post
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </body>
            <ToastContainer position="top-center" className="p-3">
                <Toast bg="primary" onClose={() => setShow(false)} show={show} delay={7000} autohide>
                    <Toast.Header>
                        <strong className="me-auto">React JS</strong>
                        <small className="text-muted">just now</small>
                    </Toast.Header>
                    <Toast.Body>Data Successfully added.</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    )
}

export default AddDocument;