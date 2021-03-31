
import {HttpOptions,Options} from './Options';
import {Listener} from './listener/Listener'
import {Response} from './response/Response';
import {Request} from './request/Request';
import {Tools} from '../lib/Index';
import {Utils} from './utils/Utils';
import {JqueryAjax} from './utils/JqueryAjax';
import {WxRequest} from './utils/WxRequest';
import {WAjax} from './WAjax';
import {Jsonp,JsonpOptions} from './other/Jsonp';



/**
 * 请求主实例对象
 *
 * @export
 * @class Http
 */
export class Http{

    /**
     * 默认的配置类型,主要是用来校验提交的是不是 标准的配置类型
     *
     * @static
     * @type {(Options|null)}
     * @memberof Http
     */
    public static _defaultConfig:Options|any|null = null;

    /**
     * 单例模式
     *
     * @private
     * @static
     * @type {Http}
     * @memberof Http
     */
    private static _instance:Http;


    /**
     * 当前请求实例的配置
     *
     * @type {(Options|{[key:string]:any})}
     * @memberof Http
     */
    public config:Options|{[key:string]:any} = {};


    /**
     * 当前请求实例的监听实例
     *
     * @private
     * @type {Listener}
     * @memberof Http
     */
    private listener:Listener;

    
    /**
     * 异步函数的挂载属性,对应到每一个实例上
     *
     * @public
     * @memberof Http
     */
    private _asyncfns:{[key:string]:(config:HttpOptions,httpvm:Http)=>Promise<HttpOptions>} = {};


    /**
     * 用户自定义了请求实例,可以设置 Jquery.ajax 或 wx.request
     *
     * @memberof Http
     */
    public ajax:(options:{[key:string]:any})=>any = null;
  

    /**
     * Creates an instance of Http.
     * @memberof Http
     */
    public constructor(){
        // 最后在当前实例上重定义 listener 属性,防止被篡改
        Utils._ReDefineProperty(this,"listener",new Listener());
        // 重定义 listener.request 防止被篡改
        Utils._ReDefineProperty(this.listener,"request",this.listener.request);
        // 重定义 listener.response 防止被篡改
        Utils._ReDefineProperty(this.listener,"response",this.listener.response);
    }


    /**
     * 单例模式,保证唯一的实例
     *
     * @static
     * @returns
     * @memberof Http
     */
    public static getInstance(){
        if(!(Http._instance instanceof Http)){
            Http._instance = new Http();
        }
        return Http._instance;
    }

    /**
     * 设置配置参数
     *
     * @param {(HttpOptions|Options)} config
     * @memberof Http
     */
    public setConfig(config:HttpOptions|Options):void{
        // 保证 config 是对象形式才能进行赋值合并
        if(this.isConfig(config)){
            // 用户总定义好的配置,所有请求都会按照这个配置进行提交,于 当前请求的配置级别最高,会覆盖这里面的配置
            this.config = Tools._MergeConfig(this.config,config);
        }
        // 冻结当前实例,避免用户乱篡改当前实例上的属性,所以 config 只能设置一次,不能直接冻结 Object.freeze(Http.getInstance()); 导出,这样子就没有办法修改 config 了
        // Object.freeze(this);
    }

    /**
     * 判断当前对象是不是 config, 由于在 state,中
     * $store.commit 和 $store.dispatch 都是只能传递一个参数对象的
     * 所以需要将 config 结构出来, data 或 config 
     * 又由于,用户只是传来了 {name:"张三",age:18,sex:"男"} 这里面的 key, 只要有一个不是 config 的属性,
     * 我们就认为不是 config , 就会将上面传过来的对象, 转换成 {data:{name:"张三",age:18,sex:"男"}},
     * 转换成 config 进行传入 http 请求实例中去
     *
     * @param {(HttpOptions|Options)} config
     * @returns {boolean}
     * @memberof Http
     */
    public isConfig(config:HttpOptions|Options):boolean{
        // 必须是一个 config 对象
        if(Tools._IsObject(config)){
            let yes:boolean = true; // 表示当前的配置就是 config
            // 将默认的配置,挂载到 实例下
            if(!Http._defaultConfig) Http._defaultConfig = new Options({});
            // 遍历校验
            Object.keys(config).forEach((key:string) => {
                // 排除掉特殊的特殊的 只要出现 undefined 就证明是乱传参的
                if(!Tools._InArray(key,['_options','$options']) && Http._defaultConfig[key] === undefined){
                    yes = false; // 只要一个 key 不存在,就不是 config
                }
            })
            return yes;
        }else{
            return false; // 不是 config
        }
    }



