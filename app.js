const express = require("express");
const multer = require("multer");
const ejs = require("ejs");
const path = require("path");

//Set storage engine
const storage = multer.diskStorage({
    destination: "./public/uploads",
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));

    }
})

//Init upload
const upload = multer({
    storage: storage,
    limits: {fileSize: 1000000},
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single("myImage");

//check file type
function checkFileType(file, cb) {
//allowed ext
const fileTypes = /jpeg|jpg|png|gif/;
//check ext
const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

//check mime type
const mimeType = fileTypes.test(file.mimetype);

if(mimeType && extname){
    return cb(null, true);
} else {
    return cb("Error: Invalid filetype");
}
}

const app = express();
//EJS
app.set("view engine" , "ejs");

// Public Folder
app.use(express.static("./public"));

app.get("/", (req, res) => res.render("index"));
const port = 3000;

app.post("/upload", (req, res) => {
    upload(req, res, (err) =>{
        if(err) {
            res.render("index", {
                msg: err
            })
        } else {
            if(req.file == undefined) {
                res.render("index", {
                    msg: "Error: No file selected"
                })

            } else {
                res.render("index", {
                    msg: "File Upload Success!",
                    file: `/uploads/${req.file.filename}`
                })
            }
        }
    })
})

 app.listen(port, () => console.log(`server started on port ${port}`));
