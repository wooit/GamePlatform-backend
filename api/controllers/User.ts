import DB from "../Database";
import express from "express";
import bcrypt from "bcrypt";
export default class User {
    async register(req: express.Request, res: express.Response): Promise<any> {
        console.log(req.body);

        let username = req.body.user.username;
        let password = req.body.user.password;
        let hashPassword = await bcrypt.hash(password, 10);
        let sql= `INSERT INTO user (username, password) VALUES (
            '${username}',
            '${hashPassword}'
        )`;
       

        // let sql= `INSERT INTO user (username, password) VALUES (
        //     '${req.body.user.username}',
        //     '${req.body.user.username}'
        // )`;
        DB.query(sql).then(qres => {
            
            res.status(200).json({
                status : 200,
                success : true   
            });
            
            console.log('new user created');
        }).catch(err => {
            console.log(err);
            res.send({ err: err });
        })

        // DB.query(sql, function (err, result) {
        //     if (err) throw err;
        //     console.log("1 record inserted");
        //   });
    };

    //////////////////
    //    LOGIN     //
    //////////////////

    async login(req:express.Request, res:express.Response): Promise<void> {
            //let username = req.body.username;
            let password = req.body.user.password;
            let sql = `SELECT password FROM user WHERE username = '${req.body.user.username}'`;
            DB.query(sql).then(async qres => {
                try{
                    throw 'error mot de passe'
                }catch(err){
                    let validation = await bcrypt.compare(password, qres[0].password);
                    if(validation){
                    res.send(qres);
                    } else {
                        res.send({ err: err });
                    }
                }
            })
        }
    }                      
             
    //  login(req:express.Request, res:express.Response): void {
    //     // const username = req.body.username;
    
    //     console.log(req.body);
    //     let sql = `SELECT * FROM user WHERE username = '${req.body.user.username}' AND password = '${req.body.user.password}'`;
    //     console.log(sql);
    //     DB.query(sql).then(qres => {
    //         res.send(qres);
    //     }).catch(err => {
    //         console.log(err);
    //         res.send({ err: err })
    //     });
    // }

