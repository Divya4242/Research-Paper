const express = require('express');
const app = express();
const router = express.Router();

var admin = require('firebase-admin');
var appp = admin.initializeApp({
    credential: admin.credential.cert('F:/MERN Learning/server/ServiceKey.json')
});
const db = appp.firestore();
let defaultAuth = admin.auth();

router.post('/register', async (req, res) => {
    try {
        const newid = req.body.newid;
        console.log(newid);
        await defaultAuth.deleteUser(`${newid}`);
        try{
            await db.collection('FacultyData').doc(`${newid}`).delete();
            console.log("Data deleted successfully");
        }
        catch (error) {
            console.log(error);
        }
    }
    catch (error) {
        console.log(error);
    }
})

module.exports = router;
