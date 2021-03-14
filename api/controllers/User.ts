import DB from "../Database";
import express from "express";
import bcrypt from "bcrypt";
import RequestHandler from "./RequestHandler";

export default class User {

    async isLogged(req: express.Request, res: express.Response): Promise<any> {     // <>  type de données retournée par la promise
        const { username, token } = req.body.credentials;
        RequestHandler.handleAuthenticatedRequest({ username, token }, () => {
            res.send(username);
        })
    }

    async register(req: express.Request, res: express.Response): Promise<any> {
        let username = req.body.user.username;
        let password = req.body.user.password;
        let hashPassword = await bcrypt.hash(password, 10);
        let sql1 = `SELECT * FROM user WHERE username = '${username}'`;
        let sql2 = `INSERT INTO user (username, password) VALUES ('${username}', '${hashPassword}')`;

        DB.query(sql1).then(qres => {
           console.log(qres[0])
           if (qres && qres[0])
                res.status(400).send('username already exist')
           else {
                DB.query(sql2).then(qres => {
                    res.send('OK');
                }).catch(err => {
                    console.error(err)
                })
           }
        }).catch(err => {
            console.error(err)
        })
    };

    async login(req: express.Request, res: express.Response): Promise<void> {
        const { username, password } = req.body.user;
        const sql = `SELECT id, username, password FROM user WHERE username = '${username}'`;
        DB.query(sql).then(async qres => {
            if (!qres.length) {
                res.status(403).send({err: `Cet utilisateur n'existe pas`});
                return;
            }
            let validation = await bcrypt.compare(password, qres[0].password);
            if (validation) {
                const token = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
                const sql2 = `UPDATE user SET token='${token}' WHERE username='${username}'`;
                DB.query(sql2).then(q2res => {
                    res.send({id: qres[0].id, token });
                })
                .catch(err => {
                    console.error(`Error while updating client token to DB : ${err}`);
                })
            }
            else
                res.status(403).send({err: `Mot de passe incorrect`});
        }).catch(err => {
            console.error(`Error while searching for user '${username}' in DB : ${err}`);
        })
    }

    async profile(req: express.Request, res: express.Response): Promise<void> {
        const { username, token } = req.body.credentials;
        RequestHandler.handleAuthenticatedRequest({ username, token }, () => {
            const sql = `SELECT username FROM user WHERE id='${req.params.id}'`;
            DB.query(sql).then(sqlRes => {
                res.send(sqlRes);
            })
            .catch(err => {
                console.error(`Error while loading user profile ${req.params.id} : ${err}`);
            })
        })
    }
}