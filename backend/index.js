const http = require('http');
const fs = require('fs');
const path = require('path');
const hostname = 'localhost';
const port = 8080;
const datFile = "emojiDat.csv"
const writeStream = fs.createWriteStream(datFile,{flags:"a"});

const PUBLIC_DIR = path.resolve("./public");

//open database
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("./users.db",
      (err)=>{
        if(err){
          console.error(
`An error occured while attempting to connect to the database
Found Error:
${err.message}`)
          process.exit(1);
      }
      console.log("Connected to database");
});

function closeAndExit(status){
  if(db!=null)db.close();
  if(server!=null)server.close();
  process.exit(1);
}
//create table if it does not yet exist
db.serialize(()=>{
  db.run(`CREATE TABLE IF NOT EXISTS users (
      username TEXT NOT NULL,
      website TEXT NOT NULL,
      password TEXT NOT NULL,
      PRIMARY KEY (username, website)
  );`,(err)=>{
    if(err){
      console.error(err);
      closeAndExit(1);
    }
  });

});

/*
writeEventToFile
event_data : an object with the data from the event. Must include the following
  time, username, goal, action, data
time_offset (optional) : the time offset (for events submitted from the frontend)
*/
function writeEventToFile(event_obj,time_offset=0){
  var time = time_offset === 0 ?
          new Date(event_obj.time):
          new Date((new Date(event_obj.time)).getTime()+time_offset);
  let event_line = `${time}","${event_obj.username}","${event_obj.website}","emojiTextRandom","emojis","${event_obj.goal}","${event_obj.action}","${event_obj.data}"\n`;
  writeStream.write(event_line);

}
/*
getUser(username,website,callback)
    username: the username for the user
    website: the id for the website the user is associated with
    callback: a callback that decides what to do with the retrieved user
*/
function getUser(username,website,callback){
  return db.get(`SELECT DISTINCT Username username, Password password
        from users
        where Username=? AND Website=?;`,[username,website],(err,row)=>{
          if(err)console.error(`An error occured while retrieving from database\nFound Error:\n${err.message}`)
          callback(err,row)
        });
}
/*
insertUser(username,password,website,callback)
    username: the username for the user
    website: the id for the website the user is associated with
    password: password for the new user
    callback: a callback that confirms user creation
*/
function insertUser(username,password,website,callback){
  return db.run(`INSERT INTO users(username,password,website) VALUES(?,?,?);`,[username,password,website],callback);
}

