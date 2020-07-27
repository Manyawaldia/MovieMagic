const express = require('express'); //Require the package
const app = express();//Initialize express for our app
const bodyParser = require('body-parser');
const path = require('path');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//browser sent a request to / and we got back this header

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});


//post method to search the database
app.post('/Movies', function (req, res) {

    //configure web server to wor kwith mysql 
    const mysql = require('mysql');

    const config = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'pass',
        database: 'moviedb'
        //port: '3306'
    });


    console.log(req.body);
    let rating = req.body.title1;
    console.log(rating);

    var appendToQuery = '(m.id=s.id AND ';

    if (req.body.titlesearch) {
        if (!(appendToQuery === '(m.id=s.id AND ')) { //if this is not the very first arg for where
            appendToQuery = appendToQuery + " AND ";
        }
        let titlesearch = req.body.titlesearch;
        appendToQuery = appendToQuery + "m.title = '" + titlesearch + "'";
    }
    if (req.body.yearsearch) {
        if (!(appendToQuery === '(m.id=s.id AND ')) { //if this is not the very first arg for where
            appendToQuery = appendToQuery + " AND ";
        }
        let yearsearch = req.body.yearsearch;
        appendToQuery = appendToQuery + "m.year =" + yearsearch;
    }
    if (req.body.genresearch) {
        if (!(appendToQuery === '(m.id=s.id AND ')) { //if this is not the very first arg for where
            appendToQuery = appendToQuery + " AND ";
        }
        let genresearch = req.body.genresearch;
        appendToQuery = appendToQuery + " m.genre1 = '" + genresearch + "'";
    }
    if (req.body.studiosearch) {
        if (!(appendToQuery === '(m.id=s.id AND ')) { //if this is not the very first arg for where
            appendToQuery = appendToQuery + " AND ";
        }
        let studiosearch = req.body.studiosearch;
        appendToQuery = appendToQuery + " s.id=m.id AND s.studio = '" + studiosearch + "'";
    }

    // if(req.body.title1){
    //     let ratingSearch = req.body.title1; 
    //     appendToQuery = appendToQuery+ " AND m.averageRating > " + ratingSearch;
    // }

    var queryString = "Select DISTINCT m.title, m.year FROM movies m, studio s WHERE " + appendToQuery + ");";
    console.log(queryString);

    config.query(queryString, (err, rows) => {
        if (err) throw err;

        console.log('Data received');
        console.log(typeof (rows));
        //console.log(rows);
        var resultArray = Object.values(JSON.parse(JSON.stringify(rows)))
        resultArray.forEach(function (v) { console.log(v) })

        ///// tried to style the raw data 
        // let h = '<h1 style="background:red; color:whitesmoke;margin:20px; border:20px solid red;">Movie Rated Above:  ' + parseInt(rating) +'</h1>'
        // let str ='<table style="margin-left:20px;>';
        // let row='';
        // resultArray.forEach(function(v){
        //      console.log(v) 
        //      row = row +'<tr>'+ '<td>' + v.title +  '</td>' + '<td>' + v.averageRating  +  '</td>' + '</tr>';
        // });

        // // for(let i = 0; i<resultArray.length; i++){
        // //    row = row+'<tr>'+ '<td>' + resultArray[i].title +  '</td>' + '<td>' + resultArray[i].averageRating  +  '</td>' + '</tr>';
        // // }
        // str=str + row + '</table>';


        /////
        res.send(rows);
    });

});

app.post('/Add', function(req,res){

    //configure web server to wor kwith mysql 
    const mysql = require('mysql');

    const config = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'pass',
        database: 'moviedb'
        //port: '3306'
    });

    console.log(req.body);
    let rating = req.body.title1;
    console.log(rating);
    var count = "Select COUNT(title) from movies";
    var id= 15000; 
    // config.query(count, (err, rows) => {
    //     if (err) throw err;
    //     //console.log(rows);
    //     var resultArray = Object.values(JSON.parse(JSON.stringify(rows)))
    //     id = resultArray + 1;
    // });
    
    var appendToQuery = ''+ id; //first argument of the insert query is the ID NUMBER

    if (req.body.titlesearch2) {

        let titlesearch2 = req.body.titlesearch2;
        appendToQuery = appendToQuery + ',' + titlesearch2;
    }
    if (req.body.yearsearch2) {

        let yearsearch2 = req.body.yearsearch2;
        appendToQuery = appendToQuery + ',' + yearsearch2;
    }
    if (req.body.genresearch2) {

        let genresearch2 = req.body.genresearch2;
        appendToQuery = appendToQuery+  ',' + genresearch2;
    }

    if (req.body.studiosearch2) {

        let studiosearch2 = req.body.studiosearch2;
        let q2 = studiosearch2;
    }

    var queryString = "Insert into movies (id, title, year, genre1) VALUES (" + appendToQuery + ");";
    console.log(queryString);

    config.query(queryString, (err) => {
        if (err) throw err;

        //res.send(rows);
    });
});


///////
// verify webserver is running 
const webserver = app.listen(3000, function () {
    console.log('Node web server is running...');
});

