const sqlite3 = require('sqlite3').verbose();  
  
// Open the database  
let db = new sqlite3.Database('./books.db', (err) => {  
    if (err) {  
        return console.error(err.message);  
    }  
    console.log('Connected to the SQLite database.');  
  
    // Read from the table  
    let sql = 'SELECT * FROM books'; // Assuming your table name is "book_details"  
    db.all(sql, [], (err, rows) => {  
        if (err) {  
            return console.error(err.message);  
        }  
        rows.forEach((row) => {  
            console.log(row); // This will print each row from the table  
        });  
    });  
});  
  
// Close the database connection when done  
db.close((err) => {  
    if (err) {  
        return console.error(err.message);  
    }  
    console.log('Closed the database connection.');  
});