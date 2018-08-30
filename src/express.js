import express from 'express';
import bodyParser from 'body-parser';
import cors from 'express-cors';
import routes from './routes';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(logger({ logger: appLogger }));

app.set('json spaces', 2);

// All routes under /api
app.use('/api', routes);

export default app;