    /**
     * 为当前请求实例 添加异步函数
     *
     * @param {string} name
     * @param {(config:HttpOptions,httpvm:Http)=>Promise<HttpOptions>} fn
     * @memberof Http
     */
    public addAsyncFn(name:string,fn:(config:HttpOptions,httpvm:Http)=>Promise<HttpOptions>):void{
        // 判断该对象没有被添加过
        if(Tools._IsNull(this._asyncfns[name])){
            // 保证函数必须是 Promise
            if(Tools._IsFunction(fn)){
                // 最后挂载
                this._asyncfns[name] = fn;
            }
        }
    }

    /**
     * 快速设置token函数
     *
     * @param {(config:HttpOptions)=>Promise<HttpOptions>} fn
     * @memberof Http
     */
    public setToken(fn:(config:HttpOptions)=>Promise<HttpOptions>):void{
        // 直接执行
        this.addAsyncFn("token",fn);
    }


    /**
     * 设置 ajax 请求, 可以设置 Jquery ajax 和  微信API wx.request
     *
     * @param {(options:{[key:string]:any})=>any} ajax
     * @param {boolean} [isWechatAjax=false]
     * @memberof Http
     */
    public setAjax(ajax:(options:{[key:string]:any})=>any,isWechatAjax:boolean=false):void{
        // 保证必须是函数
        if(Tools._IsFunction(ajax)){
            // 在这个方法上,添加一个静态属性,用来辨别是不是微信小程序里使用的 wx.request
            (ajax as any).isWechatAjax = isWechatAjax;     
            // 重定义当前的 http 实例上,并且不能修改和删除
            Tools._ReDefineProperty(this,'ajax',ajax);
        }
    }


    /**
     * 执行异步函数,除了不需要token的
     *
     * @private
     * @static
     * @param {{[key:string]:(config:HttpOptions,httpvm:Http)=>Promise<HttpOptions>}} fns
     * @param {HttpOptions} config
     * @param {Http} WVM
     * @returns {Array<Promise<HttpOptions>>}
     * @memberof Http
     */
    private static _CallAllPromiseFn(fns:{[key:string]:(config:HttpOptions,httpvm:Http)=>Promise<HttpOptions>},config:HttpOptions,WVM:Http):Array<Promise<HttpOptions>>{
        // 定义一个就收 Promise 对象的数组
        let pfns:Array<Promise<HttpOptions>> = [];
        // 遍历所有异步函数,并使用 引用传递将 config 和 vm 传到异步函数中去
        Object.keys(fns).forEach((key)=>{
            // 执行回调函数,并确保返回的都是 Promise
            let AsyncFn:Promise<HttpOptions> = fns[key](config,WVM);
            // 确保
            if(Tools._IsPromise(AsyncFn)){
                // 添加 Promise 到数组中
                pfns.push(AsyncFn);
            }
        })
        // 返回一个所有 promise 的数组
        return pfns;
    }


