import {Response} from './response/Response';
import {Tools} from '../lib/Index'; 

/**
 * 请求的配置项接口
 *
 * @export
 * @interface HttpOptions
 */
export interface HttpOptions{
    // 基础路由
    baseUrl?:string;
    // 请求的地址
    url:string;
    // 请求的方式
    method?:string;
    // 字符集
    charset?:string;
    // 参数对象,最后是会赋值到url上的
    params?:object;
    // 数据
    data?:object|Array<object|string|any>|string|null|any;
    // 跨域携带cookie
    withCredentials?:boolean;
    // 内容长度
    maxContentLength?:number;
    // 请求头
    headers?:object;
    // 提交内容的格式  Content-Type: "application/json;charset=utf-8"
    contentType?:string;
    // 返回的数据类型
    dataType?:string;
    // 加密时,需要传递的名称 通过 contentType => etext
    ename?:string;
    // 取消 token
    tokenCancel?:boolean;
    // token 名称,可以自定义名称
    tokenName?:string;
    // 提交 token 的方式,将token放在什么位置上 all => ["url","head","cookie"]
    tokenType?:string;
    // 定义请求超时时间戳
    timeout?:number;
    // 使用 formdata 提交,默认是不使用的,如果data本身就是formdata,也不会反转换
    useFormData?:boolean;
    // 成功的回调函数
    success?:(response:Response)=>void;
    // 失败的回调函数
    error?:(response:Response)=>void;
    // 无论成功与否均会回调
    complete?:(response:Response)=>void;
}




/**
 * 请求 http 的配置
 *
 * @export
 * @class Options
 */
export class Options{
    /**
     * 配置的基础路径 http://www.xxx.com
     *
     * @type {string}
     * @memberof Options
     */
    public baseUrl:string = '';

    /**
     * 当前请求的地址
     *
     * @type {string}
     * @memberof Options
     */
    public url:string = '';

    /**
     * 执行请求的方式
     *
     * @type {string}
     * @memberof Options
     */
    public method:string = 'GET';

    /**
     * 请求的字符集
     *
     * @type {string}
     * @memberof Options
     */
    public charset:string  = "utf-8";


    /**
     * 提交的 url Get Query 请求参数
     *
     * @type {object}
     * @memberof Options
     */
    public params:object = {};

    /**
     * 提交的数据
     *
     * @type {(object|Array<object|any>|null|any)}
     * @memberof Options
     */
    public data:object|Array<object|any>|null|any = null;

    /**
     * 跨域携带cookie
     *
     * @type {boolean}
     * @memberof Options
     */
    public withCredentials:boolean = false;

    /**
     * 提交的内容长度
     *
     * @type {number}
     * @memberof Options
     */
    public maxContentLength:number = -1;

    /**
     * 设置当前的请求头
     * 
     * 默认接收的类型,最低级的, application/json,text/plain
     * 
     * 中级, q=0.5,application/json
     * 
     * 高级, q=0.9,application/json 或 q=0.9,application/e+json
     *
     * @type {{[key:string]:any}}
     * @memberof Options
     */
    public headers:{[key:string]:any} = {"Accept":"application/json,text/plain,text/html,*/*;q=0.5,application/json;"};

    /**
     * 提交内容的格式  Content-Type: "application/json;charset=utf-8"
     *
     * @type {string}
     * @memberof Options
     */
    public contentType:string = "text"; // 默认 application/x-www-form-urlencoded 可以简写: plain json xml
    
    /**
     * 返回的数据类型
     *
     * @type {string}
     * @memberof Options
     */
    public dataType:string ="text"; // 允许的的类型 ["text","xml","html","json","jsonp","script"]
    
    /**
     * 加密时,需要传递的名称 通过 contentType => etext
     *
     * @type {string}
     * @memberof Options
     */
    public ename:string = ""; // 当不为空,且是字符串的时候,则会启动加密
    
    /**
     * 取消 token
     *
     * @type {boolean}
     * @memberof Options
     */
    public tokenCancel:boolean = false;
    
    /**
     * token 名称,可以自定义名称
     *
     * @type {string}
     * @memberof Options
     */
    public tokenName:string = "token";

    /**
     * 提交 token 的方式,将token放在什么位置上 all => ["url","head","cookie"]
     *
     * @type {string}
     * @memberof Options
     */
    public tokenType:string = "url"; // ["url","head","cookie","all"]
    
    /**
     * 请求超时时间戳,单位为毫秒
     *
     * @type {number}
     * @memberof Options
     */
    public timeout:number = 60000;
    
    /**
     * 使用 formdata 提交,默认是不使用的,如果data本身就是formdata,也不会反转换
     *
     * @type {boolean}
     * @memberof Options
     */
    public useFormData:boolean = false;


