import {Utils} from '../utils/Utils';
import {HttpOptions,Options} from '../Options';
import {Response} from '../response/Response';
import {Tools} from '../../lib/Index';

/**
 * 负责请求前,请求后,发生错误时,正确返回结果时间 的监听
 *
 * @export
 * @class Listener
 */
export class Listener{

    /**
     * 请求前的监听配置函数名称
     *
     * @static
     * @memberof Listener
     */
    public static B1 = 'RequestConfigFn';

    /**
     * 请求前的监听错误函数名称
     *
     * @static
     * @memberof Listener
     */
    public static B2 = 'RequestErrorFn';

    /**
     * 挂载请求前响应回调
     *
     * @memberof Listener
     */
    public B:{[key:string]:(config:HttpOptions|Response)=>HttpOptions|Response} = {};

    /**
     * 请求后的监听成功返回值函数名称
     *
     * @static
     * @memberof Listener
     */
    public static A1 = 'ResponseResultFn';

    /**
     * 请求后的监听错误返回函数名称
     *
     * @static
     * @memberof Listener
     */
    public static A2 = 'ResponseErrorFn';

    /**
     * 挂载监听响应回调
     *
     * @memberof Listener
     */
    public A:{[key:string]:(response:Response)=>Response} = {};

     /**
      * 构造器
      * Creates an instance of Listener.
      * @memberof Listener
      */
     constructor(){
        // 这些函数,都是不能直接更改的,只可以通过 request 和 response 进行赋值,只允许修改一次

        // 请求前监听config函数
        Utils._ReDefinePropertyOnlyGet(this.B,Listener.B1,function(config:HttpOptions){
            return config;
        });
        // 请求前错误监听函数
        Utils._ReDefinePropertyOnlyGet(this.B,Listener.B2,function(error:Response){
            return error;
        });
        // 响应正确结果监听函数
        Utils._ReDefinePropertyOnlyGet(this.A,Listener.A1,function(response:Response){
            return response;
        });
        // 响应错误结果监听函数
        Utils._ReDefinePropertyOnlyGet(this.A,Listener.A2,function(error:Response){
            return error;
        });
    }

    /**
     * 请求前监听,赋值函数
     *
     * @param {(config:Options)=>Options} resolve
     * @param {(response:Response)=>Response} reject
     * @memberof Listener
     */
    request(resolve:(config:Options)=>Options,reject:(response:Response)=>Response){
        // 赋值监听函数
        if(Tools._IsFunction(resolve)) Utils._ReDefineProperty(this.B,Listener.B1,resolve);
        if(Tools._IsFunction(reject)) Utils._ReDefineProperty(this.B,Listener.B2,reject);
    }
    

    /**
     * 响应后监听 进行赋值函数
     *
     * @param {(response:Response)=>Response} resolve
     * @param {(response:Response)=>Response} reject
     * @memberof Listener
     */
    response(resolve:(response:Response)=>Response,reject:(response:Response)=>Response){
        // 赋值响应监听函数
        if(Tools._IsFunction(resolve)) Utils._ReDefineProperty(this.A,Listener.A1,resolve);
        if(Tools._IsFunction(reject)) Utils._ReDefineProperty(this.A,Listener.A2,reject);
    }

}