

import  express, { query } from "express";
import axios from "axios";
import bodyParser from "body-parser";
import fs from "fs";
import { resolve } from "path";
import { rejects } from "assert";

const app = express();
const port = 3000;

var pageName = "index.ejs";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get("/", (req, res) => {
    res.render(pageName);
});

var i = 0; // Valoare de referinta folosita pentru a monitoriza numarul de evenimente aduse si pentru a le salva.

let resultNo = i + ".ejs"; // denumirea fiecarui rezultat la momentul salvarii temporare;

var n = 0; // Valoare de referinta pentru constructia fisierului inclus in FRONT-END

var forDelete = []; // Lista completa si ordonata ce contine toate evnimentele aduse prin API;



app.post("/clicked", async (req, res) => {
    
    i = 0;
    n = 0;
    

    try{

        const dayValue = req.body.input1Value;
        const monthValue = req.body.input2Value;

        pageName = "Result.ejs";

        console.log("click was recorded btn1");
        console.log(dayValue, monthValue);
        const result = await axios.get(`https://byabbe.se/on-this-day/${monthValue}/${dayValue}/events.json`);
        

        var listing = result.data.events.length;
        console.log(listing);
        
        i = 0;
        n = 0;
        while(i < listing) {

            console.log(i);

            let an = result.data.events[i].year;
            let descriere = result.data.events[i].description;
            let wiki = result.data.events[i].wikipedia;
            let textNote = "<h1>the year is: " + an + "</h1>\n <h2>These happened that year: " + descriere + "</h2>\n <h2>These are wiki links and refferences: " + wiki + "</h2><hr>\n\n\n <br><br>\n\n<script>\n a = " + i +"\n</script>";

            console.log(textNote);

            fs.writeFile(`views/partials/results/${resultNo}`, textNote, {flag: 'a+'}, (err) => {
                if(err){
                    throw err;
                }                
            });

            forDelete.push(resultNo);

            let textNote2 = `<%- include("results/${forDelete[n]}") %>\n\n`;
            let textNote3 = `\n\n<div class="carousel-item active" style="height: 100%;"><svg class="bd-placeholder-img" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="var(--bs-secondary-color)"></rect></svg><div class="carousel-caption d-none d-md-block"><h5>First slide label</h5><p>Some representative placeholder content for the first slide.</p></div></div>`

            fs.writeFile(`views/partials/fileList.ejs`, textNote2, {flag: 'a+'}, (err) => {
                if(err){
                    throw err;
                }                
            });
            
            n++;
            i++;
            resultNo = i + ".ejs"

            
        };

        res.render(pageName);
        

    } catch (error) {
        console.log(error);
        res.status(500);
    }



});   //Aici se termina primul "app.post"    !!!!


app.post("/clicked1", async (req, res) => {
    pageName = "index.ejs";
    console.log("click was recorded btn2");
    res.redirect("/");

    console.log(forDelete);
    console.log(forDelete.length);
    i = 0;

    while (i <= forDelete.length) {
        fs.unlink(`views/partials/results/${forDelete[i]}`, (err) => {
            if (err) {

                if (err.code === 'ENOENT') {
                    console.log(`${resultNo} File does not exist!`);
                } else {
                    throw err;
                }
            } else {
                console.log("File deleted successfuly!");

            }
        });

        i++;
        resultNo = i + ".ejs"
    };

    fs.unlink(`views/partials/fileList.ejs`, (err) => {
        if (err) {

            if (err.code === 'ENOENT') {
                console.log(`FileList does not exist!`);
            } else {
                throw err;
            }
        } else {
            console.log("FileList deleted successfuly!");

        }
    });

    i = 0;
    n = 0;
    forDelete = [];
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});