    /**
     * 执行请求
     *
     * @private
     * @static
     * @param {Options} options
     * @param {(response:Response) => any} resolve
     * @param {(response:Response) => any} reject
     * @param {Http} httpvm
     * @memberof Http
     */
    private static _CallAjax(options:Options,resolve:(response:Response) => any,reject:(response:Response) => any,httpvm:Http):void{
        // 统一进行过滤转换请求配置
        options = Request._OptionsTransform(options);

        // 统一定义一个错误函数,这个错误函数用于 Promise then catch 中
        let WAjaxErrorFn:(response:Response)=>any = (response:Response) => {
            // 执行到错误监听,等待监听返回值,如果没有返回值,则使用原来的返回值进行返回
            let ErrorReturnResult:any = httpvm.listener.A[Listener.A2](response);
            // 等待返回,如果返回的 是 undefined 则将原始值返回去
            ErrorReturnResult = Tools._IsNull(ErrorReturnResult) ? response : ErrorReturnResult;
            // 用户配置里的自定义回调函数
            Tools._IsFunction(options.error) && options.error(ErrorReturnResult);
            Tools._IsFunction(options.complete) && options.complete(ErrorReturnResult);
            // 执行 Promise 返回
            reject(ErrorReturnResult);
        }
        // 统一定义一个成功函数,这个函数主要是用到 Promise then 中
        let WAjaxSuccessFn:(response:Response)=>any = (response:Response) => {
            // 响应正确返回监听结果,如果有返回值,则执行返回值
            let ReturnResult:any = httpvm.listener.A[Listener.A1](response);
            // 等待返回,如果返回的 是 undefined 则将原始值返回去
            ReturnResult = Tools._IsNull(ReturnResult) ? response : ReturnResult;
            // 用户配置里的自定义回调函数
            Tools._IsFunction(options.success) && options.success(ReturnResult);
            Tools._IsFunction(options.complete) && options.complete(ReturnResult);
            // 执行 Promise 返回
            resolve(ReturnResult);
        }


        // 分别将对应的函数分别放进 Promise 的回调函数中去

        // 如果使用了 ajax
        if(httpvm.ajax){
            // 在看看是不是使用微信的 wx.request
            if((httpvm.ajax as any).isWechatAjax){
                // 执行 wx 请求
                WxRequest.ajax(httpvm.ajax)(options,httpvm).then(WAjaxSuccessFn,WAjaxErrorFn).catch(WAjaxErrorFn);
            }else{
                // 执行 Jquery 请求
                JqueryAjax.ajax(httpvm.ajax)(options,httpvm).then(WAjaxSuccessFn,WAjaxErrorFn).catch(WAjaxErrorFn);
            }
        }else{
            // 这里使用默认的 WAjax 进行请求
            WAjax.create(options).then(WAjaxSuccessFn,WAjaxErrorFn).catch(WAjaxErrorFn);
        }
    }