    /**
     * 配置上的成功回调
     *
     * @memberof Options
     */
    public success:(response:Response)=>void;

    /**
     * 配置上的失败回调
     *
     * @memberof Options
     */
    public error:(error:Response)=>void;

    /**
     * 配置上的,不论成功与否均回调
     *
     * @memberof Options
     */
    public complete:(response:Response)=>void;


    /**
     * 用于传入的额外配置参数,会被统一挂载到这里
     *
     * @type {{[key:string]:any}}
     * @memberof Options
     */
    public options:{[key:string]:any} = {};

    /**
     * 原始的配置参数
     *
     * @type {{[key:string]:any}}
     * @memberof Options
     */
    public $options:{[key:string]:any} = {};

    



    /**
     * Creates an instance of Options.
     * @param {(HttpOptions|object)} config
     * @param {{[key:string]:any}} [OriginOptions=null]
     * @memberof Options
     */
    constructor(config:HttpOptions|object,OriginOptions:{[key:string]:any}=null){
        // this.error=function(error){

        // };
        // // 无论成功与否均会回调
        // this.complete=function(response){
        
        // };
        // // 基础路由
        // this.baseUrl="";
        // // 请求的地址
        // this.url="";
        // // 请求的方式
        // this.method="GET";
        // // 字符集
        // this.charset="utf-8";
        // // 参数对象,最后是会赋值到url上的
        // this.params={};
        // // 数据
        // this.data=null;
        // // 跨域携带cookie
        // this.withCredentials=false;
        // // 内容长度
        // this.maxContentLength=-1;
        // // 请求头
        // this.headers={Accept:"application/json, text/plain, */*"};  // Accept: application/json, text/plain, */* 允许返回的数据类型
        // // 提交内容的格式  Content-Type: "application/json;charset=utf-8"
        // this.contentType="text"; // 默认 application/x-www-form-urlencoded 可以简写: plain json xml
        // // 返回的数据类型
        // this.dataType="text"; // 允许的的类型 ["text","xml","html","json","jsonp","script"]
        // // 加密时,需要传递的名称 通过 contentType => etext
        // this.ename=""; // 当不为空,且是字符串的时候,则会启动加密
        // // 取消 token
        // this.tokenCancel=false;
        // // token 名称,可以自定义名称
        // this.tokenName="token";
        // // 提交 token 的方式,将token放在什么位置上 all => ["url","head","cookie"]
        // this.tokenType="url"; // ["url","head","cookie","all"]
        // // 超时  
        // this.timeout=0;
        // // 使用 formdata 提交,默认是不使用的,如果data本身就是formdata,也不会反转换
        // this.useFormData=false;
        // 成功的回调函数
        this.success = (response:Response):void => {
        
        };
        // 失败的回调函数
        this.error = (error:Response):void => {
        
        };
        // 无论成功与否均会回调
        this.complete = (response:Response):void => {
        
        };

        // 执行校验,并赋值
        CheckOptions._CheckTypeSetConfig(CheckOptions._DefaultOptions,this,config,OriginOptions);
    }


    /**
     * 配置参数重新校验
     *
     * @memberof Options
     */
    public reCheck():void{
        // 执行校验,并赋值
        CheckOptions._CheckTypeSetConfig(CheckOptions._DefaultOptions,this,this,null);
    }
    


    


    // /**
    //  * 成功的回调函数
    //  *
    //  * @param {Response} response
    //  * @memberof Options
    //  */
    // public success(response:Response):void{

    // }


    // /**
    //  * 失败的回调函数
    //  *
    //  * @param {Response} response
    //  * @memberof Options
    //  */
    // public error(response:Response):void{

    // }

    // /**
    //  * 无论成功与否均会回调
    //  *
    //  * @param {Response} response
    //  * @memberof Options
    //  */
    // public complete(response:Response):void{

    // }

}


/**
 * 内部使用的,校验请求配置的类静态函数
 *
 * @class CheckOptions
 */
class CheckOptions{

    /**
     * 默认的配置对象,保留原始的一份,确保原来的 key 是固定模式的,当执行重新校验时,也能恢复到原来的状况
     *
     * @static
     * @type {Options}
     * @memberof CheckOptions
     */
    public static _DefaultOptions:Options|any = null;


