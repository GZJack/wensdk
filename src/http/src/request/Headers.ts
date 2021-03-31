import { Options } from './../Options';
import { Tools } from '../../lib/Index';
import {Request} from './Request';


/**
 * 请求头类
 *
 * @export
 * @class Headers
 */
export class Headers{

    /**
     * 设置请求头内容
     *
     * @private
     * @static
     * @param {Options} config
     * @param {string} key
     * @param {string} value
     * @memberof Headers
     */
    private static _SetHeaders(config:Options,key:string,value:string):void{
        config.headers[key] = value;
    }



    /**
     * 爆出的接口,设置请求头
     *
     * @static
     * @param {Options} config
     * @param {string} key
     * @param {string} value
     * @memberof Headers
     */
    public static s(config:Options,key:string,value:string):void{
        Headers._SetHeaders(config,key,value);
    }


    /**
     * 删除请求头属性
     *
     * @private
     * @static
     * @param {Options} config
     * @param {string} key
     * @memberof Headers
     */
    private static _DeleteHeaders(config:Options,key:string):void{
        delete config.headers[key];
    }

    /**
     * 暴露的删除接口
     *
     * @static
     * @param {Options} config
     * @param {string} key
     * @memberof Headers
     */
    public static d(config:Options,key?:string):void{
        // 默认删除 content-type
        Headers._DeleteHeaders(config,Tools._IsString(key) ? key : Request.HC);
    }


}