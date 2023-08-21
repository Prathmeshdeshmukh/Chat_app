const moment= require('moment')
function formatMesaage(username, text){
    return {
        username,
        text,
        time: new Date().toTimeString().substring(0,8)
    }
}

module.exports = formatMesaage;

