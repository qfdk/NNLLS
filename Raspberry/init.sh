#!/bin/bash

## installer gstreamer 
#sudo echo "deb http://vontaene.de/raspbian-updates/ . main" >>/etc/apt/sources.list
sudo apt-get update
sudo apt-get dist-upgrade
sudo apt-get -y install gstreamer1.0-tools
sudo apt-get -y install gstreamer1.0
## rediriger le flux
raspivid -n -t 0 -rot 270 -w 960 -h 720 -fps 30 -b 6000000 -o - | gst-launch-1.0 -e -vvvv fdsrc ! h264parse ! rtph264pay pt=96 config-interval=5 ! udpsink host=pi.qfdk.me port=5000