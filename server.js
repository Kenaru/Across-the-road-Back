const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const expressWinston = require('express-winston');
const jwtMiddleware = require('./middleware/jwtMiddleware');
const routes = require('./routes/routes');
const logger = require('./config/logger');

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));


app.use(expressWinston.logger({
    winstonInstance: logger,
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}",
    colorize: true,
    ignoreRoute: function (req, res) { return false; }
}));


app.use('/api/get', jwtMiddleware);


app.use('/api/', routes);


app.use(expressWinston.errorLogger({
    winstonInstance: logger,
}));


app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
