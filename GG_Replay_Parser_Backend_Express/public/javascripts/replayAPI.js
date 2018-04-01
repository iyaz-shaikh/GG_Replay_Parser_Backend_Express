var createConnection = require("./database.js");
var request = require('request');
/*require("jsdom").env("", function (err, window) {
    if (err) {
        console.error(err);
        return;
    }

    var $ = require("jquery")(window);
});*/

var steamIDs = [];
var steamAPIKey = "B677FB1E5073E7D72F52F57FB8E4FFD9";

exports.getSteamIDs = function (req, res) {
    res.send(steamIDs);
};

exports.addSteamIDs = function (req, res) {
    /*var data = req.body;
    var newSteamIDs = data["steamIDs[]"];
    for (var i = 0; i < newSteamIDs.length; i++) {
        steamIDs.push(newSteamIDs[i]);
    }
    //steamIDs.push(data);
    res.send(steamIDs);*/
    var data = req.body;
    var newSteamIDs = data["steamIDs[]"];
    var newSteamIDsString = ""

    for (var i = 0; i < newSteamIDs.length; i++) {
        newSteamIDsString = newSteamIDsString + (i > 0 ? "," : "") + newSteamIDs[i];
    }



    let url = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" + steamAPIKey + "&steamids=" + newSteamIDsString;

    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //TODO: Pull steam names (listed under personaname) from body variable (steam API) then add them as params to createConnection.
            var bodyObject = JSON.parse(body);
            var players = bodyObject.response.players;
            var steamAliasArray = [];
            for (var i = 0; i < players.length; i++) {
                var playerObject = players[i];
                var values = [];
                var personaName = playerObject.personaname;
                var steamID = playerObject.steamid;

                values[0] = steamID;
                values[1] = personaName;
                steamAliasArray[i] = values;                
            }
            createConnection(steamAliasArray, function (params, err, connection) {
                //Make an insert query to the players_test table
                if (err) throw err;
                console.log("Connected!");
                var sql = "INSERT INTO players_test (idplayers, playername) VALUES ? ON DUPLICATE KEY UPDATE playername = VALUES(playername)";
                connection.query(sql, [params], function (err, result) {
                    if (err) throw err;
                    console.log("Number of records inserted: " + result.affectedRows);
                });
                connection.release();
            });
        }


    });
    /*$.get({
        url: "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/",
        data: {
            key: steamAPIKey,
            steamids: newSteamIDsString
        },
        success: success,
        dataType: "json"
    });

    var success = function (data, textStatus, jqXHR) {

    };
    */
};
