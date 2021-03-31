import { Options } from './../Options';
import {Headers} from './Headers';
import {Request} from './Request';
import {Tools} from '../../lib/Index';
import {ContentType} from './ContentType';

/**
 * 负责提交
 *
 * @export
 * @class Accept
 */
export class Accept{

    /**
     * 获得响应的内容类型
     *
     * @private
     * @static
     * @param {string} dataType
     * @returns {string}
     * @memberof Accept
     */
    private static _GetResponseContentTypeByDataType(dataType:string):string{
        // 返回内容类型
        let ResponseContentType:string = '';
        // 区分
        switch(dataType){
            case 'xml':
            case 'e+xml':
            case 'json':
            case 'e+json':
                ResponseContentType = ContentType.g(ContentType.T1,dataType);
                break;
            case 'text':
            case 'plain':
            case 'e+text':
            case 'e+plain':
                ResponseContentType = ContentType.g(ContentType.T2,/^e\+\w+/.test(dataType) ? 'e+plain' : 'plain');
                break;
            case 't-xml':
            case 'html':
            case 't-e+xml':
            case 'e+html':
                ResponseContentType = ContentType.g(ContentType.T2,dataType.replace('t-',''));
                break;
            default:
                ResponseContentType = ContentType.g(ContentType.T2,'html');
        }
        // 返回响应的内容类型
        return ResponseContentType;
    }


    /**
     * 创建可接受的数据类型
     *
     * @private
     * @static
     * @param {Options} config
     * @memberof Accept
     */
    private static _CreateAccept(config:Options):void{
        // 拿到原来的请求头
        let {headers,dataType} = config;
        // 拿到原有的接收服务器规则
        let AcceptString:string = Tools._ToGet(headers,Request.HA,'');
        // 保证必须是字符串,去掉首尾空格,并去掉默认的 ; 分号
        AcceptString = Tools._RTrim(Tools._Trim(Tools._IsString(AcceptString) ? AcceptString : ''),';');
        // 如果不为空,则在后面添加上分号 ; 
        AcceptString = !Tools._IsEmpty(AcceptString) ? AcceptString + ';' : '';
        // 通过DataType获得响应内容类型,将类型设置到最高级别 q=0.9
        AcceptString += 'q=0.9,' + Accept._GetResponseContentTypeByDataType(dataType);
        // 最后设置到请求头上
        Headers.s(config,Request.HA,AcceptString);
    }

    /**
     * 暴露的主入口
     *
     * @static
     * @param {Options} config
     * @memberof Accept
     */
    public static c(config:Options):void{
        Accept._CreateAccept(config);
    }
}