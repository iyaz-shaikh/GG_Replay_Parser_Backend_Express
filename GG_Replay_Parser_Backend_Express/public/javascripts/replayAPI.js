var createConnection = require("./database.js");
var request = require('request');

var steamAPIKey = "B677FB1E5073E7D72F52F57FB8E4FFD9";
//Keys
let WINNER_ID = "Winner";
let PLAYER_STEAMID = "Player_SteamID";
let OPPONENT_STEAMID = "Opponent_SteamID";
let UPLOADER_STEAMID = "Uploader_SteamID";
let TIMESTAMP_ID = "Timestamp";
let CHARACTER1_ID = "Player1_Character";
let CHARACTER2_ID = "Player2_Character";
let YEAR_ID = "Year";
let MONTH_ID = "Month";
let DAY_ID = "Day";
let HOUR_ID = "Hour";
let MINUTE_ID = "Minute";
let SECOND_ID = "Second";
let UNIQUEHASH_ID = "Unique_Hash";


exports.getSteamIDs = function (req, res) {
    res.send(steamIDs);
};

exports.addSteamIDs = function (req, res) {
    var data = req.body;
    var newSteamIDs = data.steamIDs;
    var newSteamIDsString = ""

    for (var i = 0; i < newSteamIDs.length; i++) {
        newSteamIDsString = newSteamIDsString + (i > 0 ? "," : "") + newSteamIDs[i];
    }

    let url = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" + steamAPIKey + "&steamids=" + newSteamIDsString;

    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var bodyObject = JSON.parse(body);
            var players = bodyObject.response.players;
            var steamAliasArray = [];
            for (var i = 0; i < players.length; i++) {
                var playerObject = players[i];
                var values = [];
                var personaName = playerObject.personaname;
                var steamID = playerObject.steamid;
                var avatar = playerObject.avatar;
                var avatarfull = playerObject.avatarfull;

                values[0] = steamID;
                values[1] = personaName;
                values[2] = avatarfull;
                values[3] = avatar;
                steamAliasArray[i] = values;                
            }
            createConnection(steamAliasArray, function (params, err, connection) {
                //Make an insert query to the players_test table
                if (err) throw err;
                console.log("Connected!");
                var sql = "INSERT INTO Players_test (SteamID, Playername, bigsteamicon, smallsteamicon) VALUES ? ON DUPLICATE KEY UPDATE Playername = VALUES(Playername), bigsteamicon = VALUES(bigsteamicon), smallsteamicon = VALUES(smallsteamicon)";
                connection.query(sql, [params], function (err, result) {
                    if (err) throw err;
                    console.log("Number of records inserted: " + result.affectedRows);
                });
                connection.release();
            });
        }
    });
};

exports.addReplayData = function (req, res) {
    var data = req.body;
    var replays = data.replays;
    
    var replaysInSQLFormat = [];
    //add unique hash to each replay.
    for (var i = 0; i < replays.length; i++) {
        let replay = replays[i];
        var replayInSQLFormat = [];
        replayInSQLFormat[0] = replay[UNIQUEHASH_ID];
        replayInSQLFormat[1] = replay[PLAYER_STEAMID];
        replayInSQLFormat[2] = replay[CHARACTER1_ID];
        replayInSQLFormat[3] = replay[OPPONENT_STEAMID];
        replayInSQLFormat[4] = replay[CHARACTER2_ID];
        replayInSQLFormat[5] = replay[UPLOADER_STEAMID];
        replayInSQLFormat[6] = replay[WINNER_ID];
        replayInSQLFormat[7] = replay[TIMESTAMP_ID];
        replaysInSQLFormat[i] = replayInSQLFormat;
    }
    
    createConnection(replaysInSQLFormat, function (params, err, connection) {

        if (err) throw err;
        console.log("Connected!");
        var sql = "INSERT IGNORE INTO ggreplaydata_test (Unique_Hash, Player1_SteamID, Player1_Character, Player2_SteamID, Player2_Character, Uploader_SteamID, Winner, Timestamp) VALUES ?" 
        connection.query(sql, [params], function (err, result) {
            if (err) throw err;
            console.log("Number of records inserted: " + result.affectedRows);
        });
        connection.release();
    });
};
