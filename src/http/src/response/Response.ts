


//  // 配置参数 保证是一个请求一个config,不能引用同一个地址
//  this.config = Object.freeze(config);
//  // 状态码
//  this.status = request.status;
//  // 状态内容
//  this.statusText = request.statusText;
//  let headers = ('getAllResponseHeaders' in request) ? Response.parseHeaders(request.getAllResponseHeaders()) : {};
//  // 请求头
//  this.headers = Object.freeze(headers);
//  // 当前请求实例
//  this.request = Object.freeze(request);
//  // 获得响应数据
//  let responseData = (!config.dataType || config.dataType === 'text') ? request.responseText : request.response;
//  // 数据,将数据最后挂载,而且会自动解密数据
//  this.data = (request.status === 200) ? Response.TransformResponseDataFn(config,responseData) : responseData;
//  // 可能上面的data,还存在未解密的,所以还需要进行自动判断需要自动解密吗?
//  (request.status === 200) && Response.ResponseAutoCrypto(this);
//  // 用于判断是否是 响应类 (主要是用在then方法中)
//  Object.defineProperty(this,"isResponse",{
//      enumerable:false,
//      configurable:false,
//      writable:false,
//      value:true
//  });

import {Options} from '../Options';
import {Methods,IsValidateRequest} from './Methods';
import {Tools} from '../../lib/Index';

import {Header} from './Header';
import {Data} from './Data';

/**
 * 响应类
 *
 * @export
 * @class Response
 */
export class Response extends Methods{

    /**
     * 请求的配置
     *
     * @type {Options}
     * @memberof Response
     */
    public config:Options = null;

    /**
     * 相应的数据
     *
     * @type {*}
     * @memberof Response
     */
    public data:any=null;

    

    /**
     * 响应的请求头
     *
     * @type {({[key:string]:string|number})}
     * @memberof Response
     */
    public headers:{[key:string]:string|number}={};


    /**
     * 请求实例
     *
     * @type {(XMLHttpRequest)}
     * @memberof Response
     */
    public request:XMLHttpRequest=null;


    /**
     * 请求的状态码
     *
     * @type {number}
     * @memberof Response
     */
    public status:number=0;

    /**
     * 请求的状态值
     *
     * @type {string}
     * @memberof Response
     */
    public statusText:string='';


    /**
     * 校验是否是响应类
     *
     * @type {boolean}
     * @memberof Response
     */
    public isResponse:boolean=true;


    /**
     * 额外配置,是用于响应实例上,传入的多余配置
     *
     * @type {{[key:string]:any}}
     * @memberof Response
     */
    public $options:{[key:string]:any} = {};


    /**
     * Creates an instance of Response.
     * @private
     * @param {number} [status]
     * @param {string} [statustext]
     * @param {{[key:string]:any}} [options={}]
     * @memberof Response
     */
    private constructor(status?:number,statustext?:string,options:{[key:string]:any}={}){
        super(); // 实例后基类
        // Response.prototype.constructor = Response;
        // 赋值状态码
        this.status = status || 0;
        this.statusText = statustext || 'OK';

        // 设置并赋值
        Response._SetResponseValue(this,options);

        // 必须先说明,以下都必须依赖于 request 这个对象,如果这个对象没有该实例,则不会执行的
        if(IsValidateRequest(options.request)){
            // 设置请求头,并冻结起来
            this.headers = Object.freeze(Header.c(options.request));
            // 创建数据
            this.data = Data.c(options.request,this.config);
            

            // 我们可以在这里对响应的内容,提交到请求实例上header


        }
        
        // 重定义 isResponse 不可修改
        Tools._ReDefineProperty(this,'isResponse',true);
    }


    /**
     * 设置响应类上属性的值
     *
     * @private
     * @static
     * @param {(Response|any)} WVM
     * @param {{[key:string]:any}} [options={}]
     * @memberof Response
     */
    private static _SetResponseValue(WVM:Response|any,options:{[key:string]:any}={}):void{
        // 保证 options 必须是一个对象
        if(Tools._IsObject(options)){
            // 定义一个用户自定义的
            let UserOptoins:{[key:string]:any} = {};
            // 遍历
            Object.keys(options).forEach((key)=>{
                // 如果存在该属性则赋值
                if(WVM[key] === undefined){
                    UserOptoins[key] = options[key];
                }else{
                    // 赋值
                    WVM[key] = options[key];
                }
            });
            // 再将额外挂载起来
            //WVM['$options'] = UserOptoins;
            // 将其重定义到原来的属性上
            Tools._ReDefineProperty(WVM,'$options',UserOptoins);
        }
    }


    /**
     * 创建一个标准的响应类
     *
     * @static
     * @param {number} status
     * @param {string} statustext
     * @param {{[key:string]:any}} [options={}]
     * @returns {Response}
     * @memberof Response
     */
    public static create(status:number,statustext:string,options:{[key:string]:any}={}):Response{
        return new Response(status,statustext,options);
    }


    /**
     * 快速生成一个错误的响应类对象
     *
     * @static
     * @param {string} statustext
     * @param {{[key:string]:any}} [options={}]
     * @returns {Response}
     * @memberof Response
     */
    public static error(statustext:string,options:{[key:string]:any}={}):Response{
        // 固定错误码,输出错误值,最后的是响应对象的配置
        return new Response(-1,statustext,options);
    }


}