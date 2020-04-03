# EmojiKeyboard
Team: A Funny Name
Authors: Sarah Elizabeth "Liz" Davies

Note: This is my first React project. My state management and jsx may not always been the cleanest. Have mercy.

# Setup Instructions
## Mac or Linux Terminal
```bash
./setup.sh init
./setup.sh run
```
## Windows Command Prompt
```
cd frontend
npm install
npm run build
cd ../backend
npm install
copy ../frontend/build public
node index.js
```
# Components
## Frontend vs backend
To facilitate the emoji keyboard and maximize reuse we decided to use a react front end. Because of this decision the frontend and the backend we separated with the compiled/generated front end being placed in the public file of the backend on setup.

## Frontend Components
### EmojiKeyboard (components/emoji-keyboard.js)
The core components are stored in the file. The keyboard renders key rows and the key rows render keys. The config for what keys appear in which rows and which emojis appear on which keys appears in a short config at the top of the file. Because of shared details the EmojiPasswordGenerator is also written here. This file also imports the css page which imports selected font (Noto-Emoji) so that the font is always carried with the component.

### Form Components (components/form-components.js)
The emoji components are formed into larger form components here. The password form is reused for both the practice login and login pages with slight prop changes. The new user form uses the emoji generator.

### App (App.js)
The entire component is technically a one page app. Logic and components for opening and switching between the "New User" and "Login" pages is defined here.

### Other
Remaining js files are provided by the react start up

## Backend
The backend is a Node.js Http server with an SQL database to manage users and user passwords. It logs directly to a csv file, emojiDat.csv that is formatted as closely to the csvs from part 1 as was reasonably possible.

The database is a single table of users. The table rows are comprised of (username, website, password) with PK(username,website). This means there is allowed to be only one instance of a username per website but the username can (and will) be reused across all three websites. The password is a text field. This would be a major security violation in a true login scheme. Since this does not hold a user's actual passwords this was seen as acceptable. The decision was made so that the "correct" password would be visible in comparison to the "submitted" password in the logfile's data field.

The backend is a single file server. The server makes the distinction between GET requests to fetch pages and resources and POST requests for login and create user requests.

Post request accept JSON objects that may or may not have a list of client events (events that were tracked in the front end and submitted upon submit). To accommodate a difference in client time and server time the server assumes the last event (usually submit) happened nearly instantaneously in the past and offsets the time for client events by that degree. This is obviously not an ideal method, but will be a good approximation and will account for clients whose time is off by minutes or event days.

# Event Data Format(s)
### JSON Client Events
```JSON
{  
    "time": "[Date]",  
    "action":"[start | submit | passAccept | passRegen | key_input | input_change | button_click ]",
    "goal":"[create | login]",
    "website":"[mr-banks | shop-frands | kwazy]",
    "data":"data"
}  
```
### Existing CSV
"Date","username","Website","scheme?","PicId?","Event_State","Event","Data"    

### Existing Events (To Mimic)
|Events Category|Events||||||||||||
|---|---|---|---|---|---|---|---|---|---|---|---|---|
|**create**|start|picChange|picAccept|Password|order inputPwd|goodPractice|hidePassword|PwdDisplay|badPractice|showPassword|createClear|help|
|**enter**|start|order inputPwd|goodLogin|badLogin|enterClear||||||||
|**reset**|resetdone|resetask|||||||||||
|**login**|success|failure||||||||||||

# Emoji Library
## Suggestions by team mate
|||
|-|-|
|Ben |🌵🌶️🍒👾🤖🐞🐖🍺🧦|  
|Essam |🍻❄️🎃🎱💎👑🌲🌙💨💦🍦☕🎿🗿🎬🥊|
|Jacy |🐶🔥🌧️⚽☄️🌧️🚗🌻🎵|
|Liz |🌸🚀🍉💡🦄🔑🎀🥇💌👁️🤟|
|good extras |♣️♦️♠️♥️🐱|

## Suggestions by topic
|Topic|Emojis|Emojis After Replacements|
|-|-|-|
|travel | 🌵🚗🗿|🌵🚗🗿|
|sport | 🎱⚽🎿🥊🥇|🎱⚽🎿🎲🏆|
|animals | 🦄🐶🐞🐖🐱|🐼🐧🐞🐖🐱|
|food | 🍉🌶️🍒🍦☕|🍉🍍🍒🍺🍦☕|
|seasons | ❄️🎃🌸🌻|❄️🎃🌸🍁🌲|
|weather | 🌧️💨❄️|☔️💨❄️|
|movies | 🎬📽️🎵|🎬🎥️🎵|
|fantasy | 👑💎🦄|👑💎|
|space/scifi | 👾🤖🚀🌙☄️| 🌃🔭🚀🌙☄️|
|home | 🔑💡🏠|🔑💡🏠💌📫|
|cards | ♣️♦️♠️♥️|♣️♦️♠️♥️|
|other | 💌🧦||

## Final Key Mapping
|Key|Emoji|
|-|-|
|0|🍁|
|1|🌵|
|2|🚗|
|3|🗿|
|4|🎲|
|5|⚽|
|6|🎿|
|7|🐧|
|8|🐱|
|9|🌸|
|-|🎃|
|=|🌲|
|q|🍉|
|w|🍍|
|e|️🍒|
|r|🎱|
|t|🏆|
|y|🐞|
|u|️🐼|
|i|🐖|
|o|💨|
|p|☔️|
|[|❄️|
|]|🎀|
|a|🍦|
|s|🍺|
|d|☕|
|f|🎬|
|g|📽️️|
|h|🎵|
|j|👑|
|k|💎|
|l|🏠|
|;|💌|
|'|🔑|
|\\ |💡|
|z|♣️|
|x|♦️|
|c|♠️|
|v|♥️|
|b|🌃|
|n|🔭|
|m|🚀|
|,|🌙|
|.|☄️|
|/|📫|
