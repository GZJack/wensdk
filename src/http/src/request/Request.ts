
import {Tools} from '../../lib/Index';
import {Options} from '../Options';

import {ContentType} from './ContentType';
import {Accept} from './Accept';
import {Url} from './Url';
import {Data} from './Data';
import {Headers} from './Headers';


/**
 * 负责请求前的过滤及转换
 * 
 *  1. 通过 config 上的 ename 决定是否对数据加密
 *      
 *
 * @export
 * @class Request
 */
export class Request{

    /**
     * 定义客户端接受内容类型名称
     *
     * @static
     * @type {string}
     * @memberof Request
     */
    public static HA:string = 'Accept';

    /**
     * 定义客户端提交的内容类型名称
     *
     * @static
     * @type {string}
     * @memberof Request
     */
    public static HC:string = 'Content-Type';

    // /**
    //  * 定义客户端提交的内容长度名称  不可以设置
    //  *
    //  * @static
    //  * @type {string}
    //  * @memberof Request
    //  */
    // public static HL:string = 'Content-Length';

    // 这个代码IE可以正常跑,但是Chrom,Firefox就不行,因为谷歌和火狐遵循w3c规范.IE呢,自己玩自己的.
    // w3c规定,不允许设置下面的请求头,为的是防止二次伪装请求,是出于安全考虑.
    // Accept-Charset
    // Accept-Encoding
    // Connection
    // Content-Length
    // Cookie
    // Cookie2
    // Content-Transfer-Encoding
    // Date
    // Expect
    // Host
    // Keep-Alive
    // Referer
    // TE
    // Trailer
    // Transfer-Encoding
    // Upgrade
    // User-Agent
    // Via
    // 这是最新标准.


    

    

    /**
     * 请求参数请求前的转义,总入口
     * 
     * 总体顺序流程说明: (自下而上)
     * 1. 
     *
     * @static
     * @param {Options} config
     * @returns {Options}
     * @memberof Request
     */
    public static _OptionsTransform(config:Options):Options{
        // 保证数据不是 null 或 undefined

        // 执行提交的内容类型
        ContentType.c(config);
        // 执行告知服务器,我能接受的数据类型
        Accept.c(config);
        // 执行 url (含执行token)
        Url.c(config);
        // 执行处理data
        Data.c(config);

        // 拿到请求方法
        // let {method} = config;
        // 需要知道 GET OPTIONS HEAD 等请求是不需要 content-type
        if(Tools._InArray(config.method,['GET','OPTIONS','HEAD'])){
            Headers.d(config); // 默认是删除 content-type 项的
        }
        
        // 最后过滤处理完成的config,到最后执行请求
        return config;
    }
}