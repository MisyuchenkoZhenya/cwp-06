const fs = require('fs');
const logPath = './content/LogFile.log';

function LOG(text){
    let content = `${getDate()}:\n ${text}\n\n`;
    fs.appendFile(logPath, content, (err) => {
        if(err)
            console.error(err);
    });
}

function getDate(){
    let date = new Date().toString();
    return date.split(/ /g).slice(1, 5).join(' ');
}  

module.exports.LOG = LOG;