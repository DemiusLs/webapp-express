import express from "express"
import movieController from "../controllers/movieController.js";

const router = express.Router();

//INDEX
// lettura di tutti i movies
router.get("/", movieController.index)


//SHOW 
//lettura di un elemento movie
router.get("/:slug", movieController.show)


//STORE
//inserisco un nuovo movie
router.post('/', movieController.store)
router.post('/:id/reviews', movieController.storeReview)


//UPDATE
//modifico un elemento
router.put("/:id", movieController.update)


//DELETE
//elimino un elemento
router.delete("/:id", movieController.destroy)


export default router;