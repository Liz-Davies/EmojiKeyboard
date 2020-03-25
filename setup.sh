

function init(){
  cd frontend
  npm install
  npm run build
  cd ../backend
  npm install
  cp -r ../frontend/build public
  cd ..
}
function refresh(){
  rm -r backend/public/*
  echo "Cleaning old files"
  cd frontend
  npm run build
  cd ..
  cp -r frontend/build/* backend/public/.
  echo "New files in place"
}
function run(){
  cd backend
  node index.js
  cd ..
}
function getOutput(){
  cat backend/emojiDat.csv
}
function archiveOutput(){
  mv "backend/emojiDat.csv" "backend/emojiDat.$(date +%F).CSV"
}

if [[ "$1" == "init" ]]; then
  init
elif [[ "$1" == "refresh" ]]; then
  refresh
elif [[ "$1" == "run" ]]; then
  run
elif [[ "$1" == "archive" ]]; then
  archiveOutput
else
  echo "init - install and setup front and back ends"
  echo "refresh - refresh the front end compact build"
  echo "run - run the server"
  echo "archive - move the outputFile to a time stamped out putfile"
  echo "    do before playing to ensure testing data isn't mixed with practice"
  echo "help - display this message"
fi
