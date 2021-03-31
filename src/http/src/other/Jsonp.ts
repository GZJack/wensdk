import {Tools,Url} from '../../lib/Index';

/**
 * jsonp 的配置接口
 *
 * @interface JsonpOptions
 */
export interface JsonpOptions{
    // script节点的src地址属性,默认:''
    url:string;
    // script节点的基础地址,默认:''
    baseUrl?:string;
    // script节点的type类型属性,默认:'text/javascript'
    type?:string;
    // script节点的async类型属性,默认:true
    async?:boolean;
    // script节点的charset类型属性,默认:'utf-8'
    charset?:string;
    // script节点的src地址属性上的查询参数,默认:{}
    params?:{[key:string]:any};
    // script节点的src地址属性上回调函数赋值在这个key值上,默认:'callback'
    callbackKey?:string;
    // script节点的src地址属性上回调函数名称,将该值赋值到上面的key上,默认:'callback'
    callbackName?:string;
    // 回调函数,当使用 Promise 时,就会有该回调了
    callback?:(res:any)=>void;
    // 回调函数,当加载失败时触发
    fail?:(res:any)=>void;
}

/**
 * jsonp 配置
 *
 * @class Options
 */
class Options{

    /**
     * 基础路径
     *
     * @type {string}
     * @memberof Options
     */
    public baseUrl:string = '';
    /**
     * 请求的地址
     *
     * @type {string}
     * @memberof Options
     */
    public url:string = '';

    /**
     * 类型
     *
     * @type {string}
     * @memberof Options
     */
    public type:string = 'text/javascript';

    /**
     * 同步异步
     *
     * @type {boolean}
     * @memberof Options
     */
    public async:boolean = true;

    /**
     * 字符集
     *
     * @type {string}
     * @memberof Options
     */
    public charset:string = 'utf-8';

    /**
     * 赋值到 url 上的参数
     *
     * @type {{[key:string]:any}}
     * @memberof Options
     */
    public params:{[key:string]:any} = {};

    /**
     * 回调函数的属性
     *
     * @type {string}
     * @memberof Options
     */
    public callbackKey:string = 'callback';

    /**
     * 回调函数的名称
     *
     * @type {string}
     * @memberof Options
     */
    public callbackName:string = 'callback';

    /**
     * 回调函数,如果是函数,则执行
     *
     * @memberof Options
     */
    public callback:(res:any)=>void = null;

    /**
     * 失败回调,如果是函数,则执行
     *
     * @memberof Options
     */
    public fail:(res:any)=>void = null;

    /**
     * 是否删除该函数,当 script 加载完成,会通过这个属性进行判断是否删除这个回调函数
     *
     * @type {boolean}
     * @memberof Options
     */
    public isDel:boolean = true;

    /**
     * Creates an instance of Options.
     * @param {(JsonpOptions|any)} options
     * @param {string} jsonid
     * @memberof Options
     */
    constructor(options:JsonpOptions|any,jsonid:string){

        // 保证是必须是一个对象
        if(Tools._IsObject(options)){
            // 在赋值前先修改函数
            this.callback = Tools._IsFunction(options.callback) ? options.callback : null;
            // 拿到当前 this
            let that:any = this;
            // 遍历赋值
            Object.keys(options).forEach((key:string) => {
                // 类型相同则赋值
                if(Tools._ToType(that[key]) === Tools._ToType(options[key])){
                    that[key] = options[key];
                }
            });
        }
        // 解构拿到值
        let {callbackName,callbackKey,callback} = this;
        // 去掉首尾空格,中间的空格也需要去除,并保证是字符串  并去掉带有 window. 的字样
        callbackName = Tools._IsString(callbackName) ? Tools._RTrim(callbackName.replace(/\s+/g,'')).replace(/^window\./i,'') : '';
        // 参数,我们要求
        let NewParams:{[key:string]:any} = {};
        // 回调的函数名称
        let YesCallbackName:string = '';
        // 取该值是不是函数,用 ToGet 的方式去取, callbackName 就可以使用多级取值
        let ToGetFunction:any = Tools._ToGet((window as any),callbackName,null);
        // 如果再全局存在这个函数时,则使用这个函数
        if(Tools._IsFunction(ToGetFunction)){
            // 原有名称
            YesCallbackName = callbackName;
            // 这个原有就存在该 window 上,是不能删除
            this.isDel = false; // 不能删除
        }else{
            // 确定名称,如果该名称在 window 上是一个空直,则可以使用该名称,否则就是用 系统生成的
            YesCallbackName = !Tools._IsEmpty(callbackName) && Tools._IsNull(ToGetFunction) ? callbackName : jsonid;
            // 挂载函数,使用 ToGet 取值就得使用 ToSet 设置值
            Tools._ToSet((window as any),YesCallbackName,Tools._IsFunction(callback) ? callback : (res:any) => {});
            // (window as any)[YesCallbackName] = Tools._IsFunction(callback) ? callback : (res:any) => {};
        }

        // 生成的函数名,必须再赋值会配置上
        this.callbackName = YesCallbackName;

        // 设置回调函数名称
        NewParams[!Tools._IsNull(callbackKey) ? callbackKey : 'callback'] = YesCallbackName;


        // 设置查询参数
        this.params = Tools._Merge({},this.params,NewParams);

        // 字符集
        this.charset = Tools._InArray(this.charset.toLowerCase(),["utf-8","utf-16","gb2312","gbk"],false) ? this.charset : "utf-8";
        // 处理url
        this.url = Url._CreateHttpQueryByBaseUrlUri(this.baseUrl,this.url).set(this.params).Url;
    }
}



