import {Tools} from '../../lib/Index';
import {IsValidateRequest} from './Methods';

/**
 * 负责响应的请求头处理
 *
 * @export
 * @class Header
 */
export class Header{

    /**
     * 创建一个请求头
     *
     * @static
     * @param {XMLHttpRequest} request
     * @returns {{[key:string]:string}}
     * @memberof Header
     */
    public static c(request:XMLHttpRequest):{[key:string]:string}{
        // 解析请求头参数
        let headers:{[key:string]:string|string[]|any} = IsValidateRequest(request) && ('getAllResponseHeaders' in request) ? Header._ParseHeaders(request.getAllResponseHeaders()) : {};
        // 返回结果
        return headers;
    }

    /**
     * 解析 响应的请求参数
     *
     * @private
     * @static
     * @param {string} HeaderString
     * @returns {({[key:string]:string|string[]|any})}
     * @memberof Header
     */
    private static _ParseHeaders(HeaderString:string):{[key:string]:string|string[]|any}{

        // 定义一个返回结果集
        let HeadersResult:{[key:string]:string|string[]|any} = {};

        // 将字符串去掉首尾空格,再转成字符串
        let Headers:Array<string> = Tools._Trim(HeaderString).split(/[\r\n]+/);

        // 遍历循环处理
        Headers.forEach((line:string) => {
            let index:number = line.indexOf(':');
            // 获得 key
            let key:string = Tools._Trim(line.substring(0,index)).toLocaleLowerCase();
            // 获得 value
            let value:string = Tools._Trim(line.substring(index+1,line.length));
            // 如果 key 不为空
            if(!Tools._IsEmpty(key)){
                // 如果存在
                if(HeadersResult[key]){
                    HeadersResult[key] = Tools._IsArray(HeadersResult[key]) ? (HeadersResult[key] as string[]).push(value) : [HeadersResult[key]].push(value);
                }else{
                    HeadersResult[key] = value;
                }
            }
        });
        // 返回结果集
        return HeadersResult;
    }
}