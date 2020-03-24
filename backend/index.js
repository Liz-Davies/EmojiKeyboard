const http = require('http');
const fs = require('fs');
const path = require('path');
const hostname = '0.0.0.0';
const port = 8000;
const datFile = "emojiDat.csv"
const writeStream = fs.createWriteStream(datFile,{flags:"a"});

const PUBLIC_DIR = path.resolve("./public");


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

db.serialize(()=>{
  db.run('CREATE TABLE IF NOT EXISTS users (username text PRIMARY KEY,password text NOT NULL)',(err)=>{
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
          new Date(new Date(event_obj.time).getTime()+time_offset);
  let event_line = `${time}","${event_obj.username}","testWeb","emojiTextRandom","emojis","${event_obj.goal}","${event_obj.action}","${event_obj.data}"\n`;
  console.log(event_line);
  writeStream.write(event_line);

}
function getUser(username,callback){
  return db.get(`SELECT DISTINCT Username username, Password password
        from users
        where Username=?;`,[username],(err,row)=>{
          if(err)console.error(`An error occured while retrieving from database\nFound Error:\n${err.message}`)
          callback(err,row)
        });
}
function insertUser(username,password,callback){
  var return_val = false;
  return db.run(`INSERT INTO users(username,password) VALUES(?,?);`,[username,password],(err)=>{
    if(err) {
      console.error(
`An error occured while creating user
Found Error:
${err.message}`);
      callback(err);
    }
    callback();
  });
}
function resetPassword(username,old_password,new_password){
  var changes= db.run(`UPDATE employees
SET password = "?"
WHERE username = "?" AND password = "?";`[new_password,username,old_password],
    (err)=>{
      if(err){
        console.err(err.message);
      }else{
        return this.changes;
      }
    });
}

function loginUser(req,res,raw_data){
  let data = JSON.parse(raw_data);
  var event_data = {
    time:new Date(),
    username:data.username,
    goal:"login"
  }
  getUser(data.username,(err,user)=>{
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

function createUser(req,res,raw_data){
  let data = JSON.parse(raw_data);
  if(data.client_events){
    //offset attempts to standardize client time with server time
    let time_offset = Date.now().getTime()- new Date(data.client_events[data.client_events.length-1].time).getTime();
    data.client_events.forEach((item)=>{
      writeEventToFile(item,time_offset);
    });
  }
  var event_data = {
    time:new Date(),
    username:data.username,
    goal:"create"
  }
  event_data.data=`${data.username}:${data.password}`
  insertUser(data.username,data.password,(err)=>{
    if(err){
      event_data.action="fail"
      writeEventToFile(event_data);
      res.writeHead(400);
      res.end("Failed to create user");
      console.log(res.status_code);
    }else{
      event_data.action="success"
      event_data.data=`${data.username}:${data.password}`
      writeEventToFile(event_data);
      res.writeHead(200);
      res.end();
    }
  });
}
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
    goal:"practice"
  }
  getUser(data.username,(err,user)=>{
    if(err){
      event_data.action="db_err";
      res.writeHead(500);
      event_data.data=err.message;
      writeEventToFile(event_data);
    }else if(user){
      console.log(user);
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

function handlePost(req,res){
  var data = "";
  req.on('data',(dat)=>{data+=dat});
  req.on('end',()=>{
    console.log(data)
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

const server = http.createServer((req, res) => {
  console.log(`Recieved ${req.method} request for: ${req.url}`);
  if(req.method === "POST"){
    handlePost(req,res);
  }else if(req.method === "GET"){
    handleGet(req,res);
    res.statusCode=404
  }else{
    res.statusCode=405;
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
