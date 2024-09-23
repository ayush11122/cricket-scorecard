"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const matchcontroller_1 = require("../controllers/matchcontroller");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.send("health check");
});
router.post('/:matchid/update/:inning', matchcontroller_1.updateMatch);
router.post('/create', matchcontroller_1.createMatch);
router.get('/view', matchcontroller_1.viewMatch);
exports.default = router;
