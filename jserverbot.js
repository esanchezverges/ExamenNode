var express = require('express');
var bodyParser = require('body-parser');

var app = express();

const readChunk = require('read-chunk');
const fileType = require('file-type');

var bodyParser = require('body-parser');
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

var word = "";
var result = "";
var words = [];

var robots = [];

app.post('/removeduplicatewords', function (req,res){
    var string  = JSON.stringify(req.body.palabras);
    console.log("String = "+string+" req.body.palabras = " + req.body.palabras);
    var j = 0;
    for(var i = 1; i < string.length; i++)
    {
        if(string[i] == ',')
        {
            console.log("Adding word " + word + " on words " + words);
            words[j] = word;
            word = "";
            j++;
        }
        else
        {
            console.log("Adding char "+ string[i]+" on word " + word);
            word += string[i];
        }
    }
    var target = null;
    var k = 0;
    var firstWord = false;
    console.log("Words lenght = " + words.length+" Target = "+ target);
    for(var i = 0; i < words.length; i++)
    {
        if(target == null) target = words[k];
        else if(target == words[i] && !firstWord)
        {
            console.log(target+ " is equal to "+ words[i]);
            console.log("Current target = "+target);
            console.log("Deleting "+words[i]+" Targeting "+ target);
            words.splice(i, 1);
        }
        else if(target == words[i] && firstWord)
        {
            firstWord = false;
            continue;
        }
         if(target == undefined)
        {
            console.log("Target = "+target+" words = "+words[words.length-1]);
            console.log("end loop");
            break;
        }
        if(i == words.length-1 || i == words.length)
        {
            k++;
            i = 0;
            target = words[k];
            firstWord = true;
            console.log("Targeting "+words[k]);
        }
        console.log("Words lenght = " + words.length);
        console.log(" i "+i);
        console.log(" k "+k);
        
    }
    
    result = words;

    res.send(result);

  
});

app.post('/botorder/:order', function (req,res){
    var order = req.body.botorder;
    var url = String(req.url);
    var id = parseInt(url[url.length-1]);

    robots[id] = order;
    res.send("OK");
});

app.get('/botorder/:order', function (req,res){
    var url = String(req.url);
    var id = parseInt(url[url.length-1]);
    var response;

    if(robots[id]) response = robots[id];
    else
    {
        response = "NONE";
    }
    res.send(response);
});


app.get('/detectfiletype', function (req,res){

   var buffer = readChunk.sync('unicorn.png', 0, fileType.minimumBytes);
   var response = fileType(buffer);

   app.send(response);

});

app.listen(process.env.PORT || 8000);  