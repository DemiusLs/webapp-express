import express from "express"
import movieRouter from "./routers/movieRouter.js"
import notFound from "./middleware/notFound.js";
import imagePath from "./middleware/imagePath.js";
import errorHandler from "./middleware/errorsHandler.js";
import cors from "cors";


const app = express()
const port = 3000;

app.use(
    cors({
        origin: process.env.FE_URL,
    })
);

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {

    res.json({

        data: "Benvenuti in movie API"
    })
})

app.use("/movies", imagePath, movieRouter)


app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {

    console.log(`Movie API listening on port ${port}`)
})
