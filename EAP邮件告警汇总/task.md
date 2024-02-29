一、邮件
1.一个设备 发送静态邮件给指定人
2.一个设备， 发送设备动态数据给指定人
3.一个设备，发送动态数据并设计html样式
4.资产中汇总多个设备的数据，并发送好看的表格给指定人
5.收到 特定的事件信息时，发送资产数据email，给指定人。
6.如何动态设置多个收件人
二、统计汇总
1.如何拿到不同设备的值
2.如何区分不同设备的值，并计算所需属性的duration
3.如何整理成表格所需数据，传给email功能前的节点


1.  表格中的区域名 、所属模组、部署ip、设备类型这四个静态数据像机台name一样跟随设备，还是遥测数据会实时发送？

自定义server attribute：
areaName  belongTo ip deviceType

2. EAP告警汇总事件   `{"AlarmReportEvent":""}`  接收到这个AlarmReportEvent属性， 就把所有的设备数据汇总计算出来，并发送email表格？



建立三个device => 关联到一个资产=> 对应的资产profile 关联 发送邮件的rule
change 


deviceInfo
{"MA02-XRAY01":{"ip":"127.0.0.1","area":"2F","module":"注胶"},"MA02-MODULEXRAY02-A":{"ip":"127.0.0.1","area":"2F","module":"注胶"}}


EAPConnectState
{"MA02-MODULEXRAY02-A":{"state":"disconnect","ts":"1709091725136"},"MA02-XRAY01":{"state":"connect","ts":"1709091086240"}}



1。 资产的初始化格式必须有 {info:[]} 
2。 发送告警事件 { xxx : 1}
3。 设备类型是啥