/**
 * 负责 jsonp
 *
 * @export
 * @class Jsonp
 */
export class Jsonp{

    /**
     * Jsonp 的最终配置
     *
     * @private
     * @type {Options}
     * @memberof Jsonp
     */
    private _Options:Options;

    /**
     * head 节点,用于承载 script 节点而使用
     *
     * @private
     * @type {HTMLHeadElement}
     * @memberof Jsonp
     */
    private _HeadElement:HTMLHeadElement;

    /**
     * script 节点
     *
     * @private
     * @type {HTMLScriptElement}
     * @memberof Jsonp
     */
    private _ScriptElement:HTMLScriptElement;

    /**
     * 成功监听函数
     *
     * @private
     * @memberof Jsonp
     */
    private _ListenerLoadEvent:(event:Event)=>void;

    /**
     * 失败监听函数
     *
     * @private
     * @memberof Jsonp
     */
    private _ListenerErrorEvent:(event:Event)=>void;


    /**
     * Creates an instance of Jsonp.
     * @param {JsonpOptions} options
     * @memberof Jsonp
    /**
     *Creates an instance of Jsonp.
     * @param {JsonpOptions} options
     * @memberof Jsonp
     */
    private constructor(options:JsonpOptions){
        
        // 定义一个动态ID + 10 位数的时间戳
        let JsonpId:string = "http_jsonp_" + Tools._GetTime(true);

        // 获得 head 和 生成 script 节点
        let head:HTMLHeadElement = document.getElementsByTagName("head")[0];
        let script:HTMLScriptElement = document.createElement("script");

        
        // 通过 参数 实例 构造出来
        let NewOptions:Options = new Options(options,JsonpId);
        // 解构取值:请求地址,类型,异同步,字符集
        let {url,type,charset,async} = NewOptions;

        

        // 设置类型
        // script.type = "text/javascript";
        script.type = type;
        // 加个id
        script.id = JsonpId;
        // 同步
        // script.async = true;
        script.async = async;
        // 字符集
        // script.charset = 'utf-8';
        script.charset = charset;
        // 赋值请求地址
        script.src = url;


        // 定义成功监听函数
        this._ListenerLoadEvent = (event:Event) => {
            this._Load.call(this,event);
        }
        // 定义失败监听函数
        this._ListenerErrorEvent = (event:Event) => {
            this._Error.call(this,event);
        }

        // 挂载两个监听函数
         // 加载成功
         script.addEventListener("load",this._ListenerLoadEvent);
         // 加载失败
         script.addEventListener("error",this._ListenerErrorEvent);

        // 最后将这两个节点挂载当前属性上
        this._HeadElement = head;
        this._ScriptElement = script;
        // 再将当前配置挂载到当前属性上
        this._Options = NewOptions;
    }


    /**
     * 整个创建的入口
     *
     * @static
     * @param {JsonpOptions} options
     * @returns
     * @memberof Jsonp
     */
    public static create(options:JsonpOptions){
        return new Jsonp(options);
    }


    /**
     * 成功
     *
     * @private
     * @param {Event} event
     * @memberof Jsonp
     */
    private _Load(event:Event){
        // 成功回调
        // 如果设置的是 window 函数,则又设置 Promise 成功回调,则需要执行成功回调
        !this._Options.isDel && Tools._IsFunction(this._Options.callback) && this._Options.callback({"errcode":200,"errmsg":"ok"});
        // 销毁(删除事件 和 DOM)
        this._Destroy();
    }

    /**
     * 错误
     *
     * @private
     * @param {Event} event
     * @memberof Jsonp
     */
    private _Error(event:Event){
        // 失败回调
        // 如果设置了失败回调,则会执行
        Tools._IsFunction(this._Options.fail) && this._Options.fail({"errcode":404,"errmsg":"Request error url: " + this._Options.url});
        // 销毁(删除事件 和 DOM)
        this._Destroy();
    }


    /**
     * 销毁
     *
     * @private
     * @memberof Jsonp
     */
    private _Destroy(){
        // 删除监听 加载函数
        this._ScriptElement.removeEventListener("load", this._ListenerLoadEvent, false);
        // 删除监听 失败函数
        this._ScriptElement.removeEventListener("error", this._ListenerErrorEvent, false); 
        // 删除dom元素
        this._ScriptElement.remove();
        // 是否需要删除 window 上定义的回调函数
        if(this._Options.isDel){
            let callbackName:string = this._Options.callbackName;
            if(callbackName.indexOf('.') > 0){
                // 取到上一级
                let Keys:Array<string> = callbackName.split('.');
                // 取出最后一个值
                let LastKey:any = Keys.pop();
                // 取值最终的值
                let LastObject:any = Tools._ToGet((window as any),Keys.join('.'),{});
                // 最后就是删除
                delete LastObject[!isNaN(LastKey) ? parseInt(LastKey) : LastKey];
            }else{
                // 不带有 . 的属性就可以直接删除了
                delete (window as any)[callbackName];
            }
        }
    }



    /**
     * 执行开始
     *
     * @memberof Jsonp
     */
    public run(){
        // 执行的最简单方式就是将 script 插入到 head 里
        this._HeadElement.appendChild(this._ScriptElement);
    }

}