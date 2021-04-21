import express from 'express';
import Data from './Data.json';

const Server = express();

Server.use(express.json());
Server.use(express.urlencoded({
    extended: false
}))

const questions = Data.questions;
const outcomes = Data.outcomes;
const answerChoices = Data.answerChoices;

questions.forEach((v, i) => {
    console.log(v, answerChoices[i]);
})


Server.post("/Answer", (req, res) => {
    if (req.body.QuestionNo && req.body.UserAnswer) {
        const answers: any = answerChoices[req.body.QuestionNo];
        const answerResult = answers[req.body.UserAnswer];
        console.log(answerResult);
        res.send(answerResult);
    } else {
        res.send("Wrong REQ")
    }
})


Server.listen(80, () => {
    console.log("Server online");
})