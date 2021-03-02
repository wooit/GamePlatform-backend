import User from "../controllers/User";
import * as express from "express";

export default class Routes {
    public User: User = new User();

    public routes(app: express.Application): void {
        // USER ROUTES
        app.route("/register").post(this.User.register);
        app.route("/login").post(this.User.login);
    }
}