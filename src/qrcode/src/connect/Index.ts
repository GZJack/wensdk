
// 引入依赖库暴露出来的类
import {Tools,Q,Url} from '../../lib/Index';


/**
 * 二维码连接的配置接口
 *
 * @interface ConnectConfig
 */
export interface ConnectConfig{
    // 连接的地址
    url:string,
    // 连接的最大次数
    count?:number,
    // 每次连接的时间间隔
    time?:number,
    // 后台返回的全局需要挂载
    callbackName?:string
}


/**
 * 监听函数中参数的回调函数,
 *
 * @interface listenerFn
 */
interface listenerFn{
    (code:number,...args:Array<any>):boolean;
}


/**
 * 二维码与后台的连接类
 *
 * @export
 * @class Connect
 */
export class Connect{
    
    /**
     * 连接配置,会被重定义到 连接实例上
     *
     * @type {ConnectConfig}
     * @memberof Connect
     */
    private _config:ConnectConfig;


    /**
     * 单例模式的挂载
     *
     * @static
     * @type {Connect}
     * @memberof Connect
     */
    private static _instance:Connect;

    /**
     * 该实例的所有监听函数都挂载该属性上
     *
     * @private
     * @static
     * @type {Array<listenerFn>}
     * @memberof Connect
     */
    private _listeners:Array<listenerFn> = [];

    /**
     * 连接状态,当状态等于false,就不能再执行了
     *
     * @private
     * @type {boolean}
     * @memberof Connect
     */
    private _status:boolean=true;

    /**
     * 记录连接过的次数,含成功和识别的
     *
     * @private
     * @type {number}
     * @memberof Connect
     */
    private _count:number=0;

    /**
     * 挂载当前的定时器,用户等会销毁
     *
     * @private
     * @type {*}
     * @memberof Connect
     */
    private _timer:any=null;



    /**
     * Creates an instance of Connect.
     * @param {ConnectConfig} config
     * @memberof Connect
     */
    constructor(config:ConnectConfig,IsAutoConnect:boolean=true){
        // 重定义配置属性
        // Tools.ReDefineProperty(this,'_config',config); // 感觉重定义没有什么意义了
        this._config = config;
        // 保证 _listeners 属性必须是数组,如果不是数组,则转为数组空
        Tools._IsEmptyToBeArray(this._listeners)
        // 首先设置全局监听函数
        this._setCallBack(true,false);
        // 设置当前对象上的属性为不可枚举
        Tools._ForEachObjectProperty(this);
        // 是否自动开始
        if(IsAutoConnect){
            this.start(); // 执行自动连接
        }
    }



    /**
     * 单例模式入口
     *
     * @static
     * @param {ConnectConfig} config
     * @param {boolean} [IsAutoConnect=true]
     * @returns
     * @memberof Connect
     */
    public static getInstance(config:ConnectConfig,IsAutoConnect:boolean=true){
        // 不是该实例,就 new
        if(!(Connect._instance instanceof Connect)){
            // new 并赋值该实例
            Connect._instance = new Connect(config,IsAutoConnect);
        }
        // 返回该实例
        return Connect._instance;
    }

    /**
     * 设置(挂载和销毁)和发送回调函数,挂载window上,发送也是使用window上的发送
     *
     * @private
     * @param {boolean} IsSet
     * @param {boolean} IsDestroy
     * @param {number} code
     * @param {string} text
     * @memberof Connect
     */
    private _setCallBack(IsSet:boolean,IsDestroy:boolean,code?:number,text?:string){
        // 提取监听函数名
        let CallbackName = this._config.callbackName;
        // 保证必须是合法的
        CallbackName = Tools._IsString(CallbackName) && !Tools._IsEmpty(CallbackName) ? CallbackName : 'connect_call';
        // 是否设置
        if(IsSet){
            // 保证挂载在window命名的监听函数,不存在,才会进行挂载
            if(!Tools._IsFunction((window as any)[CallbackName])){
                // 如果不是监听函数,则创建,这个函数挂载类的静态方法上,私有的
                (window as any)[CallbackName] = this._getCallBack.apply(this);
            }else{
                // 如果开启设置,并传入销毁,此函数又存在,则执行销毁
                if(IsDestroy){
                    // 不能直接删除函数,我们先将其置为 null,后再删除
                    (window as any)[CallbackName] = null;
                    // 再删除就等于 undefined 了
                    delete (window as any)[CallbackName];
                }
            }
        }else{
            // 必须保证是函数
            if(Tools._IsFunction((window as any)[CallbackName])){
                // 执行该函数,完成回调
                (window as any)[CallbackName](code,text);
            }
        }
    }

