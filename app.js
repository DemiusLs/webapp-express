import express from "express"
import movieRouter from "./routers/movieRouter.js"



const app = express()
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {

    res.json({

        data: "Benvenuti in movie API"
    })
})

app.use("/movies", movieRouter)


app.listen(port, () => {

    console.log(`Movie API listening on port ${port}`)
})
