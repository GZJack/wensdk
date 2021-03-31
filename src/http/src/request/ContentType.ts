import { Options } from './../Options';
import {Headers} from './Headers';
import {Request} from './Request';
import {Tools} from '../../lib/Index';


/**
 * 处理请求头 Content-Type 的处理
 *
 * @export
 * @class ContentType
 */
export class ContentType{

    // 常见:
    // application/x-www-form-urlencoded
    // application/json
    // text/xml
    // text/plain
    // text/html
    // multipart/form-data


    // 不常见:
    // application/x-javascript
    // text/css

    /**
     * 重复使用的,内容类型开头
     *
     * @public
     * @static
     * @memberof ContentType
     */
    public static T1 = 'application/$1';

    /**
     * 重复使用的,内容类型开头
     *
     * @public
     * @static
     * @memberof ContentType
     */
    public static T2 = 'text/$1';


    /**
     * 提交的数据格式 a=123&b=456
     *
     * @private
     * @static
     * @memberof ContentType
     */
    private static D1 = 'x-www-form-urlencoded';


    /**
     * 提交的数据格式的是 FormData 的类型
     *
     * @private
     * @static
     * @memberof ContentType
     */
    private static F1 = 'multipart/form-data';


    /**
     * 合并并获得类型
     *
     * @private
     * @static
     * @param {string} type
     * @param {string} replace
     * @returns {string}
     * @memberof ContentType
     */
    private static _GetContentType(type:string,replace:string):string{
        return type.replace('$1',replace);
    }

    /**
     * 这是对外暴露的接口
     *
     * @static
     * @param {string} type
     * @param {string} replace
     * @returns {string}
     * @memberof ContentType
     */
    public static g(type:string,replace:string):string{
        return ContentType._GetContentType(type,replace);
    }


    /**
     * 主要处理操作
     *
     * @private
     * @static
     * @param {Options} config
     * @memberof ContentType
     */
    private static _ContentType(config:Options):void{
        // 需要转换的类型
        let {contentType,charset} = config;

        // 拼接成的字符串
        let ContentTypeString:string = '';

        // 区分类型
        switch(contentType){
            case 'xml':
            case 'e+xml':
            case 'json':
            case 'e+json':
                ContentTypeString = ContentType._GetContentType(ContentType.T1,contentType);                
                break;
            case 'text':
            case 'plain':
            case 'e+text':
            case 'e+plain':
                ContentTypeString = ContentType._GetContentType(ContentType.T2,/^e\+\w+/.test(contentType) ? 'e+plain' : 'plain');                
                break;
            case 't-xml':
            case 'html':
            case 't-e+xml':
            case 'e+html':
                // 有 t- 则需要去掉
                ContentTypeString = ContentType._GetContentType(ContentType.T2,contentType.replace('t-',''));                
                break;
            case 'formdata':
                ContentTypeString = ContentType.F1;                
                break;
            case 'formurl':
                 // 修改成默认 a=123&b=456
                 ContentTypeString = ContentType._GetContentType(ContentType.T1,ContentType.D1);               
                break;
            default:
                // 修改成默认 a=123&b=456
                ContentTypeString = ContentType._GetContentType(ContentType.T1,ContentType.D1); 
                // 需要将contentType进行修改
                config.contentType = 'formurl';
                
        }
        // 设置了请求头 Content-Type
        Headers.s(config,Request.HC,ContentTypeString + ";charset=" + charset);
    }


    /**
     * 暴露的主入口
     *
     * @static
     * @param {Options} config
     * @memberof ContentType
     */
    public static c(config:Options):void{
        ContentType._ContentType(config);
    }
}