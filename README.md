##Node.js+Nginx+Linux+Live Streaming


经过了一系列的开发，加上小伙伴们的坑，最后重新造了一个轮子，可以进行在线直播。
这里面运用了`Node.js`+`Nginx` 等模块因此得名。这个项目又什么好处呢? 首先来说一下它的架构。 它的架构经历了三个版本的进化，最后定了这个版本。

![](./img/1.png)

左侧的是是我们的机器（手机，电脑，raspi等等一系列可以录制推流rtmp的工具），中间的是一个神奇的模块，就叫它`Smart-Push` 它的作用是权限控制和接受客户端来的流再进行流的分发实现流处理的负载均衡，它还包括了一个简单的API服务，前端可以进行请求。`VM*` 系列是处理流服务器，可以把流处理成不通的格式。 最后是`web`前端，这个建议大家自己写原因嘛，自己看代码就知道了，建议数据库结构也重新定义一下，由于项目时间比较敢就没有过多计较代码风格。
文档基本算是完全了，有什么不懂的可以直接联系。

## Français

- [Rasberry (Caméra)](https://github.com/qfdk/projetESIR/tree/master/Raspberry
) 简单的命令让树莓派也可以推流

- [Linux (SmartPush system + kfc-* + kfc-nginx)](https://github.com/qfdk/projetESIR/tree/master/Linux)
 
- [Web (Client + player)](https://github.com/qfdk/projetESIR/tree/master/Web) 建议根据要求重写UI

## Todo
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

## License Apache 2
World is powered by solitude
![img-source-from-https://github.com/docker/dockercraft](https://github.com/docker/dockercraft/raw/master/docs/img/contribute.png?raw=true)
