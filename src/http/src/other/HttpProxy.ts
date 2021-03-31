
/**
 * 请求代理配置
 *
 * @export
 * @interface HttpProxyOptions
 */
export interface HttpProxyOptions{

}

/**
 * 请求实例代理
 * 
 * 当设置了代理,则请求就会走代理,等待代理返回内容
 * 
 * 功能说明:
 * 必须有一个可以返回请求真实内容的请求地址,这个地址支持所有的提交方式
 *
 * @export
 * @class HttpProxy
 */
export class HttpProxy{

    /**
     * 代理请求的地址
     *
     * @type {string}
     * @memberof HttpProxy
     */
    public url:string = '';

    
    /**
     * Creates an instance of HttpProxy.
     * @param {HttpProxyOptions} options
     * @memberof HttpProxy
     */
    constructor(options:HttpProxyOptions){

    }
}