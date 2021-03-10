import express from "express";
import cors from 'cors';
import bodyParser from 'body-parser';
import Routes from "./routes/Routes";

class App {
    public app: express.Application;
    public routes: Routes = new Routes();

    constructor() {
        this.app = express();
        this.app.use(bodyParser.urlencoded({ extended: false })) 
        this.app.use(bodyParser.json()) 
        this.app.use(express.json()); // recognize the incoming Request Object as a JSON Object
        this.app.use(cors());
        this.routes.routes(this.app);
    }
}

export default new App().app;