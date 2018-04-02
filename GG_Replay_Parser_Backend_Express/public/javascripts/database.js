var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 100,
    host: 'opuk.ca',
    user: 'opukca5',
    password: 'Beakdriver1!',
    database: 'opukca5_Statistics',
    debug: false
});

var getConnection = function (params, callback) {
    pool.getConnection(function (err, connection) {
        callback(params, err, connection);
    });
};

module.exports = getConnection;