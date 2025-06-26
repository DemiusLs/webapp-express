import express from "express"
import movieController from "../controllers/movieController.js";

const router = express.Router();

//INDEX
// lettura di tutti gli elementi 
router.get("/", movieController.index)


//SHOW 
//lettura di un elemento singolo
router.get("/:id", movieController.show)


//STORE
//inserisco un nuovo elemento
router.post('/', movieController.store)


//UPDATE
//modifico un elemento
router.put("/:id", movieController.update)


//DELETE
//elimino un elemento
router.delete("/:id", movieController.destroy)


export default router;