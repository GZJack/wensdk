
// 配置类,负责生成一个请求的 config
import {Options} from './Options';
// 请求类,负责请求前的拦截过滤及转换,在 Index.ts 中的 request => _CallAjax 方法中已经实现统一过滤
// import {Request} from './request/Request';
// 响应类,负责请求后的拦截过滤及转换
import {Response} from './response/Response';
import { Tools } from '../lib/Index';
import {Utils} from './utils/Utils';


/**
 * 请求ajax实例
 * 
 * 1. 唯一入口 create() 
 * 2. 分发入口 _WenAjax(config),为私有 w(config),为公开
 * 2.1 分发要求
 *    1. 必须是返回一个 Promise 对象
 *    2. 解构取值,因为分发请求时(请求前校验、拦截、过滤、转换)
 *    3. 创建 XMLHttpRequest 实例
 *    4. 设置请求头,挂载监听函数
 *    4. 执行 ajax 请求
 *
 * @export
 * @class WAjax
 */
export class WAjax{

    /**
     * 使用静态函数,创建一个实例,并执行请求
     *
     * @static
     * @param {Options} config
     * @returns {Promise<Response>}
     * @memberof WAjax
     */
    public static create(config:Options):Promise<Response>{
        // new 并执行提交请求
        return (new WAjax()).w(config);
    }

