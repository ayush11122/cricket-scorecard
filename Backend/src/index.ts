import express from 'express';
import route  from './routes/Route';
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());
const port = 3000;


app.use('/api/v1', route)

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
