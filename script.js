// (3) Add your name and ID to the first line of JavaScript  
// Your Name - Your ID  
  
const sqlite3 = require('sqlite3').verbose();  
const os = require('os');  
const util = require('util');  
const exec = util.promisify(require('child_process').exec);  

console.log('姓名:JAY-JAYMZ  ID:223190722');  
  
// Create a new SQLite database or connect to an existing one  
const db = new sqlite3.Database('./books.db', (err) => {  
  if (err) {  
    console.error(err.message);  
  }  
  console.log('Connected to the books database.');  
});  
  
// Function to insert a book record into the database  
const insertBook = async (title, author, ISBN, context) => {  
  const sql = 'INSERT INTO books (title, author, ISBN, context) VALUES (?, ?, ?, ?)';  
  try {  
    await new Promise((resolve, reject) => {  
      db.run(sql, [title, author, ISBN, context], function (err) {  
        if (err) {  
          reject(err);  
        } else {  
          resolve();  
        }  
      });  
    });  
    console.log('Book record inserted successfully.');  
  } catch (error) {  
    console.error('Error inserting book record:', error);  
  }  
};  
  
// Function to retrieve all book records from the database  
const listBooks = async () => {  
  const sql = 'SELECT * FROM books';  
  try {  
    const data = await new Promise((resolve, reject) => {  
      db.all(sql, [], (err, rows) => {  
        if (err) {  
          reject(err);  
        } else {  
          resolve(rows);  
        }  
      });  
    });  
    console.log('Book records:');  
    data.forEach((row) => {  
      console.log(row.id, row.title, row.author, row.ISBN, row.context);  
    });  
  } catch (error) {  
    console.error('Error retrieving book records:', error);  
  }  
};  
  
// Function to get the machine's MAC address and IP address  
const getMachineInfo = async () => {  
  try {  
    const { stdout: macAddress } = await exec('getmac'); // Note: This command might vary depending on the operating system  
    const { stdout: ipAddress } = await exec('hostname -I | awk \'{print $1}\''); // Note: This command might vary depending on the operating system  
    console.log('MAC Address:', macAddress.trim());  
    console.log('IP Address:', ipAddress.trim());  
  } catch (error) {  
    console.error('Error getting machine info:', error);  
  }  
};  
  
// Create the books table if it doesn't exist  
db.serialize(() => {  
  db.run('CREATE TABLE IF NOT EXISTS books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, author TEXT, ISBN TEXT, context TEXT)');  
});  
  
// Prompt the user to enter book details and insert records  
const promptUser = async () => {  
  let continueInputting = true;  
  while (continueInputting) {  
    console.log('Enter book details:');  
    const title = await getInput('Title: ');  
    const author = await getInput('Author: ');  
    const ISBN = await getInput('ISBN: ');  
    const context = await getInput('Context: ');  
    await insertBook(title, author, ISBN, context);  
    console.log('Book record inserted successfully.');  
  
    // Ask the user if they want to continue inputting book details  
    const shouldContinue = await getInput('Do you want to continue inputting book details? (yes/no): ');  
    continueInputting = shouldContinue.toLowerCase() === 'yes';  
  }  
}; 
  
// Helper function to get user input from the console  
const getInput = (question) => {  
  const readline = require('readline').createInterface({  
    input: process.stdin,  
    output: process.stdout,  
  });  
  return new Promise((resolve) => {  
    readline.question(question, (input) => {  
      readline.close();  
      resolve(input);  
    });  
  });  
};  
  
// Main program logic  
(async () => {  
  await promptUser(); // Prompt the user to enter book details and insert records  
  await listBooks(); // List all book records from the database  
  await getMachineInfo(); // Print the machine's MAC address and IP address  
})();  
  