    /**
     * 静态方法,获得 xmlHttp 请求对象
     *
     * @private
     * @static
     * @returns {(XMLHttpRequest)}
     * @memberof WAjax
     */
    private static _GetXmlHttpObject():XMLHttpRequest{
        let xmlHttp:XMLHttpRequest = null;
        try {
            // Firefox, Opera ie8.0+, Safari
            xmlHttp = new XMLHttpRequest();
        } catch (err) {
            // IE
            try {
                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (error) {
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
        }
        return xmlHttp;
    }


    /**
     * 核心方法
     *
     * @private
     * @param {Options} config
     * @returns {Promise<Response>}
     * @memberof WAjax
     */
    private _WenAjax(config:Options):Promise<Response>{
        // 创建一个 Promise 对象
        return new Promise((resolve:(response:Response) => Response|any,reject:(response:Response) => Response|any) => {
            // 记住,这里面的 this 未变化,依然是指着 Ajax

            // 这里面则不进行转义, 在分发请求的时候就统一进行转义并过滤,传到这里就是一个合格请求配置
            // config = Request._OptionsTransform(config); // 这里不能再使用,因为需要转义,保证 jquery.ajax 也能正常使用


            // 情况说明,这时的config已经是一个合格的config了
            // 以下介绍主要的属性:
            // url: 已经包含了 baseurl 和 params 里所有的参数,以及异步函数中 token
            // headers: 已经完成了 content-type 及其其他配置
            // data: 任意值,如果 contentType 设置加密了,自然就加密成功了 

            // 解构取值了
            let {url,method,data,headers,timeout,withCredentials} = config;


            // 获得 请求实例, 完成或者错误,中断都会销毁当前实例
            let xmlHttp:XMLHttpRequest = WAjax._GetXmlHttpObject();
            // 定义一个销毁函数
            let DestroyAjax:()=>void = () => {
                // 注销实例
                xmlHttp = null;
                // 同时注销掉 Ajax
                // delete this;
                // this = null;
            };

 
            // 设置,开启一个请求对象
            xmlHttp.open(method,url,true);
            
            
            
            // 用户在配置参数中不可见,不影响使用, 当不是同域的情况下,请求头添加了新属性,GET请求 前会先发送一条 OPTIONS 请求
            //(Ajax.IsCrossDomain(config) && "setRequestHeader" in xmlHttp) && xmlHttp.setRequestHeader("WenClient",Ajax.appname + " " + Ajax.version);
            // 但是 POST 请求头需要提交 Content-Type : application/json;charset=utf-8 再加上跨域,就会先执行一次 OPTIONS 请求后,才会执行正真的 POST 请求

            /**
             * 设置请求头
             * 当请求头有内容了,就会进行设置
             */
            if(Tools._IsObject(headers) && !Tools._IsEmpty(headers)){
                // 遍历配置 请求头
                Object.keys(headers).forEach((key:string):void => {
                    // 循环配置请求头
                    ("setRequestHeader" in xmlHttp) && xmlHttp.setRequestHeader(key,headers[key]);
                });
            };
            

            /**
             * 只要满足以下条件,证明是使用了超时设置
             */
            if(Tools._IsNumber(timeout) && timeout > 0){
                xmlHttp.timeout = timeout; // 超时时间，单位是毫秒
                // 超时时间
                xmlHttp.ontimeout = (even: ProgressEvent<EventTarget>):any => {
                    // XMLHttpRequest 超时。在此做某事。
                    // 超时后,就会产生错误,先改变请求实例
                    // Ajax.ChangeRequest(-1,"系统繁忙,稍后再试",config,xmlHttp);
                    // // 返回 Promise 错误回调,并传一个 响应实例
                    reject(Response.error('timeout',{
                        "config":Utils._CopyConfigInResponse(config),
                        "request":xmlHttp
                    }));
                    // 超时后,取消请求 
                    xmlHttp.abort && xmlHttp.abort();
                    // 注销实例
                    DestroyAjax();
                };
            };

            // 跨域携带cookie
            if(withCredentials) {
                xmlHttp.withCredentials = true;
            }
            
            /**
             * 事件监听,返回正确与错误都在这里执行
             */
            xmlHttp.onreadystatechange = function(){
                // console.log(xmlHttp.status,xmlHttp.statusText,xmlHttp);
                
                // 处理这些无效的,既不响应,也不报错
                if(!xmlHttp || xmlHttp.readyState !== 4) {
                    return;
                }
                // 禁止本地文件协议请求
                if(xmlHttp.status === 0 && !(xmlHttp.responseURL && xmlHttp.responseURL.indexOf('CopyFiles:') === 0)) {
                    return;
                }

                // // 定义一个返回对象
                // var response = Ajax.CreateResponse(config,xmlHttp);

                // console.log("最后结果",xmlHttp.status,xmlHttp.statusText,xmlHttp);

                // // 认为 200 的就是正确的返回
                if(xmlHttp.status===200){
                    resolve(Response.create(xmlHttp.status,xmlHttp.statusText,{
                        "config":Utils._CopyConfigInResponse(config),
                        "request":xmlHttp
                    }));
                }else{
                    reject(Response.error(xmlHttp.statusText,{
                        "config":Utils._CopyConfigInResponse(config),
                        "request":xmlHttp,
                        "status":xmlHttp.status
                    }));
                }
                // 注销实例
                DestroyAjax();
            };


            // 当手动取消请求时触发
            xmlHttp.onabort = function(){
                // 如果当前实例存在,则自动注销
                if (!xmlHttp) {
                    return;
                }
                // // 中断后,就会产生错误,先改变请求实例
                // Ajax.ChangeRequest(1,"请求中断",config,xmlHttp);
                // // 返回 Promise 错误回调,并传一个 响应实例
                reject(Response.error('break off',{
                    "config":Utils._CopyConfigInResponse(config),
                    "request":xmlHttp
                }));
                // 注销实例
                DestroyAjax();
            };
        
            // 当网络发生错误时触发
            xmlHttp.onerror = function(){
                // 如果当前实例存在,则自动注销
                if (!xmlHttp) {
                    return;
                }
                // // 请求时错误后,就会产生错误,先改变请求实例
                // Ajax.ChangeRequest(2,"请求失败,网络错误",config,xmlHttp);
                // // 返回 Promise 错误回调,并传一个 响应实例
                // reject(Ajax.CreateResponse(config,xmlHttp));
                reject(Response.error('error',{
                    "config":Utils._CopyConfigInResponse(config),
                    "request":xmlHttp
                }));
                // 注销实例
                DestroyAjax();
            };

            // // 非IE浏览器才会自动转换的,IE9-IE11设置xmlHttp.responseType都不能成功,responseType只有IE10才有
            // if("responseType" in xmlHttp && wen.device && wen.device("ie") === false){
            //     try {
            //         xmlHttp.responseType = (opt.dataType === "json") ? "json" : "";
            //     } catch (e) {
            //       // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
            //       // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
            //       if (opt.dataType !== 'json') {
            //          throw e;
            //       }
            //     }
            // }

            
            // 执行发送,并携带数据,如果传入的数据是无意义的,则执行null
            xmlHttp.send(data == undefined ? null : data);
            // xmlHttp.send();
        });
    }

    /**
     * 暴露出去的接口,用于实例上调用
     *
     * @param {Options} config
     * @returns {Promise<Response>}
     * @memberof WAjax
     */
    public w(config:Options):Promise<Response>{
        return this._WenAjax(config);
    }
}