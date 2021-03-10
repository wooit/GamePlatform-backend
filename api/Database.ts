import mysql from "mysql";

const DB = mysql.createPool({
    connectionLimit: 10,
    host: 'sql11.freesqldatabase.com',
    port: '3306',
    user: 'sql11395062',
    password: '11B4bc2avX',
    database: 'sql11395062',
    //charset : 'utf8mb4'
});

DB.query = (sql: string): Promise<any> => {                 // function DB Q (une string sql) : return une promess <any>
    return new Promise<any>(resolve => {
        DB.getConnection((err, con) => {
            if (err) throw err;
            con.query(sql, (err, res) => {
                con.release();
                if (err) throw err;
                resolve(res);                               // resolve (res) => res est (c'est le qres de Register)
            });
        })
    })
}

DB.queryValues = (sql: string, values: any[][]): Promise<any> => {
    return new Promise<any>(resolve => {
        DB.getConnection((err, con) => {
            if (err) throw err;
            con.query(sql, [values], (err, res) => {
                con.release();
                if (err) throw err;
                resolve(res);
            });
        })
    })
}

export default DB