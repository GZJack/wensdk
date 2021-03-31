
import {Options} from '../Options';
import {Tools,cyt} from '../../lib/Index';
import {Xml} from '../utils/Xml';

/**
 * 负责响应的 数据转换
 *
 * @export
 * @class Data
 */
export class Data{

    /**
     * 公用类型
     *
     * @static
     * @memberof Data
     */
    public static T1 = 'application/$1';

    /**
     * 公用类型
     *
     * @static
     * @memberof Data
     */
    public static T2 = 'text/$1';

    /**
     * 拿到响应的类型
     *
     * @static
     * @type {string}
     * @memberof Data
     */
    public static HC:string = 'Content-Type';

    /**
     * 合并并获得类型
     *
     * @private
     * @static
     * @param {string} type
     * @param {string} replace
     * @returns {string}
     * @memberof Data
     */
    private static _GetContentType(type:string,replace:string):string{
        return type.replace('$1',replace);
    }

    /**
     * 获得 内容类型和字符集
     *
     * @static
     * @param {string} ContentTypeCharsetString
     * @returns {[string,string]}
     * @memberof Data
     */
    public static _GetContentTypeAndCharset(ContentTypeCharsetString:string):[string,string]{
        // 拿到content-type + charset = utf-8
        let ContentTypeCharset:string = Tools._ReplaceAllSpaces(ContentTypeCharsetString);
        // 解构
        let ContentTypeCharsetArray:string[] = ContentTypeCharset.split(';')
        // 分别取出
        let ContentType:string = Tools._ToGet(ContentTypeCharsetArray,0,'');
        let Charset:string = Tools._ToGet(ContentTypeCharsetArray,2,'utf-8'); // 这个目前不需要
        // 再处理一下
        Charset = Charset.substring(Charset.indexOf('=')+1,Charset.length);
        // 返回
        return [ContentType,Charset];
    }

    /**
     * 响应数据转换成Json
     *
     * @static
     * @param {(string|any)} ResponseData
     * @returns {*}
     * @memberof Data
     */
    public static _ResponseDataToJson(ResponseData:string|any):any{
        try {
            // 如果原来就是 json 就直接返回,否则就是字符串,进行转换
            return Tools._IsString(ResponseData) && (/^(\{|\[).*(\]|\})$/.test(ResponseData)) ? JSON.parse(ResponseData) : (Tools._IsObject(ResponseData) || Tools._IsArray(ResponseData) ? ResponseData : {});
        } catch (error) {
            // 来一条提示信息
            Tools._DebugLog("responseText is not a valid JSON string",ResponseData);
            // 返回一个默认的 Json 对象
            return {};
        }
    }

    /**
     * 响应数据转换成 xml
     *
     * @static
     * @param {(string|any)} ResponseData
     * @returns {*}
     * @memberof Data
     */
    public static _ResponseDataToXml(ResponseData:string|any):any{
        return Tools._IsString(ResponseData) ? Xml._ToXml(ResponseData) : ResponseData;
    }

    /**
     * 响应数据转换成 text
     *
     * @static
     * @param {(string|any)} ResponseData
     * @returns {*}
     * @memberof Data
     */
    public static _ResponseDataToText(ResponseData:string|any):any{
        return Tools._IsString(ResponseData) ? ResponseData : ResponseData.toString();
    }

    /**
     * 创建 数据data
     *
     * @static
     * @param {XMLHttpRequest} request
     * @param {Options} config
     * @returns {*}
     * @memberof Data
     */
    public static c(request:XMLHttpRequest,config:Options):any{
        // 如果发生错误
        // if(request.status !== 200) return null;
        // 返回结果集
        let ReturnResult:any = null;
        // 拿到content-type + charset = utf-8
        let [ContentType,Charset] = Data._GetContentTypeAndCharset(request.getResponseHeader(Data.HC) || '');
        // 拿到配置上的 dataType
        let DataType:string = Tools._ToGet(config,'dataType','');
        // 拿到原始内容
        let ResponseData:any = request.responseText;
        // 替换掉 t-
        DataType = DataType.replace('t-','');

        // console.log("输出的内容类型是",ContentType,DataType,Charset);
        // 如果服务器 content-type 与前端的 dataType 就只是报一条警告
        if(Data._GetContentType(Data.T1,DataType) !== ContentType){
            // 报一条警告
            Tools._WarnLog("The content-type of the server response does not correspond to the type of dataType set at the front end");
        }
        // 如果含有加密的,则进行解密
        if(/\/e\+/.test(ContentType)){
            ResponseData = cyt.d(ResponseData,'',false);
        }
        // 校验,与服务器提供的 content-type 为准
        switch(ContentType){
            case '':
            // case Data._GetContentType(Data.T1,'text'):
            // case Data._GetContentType(Data.T1,'text'):
            case Data._GetContentType(Data.T2,'plain'):
            case Data._GetContentType(Data.T2,'e+plain'):
                ReturnResult = Data._ResponseDataToText(ResponseData);
                break;
            case Data._GetContentType(Data.T1,'json'):
            case Data._GetContentType(Data.T1,'e+json'):
                ReturnResult = Data._ResponseDataToJson(ResponseData);
                break;
            case Data._GetContentType(Data.T1,'xml') || Data._GetContentType(Data.T2,'xml'):
            case Data._GetContentType(Data.T1,'e+xml') || Data._GetContentType(Data.T2,'e+xml'):
                ReturnResult = Data._ResponseDataToXml(ResponseData);
                break;
            default:
                // 返回默认
                ReturnResult = ResponseData;
        }

        // 返回结果集
        return ReturnResult;
    }



}