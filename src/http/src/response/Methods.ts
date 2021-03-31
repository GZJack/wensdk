import {Options} from '../Options';
import {Data} from './Data';
import {Tools,cyt} from '../../lib/Index';
import { Xml } from '../utils/Xml';


/**
 * 拿到内容类型和字符集
 *
 * @returns {[string,string]}
 */
function GetContentTypeAndCharset():[string,string]{
    // this 是保证的, 为了输出的 response 对象上不要出现太多的属性,所以使用绑定this进行使用
    return Data._GetContentTypeAndCharset(this.request.getResponseHeader(Data.HC) || '');;
}

/**
 * 是否是有效的请求实例
 *
 * @export
 * @param {(XMLHttpRequest|ActiveXObject)} request
 * @returns {boolean}
 */
export function IsValidateRequest(request:XMLHttpRequest|ActiveXObject):boolean{
    return (("XMLHttpRequest" in window) && (request instanceof XMLHttpRequest)) || (("ActiveXObject" in window) && (request instanceof ActiveXObject));
}

/**
 * 拿到响应的数据内容,并自动识别并解密
 *
 * @returns {*}
 */
function GetResponseData():any{
    // 拿到content-type + charset = utf-8
    let [ContentType,Charset] = GetContentTypeAndCharset.call(this);
    // 拿到请求对象
    let request:XMLHttpRequest = this.request;

    
    // 再拿到数据
    let ResponseData:any = IsValidateRequest(request) ? request.responseText : '';
    // 自动解密
    ResponseData = /\/e\+/.test(ContentType) || /^[\w\=]+$/.test(ResponseData) ? cyt.d(ResponseData) : ResponseData;
    // 返回结果集
    return ResponseData;
}


/**
 * 响应类上的所有方法类,是一个基类,被用于继承
 *
 * @export
 * @class Methods
 */
export class Methods{

    /**
     * 请求的配置
     *
     * @type {Options}
     * @memberof Response
     */
    public config:Options = null;

    /**
     * 相应的数据
     *
     * @type {*}
     * @memberof Response
     */
    public data:any=null;

    

    /**
     * 响应的请求头
     *
     * @type {({[key:string]:string|number})}
     * @memberof Response
     */
    public headers:{[key:string]:string|number}={};


    /**
     * 请求实例
     *
     * @type {(XMLHttpRequest)}
     * @memberof Response
     */
    public request:XMLHttpRequest=null;


    /**
     * 请求的状态码
     *
     * @type {number}
     * @memberof Response
     */
    public status:number=0;

    /**
     * 请求的状态值
     *
     * @type {string}
     * @memberof Response
     */
    public statusText:string='';


    /**
     * 校验是否是响应类
     *
     * @type {boolean}
     * @memberof Response
     */
    public isResponse:boolean=true;

    /**
     * Creates an instance of Methods.
     * @memberof Methods
     */
    constructor(){

    }

    /**
     * 快速解密
     *
     * @returns {string}
     * @memberof Methods
     */
    public d():string{
        // 直接解密当前请求实例上的响应的内容
        return cyt.d(IsValidateRequest(this.request) ? this.request.responseText : '');
    }


    /**
     * 通过类型进行转换成 text 类型
     *
     * @returns {string}
     * @memberof Methods
     */
    public text():string{
        // 拿到数据
        let ResponseData:any = GetResponseData.call(this);
        // 转换成
        return Data._ResponseDataToText(ResponseData);
    }

    /**
     * 转成 json 类型
     *
     * @returns {({[key:string]:any}|Array<any>)}
     * @memberof Methods
     */
    public json():{[key:string]:any}|Array<any>{
        // 拿到数据
        let ResponseData:any = GetResponseData.call(this);
        // 转换成
        return Data._ResponseDataToJson(ResponseData);
    }

    /**
     * 转成 xml 类型
     *
     * @returns {XMLDocument}
     * @memberof Methods
     */
    public xml():XMLDocument{
        // 拿到数据
        let ResponseData:any = GetResponseData.call(this);
        // 转换成
        return Data._ResponseDataToXml(ResponseData);
    }

    /**
     * 将 xml 转成 json
     *
     * @returns {({[key:string]:any}|Array<any>)}
     * @memberof Methods
     */
    public xml2json():{[key:string]:any}|Array<any>{
         // 拿到数据
         let ResponseData:any = GetResponseData.call(this);
         // 转换成
         return Xml._ToJson(ResponseData);
    }

    /**
     * 转成 dom 类型
     *
     * @returns {HTMLDivElement}
     * @memberof Methods
     */
    public dom():HTMLDivElement{
        // 拿到数据
        let ResponseData:any = GetResponseData.call(this);
        // 新建一个 div 元素
        let Div:HTMLDivElement = document.createElement("div");
        Div.innerHTML = ResponseData;
         // 返回所有的子元素
         return Div;
    }

    /**
     * 转成 html 类型
     *
     * @returns {HTMLDivElement}
     * @memberof Methods
     */
    public html():HTMLDivElement{
        return this.dom();
    }
}