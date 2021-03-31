
// 引入本文件需要的类库
import {
    // 加密模块
    Crypto,
    // 本地缓存模块
    Cache,
    // 本地数据模块
    WData,
    // 工具类模块
    Tools,ToolsStaticClass,UriClass,
    // 二维码模块,及配置接口
    Qrcode,QrcodeConfig,
    // 条形码模块,及配置接口,及生成的对象
    Barcode,BarcodeOptions,WBarCode,
    // 请求模块
    Http,
    // 浏览器
    BrowserClass,
    // 配置
    Config,
    // cookie
    Cookie,
    // vuex 扩展 state
    Store
} from '../lib/Index';



/**
 * 注册的插件接口
 *
 * @interface UseUtils
 */
interface UseUtils{
    install(Wen:Wen|any):void
}

/**
 * Wen JSSDK 配置
 *
 * @export
 * @interface WenConfig
 */
export interface WenConfig{
    qrcode:QrcodeConfig
}

/**
 * Wen JSSDK 的基础类
 * @class Wen
 */
export class Wen{

    /**
     * 是否开发模式
     *
     * @static
     * @type {boolean}
     * @memberof Wen
     */
    public static debug:boolean = false;

    /**
     * 静态的,总配置
     *
     * @static
     * @type {WenConfig}
     * @memberof Wen
     */
    private static _config:WenConfig;

    /**
     * 加密实例
     *
     * @type {Crypto}
     * @memberof Wen
     */
    public crypto:Crypto;

    /**
     * 缓存操作
     *
     * @type {Cache}
     * @memberof Wen
     */
    public cache:Cache;

    /**
     * 本地 cookie 操作
     *
     * @type {Cookie}
     * @memberof Wen
     */
    public cookie:Cookie;

    /**
     * 大数据缓存实例
     *
     * @type {WData}
     * @memberof Wen
     */
    public data:WData;

    /**
     * 二维码实例
     *
     * @type {Qrcode}
     * @memberof Wen
     */
    public qrcode:Qrcode;

    /**
     * 条形码
     *
     * @memberof Wen
     */
    public barcode:Barcode;

    /**
     * 工具实例
     *
     * 这是暴露出来的工具实例
     * 
     * @type {ToolsStaticClass}
     * @memberof Wen
     */
    public tools:ToolsStaticClass;

    /**
     * 路由实例
     * 
     * 暴露出去的
     *
     * @type {UriClass}
     * @memberof Wen
     */
    public uri:UriClass;

    /**
     * 请求实例
     * 
     * 暴露出去
     *
     * @type {Http}
     * @memberof Wen
     */
    public http:Http;



    /**
     * 浏览器信息分析及判断
     *
     * @type {BrowserClass}
     * @memberof Wen
     */
    public browser:BrowserClass;


    /**
     * 整个 SDK 的配置
     *
     * @type {Config}
     * @memberof Wen
     */
    public config:Config;

    /**
     * 状态的原型实例
     *
     * @static
     * @type {Store}
     * @memberof Wen
     */
    public static Store:Store = Store;

    /**
     * Creates an instance of Wen.
     * @memberof Wen
     */
    constructor(){
        
        // 如果没有设置配置,则需要进行配置默认
        if(!Tools._IsObject(Wen._config)){
            // 总的默认设置,如果设置了,就不会走到
            Wen.config({
                "qrcode":{
                    "autoConnect":true,
                    "allowMoreConnect":false,
                    "connect":{
                        "url":'',
                        "time":3000,
                        "count":20,
                        "callbackName":'connect_call'
                    }
                }
            });
        }

        // 整个 SDK 的配置写入和读取
        this.config = Config;

        // 基础扩展,必先写到前头
        this.cookie = Cookie;

        // 浏览器分析及判断,暴露的接口
        this.browser = new BrowserClass();

        // 设置配置后,就会执行到挂载
        this.qrcode = new Qrcode(Wen._config.qrcode);

        // 挂载条形码
        this.barcode = new Barcode();

        // 挂载工具实例,是静态类
        this.tools = ToolsStaticClass;

        // 挂载 url 操作实例
        this.uri = new UriClass();


        // 挂载 http 请求实例
        this.http = new Http();

        // 挂载加密实例
        this.crypto = new Crypto();

        // 挂载缓存
        this.cache = new Cache('zhangsan');

        this.data = new WData();
    }



    /**
     * 总配置的入口
     *
     * @static
     * @param {WenConfig} config
     * @memberof Wen
     */
    public static config(config:WenConfig){
        // 校验设置并设置默认值
        Wen._config = Tools._ToSet(config,['qrcode'],[{}]);
    }

    /**
     * 这是一个空类,主要是用来挂载其他插件的 SDK
     *
     * @static
     * @param {UseUtils} fn
     * @memberof Wen
     */
    public static use(fn: UseUtils): void{
        if(Tools._IsFunction(fn) || Tools._IsObject(fn)){
            // 最后必须有 install
            if(Tools._IsFunction(fn.install)){
                fn.install(Wen);
            }
        }
    }

    /**
     * 用于 vue 的插件注册安装
     *
     * @static
     * @param {*} Vue
     * @memberof Wen
     */
    public static install(Vue:any):void{
        // 这里面是往 vue 的原型对象上挂属性

        // 保证传入的是一个函数,必须是一个 Vue 的函数
        if(Tools._IsFunction(Vue)){

            // new 当前 SDK wen 从中拿到属性
            let wen = new Wen();
            // 即将挂载的属性插件,以key为名,以值为挂载对象
            let VueUtils:any = {
                // 重要实例
                "$w":wen,
                // 挂 MD5
                "$md5":wen.crypto.md5,
                // 挂 sha1
                "$sha1":wen.crypto.sha1,
                // 挂 base64
                "$base64":wen.crypto.base64,
                // 挂 二维码
                "$qr":wen.qrcode,
                // 挂工具
                "$t":wen.tools,
                // 挂 uri
                "$uri":wen.uri,
                // 挂载条形码
                "$bc":wen.barcode,
                // 挂载 浏览器信息
                "browser":wen.browser,
                // 挂载缓存
                "cache":wen.cache,
                // 请求实例
                "$http":wen.http,

            };

            // 然后遍历,往 Vue 的原型上挂载对应的实例
            Object.keys(VueUtils).forEach((key)=>{
                // 往 Vue 上挂载
                Vue.prototype[key] = VueUtils[key];
            });

            // 这个 Store 是使用注册进行,这里需要到混入,拿到上面的实例 如 $http $md5
            Vue.use(Store);            
        }else{
            // throw new TypeError('Vue is not function');
            // 抛出一条错误
            Tools._TypeError('Vue is not function');
        }
    }


    /**
     * 获得版本
     *
     * @readonly
     * @type {number}
     * @memberof Wen
     */
    public get version():number{
        return 1.5;
    }

    /**
     * 简写,大写获得 版本
     *
     * @readonly
     * @type {number}
     * @memberof Wen
     */
    public get V():number{
        return this.version;
    }

}