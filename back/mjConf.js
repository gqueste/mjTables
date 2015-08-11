module.exports = {
    getAdresse : function(){
        if(process.env.MAIL_ADRESSE){
            return process.env.MAIL_ADRESSE;
        }
        else{
            return 'adresse';
        }
    },
    getPassword : function(){
        if(process.env.MAIL_PASSWORD){
            return process.env.MAIL_PASSWORD;
        }
        else{
            return 'password';
        }
    }
};