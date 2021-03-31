

import {Options} from '../Options';
import {Http} from '../Index';
import {Response} from '../response/Response';
import { Tools } from '../../lib/Index';
import { Utils } from './Utils';


/**
 * 处理 Jquery.ajax 模块
 *
 * @export
 * @class JqueryAjax
 */
export class JqueryAjax{

    /**
     * 负责执行 Jquery 中的 ajax
     *
     * @static
     * @param {(options:{[key:string]:any})=>any} ajax
     * @returns {(options:Options,httpvm:Http)=>Promise<Response>}
     * @memberof JqueryAjax
     */
    public static ajax(ajax:(options:{[key:string]:any})=>any):(options:Options,httpvm:Http)=>Promise<Response>{
        // 设置了 ajax 后,则执行请求
        return (options:Options,httpvm:Http):Promise<Response> => {
            // 返回固定格式 Promise 对象
            return new Promise((resolve:(response:Response) => any,reject:(response:Response) => any) => {
                // 解构取值
                let {url,method,timeout,dataType,data,headers} = options;
                // 生成响应配置的变量
                let ResponseOptions:{[key:string]:any} = {
                    // 需要冻结配置
                    // "config":Object.freeze(options)
                    "config":Utils._CopyConfigInResponse(options)
                };
                
                // 取到 contentType
                let contentType:string = headers['Content-Type'];

                // 通过 Jquery.ajax() 执行请求
                ajax({
                    // 设置请求链接,含基础链接
                    "url":url,
                    // 是否异步处理
                    "async":true,
                    // 请求的方式方法
                    "type":method,
                    // 请求超时时间 毫秒
                    "timeout":timeout,
                    // contentType 提交的数据格式
                    "contentType":contentType,
                    // data 请求的数据
                    "data":data,
                    // 返回的数据类型
                    "dataType":dataType,
                    // 成功返回
                    "success":function(result:any,status:string,xhr:XMLHttpRequest):void{
                        ResponseOptions['request'] = xhr;
                        ResponseOptions['data'] = result;
                        resolve(Response.create(xhr.status,xhr.statusText,ResponseOptions));
                    },
                    // 失败返回
                    "error":function(xhr:XMLHttpRequest,status:string,err:any):void{
                        ResponseOptions['request'] = xhr;
                        ResponseOptions['data'] = err;
                        ResponseOptions['status'] = xhr.status;
                        reject(Response.error(xhr.statusText,ResponseOptions));
                    },
                    // 成功与否都会执行
                    // "complete":function(xhr:XMLHttpRequest,status:number):void{

                    // }
                });
            });
            
            
        }
    }
}