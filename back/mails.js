var nodemailer      = require('nodemailer');
var ConfMail   = require("./mjConf");

module.exports = {
    sendMail : function(mail, callback){
        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: ConfMail.getAdresse(),
                pass: ConfMail.getPassword()
            }
        });

        var from = mail.envoyeur.username + '[Conjurés] <mjtables.conjurestemporel@gmail.com>';
        var to = getDestinatairesMails();
        var subject = mail.objet;
        var text = mail.message;

        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: from,
            to: to,
            subject: subject,
            text: text
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                callback(error);
            }else{
                callback();
            }
        });

        function getDestinatairesMails(){
            var ret = [];
            for(var i = 0; i < mail.destinataires.length; i++){
                ret.push(mail.destinataires[i].email);
            }
            return ret;
        }
    }
};