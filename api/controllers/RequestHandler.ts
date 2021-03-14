import DB from "../Database";

type Credentials = {
    username: string,
    token: string
}

export default class RequestHandler {
    static handleAuthenticatedRequest(credentials: Credentials, callback: Function) {
        const sql = `SELECT username, token FROM user WHERE username='${credentials.username}' AND token='${credentials.token}'`;
        DB.query(sql).then(sqlRes => {
            if (sqlRes.length) 
                
                callback();
            else
                console.error(`Unable to handle authenticated request for user ${credentials.username} : wrong token`);
        })
    }
}