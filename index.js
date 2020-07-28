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
        password: 'mysqlpasswd',
        database: 'cs564cp4'
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
        // let h = '<h1 style="background:#d6b3f5; color:black;margin:20px; border:20px;">Movie Info You asked for </h1>';
        // let str ='<table style="margin-left:20px;>';
        // let row='';
        // resultArray.forEach(function(v){
        //      console.log(v) 
        //      row = row +'<tr>'+ '<td>' + v.title +  '</td>' + '<td>' + v.averageRating  +  '</td>' + '</tr>';
        // });

        // for(let i = 0; i<resultArray.length; i++){
        //    row = row+'<tr>'+ '<td>' + resultArray[i].title +  '</td>' + '<td>' + resultArray[i].averageRating  +  '</td>' + '</tr>';
        // }
        // str=str + row + '</table>';


        /////
        res.send(rows);
    });
    // config.close();

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

    //keep changing the ids or else dupes
    var id=  17057; 

    let queryString = `Insert into movies ( id, title, year, genre1) VALUES (?,?,?,?)`;
    let insert1 = [id, req.body.titlesearch2, req.body.yearsearch2, req.body.genresearch2];
    
    console.log(queryString);

    config.query(queryString, insert1 , function(err, rows)  {
        if (err) {
          return console.error(err.message);
        }
        else{
            console.log("Success! Inserted 1 movie");
            var resultArray = Object.values(JSON.parse(JSON.stringify(rows)))
            resultArray.forEach(function (v) { console.log(v) })
        }
        //TODO: prnt out the right movie
        res.send(rows);

      });
    //   config.close();
});

app.get('/Stored1', function(request, response){
    const mysql = require('mysql');

    const config = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'mysqlpasswd',
        database: 'cs564db4'
        //port: '3306'
        //please change this part to run on your computer

    });


    config.query('select title from movies where averageRating>9', function(error, results){
        if ( error ){
            throw error;
        } else {
            response.send(results);
        }
    });
});

app.get('/Stored2', function(request, response){
    const mysql = require('mysql');

    const config = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'pass',
        database: 'moviedb'
        //port: '3306'
    });


    config.query('select title from movies where oscar_win="yes"', function(error, results){
        if ( error ){
            throw error;
        } else {
            response.send(results);
        }
    });
});

app.get('/Stored3', function(request, response){
    const mysql = require('mysql');

    const config = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'pass',
        database: 'moviedb'
        //port: '3306'
    });


    config.query('select m.title from movies m, studio s where m.id=s.id AND s.lifetime_gross<10000 AND m.year=2019', function(error, results){
        if ( error ){
            throw error;
        } else {
            response.send(results);
        }
    });
});
///////
// verify webserver is running 
const webserver = app.listen(3000, function () {
    console.log('Node web server is running...');
});