    /**
     * 与window上绑定的事件监听函数相关
     *
     * @private
     * @returns
     * @memberof Connect
     */
    private _getCallBack(){
        // 绑定一个回调函数,主要是为了方便绑定this
        return (code:number,...args:Array<any>) => {
            // 遍历执行所有监听函数,如果返回的是 true=>则继续执行,false=>则终止,并且销毁该实例
            this._listeners.forEach((fn:listenerFn)=>{
                // 执行该函数,并监听回调执行的结果
                let Result:boolean|void = fn.call(this,code,args);
                // 如果是 true,就继续,false就必须销毁,无返回值,既不继续,也不销毁
                if(Result===true){       
                    this.reload();
                }else if(Result===false){
                    this.stop();
                }
            })
        };
    }

    /**
     * 合并地址,拼接一个时间戳
     *
     * @private
     * @static
     * @param {string} url
     * @param {number} time
     * @returns {string}
     * @memberof Connect
     */
    private static _mergeUrl(url:string,time:number):string{ 
        // 保证传入的必须是字符串,通过解析链接,获得 Url
        return Url._ParseUrl(!Tools._IsString(url) ? '/' : url).set('t',time).Url;
    }

    /**
     * 记录连接的次数,当次数超过了,则自动停止销毁
     *
     * @private
     * @param {boolean} [IsFail=false]
     * @memberof Connect
     */
    private _callConnectCount(IsFail:boolean=false):void{
        // 记录连接的次数
        this._count += 1;
        // 如果是错误了,仍需要自动去连接
        if(IsFail && this._status){
            setTimeout(()=>{
                this._connect();
            },1000);
        }
        // 如果次数超出了,就会销毁
        if(this._count >= this._config.count){
            // 先发送一条超时消息,等stop进行销毁
            this._setCallBack(false,false,0,'expired');
            // 已经超出了,得执行销毁
            this.stop();
        }
    }

    /**
     * 执行连接,私有函数
     *
     * @private
     * @memberof Connect
     */
    private _connect():void{
        // 状态必须是开启的
        if(this._status){
            // 执行 script 向服务器发起请求
            Q.getScript(Connect._mergeUrl(this._config.url,Q.getTime()),(e) => {
                // 记录执行了多少次
                this._callConnectCount(false);
            },(e) => {
                // 记录失败的次数
                this._callConnectCount(true);
            });
        }
    }

    
    /**
     * 暴露出,连接启动的开始
     *
     * @returns {Connect}
     * @memberof Connect
     */
    public start():Connect{
        // 是初次连接,才能执行连接
        if(this._count === 0){
            // 首次定时2秒后执行
            setTimeout(()=>{
                // 执行连接
                this._connect();
            },2000);
        }  
        // 返回当前实例
        return this;
    }

    /**
     * 暴露出,重新连接的函数
     *
     * @returns {Connect}
     * @memberof Connect
     */
    public reload():Connect{
        // 获得时间间隔
        let time:number = this._config.time;
        // 每次执行一次重载,都会清空上一次的定时器
        clearTimeout(this._timer);
        // 设置时间间隔执行连接
        this._timer = setTimeout(()=>{
            // 执行连接
            this._connect();
        },time >= 1000 ? time : 3000);
        // 返回当前实例
        return this;
    }

    /**
     * 停止继续连接,或销毁当前连接实例
     *
     * @param {boolean} IsDestroy
     * @memberof Connect
     */
    public stop(IsDestroy:boolean=true):void{
        // 改变状态
        this._status = false;
        // 销毁时间定时器
        clearTimeout(this._timer);
        // 置空
        this._timer = null;
        // 是否销毁全局监听函数
        if(IsDestroy){
            // 第一个 true 开启设置,第二个true,执行销毁,后面两个没有意义
            this._setCallBack(true,true);
            // 还需要销毁监听数组
            this._listeners = [];
        }
    }



    /**
     * 挂载监听函数
     *
     * @param {listenerFn} fn
     * @returns {Connect}
     * @memberof Connect
     */
    public listener(fn:listenerFn):Connect{
        // 必须是函数,才能进行添加
        Tools._IsFunction(fn) && this._listeners.push(fn);
        // 返回当前实例
        return this;
    }

}