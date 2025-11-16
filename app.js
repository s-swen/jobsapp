require('dotenv').config();
require('express-async-errors');
const express = require('express');
const connectDB = require('./db/connect')
const app = express();
const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')
const authenticateUser = require('./middleware/authentication')

const rateLimiter = require('express-rate-limit')
const helmet = require('helmet')
const xss = require('xss-clean')
const cors = require('cors')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
}))
app.use(helmet())
app.use(xss())
app.use(cors())

app.use(express.json());
// extra packages
app.get('/', (req, res) => {
  res.send('Jobs API')
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticateUser, jobsRouter)

// routes
app.get('/', (req, res) => {
  res.send('jobs api');
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening at http://localhost:${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();