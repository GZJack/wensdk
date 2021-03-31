
import {Tools} from '../../lib/Index';

/**
 * 二维码授权登录配置
 *
 * @export
 * @interface LoginConfig
 */
export interface LoginConfig{
    // 登录地址,可以携带 appid,state
    login_url:string;
    connect_url:string;
    appid:string;
    state?:string;
    
}


/**
 * 负责二维码授权登录,
 * 要求:
 * 1. 通过getScript从后台拿到二维码图片(base64)和uuid(或者说是整个连接的地址也行)
 * 2. 将二维码显示显示到输入的图片元素上
 * 3. 通过connect与后台保持连接监听获得数据
 * 4. 允许刷新,重新获得二维码图片和新的uuid
 * 5. 只能是单例模式,只可以通过配置一次进行登录
 *
 * @class Login
 */
export class Login{

    /**
     * 单例模式实例
     *
     * @private
     * @static
     * @type {Login}
     * @memberof Login
     */
    private static _instance:Login=null;

    /**
     * 二维码授权登录,配置参数
     *
     * @private
     * @type {LoginConfig}
     * @memberof Login
     */
    private _config:LoginConfig;

    /**
     * Creates an instance of Login.
     * @param {LoginConfig} config
     * @memberof Login
     */
    private constructor(config:LoginConfig){
        // 赋值配置参数
        this._config = config;

        // 一 new 就开始登录了
        this._login();
    }


    /**
     * 单例模式,的入口
     *
     * @static
     * @param {LoginConfig} config
     * @returns
     * @memberof Login
     */
    public static getInstance(config:LoginConfig){
        // 不是该实例,则new
        if(!(Login._instance instanceof Login)){
            // new 实例,并赋值
            Login._instance = new Login(config);
        }
        // 返回实例
        return Login._instance;
    }


    private _login(){

        let UrlObject1 = Tools._ToParseUrl();

        console.log('http://wen.io:6060/qr/login?appid=1233333321433234243242&scope=wechat_login&state=123&t=1578729879361&a[0]=1&a[1]=445#dsavf');
        

        console.log('创建出的连接1',UrlObject1);

        let UrlObject = Tools._ToParseUrl(this._config.login_url);

        console.log('创建出的连接',UrlObject);


        console.log('无端口',Tools._ToParseUrl('http://wen.io/qr/login?appid=1233333321433234243242&scope=wechat_login&state=123&t=1578729879361#dsavf'));
        

        console.log('无协议',Tools._ToParseUrl('/qr/login?appid=1233333321433234243242&scope=wechat_login&state=123&t=1578729879361#dsavf'));
        
        
    }
}