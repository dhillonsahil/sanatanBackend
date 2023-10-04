const express = require('express');
const router = express.Router();
const connection = require('../db');
const multer = require('multer');
const path = require('path');

//  Insert Books in the database
router.post("/addCategory", async (req, res) => {
    // insert command
    try {
        const result = await connection.execute(`insert into category (category_name,image) values(? , ?)`, [req.body.categoryName,req.body.image]);
        res.send({ success: "true" })
    } catch (error) {
        res.send({ success: "false" })
    }
    //
})



// get all the categories
router.get('/getCategories', async (req, res) => {
    connection.query(
        'select * from category',
        function (err, results, fields) {
            res.send(results)
        }
    );

})

// get recommended books
router.get('/getrecommended', async (req, res) => {
    connection.query(
        'select * from recommended',
        function (err, results, fields) {
            res.send(results)
        }
    );

})
// get all books under that category
router.post('/getBooks', async (req, res) => {
    const quer =`select * from ${req.body.categoryName}`;
    connection.query(
        quer,
        function (err, results, fields) {
            res.send(results)
        }
    );
})

// create book for the category :- input name , category name , languages and Book Links as a json;
router.post('/addbook', async (req, res) => {
    // 1st create the table for that category if it does not exists

    try {

        const createTableSQL = `
    CREATE TABLE IF NOT EXISTS ${req.body.categoryName} (
        id INT PRIMARY KEY AUTO_INCREMENT,
        book_name VARCHAR(50),
        category_name VARCHAR(50),image varchar(200),
        available_books JSON NOT NULL, foreign key (category_name) references category(category_name)
    )
`;

        const result = await connection.execute(createTableSQL);

        const insertBookSQL = `
    INSERT INTO ${req.body.categoryName} (book_name,category_name, available_books,image)
    VALUES (?, ?,?,?)
`;

        const res2 = await connection.execute(insertBookSQL, [req.body.bookName,req.body.categoryName, req.body.availableBooks,req.body.image]);

        res.send({ success: "true" })
    } catch (error) {
        res.send({ success: "false" })

    }
})

//  Upload Image to server and return url of image on server to store in mysql

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
  });
  const upload = multer({ storage });
  
// 
router.post('/imagetest', upload.single('image'), (req, res) => {
    
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    const imageUrl = `http://192.168.101.190:5001/uploads/${req.file.filename}`;

    res.json({ imageUrl });
  });
  
  router.post('/uploadpdf', upload.single('pdf'), (req, res) => {
    
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    const pdfUrl = `http://192.168.101.190:5001/uploads/${req.file.filename}`;

    res.json({ pdfUrl });
  });
  



module.exports = router;