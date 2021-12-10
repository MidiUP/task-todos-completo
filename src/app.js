import Express from 'express';
import Routes from './routes';

import './database'

class App {

    constructor() {
        this.server = new Express();
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.server.use(Express.json())
    }

    routes() {
        this.server.use(Routes)
    }

}

export default new App().server;