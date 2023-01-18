import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import React, { useState } from 'react';
import Nabvar from './Navbar';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import Registration from './Registration';
import AddDocument from './AddDocument';
import ShowDocument from './ShowDocument';
import MyActivity from './MyActivity';
import Statistics from './Statistics';
import HelpPage from './HelpPage';

function App() {
  // const [occupation, SetOccupation] = useState("");
  // const [college, SetCollege] = useState("");
  //   if(!occupation){
  //   console.log("Sorry");
  //   }
  //   else{
  //     console.log(occupation);
  //   }
  
  return (
    <Router>
      <div className="App">
        <Nabvar />
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/loginpage" element={<LoginPage />}/>
          <Route exact path="/registration" element={<Registration />}/>
          <Route exact path="/showdocument" element={<ShowDocument />}/>
          <Route exact path="/adddocument" element={<AddDocument />}/>
          <Route exact path="/myactivity" element={<MyActivity />}/>
          <Route exact path="/statistics" element={<Statistics />}/>
          <Route exact path="/help" element={<HelpPage />}/>
        </Routes>
      </div>
    </Router>

  );
}

export default App;
