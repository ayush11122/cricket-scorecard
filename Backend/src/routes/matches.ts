import { Router } from "express";
import { createMatch, updateMatch, viewMatch } from "../controllers/matchcontroller";

const router = Router();

router.get('/', (req, res)=>{

    res.send("health check");
})


router.post('/:matchid/update/:inning', updateMatch)
router.post('/create', createMatch)
router.get('/view', viewMatch);
export default router;