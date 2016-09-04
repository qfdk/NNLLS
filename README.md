##Node.js+Nginx+Linux+Live Streaming

## Documentation en Français

- [Rasberry (Caméra)](https://github.com/qfdk/projetESIR/tree/master/Raspberry
) 简单的命令让树莓派也可以推流

- [Back-end (SmartPush system + kfc-* + kfc-nginx)](https://github.com/qfdk/projetESIR/tree/master/Linux)
 
- [Front-end (Client + player)](https://github.com/qfdk/projetESIR/tree/master/Web) 建议根据要求重写UI

## Introduction

本项目使用 `Node.js`+`Nginx` 进行直播，后端为`Node.js`，可以自行添加处理服务器来进行流的处理。
前端可以直接调用后端api，如果成功将返回json数组便于显示，不同的质量对应不同的url。

经过测试，视频播放延时在4s之内。

![](./img/1.png)

左侧的是是我们的机器（手机，电脑，raspi等等一系列可以录制推流rtmp的工具），中间的模块，就叫它`Smart-Push`好了，
它的作用是权限控制和接受客户端来的流，再进行流的分发实现流处理的负载均衡，它还包括了一个简单的API服务，前端可以进行请求。
`VM*` 系列是处理流服务器，可以把流处理成不通的格式。 
最后是`web`前端，这个建议大家自己写原因嘛，自己看代码就知道了，建议数据库结构也重新定义一下，由于项目时间比较敢就没有过多计较代码风格。
文档基本算是完全了，有什么不懂的可以直接联系。

## Archi

``` bash
.
├── Back-end
│   ├── README.md
│   ├── SmartPush
│   └── img
├── Front-end
│   ├── todo_here.md
├── README.md
├── Raspberry
│   ├── README.md
│   ├── init.sh
│   └── vnc.sh
└── img
    ├── 1.png
    └── 2.JPG
```
- 重新写WebUI

## SQL

```
CREATE TABLE IF NOT EXISTS `login_web` (
  `nom` varchar(40) DEFAULT NULL,
  `prenom` varchar(40) DEFAULT NULL,
  `identifiant` varchar(40) NOT NULL,
  `mdp` varchar(40) NOT NULL,
  `email` varchar(100) NOT NULL,
  `is_locked` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

```
## Café in Code out (捐赠)
Paypal or 支付宝 ：qfdk2010#gmail.com

<img src="./img/2.jpg" width="250px"/>

## License Apache 2
World is powered by solitude
![img-source-from-https://github.com/docker/dockercraft](https://github.com/docker/dockercraft/raw/master/docs/img/contribute.png?raw=true)
