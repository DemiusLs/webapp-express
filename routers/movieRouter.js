import express from "express"
import movieController from "../controllers/movieController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

//INDEX
// lettura di tutti i movies
router.get("/", movieController.index)


//SHOW 
//lettura di un elemento movie
router.get("/:slug", movieController.show)


//STORE
//inserisco un nuovo movie
router.post('/', upload.single("image"), movieController.store)
router.post('/:id/reviews', movieController.storeReview)


//DELETE
//elimino un elemento
router.delete("/:id", movieController.destroy)


export default router;