    /**
     * 检验并设置Config的类型和值
     *
     * @private
     * @static
     * @param {Options} OVM
     * @param {HttpOptions} options
     * @memberof Options
     */
    public static _CheckTypeSetConfig(DefaultOptions:Options|any,OVM:Options|any,options:HttpOptions|any,OriginOptions:{[key:string]:any}=null):void{
        // 记录一份原始的请求配置,用于重新校验时使用
        if(Tools._IsNull(DefaultOptions)){
            // 深度克隆一份
            DefaultOptions = Tools._Merge({},OVM);
            // 并赋值到默认值上
            CheckOptions._DefaultOptions = DefaultOptions;
        }

        // 保证传入的配置必须是对象类型
        if(Tools._IsObject(options)){
            // 额外的参数,统一起来管理,都会被挂载的 this.options 上
            let userOptions:any = OVM.options;
            // 遍历
            Object.keys(options).forEach((key:string)=>{
                // 等于 undefined 无需校验
                if(DefaultOptions[key] === undefined){
                    // 附加的内容,直接挂载在options上
                    userOptions[key] = options[key];
                    // 删除一些多余的属性
                    delete OVM[key];
                }else{
                    // 除了 data 和 headers options $options 头信息额外配置不能乱改的
                    let IsSpecialPrototype = Tools._InArray(key,['data','headers','options','$options'],false);

                    // 校验类型,除了 data 特殊性,还有 headers 不能设置
                    if(!IsSpecialPrototype && Tools._ToType(DefaultOptions[key]) === Tools._ToType(options[key])){
                        OVM[key] = options[key];                     
                    }else{
                        // 如果设置的是数据
                        if(key === "data"){
                            OVM.data = options.data;
                        }
                        // 当不是以下类型,chuxian
                        if(!IsSpecialPrototype){
                            Tools._WarnLog(`Http config.${key} type error: Require [${Tools._ToType(DefaultOptions[key])}],Current [${Tools._ToType(options[key])}]`);
                        }
                    }
                }
            });

            // 这两个属性是能改的,所以均不需要重定义了

            // 原始配置,必须是对象,且不能为空,才会被记录
            if(Tools._IsObject(OriginOptions) && !Tools._IsEmpty(OriginOptions)){
                // 合并克隆,就是后面的原始有改变,也不会被改变
                OVM.$options = Tools._Merge({},OriginOptions);
                // 将其重定义到原来的属性上
                // Tools._ReDefineProperty(OVM,'$options',Tools._Merge({},OriginOptions));
            }
            // 额外参数不为空的时候才进行合并
            if(!Tools._IsEmpty(userOptions)){
                // 需要将原来的合并起来,并被覆盖, 合并克隆,就是后面的原始有改变,也不会被改变
                OVM.options = Tools._Merge({},OVM.options,userOptions);
                // 将其重定义到原来的属性上
                //  Tools._ReDefineProperty(OVM,'options',Tools._Merge({},OVM.options,userOptions));
            }
            

            // 然后赋值结束后,再继续执行校验 config
            CheckOptions._CheckConfig(OVM);
        }
    }

    /**
     * 校验并设置默认值
     *
     * @private
     * @static
     * @param {*} Value
     * @param {Array<string>} Items
     * @param {*} DefaultValue
     * @param {boolean} [IsIgnore=false]
     * @returns {*}
     * @memberof CheckOptions
     */
    private static _CheckSetDefault(Value:any,Items:Array<string>,DefaultValue:any):any{
        return Tools._InArray(Value,Items,false) ? Value : DefaultValue;
    }

    /**
     * 校验,并重新赋值,不符合的则设置成默认值
     *
     * @private
     * @static
     * @param {Options} OVM
     * @memberof CheckOptions
     */
    private static _CheckConfig(OVM:Options){
        // 校验提交方法
        OVM.method = CheckOptions._CheckSetDefault(OVM.method.toUpperCase(),["GET","POST","PUT","HEAD","OPTIONS","PATCH","DELETE"],'GET');
        // 校验字符集
        OVM.charset = CheckOptions._CheckSetDefault(OVM.charset.toLowerCase(),["utf-8","utf-16","gb2312","gbk"],'utf-8');
        // dataType 和 contentType 相似部分
        let Ttpes = ["xml","json","text","html","plain","e+xml","e+json","e+text","e+html","e+plain","t-xml","t-e+xml"];
        // 校验返回数据类型
        OVM.dataType = CheckOptions._CheckSetDefault(OVM.dataType.toLowerCase(),Tools._Merge(Ttpes,["jsonp","script"]),'json');
        // 提交的内容类型
        OVM.contentType = CheckOptions._CheckSetDefault(OVM.contentType.toLowerCase(),Tools._Merge(Ttpes,["formdata","formurl"]),'formurl');
        // 校验 tokenType 提交到指定的位置
        OVM.tokenType = CheckOptions._CheckSetDefault(OVM.tokenType.toLowerCase(),["url","head","cookie","all"],"url");
        // 校验数据只能是以下类型
        // OVM.data = CheckOptions._CheckSetDefault(Tools._ToType(OVM.data).toLowerCase(),["string","object","array","null","file","formdata","xmldocument"],null);
        // OVM.data = Tools._InArray(Tools._ToType(OVM.data).toLowerCase(),["string","object","array","null","file","formdata","xmldocument"],false) ? OVM.data : null;
    }
}