    /**
     * 最终的原生请求
     * 
     * 要求
     *  config 从生成,至始至终必须是同一个变量对象的引用,config 原型上有着特定的方法,用于重新校验当前配置
     *
     * @param {(HttpOptions|Options|any)} options
     * @returns {Promise<Response>}
     * @memberof Http
     */
    public request(options:HttpOptions|Options|any):Promise<Response>{
        // console.log('初始的配置',options);
 
        // 拿到 request 函数的所有参数
        let args:IArguments = arguments;
        // 始终返回一个 Promise 对象
        return new Promise((resolve:(response:Response) => any,reject:(response:Response) => any) => {

            // 拿到原始配置,这个原始配置会被克隆挂载到 配置对象的 config.$options 属性上
            let OriginOptions:{[key:string]:any} = Utils._CheckRequestOptions(options,args);
            // 通过合并公共配置,及request()函数的参数,并生成一个新的配置,合并克隆,就是后面的原始有改变,也不会被改变
            let NewOptions:Options|HttpOptions|any = new Options(Tools._Merge({},this.config,OriginOptions),Tools._Merge({},OriginOptions));
            // 传给监听函数的请求前
            NewOptions = this.listener.B[Listener.B1](NewOptions);
            // 校验用户传入的是不是有效的 配置项目,配置对象的原型上有一个重新校验的方法
            if(!Tools._IsObject(NewOptions) || !Tools._IsFunction(NewOptions.reCheck)){
                // 生成一个错误的响应对象
                let ErrorResponse:Response = Response.error('http.listener return is not config',{
                    "config":Utils._CopyConfigInResponse(NewOptions),
                });
                // 通知请求前错误监听
                let ReturnError:Response|any = this.listener.B[Listener.B2](ErrorResponse);
                // 如果不是一个响应对象,我们则返回,则执行到一个 Promise 错误回调,均不能往下执行
                if(Tools._IsObject(ReturnError) && !Tools._IsNull(ReturnError.isResponse)){
                    // 均不能往下执行
                    return reject(ReturnError);
                }else{
                    // 均不能往下执行
                    return;
                }
            }
            // 如果是 config 我们则继续执行

            // 判断是否取消 token 
            if(NewOptions.tokenCancel === true){
                // 执行请求
                Http._CallAjax(NewOptions,resolve,reject,this);
            }else{
                // 不取消token,则需要校验 token

                // 定义一个统一错误回调,用于 Promise then catch 中,共同使用
                let AsyncFnErrorCallback = (WError:Response|any):void => {
                    // 错误,有可能异步请求中产生了错误,异步产生的错误
                    // 说明:
                    // 1. 有可能是异步函数 http 请求发生了错误,(此错误,会在监听中被拦截过一次,只要返回 null,undefined,则不会执行监听)
                    // 2. 有可能是本地读取数据过程中发生错误
                    // 3. 有可能是一些业务逻辑出现错误
                    // 以上的错误,都是当前请求前发生的错误,所以是响应请求前监听错误
                    // console.log('异步函数,统一错误回调 输出',WError);
                    // 这里需要执行到响应的错误回调
                    
                    // 如果不是 null undefined
                    if(!Tools._IsNull(WError)){
                        // 定义一个错误返回对象
                        let RequestBeforeError:Response|any = null;
                        // 如果返回的是 Response 对象
                        if(Tools._IsObject(WError) && !Tools._IsNull(WError.isResponse)){
                            RequestBeforeError = WError;
                        }else{
                            if(Tools._IsString(WError)){
                                RequestBeforeError = Response.error(WError,{});
                            }else{
                                RequestBeforeError = Response.error('async function error',{"data":WError});
                            }
                        }

                        // 等待监听返回来的错误内容
                        RequestBeforeError = this.listener.B[Listener.B2](RequestBeforeError);

                        // 如果监听返回值不为 null,undefined
                        !Tools._IsNull(RequestBeforeError) && reject(RequestBeforeError);

                    }else{
                        // 返回 null 不执行
                        reject(Response.error('async function error',{"data":WError}));
                        // 警告日志
                        Tools._WarnLog('async function error: no return result')
                    }
                }

                // 执行 请求前所有的 Promise 等到所有都返回值了,则进行真实的请求
                Promise.all(
                    // 所有的异步函数,会返回一个数组,数组里全是 Promise 对象
                    Http._CallAllPromiseFn(this._asyncfns,NewOptions,this)
                ).then((configs:Array<Options>)=>{                   
                    // 返回一个配置数组,取最后一个返回的配置,如果返回的配置不是 真实的配置,则使用原来的对象
                    let LastConfig:Options = configs.pop(); // 取出最后一个,还得必须保证其必须是 config
                    // 注销变量
                    configs = null;
                    // 校验返回的是不是原配置对象,如果篡改异步函数中配置,或者 返回的不是 原配置本身,也可以发起请求,但是就相当于,绕过了异步函数,所以最好是在异步函数中不要乱篡改
                    LastConfig = Tools._IsObject(LastConfig) && Tools._IsFunction(LastConfig.reCheck) ? LastConfig : (Tools._IsObject(NewOptions) && Tools._IsFunction(NewOptions.reCheck) ? NewOptions : new Options(Tools._MergeConfig(this.config,OriginOptions),Tools._ToDeepCopyObject(OriginOptions)));
                    // 需要重新校验请求配置参数
                    LastConfig.reCheck();

                    // console.log('请求的config',LastConfig);
                 
                    // 最终拿到了配置信息,等待执行当前请求,
                    // 执行请求
                    Http._CallAjax(LastConfig,resolve,reject,this);
                },AsyncFnErrorCallback).catch(AsyncFnErrorCallback); // Promise then catch 里的错误回调函数是统一处理的
            }
        });
    }


