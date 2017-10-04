var express= require('express');
var app = express()
var cfenv = require('cfenv');
var appEnv = cfenv.getAppEnv(); 

app.get('/',function(req,res)){
        
        res.send('hello world')
        }
app.listen(appEnv.port, '0.0.0.0', function() { 
    console.log("server starting on " + appEnv.url);
});
