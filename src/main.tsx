import {Wen} from './wen/main';
import {Q,JQ} from './Q/main';


// 可以在这里进行二次封装
// 在wen直接挂载,use() 是用来给其他注册的
// import Qrcode from './qrcode/index';
// // 注册验证码插件
// Wen.use(Qrcode);


// 必须声明window接口
declare global {
    interface Window {
        Wen: Wen;
        Q:JQ;
    }
}


// 挂载window上
(window as any).Wen = Wen;
(window as any).Q = Q;


// Wen.config({
//     qrc:{
//         y:''
//     }
// });


var wen:Wen = new Wen();

// wen.qrcode.connect({
//     url:'1233332',
//     time:30,
//     count:30
// });

// wen.qrcode.login({
//     login_url:'http://wen.io:6060/qr/login?appid=1233333321433234243242&scope=wechat_login&state=123&t=1578729879361#dsavf',
//     connect_url:'',
//     appid:'',
//     state:''
// });

// Q('#el').hide();


import {Store} from './store/main';

import Stores from './state/Index';


// // 注册
Store.use(Stores);