    /**
     * 执行 Get 请求
     *
     * @param {(string|HttpOptions|object)} url
     * @param {(HttpOptions|object|any)} options
     * @returns {Promise<Response>}
     * @memberof Http
     */
    public get(url:string|HttpOptions|object,options:HttpOptions|object|any):Promise<Response>{
        // 统一处理并解构赋值
        [url,options,] = Utils._CheckUrlSetData(url,options,null);
        // 为了统一对象的合并,尽量使用工具类里的Merge
        return this.request(Tools._Merge(options,{"url":url,"method":'GET'}));
    }

    /**
     * 执行 Head 请求
     *
     * @param {(string|HttpOptions|object)} url
     * @param {(HttpOptions|object|any)} options
     * @returns {Promise<Response>}
     * @memberof Http
     */
    public head(url:string|HttpOptions|object,options:HttpOptions|object|any):Promise<Response>{
        // 统一处理并解构赋值
        [url,options,] = Utils._CheckUrlSetData(url,options,null);
        // 为了统一对象的合并,尽量使用工具类里的Merge
        return this.request(Tools._Merge(options,{"url":url,"method":'HEAD'}));
    }

    /**
     * 执行 Options 请求
     *
     * @param {(string|HttpOptions|object)} url
     * @param {(HttpOptions|object|any)} options
     * @returns {Promise<Response>}
     * @memberof Http
     */
    public options(url:string|HttpOptions|object,options:HttpOptions|object|any):Promise<Response>{
        // 统一处理并解构赋值
        [url,options,] = Utils._CheckUrlSetData(url,options,null);
        // 为了统一对象的合并,尽量使用工具类里的Merge
        return this.request(Tools._Merge(options,{"url":url,"method":'OPTIONS'}));
    }


    /**
     * 执行 Post 请求
     *
     * @param {(string|HttpOptions|object)} url
     * @param {(object|Array<object|any>|any)} data
     * @param {(HttpOptions|object|any)} options
     * @returns {Promise<Response>}
     * @memberof Http
     */
    public post(url:string|HttpOptions|object,data:object|Array<object|any>|any,options:HttpOptions|object|any):Promise<Response>{
        // 统一处理并解构赋值
        [url,options,data] = Utils._CheckUrlSetData(url,options,data);
        // 为了统一对象的合并,尽量使用工具类里的Merge
        return this.request(Tools._Merge(options,{"url":url,"data":data,"method":'POST'}));
    }

    /**
     * 执行 Put 请求
     *
     * @param {(string|HttpOptions|object)} url
     * @param {(object|Array<object|any>|any)} data
     * @param {(HttpOptions|object|any)} options
     * @returns {Promise<Response>}
     * @memberof Http
     */
    public put(url:string|HttpOptions|object,data:object|Array<object|any>|any,options:HttpOptions|object|any):Promise<Response>{
        // 统一处理并解构赋值
        [url,options,data] = Utils._CheckUrlSetData(url,options,data);
        // 为了统一对象的合并,尽量使用工具类里的Merge
        return this.request(Tools._Merge(options,{"url":url,"data":data,"method":'PUT'}));
    }

    /**
     * 执行 Patch 请求
     *
     * @param {(string|HttpOptions|object)} url
     * @param {(object|Array<object|any>|any)} data
     * @param {(HttpOptions|object|any)} options
     * @returns {Promise<Response>}
     * @memberof Http
     */
    public patch(url:string|HttpOptions|object,data:object|Array<object|any>|any,options:HttpOptions|object|any):Promise<Response>{
        // 统一处理并解构赋值
        [url,options,data] = Utils._CheckUrlSetData(url,options,data);
        // 为了统一对象的合并,尽量使用工具类里的Merge
        return this.request(Tools._Merge(options,{"url":url,"data":data,"method":'PATCH'}));
    }

