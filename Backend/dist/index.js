"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Route_1 = __importDefault(require("./routes/Route"));
const app = (0, express_1.default)();
const cors = require('cors');
app.use(express_1.default.json());
app.use(cors());
const port = 3000;
app.use('/api/v1', Route_1.default);
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
