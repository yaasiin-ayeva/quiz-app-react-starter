import express from "express";
import dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";

const app = express();
const port = 4000;

app.use(express.json());
dotenv.config();

const uri = process.env.DB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

app.get('/posts', (_, res) => {
    client.connect().then(db => {
        console.log("successfully connected");
        if (!db) return false;
        return db.db("blog").collection("posts").find().toArray();
    }).then(posts => {
        res.send(posts);
        client.close();
    }).catch(err => {
        console.error(err);
        res.status(500).send("Error retrieving posts");
    });
});

app.post('/insert', (req, res) => {
    client.connect().then(db => {
        if (!db) return false;
        db.db("blog").collection("posts").insertOne(req.body).then(result => {
            res.status(200).send(result);
        });
    }).catch(err => {
        console.error(err);
        res.status(500).send("Error creating posts");
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});