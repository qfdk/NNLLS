var socket = io.connect('http://localhost:3000');

$('#loginform').submit(function () {
    socket.emit('createnewuser', {
        firstname: $('#nom').val(),
        secondname: $('#prenom').val(),
        email: $('#email').val(),
        mdp: $('#mdp').val(),
        identifiant: $('#identifiant').val()
    })
});

$('#connectionform').submit(function () {
    socket.emit('login', {
        email: $('#email').val(),
        password: $('#pwd').val()
    })
});