
import { Options } from './../Options';
import {Url as ToolsUrl,Tools,cyt,CookiePrivate} from '../../lib/Index';
import {Headers} from './Headers';

/**
 * 负责 Url 生成的
 *
 * @export
 * @class Url
 */
export class Url{


    /**
     * 创建 Url
     * 
     * 要求:
     * 1. 需要将配置上 params 属性的,数据放到 url 上
     *
     * @private
     * @static
     * @param {Options} config
     * @memberof Url
     */
    private static _CreateUrl(config:Options):void{
        // 解构取值
        let {baseUrl,url,params,ename,tokenCancel,tokenName,tokenType,options} = config;
        // 定义一个新参数对象
        let NewParams:{[key:string]:any} = {};
        // 保证 params 必须是对象
        params = Tools._IsObject(params) ? params : {};
        
        // 看是否 启动了 token 并且 tokenName 的名称,拿到后,我们需要去 params 和 options 上找
        if(!tokenCancel && Tools._IsObjectKeyName(tokenName)){
            // 我们去  params 和 options 上找
            let TokenString:string = Tools._ToGet(params,tokenName,Tools._ToGet(options,tokenName,''));
            // 需要删除 params 上的 token
            Tools._IsString((params as any)[tokenName]) && delete (params as any)[tokenName];
            // 保证必须是字符串,并且不能为空,我们才进行处理
            if(Tools._IsString(TokenString) && !Tools._IsEmpty(TokenString)){
                // 满足条件,我们就可以通过指定的方式来设定 token 所在的位置
                switch(tokenType.toLowerCase()){
                    case 'url':
                        // 只设置到请求的地址上
                        NewParams[tokenName] = TokenString;
                        break;
                    case 'cookie':
                        // 只设置到 cookie 上
                        CookiePrivate._SetItem(tokenName,TokenString);
                        break; 
                    case 'head':
                        // 只设置到 head 上
                        Headers.s(config,tokenName,TokenString);
                        break; 
                    case 'all':
                        // 设置到请求的地址上
                        NewParams[tokenName] = TokenString;
                        // 设置到 head 上
                        Headers.s(config,tokenName,TokenString);
                        // 设置到 cookie 上
                        CookiePrivate._SetItem(tokenName,TokenString);
                        break; 
                    default:
                        // 默认就是将 token 放在 url 上
                        NewParams[tokenName] = TokenString;
                }
            }
            // console.log('token 拿到了',tokenType,TokenString);
        }

        // 进行判断是否需要对查询参数进行加密, 加密,只有当 params 参数不为空的时候擦能进行加密
        if(Tools._IsObjectKeyName(ename) && !Tools._IsEmpty(params)){
            // 将所有的参数进行加密,然后赋值到指定的加密名称上
            NewParams[ename] = cyt.e(JSON.stringify(params));
        }else{
            // 不加密,就直接合并
            NewParams = Tools._MergeObject(params,NewParams);
        }

        // 是对象,就看接下来是否需要加解密了
        // console.log('wo',tokenCancel,tokenName,options,Tools._IsObjectKeyName('aaadeea'));

        // 使用专门的 http 解析 url
        config.url = ToolsUrl._CreateHttpQueryByBaseUrlUri(baseUrl,url).set(NewParams).Url;
    }

    /**
     * 暴露接口
     *
     * @static
     * @param {Options} config
     * @memberof Url
     */
    public static c(config:Options):void{
        Url._CreateUrl(config);
    }
}