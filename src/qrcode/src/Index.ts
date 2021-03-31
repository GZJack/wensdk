
import {Connect,ConnectConfig} from './connect/Index';


import {Login,LoginConfig} from './login/Index';



import {QRCode,QRErrorCorrectLevel} from "./create/QRCode";

import {WQRCode,WQRCodeOptions} from './create/WQRCode';


/**
 * 二维码实例的配置
 *
 * @export
 * @interface QrcodeConfig
 */
export interface QrcodeConfig{
    autoConnect?:boolean;
    allowMoreConnect?:boolean;
    connect?:ConnectConfig;
    login?:LoginConfig
}

/**
 * 二维码插件 SDK
 * 1.负责生成二维码
 * 2.负责与后台的二维码的监听授权
 * @class Qrcode
 */
export class Qrcode{

    /**
     * 整个二维码的配置对象挂载
     *
     * @private
     * @static
     * @type {QrcodeConfig}
     * @memberof Qrcode
     */
    private static _config:QrcodeConfig;
    
    /**
     *Creates an instance of Qrcode.
     * @memberof Qrcode
     */
    constructor(config:QrcodeConfig){
        // 赋值 config
        Qrcode._config = config;
    }

    /**
     * 二维码连接配置函数,并返回一个连接实例
     *
     * @param {ConnectConfig} config
     * @returns {Connect}
     * @memberof Qrcode
     */
    public connect(config:ConnectConfig):Connect{
        let autoConnect = Qrcode._config.autoConnect;
        // 是否允许多连接
        if(Qrcode._config.allowMoreConnect){
            return new Connect(config,autoConnect);
        }else{
            return Connect.getInstance(config,autoConnect);
        }
    }


    /**
     * 传入配置,直接生成一个二维码对象
     * 
     * 然后通过 toCanvas(),toImage(),downloadImage(),生成指定的二维码对象,每个方法返回的都是一个 Promise 对象
     *
     * @param {WQRCodeOptions} options
     * @returns {WQRCode}
     * @memberof Qrcode
     */
    public create(options:WQRCodeOptions):WQRCode{
        return new WQRCode(options);
    }


    /**
     * 二维码登录
     *
     * @param {LoginConfig} config
     * @returns {Login}
     * @memberof Qrcode
     */
    public login(config:LoginConfig):Login{
        // 执行单例模式
        return Login.getInstance(config);
    }


}