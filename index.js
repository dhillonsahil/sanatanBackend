const express = require('express');
const connection = require('./db');
const app = express()
const port = 5001 || process.env.PORT;

// ADD THIS
var cors = require('cors');
app.use(cors());

app.use('/uploads', express.static('uploads'));


app.use(express.json())

app.get('/', (req, res) => {
    res.send('hello world')
  })

app.listen(port , async()=>{
    console.log(`TakemyNote app listening at http://localhost:${port}`)
    try {
        await connection.connect(()=>{
            console.log("Connected to database")
        });
    } catch (error) {
        console.log("Error")
    }
})



app.use('/api/getbook/',require('./routes/books'))