var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 100,
    host: 'ggreplaydatabase.c1mkgc7sz4am.us-east-1.rds.amazonaws.com',
    user: 'kupo',
    password: 'R4nD0mPW!',
    database: 'ggreplay',
    debug: false
});

var getConnection = function (params, callback) {
    pool.getConnection(function (err, connection) {
        callback(params, err, connection);
    });
};

module.exports = getConnection;