    /**
     * 执行 Delete 请求
     *
     * @param {(string|HttpOptions|object)} url
     * @param {(object|Array<object|any>|any)} data
     * @param {(HttpOptions|object|any)} options
     * @returns {Promise<Response>}
     * @memberof Http
     */
    public delete(url:string|HttpOptions|object,data:object|Array<object|any>|any,options:HttpOptions|object|any):Promise<Response>{
        // 统一处理并解构赋值
        [url,options,data] = Utils._CheckUrlSetData(url,options,data);
        // 为了统一对象的合并,尽量使用工具类里的Merge
        return this.request(Tools._Merge(options,{"url":url,"data":data,"method":'DELETE'}));
    }



    
    /**
     * 请求后台getJson数据,保证返回来的时 json
     *
     * @param {string} url
     * @returns {Promise<Response>}
     * @memberof Http
     */
    public getJson(url:string):Promise<Response>{
        // 保证必须是字符串
        url = Tools._IsString(url) ? url : '';
        // 执行 Get 获得 Json 数据
        return this.get(url,{"dataType":"json"});
    }


    /**
     * 向后台提交json数据,保证提交的数据是json
     *
     * @param {(string|HttpOptions|object)} url
     * @param {(object|Array<object|any>|any)} data
     * @returns {Promise<Response>}
     * @memberof Http
     */
    public postJson(url:string|HttpOptions|object,data:object|Array<object|any>|any):Promise<Response>{
        // 统一处理并解构赋值
        [url,,data] = Utils._CheckUrlSetData(url,{},data);
        // 执行 Post 提交 Json
        return this.post(url,data,{"contentType":"json"});
    }

    /**
     * 执行 jsonp 
     *
     * @param {string|JsonpOptions} url
     * @param {JsonpOptions} options
     * @returns {Promise<any>}
     * @memberof Http
     */
    public jsonp(url:string|JsonpOptions,options:JsonpOptions|any):Promise<any>{
        // 统一处理并解构赋值
        [url,options,] = Utils._CheckUrlSetData(url,options,null);
        // 返回也是一个 Promise
        return new Promise((resolve:(result:any)=>void,reject:(result:any)=>void) => {
            // 定义三个字符串
            let Text1 = 'baseUrl',Text2 = 'charset',Text3 = 'callback',Text4 = 'fail',config = this.config;
            // 执行真实的 Jsonp
            Jsonp.create(Tools._Merge(options,{
                // 赋值 url 
                "url":url,
                // 基础路径
                [Text1]:Tools._ToGet(options,Text1,Tools._ToGet(config,Text1,'')),
                // 字符集
                [Text2]:Tools._ToGet(options,Text2,Tools._ToGet(config,Text2,'utf-8')),
                // 成功响应的回调函数
                [Text3]:Tools._IsFunction(options[Text3]) ? options[Text3] : (Tools._IsFunction(resolve) ? resolve : null),
                // 失败响应的回调函数
                [Text4]:Tools._IsFunction(options[Text4]) ? options[Text4] : (Tools._IsFunction(reject) ? reject : null)
            })).run();
        });
    }



    /**
     * 事件推送,由服务器单向向客户端推送事件,一般用作定时接收通知,页面授权扫码监听是否进行授权
     * 说明:
     * 事件流,单一的,只能监听一次,当执行新的监听会注销原来的监听,还支持多个监听共存
     * 如果不支持 EventSource 就轮询支持 get 请求
     * 默认是 单一实例,会覆盖原来的实例
     * 默认是 60 秒超时,可以设置 0 无限时
     * 错误的最大次数 默认 50,连接上一次,则会在清零
     * @param url {string} 执行的连接地址
     * @param options {object|function} 配置参数+监听函数,如果是监听函数,则是监听信息返回的参数
     */ 
    public event(url:string,options:{[key:string]:any}){
         // 统一处理并解构赋值
         [url,options,] = Utils._CheckUrlSetData(url,options,null);
    }
}