var express = require('express');
var url = require('url');
var md5 = require('md5');
var conf = require('../conf/conf.json');

var mysql = require('mysql');
//sql pool
var pool = mysql.createPool(conf.db);

var exec = require('child_process').exec;

// info_users_list vm(traitement des donnees)
var vm = conf.vm;
// users info_users_list (user name)
var users = [];

// info_users_list de info user(detail)
var info_users_list = [];

var router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.session.isConnected) {
        res.render('index', {title: 'SmartPush', users: info_users_list, vms: vm, login: true});
    } else {
        res.render('login', {login: false});
    }
});

router.get('/index', function (req, res, next) {
    if (req.session.isConnected) {
        res.render('index', {title: 'SmartPush', users: info_users_list, vms: vm, login: true});
    } else {
        res.render('login', {login: false});
    }
});

router.get('/login', function (req, res, next) {
    if (req.session.isConnected) {
        res.redirect('index');
    }
    else {
        res.render('login', {login: false});
    }
});

router.get('/logout', function (req, res, next) {
    if (req.session.isConnected) {
        req.session.destroy();
    }
    res.redirect('/');
});

router.post('/login', function (req, res) {
    if (req.session.isConnected) {
        res.redirect('index');
    }
    else {
        var user = req.body.user;
        var pass = req.body.passwd;
        if (user === conf.admin.user && pass === conf.admin.passwd) {
            req.session.isConnected = true;
            req.session.userName = user;
            res.redirect('index');
        }
        else {
            res.render('login', {login: false});
        }
    }
});

router.get('/play', function (req, res, next) {
    var params = url.parse(req.url, true).query;
    var user = params['user'];
    var pass = md5(params['passwd']);
    pool.getConnection(function (err, conn) {
        var requeteSql = 'select * from login_web where identifiant = ? and mdp = ?';
        conn.query(requeteSql, [user, pass], function (err, data) {
            if ("undefined" != typeof (data[0])) {
                console.log("Bien connecté ....");
                res.writeHead(200, {'Content-Type': 'text/json'});
                if (users.indexOf(user) === -1 && data[0].is_locked === 0) {
                    var url = conf.base_url + '/' + user;
                    //push video
                    push_stream(url, user);
                }
                if (users.indexOf(user) === -1 && data[0].is_locked === 1) {
                    var tmp = {};
                    tmp['user'] = user;
                    tmp['url'] = "Votre compte n'est pas validé !";
                    tmp['is_locked'] = 1;
                    users.push(user);
                    info_users_list.push(tmp);
                }
                res.end('ok');
            }
            else {
                console.log("Identifiants incorrects ....");
                res.writeHead(400, {'Content-Type': 'text/json'});
                res.end('failed')
            }
        });
        conn.release();
    });
});

router.get('/addVm', function (req, res, next) {
    if (req.session.isConnected) {
        var params = url.parse(req.url, true).query;
        if (params['url'] !== "") {
            vm.push(params['url']);
        }
        res.redirect('index');
    } else {
        res.redirect('login');
    }
});

router.get('/removeVm', function (req, res, next) {
    if (req.session.isConnected) {
        var params = url.parse(req.url, true).query;
        var index = params['id'];
        vm.splice(index, 1);
        res.redirect('index');
    }
    else {
        res.redirect('login');
    }

});


router.get('/banUser', function (req, res, next) {
    if (req.session.isConnected) {
        var params = url.parse(req.url, true).query;
        var user = params['user'];
        console.log(user);
        var index = users.indexOf(user);
        info_users_list.splice(index, 1);
        users.splice(index, 1);
        pool.getConnection(function (err, conn) {
            var requeteSql = 'update login_web set is_locked=1 where identifiant = ?';
            conn.query(requeteSql, [user], function (err, data) {
                var tmp = {};
                tmp['user'] = user;
                tmp['url'] = "Votre compte n'est pas validé !";
                tmp['is_locked'] = 1;
                info_users_list.push(tmp);
                users.push(user);
                res.redirect('index');
            });
            conn.release();
        });
    } else {
        res.redirect('login');
    }

});

router.get('/activUser', function (req, res, next) {
    if (req.session.isConnected) {
        var params = url.parse(req.url, true).query;
        var user = params['user'];
        var index = users.indexOf(user);
        info_users_list.splice(index, 1);
        users.splice(index, 1);
        pool.getConnection(function (err, conn) {
            var requeteSql = 'update login_web set is_locked=0 where identifiant = ?';
            conn.query(requeteSql, [user], function (err, data) {
                var url = conf.base_url + '/' + user;
                push_stream(url, user);
                res.redirect('index');
            });
            conn.release();
        });
    } else {
        res.redirect('login');
    }


});

// /api
router.get('/api', function (req, res, next) {
    var tmp = {};
    tmp['status'] = "ok";
    tmp['msg'] = "wlc,SmartPushAPI";
    res.json(tmp);
});

router.get('/api/test', function (req, res, next) {
    res.end('ok');
});
// /api/listVm
router.get('/api/listVm', function (req, res, next) {
    res.json(vm);
});
// /api/list
router.get('/api/list', function (req, res, next) {
    res.json(info_users_list);
});

// /api/info?user=xxx
router.get('/api/info', function (req, res, next) {
    var params = url.parse(req.url, true).query;
    pool.getConnection(function (err, conn) {
        var requeteSql = 'select identifiant,is_locked,nom,prenom,email from login_web where identifiant = ?';
        if ("undefined"!= typeof (conn)){

        conn.query(requeteSql, [params['user']], function (err, data) {
            if ("undefined" != typeof (data[0])) {
                var tmp = {};
                tmp['info'] = data[0];
                tmp['push_url'] = conf.base_url;
                tmp['key'] = params['user'] + '?user=' + params['user'] + '&passwd=xxx';
                res.json(tmp);
            }
            else {
                console.log("wrong user or passwd");
                res.end('failed')
            }
            conn.release();
        });

        }else {
            var tmp = {};
            tmp['status'] = "failed";
            tmp['msg'] = "check database config";
            res.json(tmp);
        }
    });
});

function push_stream(src, user) {
    var json = {};
    json['user'] = user;
    users.push(user);
    var url = vm[(calcNbUserActive()) % vm.length] + '/' + user;
    console.log("[i] API => " + src);
    var command = 'ffmpeg -i ' + src + ' -c:v copy -c:a copy -f flv ' + url;
    json['url'] = url;
    console.log("[Destination] => " + url);
    json['is_locked'] = 0;
    info_users_list.push(json);
    exec(command, function (a, b, c) {
        if (a !== null) {
            console.log('[success] Command success.');
        }
    });
}

function calcNbUserActive() {
    var cpt = 0;
    for (var i = 0; i < info_users_list.length; i++) {
        if (info_users_list[i].is_locked === 0) {
            cpt++;
        }
    }
    return cpt;
}

module.exports = router;