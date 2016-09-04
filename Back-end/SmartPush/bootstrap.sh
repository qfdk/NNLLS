#!/bin/bash
NAME=app.js
function start()
{
	forever start $NAME||true
	echo "[info] SmartPush started !"
}

function stop()
{
	forever stop  $NAME||true
	echo "[info] SmartPush stoped"
}

## main
for arg in "$*"
do
	if [ "$arg" = "stop" ]; then
		stop||exit;
	fi
done

if [[ $# -eq "0" ]]; then      
	start||exit;
fi