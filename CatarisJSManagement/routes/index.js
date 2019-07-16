'use strict';
var express = require('express');
var router = express.Router();

var hdb = require('hdb');

//local setup - credentials used if app is runnig local
var options = {
	host: "zeus.hana.prod.eu-central-1.whitney.dbaas.ondemand.com",
	port: 23356,
	user: "CATARIS_HDI_CATARISDB_1_9B3YF0APDX02RBTFU61VUGLFI_RT",
	password: "Mw0ja9Xvht-cCWm3n0M.0dOTORWV.uRVROAa31mvMy54HQFi-H.2bpwboP9QR2VaztW7sE4BlUagO5heu7ER1YD2F3uX72LeRFftq5UoIrMq.nIoFUdh10yr24PTHj2t",
	database: "CATARIS_HDI_CATARISDB_1",
	useTLS: true
};

var client = hdb.createClient(options);
client.on('error', function (err) {
	console.error('Network connection error', err);
});

client.connect(function (err) {
	if (err) {
		return console.error('Error:', err);
	}
	console.log(client.readyState); // connected
});

/* GET home page. */
router.get('/', function (req, res) {

	client.exec(
		'SELECT TOP 1000 \"usernr\",\"username\",\"password\",\"email\", \"tel\" FROM \"CATARIS_HDI_CATARISDB_1\".\"Cataris.CatarisDB::tables.user\";',
		function (err, rows) {
			if (err) {
				return console.error('Error:', err);
			}
			res.send(rows);
		});

	//res.render('index', { title: 'Express' });
});

router.post('/users', function (req, res) {
    var data = req.body;

    var hash = crypto.createHash('sha256');
    hash.update(data.password);
    var pwdhsh = hash.digest('hex');

    var user = { "usernr": data.usernr, "username": data.username, "password": data.password, "email": data.email, "tel": data.tel };

    client.exec("INSERT INTO \"CATARIS_HDI_CATARISDB_1\".\"Cataris.CatarisDB::tables.user\" VALUES('" + user.usernr + "', '" + user.username + "', '" + user.password + "', '" + user.email + "', '" + user.tel + "');", function (err, affectedRows) {
        if (err) {
            res.send(err);
        }
        res.send(user);
    });



    /*client.exec('SELECT TOP 1000 \"usernr\",\"username\",\"password\",\"email\", \"tel\" FROM \"CATARIS_HDI_CATARISDB_1\".\"Cataris.CatarisDB::tables.user\";', function (err, rows) {
        if (err) {
            return console.error('Error:', err);
        }
        res.send(rows);
    });*/
    //res.render('index', { title: 'Express' });
});
module.exports = router;