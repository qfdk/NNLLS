// ---------------Environnement-----------------
var mysql = require('mysql');
var conf = require('./conf/conf.json');
var pool = mysql.createPool(conf.db);
var url = require('url');
var app = require('express')();
var bodyParser = require("body-parser");
var expressSession = require('express-session');
var cookieParser = require('cookie-parser'); // the session is stored in a cookie
var server = require('http').Server(app);
var path = require('path');
var md5 = require('md5');
var escape = require("html-escape");
var io = require('socket.io')(server);


// ------------ Appel REST   -------------
var Client = require('node-rest-client').Client;
var client = new Client();


// ------------express-------------------
app.set('views', path.join(__dirname, 'view/'));
app.set('view engine', 'ejs');
app.use(require('express').static(path.join(__dirname, './assets')));

// -------------- Configuring express to use body-parser ----------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(expressSession({secret: 'coucou'}));

server.listen(3000, function () {
    console.log('listening on *:3000');
});

// -----------------index-----------------
app.get('/index', function (req, res) {
    var user = req.session.userName;
    // res.render('index', {"userName": user});
    var stream_list = [];
    var userName = req.session.userName;
    console.log("Username ==> " + userName);
    var req = client.get("http://api.qfdk.me:8080/api/list", function (data, response) {
        stream_list = data;
        stream_list.push({user: 'Yveline', url: 'rtmp://rtmp.infomaniak.ch/livecast/yveline1'});
        stream_list.push({user: 'NASA', url: 'https://www.youtube.com/watch?v=njCDZWTI-xg'});
        stream_list.push({user: 'Best moment decima', url: 'https://www.youtube.com/watch?v=krqdIHzrRBc'});

        res.render('streams', {"stream_list":stream_list, "userName": userName});
    });
    req.on('error', function (err) {
        console.log('something went wrong on requete rest!!', err.request.options);
        stream_list.push({ user: 'Yveline', url: 'rtmp://rtmp.infomaniak.ch/livecast/yveline1' });
        stream_list.push({ user: 'Best moment decima', url: 'https://www.youtube.com/watch?v=krqdIHzrRBc' });
        res.render('streams', { "stream_list":stream_list, "userName": userName});
    });
});

app.get('/', function (req, res) {
    res.redirect('index');
});
app.get('/login', function (req, res) {
    if (req.session.isConnected) {
        res.redirect('stream');
    }
    else {
        res.render('login', {'erreur': '','userName':''});
    }
});

app.get('/stream', function (req, res) {
    if (req.session.isConnected) {

        var stream_list = [];
        var userName = req.session.userName;
        console.log("Username ==> " + userName);
        var req = client.get("http://api.qfdk.me:8080/api/list", function (data, response) {
            stream_list = data;
            stream_list.push({user: 'Yveline', url: 'rtmp://rtmp.infomaniak.ch/livecast/yveline1'});
            stream_list.push({user: 'Best moment decima', url: 'https://www.youtube.com/watch?v=krqdIHzrRBc'});

            res.render('streams', {"stream_list":stream_list, "userName": userName});
        });
        req.on('error', function (err) {
        	console.log('something went wrong on requete rest!!', err.request.options);
        	stream_list.push({ user: 'Yveline', url: 'rtmp://rtmp.infomaniak.ch/livecast/yveline1' });
        	stream_list.push({ user: 'Best moment decima', url: 'https://www.youtube.com/watch?v=krqdIHzrRBc' });
        	res.render('streams', { "stream_list":stream_list, "userName": userName});
        });
    }
    else {
        res.render('login', {'erreur': 'Connectez vous d\'abord ...','userName':userName});
    }
});

app.post("/streamer", function (req, res) {
    // if (req.session.isConnected) {
        res.render('streamer', {'stream': req.body.stream, 'userName': req.session.userName});
    // } else {
    //     res.render('login', {'erreur': '','userName':user});
    // }
});

app.get("/streamer", function (req, res) {
    res.redirect('stream');
});

app.get('/startlive', function (req, res) {
    if (req.session.isConnected) {
        // =============================================================== TODO LI ICI ! ==========================================================
        var user = req.session.userName;
        res.render('startlive', {"userName": user});
    }
    else
        res.render('login', {'erreur': 'Hâte de partager vos meilleurs moments ? Connectez-vous !',"userName":''});
});


app.get('/about', function (req, res) {
    var user = req.session.userName;
    res.render('about', {"userName": user});
});

app.get('/logout', function (req, res) {
    console.log("Deconnexion");
    //destroy!
    req.session.destroy();
    res.redirect('/');
});


app.get('/createaccount', function (req, res) {
    // res.end

    if (req.session.isConnected) {
        res.redirect('stream');
    } else {

        res.render('createaccount', {'erreur': ''});
    }
});

app.post('/login', function (req, res) {

    if (req.session.isConnected) {
        res.redirect('stream');
    }
    else {

        var user = req.body.identifiant;
        var pass = md5(req.body.pwd);
        pool.getConnection(function (err, conn) {
            var requeteSql = 'SELECT * FROM login_web Where identifiant = ? and mdp = ?';
            conn.query(requeteSql, [user, pass], function (err, data) {


                if (data[0] != undefined) {
                    console.log("Bien connecté ....");
                    req.session.isConnected = true;
                    req.session.userName = user;
                    res.redirect('stream');
                }
                else {
                    res.render('login', {'erreur': "Email ou mot de passe incorrect"});
                }
            });
            conn.release();
        });
    }
});

// ----------------- Creation d'un compte -----------------
app.post('/createaccount', function (req, res) {

    pool.getConnection(function (err, conn) {
        var post = {
            nom: req.body.nom,
            prenom: req.body.prenom,
            identifiant: req.body.identifiant,
            mdp: md5(req.body.mdp),
            email: req.body.email
        };
        conn.query('INSERT INTO login_web SET ?', post, function (error) {
            if (error) {
                console.log(error);
                res.render('createaccount', {'erreur': "Création du compte impossible"});
            } else {
                console.log("Compte créé avec succés ....");
                res.redirect('login');
            }
        });

        conn.release();

    });

});

// ----------------- Chatbox Streamer -----------------
io.on('connection', function (socket) {
    socket.color = "#" + ((1 << 24) * Math.random() | 0).toString(16); // Random color chat

    socket.on('chat-message', function (msg, pseudo, stream) {
        if (msg != "")
            io.emit('chat-message', escape(pseudo), socket.color, escape(msg), escape(stream));
    });

    socket.on('disconnect', function () {
        console.log('Got disconnect!');
    });
});

