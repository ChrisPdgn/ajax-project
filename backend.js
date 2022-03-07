const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./books.sqlite3');

app.use(express.static('.'));
app.use(bodyParser.json());

app.get('/books/:keyword', function(req, res){
    const foundBooks = [];
    bookResult(req,foundBooks);
    setTimeout(function(){
        res.send(foundBooks);}, 2000);
});

app.post('/books/', function(req, res){
    var str = JSON.stringify(req.body);
    var book = JSON.parse(str);
    console.log(book);
    db.run(`INSERT INTO books VALUES(?,?,?,?,?)`, [null,book.author,book.title,book.genre,book.price], function(err) {
        if (err) {
            res.json('{ success: false }');
        }else{
            res.json('{ success: true }');
        }
      });
});

function bookResult(req, foundBooks){
    db.all("SELECT * FROM books", [], (err,rows) => {
        if(err)
            throw err;
        rows.forEach((row) => {
            var dbBook = {
                "id": row.id,
                "author": row.author,
                "title": row.title,
                "genre": row.genre,
                "price": row.price
            };
            if(dbBook.title.includes(req.params.keyword)){
                foundBooks.push(dbBook);
                console.log("success");
            }
        });
    });
}


app.listen(3000);