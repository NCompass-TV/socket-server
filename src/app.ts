import * as dotenv from 'dotenv';
import * as logsym from 'log-symbols';
import SocketIO, { Server as IOServer } from 'socket.io';
import cors from 'cors';
import express, { Request, Response, Application } from 'express';
import filestackRoutes from './controllers/Filestack';
import logger from 'morgan';
import { Server } from 'http';
import { SocketService } from './services/SocketService';

class App {
    app: Application = express();
    io: IOServer;

    constructor() {
        // Initialize Environment Variables
        dotenv.config();

        // Middleware
        this.initMiddlewares();

        // Ping
        this.app.get('/ping', (req: Request, res: Response) => {
            res.status(200).send({
                response: "pong"
            })
        })

        this.app.get('/', (req: Request, res: Response) => {
            res.status(200).send({
                message: "Silence is Golden ..."   
            })
        })

        this.initRoutes();

        // Initialize Express Server
        const server = <Server>this.app.listen(process.env.PORT || 3000, () => {
            console.log(logsym.success, `SocketIO Server is running on port ${process.env.PORT || 3000}`)
        })

        // Initialize Socket IO Server
        this.io = new SocketIO(server);

        // SocketIO
        this.app.set("io", this.io);

        // Init Socket Events
        new SocketService(this.io).call();
    }

    initMiddlewares() {
        // CORS
        this.app.use(cors());

        // Morgan
        this.app.use(logger('dev'));

        // Body Parser
        this.app.use(express.json({ limit: '100mb' }));
        this.app.use(express.urlencoded({ limit: "100mb", extended: true, parameterLimit:50000 }));
    }

    initRoutes() {
        this.app.use('/video-converted', filestackRoutes);
    }
}

new App();