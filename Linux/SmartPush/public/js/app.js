/**
 * Created by qfdk on 16/3/2.
 */
var socket = io.connect('http://localhost:3000');
socket.on('stoped', function(data) {
    if (data.status === 'ok') {
        $("#tab tr:eq(0)").after('<tr class="warning"><td>[Information]</td><td> Work stopted.</td></tr>');
    }
});

socket.on('twitter', function(data) {
    $("#tab tr:eq(0)").after('<tr><td>' + data.cpt + '</td><td>' + data.text + '</td></tr>');
});

socket.on('viewed', function(data) {
    if (data.status === 'ok') {
        $("#tab tr:eq(0)").after('<tr class="success"><td>[Information]</td><td>Time : '+ data.time+' ms</td></tr>');
    }
});

socket.on('create', function(data) {
    if (data.status === 'ok') {
        $("#tab tr:eq(0)").after('<tr class="info"><td>[Information]</td><td> Database created.</td></tr>');
    }
});


$('#btnStart').click(function() {
    $("#tab tr:eq(0)").after('<tr class="info"><td>[Information]</td><td> Work started.</td></tr>');
    socket.emit('start', { data: $('.form-control').val() });
    // $(this).attr('disabled','disabled');
});

$('#btnStop').click(function() {
    socket.emit('stop', { data: 'stop' });
});

$('#btnView').click(function() {
    // $("#tab tr:eq(0)").after('<tr class="info"><td>[Information]</td><td> Start Analyser.</td></tr>');
    socket.emit('view', { data: 'view' });
});

$('#btnCreate').click(function() {
    $("#tab tr:eq(0)").after('<tr class="info"><td>[Information]</td><td> Create BDD.</td></tr>');
    socket.emit('create', { data: 'create' });
});