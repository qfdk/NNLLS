## Raspberry

* x264 (√)
* ffmpeg(√)
* gstreamer(√)


## x264

Il faut compiler x264 et attendre environ 2h.
On peut push rtmp stream en live :)

ça ne marche pas git://git.videolan.org/x264 ===> 404

miroir https://github.com/yixia/x264

```bash 
//merci :)
git clone https://github.com/yixia/x264
cd x264
./configure --host=arm-unknown-linux-gnueabi --enable-static --disable-opencl
make
sudo make install
```

## ffmpeg
```bash
git clone git://source.ffmpeg.org/ffmpeg.git
cd ffmpeg
sudo ./configure --arch=armel --target-os=linux --enable-gpl --enable-libx264 --enable-nonfree
make
sudo make install
```

## Gstreamer

```bash

sudo apt-get install gstreamer1.0 gstreamer1.0-tools

gst-launch-1.0 -v v4l2src ! 'video/x-raw, width=640, height=480, framerate=30/1' ! queue ! videoconvert ! omxh264enc !  h264parse ! flvmux ! rtmpsink location='rtmp://kfc-*/rtmp/live/room/key'

//version plus fluide grace à gstreamer
gst-launch-1.0 rpicamsrc bitrate=4000000 rotation=90 ! video/x-h264,width=1920,height=1080,framerate=25/1 ! h264parse ! flvmux ! rtmpsink location='rtmp://kfc-sisilafamille/live'

```


## License Apache 2
World is powered by solitude
![img-source-from-https://github.com/docker/dockercraft](https://github.com/docker/dockercraft/raw/master/docs/img/contribute.png?raw=true)

