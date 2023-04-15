const express = require('express');
const app = express();

app.use(express.json());
app.use(require('./router/register'));
console.log("Server started");
app.get('/',(req,res)=>{
        res.send("Hello");
})

app.listen(4000); 
