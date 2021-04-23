import express from 'express';
import cors from 'cors';
import * as mongo from 'mongodb';

import Config from './Config.json';
import Data from './Data.json';

interface DB_Data {
    date: Date,
    Animal: string
}

let DB_Client: mongo.MongoClient;
const Server = express();

Server.use(express.static('./build'));
Server.use(cors())
Server.use(express.json());
Server.use(express.urlencoded({
    extended: false
}))

const questions = Data.questions;
const outcomes: {[index: string]: string} = Data.outcomes;
const answerChoices = Data.answerChoices;

Server.post("/Answer", (req, res) => {
    if (req.body.QuestionNo != undefined && req.body.UserAnswer != undefined) {
        const answers: any = answerChoices[req.body.QuestionNo];
        const answerResult = answers[req.body.UserAnswer];
        console.log({answerResult});
        res.send({answerResult});
    } else {
        res.send({err: "Wrong REQ"});
    }
});

Server.post("/GetQuestion", (req, res) => {
    if (req.body.QuestionNo != undefined) {
        const question = questions[req.body.QuestionNo];
        if (question) {
            const answer = Object.keys(answerChoices[req.body.QuestionNo]);
            res.send({question, answer});
        }
    } else {
        res.send({err: "Wrongdata"});
    }
});

Server.post("/GetResult", async (req, res) => {
    if (req.body.Scores) {
        let DB = await DB_Client.db();

        let Result: {[index: string]: number} = {};

        for (const Elem of req.body.Scores) {
            if (Result[Elem] == undefined) {
                Result[Elem] = 1;
            } else {
                Result[Elem]++;
            }
        }
        
        let max = "";
        for (const Elem in Result) {
            if (max == "") max = Elem;
            if (Result[max] < Result[Elem]) {
                max = Elem;
            }
        }
        const D: DB_Data = {
            date: new Date(),
            Animal: max
        }

        await DB.collection('Result').insertOne(D);
        const Perc = (await DB.collection('Result').find({Animal: D.Animal}).count()) / (await DB.collection('Result').find({}).count()) * 100;
        console.log(max);
        const Animalinfo = outcomes[max];
        if (Animalinfo) {
            res.send({Name: max, Desc: Animalinfo, Percent: Perc});
        } else {
            res.send({err: "No_result"});
        }
    } else {
        res.send({err: "Wrongdata"});
    }
})

Server.post("/GetTestInfo", (req, res) => {
    res.send({
        Name: "동물 유형 검사",
        Questions: questions.length,
        Ment: ["몇 가지 질문에 답을 하다보면 곧 어떤 야수가 당신의 마음속에 잠들어 있는지 알게 될 거에요."]
    })
})


Server.listen(8989, async () => {
    const DB_config: mongo.MongoClientOptions = {
        useUnifiedTopology: true,
        poolSize: 2
    }
    DB_Client = await mongo.MongoClient.connect(`mongodb://${Config.user}:${Config.pwd}@${Config.host}/${Config.DataBase}`, DB_config);
    
    console.log("Server online");
})