/*
function handles the logic required for post requests to /login
loginUser(req,res,raw_data)
    req:        the request object
    res:        the response object
    raw_data:   the unparsed json object
*/
function loginUser(req,res,raw_data){
  let data = JSON.parse(raw_data);
  var event_data = {
    time:new Date(),
    username:data.username,
    website:data.website,
    goal:"login"
  }
  getUser(data.username,data.website,(err,user)=>{
    if(err){
      event_data.action="db_fail";
      res.writeHead(500);
      event_data.data=res.message;
      writeEventToFile(event_data);
    }else if(typeof(user)==="undefined"){
      event_data.action="fail";
      event_data.data="no_such_user"
      res.writeHead(404);
      writeEventToFile(event_data)
    }else if(user.password===data.password){
      event_data.data=`${data.password}:${user.password}`;
      event_data.action = "success";
      res.writeHead(200);
      writeEventToFile(event_data);
    }else{
      event_data.action="failure";
      event_data.data=`${data.password}:${user.password}`;
      res.writeHead(401);
      writeEventToFile(event_data);
    }
    res.end();
  });

}
/*
function handles the logic required for post requests to /create
createUser(req,res,raw_data)
    req:        the request object
    res:        the response object
    raw_data:   the unparsed json object
*/
function createUser(req,res,raw_data){
  let data = JSON.parse(raw_data);
  if(data.client_events){
    //offset attempts to standardize client time with server time
    let time_offset = Date.now() - (new Date(data.client_events[data.client_events.length-1].time)).getTime();
    data.client_events.forEach((item)=>{
      writeEventToFile(item,time_offset);
    });
  }
  var event_data = {
    time:new Date(),
    username:data.username,
    website:data.website,
    goal:"create"
  }
  event_data.data=`${data.username}:${data.password}`
  insertUser(data.username,data.password,data.website,(err)=>{
    if(err){
      event_data.action="fail";
      event_data.data=err.message;
      writeEventToFile(event_data);
      res.writeHead(400);
      res.end("Failed to create user");
    }else{
      event_data.action="success"
      event_data.data=`${data.username}:${data.password}`
      writeEventToFile(event_data);
      res.writeHead(200);
      res.end();
    }
  });
}
/*
function handles the logic required for post requests to /practice
loginPractice(req,res,raw_data)
    req:        the request object
    res:        the response object
    raw_data:   the unparsed json object
*/
function loginPractice(req,res,raw_data){
  let data = JSON.parse(raw_data);
  if(data.client_events){
    //offset attempts to standardize client time with server time
    let time_offset = Date.now()-data.client_events[data.client_events.length-1].time;
    data.client_events.forEach((item)=>{
      writeEventToFile(item,time_offset);
    });
  }
  var event_data = {
    time:new Date(),
    username:data.username,
    website:data.website,
    goal:"practice"
  }
  getUser(data.username,data.website,(err,user)=>{
    if(err){
      event_data.action="db_err";
      res.writeHead(500);
      event_data.data=err.message;
      writeEventToFile(event_data);
    }else if(user){
      event_data.data=`${data.password}:${user.password}`;
      if(user.password===data.password){
        event_data.action = "goodPractice";
        res.writeHead(200);
        writeEventToFile(event_data);
      }else{
        event_data.action="badPractice";
        res.writeHead(401);
        writeEventToFile(event_data);
      }
    }else{
      event_data.action="no_user";
      res.writeHead(404);
      writeEventToFile(event_data);
    }
    res.end();
  });
}

/*
function handles the logic required to collect data associated
with a post request
collects data and then when data is finished transmission it acts as a
dispatcher, calling the appropriate function for each path.
handle(req,res)
    req:        the request object
    res:        the response object
    raw_data:   the unparsed json object
*/
function handlePost(req,res){
  var data = "";
  req.on('data',(dat)=>{data+=dat});
  req.on('end',()=>{
    if(req.url === "/login"){
      loginUser(req,res,data);
    }else if(req.url === "/create"){
      createUser(req,res,data);
    }else if(req.url ==="/practice"){
      loginPractice(req,res,data);
    }else{
      res.writeHead(404);
      res.end();
    }
  });
}
/*
function handles get requests. It fetches files and resources from the public
folder and serves it to the client. It does have protection for requests for
files made below the public folder.
*/
function handleGet(req,res){
  filePath = path.join(PUBLIC_DIR,(req.url==="" || req.url==="/")? "/index.html" : req.url);
  if(filePath.indexOf(PUBLIC_DIR)!=0) {
    res.writeHead(404);
    res.end('No');
    return;
  }
  var ext = path.extname(filePath);
  var contentType;
  switch (ext) {
    case '.js':
       contentType = 'text/javascript';
       break;
    case '.css':
       contentType = 'text/css';
       break;
    case '.json':
       contentType = 'application/json';
       break;
    case '.png':
       contentType = 'image/png';
       break;
    case '.jpg':
       contentType = 'image/jpg';
       break;
    case '.wav':
       contentType = 'audio/wav';
       break;
    default:
       contentType='text/html';
 }

 fs.readFile(filePath, function(error, content) {
     if (error) {
       if(error.code == 'ENOENT'){
         res.writeHead(404);
         res.end("File Not Found", 'utf-8');
       }
       else {
         res.writeHead(500);
         res.end('Server Error: '+error.code+' ..\n');
         res.end();
       }
     }
     else {
       res.writeHead(200, { 'Content-Type': contentType });
       res.end(content, 'utf-8');
     }
   });
}
//create server. Simple call back dispatches to the method handler functions
const server = http.createServer((req, res) => {
  console.log(`Recieved ${req.method} request for: ${req.url}`);
  if(req.method === "POST"){
    handlePost(req,res);
  }else if(req.method === "GET"){
    handleGet(req,res);
  }else{
    res.statusCode=405;
    res.end();
  }
});


//start server
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
