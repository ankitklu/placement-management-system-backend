const express= require('express');
const cors= require('cors');
const {MongoClient} = require('mongodb')
const bcrypt = require('bcrypt');

const app = new express();
app.use(express.json());        //string-> json

//client is running in port 3000
//any third part application can be served, if the cors is enabled
app.use(cors());

const client = new MongoClient('mongodb+srv://admin1:admin1@cluster0.crdqzyr.mongodb.net/?retryWrites=true&w=majority');
client.connect();
//outer circle is cluster
//inside circle is database
//inside database is collection {which is similar to mysql table}
//inside collection is document {which is similar to mySql table row or records}
const db= client.db("skill") 
const col= db.collection("user")
const col2= db.collection("placement")

 

// from browser, the default url triggering it get method
//localhost:8081/home
//two parameters, 1.Address 2.Action/ service function
app.get('/home', (req,res)=>{
    res.send("It is a homepage - New page");
});

app.post('/insert', async (req, res)=>{
    //every request will have header and body section
    //req= {header:....., body: actual_data}
    req.body.password = await bcrypt.hash(req.body.password, 5)
    console.log(req.body);
    col.insertOne(req.body);
    res.send("data received");
})

app.post('/check', async(req, res) =>{
    console.log(req.body);
    //you can give many key value pairs , every key value is a condition
    //every key is a database column name which will check fo rcorresponding value
    var result= await col.findOne({"name":req.body.un})
    if(result !== null){
        if(await bcrypt.compare(req.body.pw, result.password)){
            res.send(result);
        }
        else{
            res.send("fail");
        }
    }
    else{
        res.send("fail");
    }  
})

app.get('/show', async(req, res)=>{
    var result = await col.find().toArray();
    console.log(result);
    res.send(result);
})

app.post('/entry', (req, res)=>{
    console.log(req.body);
    col2.insertOne(req.body);
    res.send("Successfully Inserted");
})

app.put('/entry',(req,res) => {
    console.log(req.body);
    var doc ={
        $set: {
            sname: req.body.sname,
            pstatus:req.body.pstatus,
            scompany: req.body.scompany,
            sctc: req.body.sctc
        }
    }
    col2.updateOne({sid: req.body.sid}, doc)
    res.send("Updated successfully")
})

app.get('/display', async(req,res)=>{
    var result = await col2.find().toArray();
    res.send(result);
})

app.delete('/delete',async(req,res)=>{
    console.log(req.query)
    await col2.deleteOne({
        sid:req.query.id
    });
    res.send("deleted");
})
 
app.listen(8081); 
console.log("Server running");  