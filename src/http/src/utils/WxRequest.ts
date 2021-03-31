import {Options} from '../Options';
import {Http} from '../Index';
import {Response} from '../response/Response';

export class WxRequest{

    /**
     * 负责执行 微信API 中的 wx.request
     *
     * @static
     * @param {(options:{[key:string]:any})=>any} ajax
     * @returns {(options:Options,httpvm:Http)=>Promise<Response>}
     * @memberof WxRequest
     */
    public static ajax(ajax:(options:{[key:string]:any})=>any):(options:Options,httpvm:Http)=>Promise<Response>{
        return (options:Options,httpvm:Http):Promise<Response> => {
            // 返回固定格式 Promise 对象
            return new Promise((resolve:(response:Response) => any,reject:(response:Response) => any) => {

            });
        }
    }
}