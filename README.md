# EmojiKeyboard
EmojiKeyboard

# Event data format
##JSON Event data (as is currently)
###JSON current
{  
    time: [Date],  
    action:[start | submit | passAccept | passRegen ]  
    target:[key],  
    alias:[emoji]  
}  
###JSON goal
{  
    ?  
}  
### Existing CSV
"Date",",UID","Website","?","PicId?","Event_State","Event","Data"
Where  
Date: Time in seconds from 1970  
UID: The user id of the test subject  
?:?  
PicId?:Id for the picture  
Event Category: create | enter | reset | login  
Event: start | picChange | picAccept | Password  

Events
|*create*|start|picChange|picAccept|Password|order inputPwd|goodPractice|hidePassword|PwdDisplay|badPractice|showPassword|createClear|help|
|*enter*|start|order inputPwd|goodLogin|badLogin|enterClear|||||||
|*reset*|resetdone|resetask||||||||||
|*login*|success|failure||||||||||


# Emoji Library
## Suggestions by team mate
|Ben |🌵🌶️🍒👾🤖🐞🐖🍺🧦|
|Essam |🍻❄️🎃🎱💎👑🌲🌙💨🍦☕🎿🗿🎬🥊|
|Jacy |🐶🔥🌧️⚽☄️🌧️🚗🌻🎵|
|Liz |🌸🚀🍉💡🦄🔑🎀🥇💌👁️🤟|
|good extras |♣️♦️♠️♥️🐱|

## Suggestions by topic
|travel | 🌵🚗🗿|
|sport | 🎱⚽🎿🥊🥇|
|animals | 🦄🐶🐞🐖🐱|
|food | 🍉🌶️🍒🍦☕|
|seasons | ❄️🎃🌸🌻|
|weather | 🌧️💨❄️|
|movies | 🎬📽️🎵|
|fantasy | 👑💎🦄|
|space/scifi | 👾🤖🚀🌙☄️|
|home | 🔑💡🏠|
|cards | ♣️♦️♠️♥️|
|other | 💌🧦|

## Key map
|Key|Emoji|
|-|-|
|0|🌻|
|1|🌵|
|2|🚗|
|3|🗿|
|4|🥊|
|5|⚽|
|6|🎿|
|7|🐶|
|8|🐱|
|9|🌸|
|-|🎃|
|=|🌲|
|q|🍉|
|w|🌶️|
|e|️🍒|
|r|🎱|
|t|🥇|
|y|🐞|
|u|️🦄|
|i|🐖|
|o|💨|
|p|🌧️|
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
|\\|💡|
|z|♣️|
|x|♦️|
|c|♠️|
|v|♥️|
|b|👾|
|n|🤖|
|m|🚀|
|,|🌙|
|.|☄️|
|/|🧦"|
