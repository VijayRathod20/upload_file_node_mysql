const express = require('express');
const app = express();
const mysql = require('mysql2');
const multer = require('multer');
const ejs = require('ejs');
app.set("view engine","ejs");
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
const path = require('path');
var fs = require('fs');
app.use(express.static('./public'))

// parse application/json
app.use(bodyParser.json())

const conn = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"twitter_clone"
});
conn.connect(function(err){
    if(err) throw err;
    console.log("connected");
});

app.get('/',async(req,res)=>{
    const sql = `select * from tweets`;
    conn.query (sql,(err,file)=>{
        console.log(file);
        res.render('tweet',{file});
    });
    
})

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./public/uploads')
    },
    filename:(req,file,cb)=>{
        console.log(file);
        cb(null,Date.now() + path.extname(file.originalname));

    }
})
const upload = multer({storage:storage});

app.post("/tweet",upload.single('media'),(req,res)=>{
    const file = req.file;
  const filename = file.originalname;
  const filepath = file.path;
  console.log(file);
  console.log(filename);
  console.log(filepath);
  var imgsrc = 'http://127.0.0.1:3000/uploads/' + req.file.filename;

  const sql = 'INSERT INTO tweets (tweet_text, media) VALUES (?, ?)';
  const data = [filename, imgsrc];
  conn.query(sql,data);
    
})
app.listen(3000);