
import {Tools} from '../../lib/Index';


// 避免太对的字符串,统一管理两个key
let StringKeys:{[key:string]:string} = {
    r:'root',
    d:'data'
}

// 合并xml标签
function MergeTagString(tag:string,str:string):string{
    return `<${tag}>${str}</${tag}>`;
}

// CDATA 标准的正则
// let CdataReg = /^\s*\<\!\[CDATA\[\s*([\s\S]+)\s\]\]\>\s*$/i;
// 辅助方法:响应替换掉 xml 里面的值
function ResponseReplaceXmlValue(Value:string):string{
    // if(CdataReg.test(Value)){
    //      return CdataReg.exec(Value)[1];
    // }else{
    //     /**
    //      *  正常符号          xml                php             名称
    //             &             &amp;            &amp;           和号
    //             "             &quot;           &quot;          双引号 
    //             '             &apos;           ' (未转义)       单引号
    //             <             &lt;             &lt;              小于
    //             >             &gt;             &gt;             大于
    //      */
    //     return Value.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
    // }
    // 直接去替换对应的结果
    return Value.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
}


/**
 * 辅助方法,字符串转xml对象
 *
 * @param {string} xmlString
 * @returns {XMLDocument}
 */
function StringToXml(xmlString:string):XMLDocument{
    // 去掉 <?xml version="1.0" encoding="utf-8"?>
    xmlString = xmlString.replace(/^\<\?xml[\s\S]+?\?\>/,'');
    // 捕获错误
    try{
        // 如果是 IE 浏览器
        if(window.ActiveXObject !== undefined){ 
            // for IE
            let xmlObject = new ActiveXObject("Microsoft.XMLDOM");
            xmlObject.async = "false";
            xmlObject.loadXML(xmlString);
            return xmlObject;
        }else{ 
            // // for other browsers
            // let parser = new DOMParser();
            // let xmlObject = parser.parseFromString(xmlString, "text/xml");
            // return xmlObject;
            return (new DOMParser()).parseFromString(xmlString,"text/xml");
        }
    } catch(e){
        // 输出一个调试信息
        Tools._DebugLog('Incorrect xml content'); // xml 内容不正确
        // 返回最后结果
        return StringToXml(Tools._IsString(xmlString) ? MergeTagString(StringKeys.r,MergeTagString(StringKeys.d,xmlString)) : MergeTagString(StringKeys.r,''));
    }
}

/**
 * 辅助方法,xml对象转字符串
 *
 * @param {XMLDocument} xmlObject
 * @returns {string}
 */
function XmlToString(xmlObject:XMLDocument):string{
    // 如果是 IE 浏览器
    if(window.ActiveXObject !== undefined){ 
        // for IE
        return (xmlObject as any).xml;
    }else{ 
        // for other browsers
        return (new XMLSerializer()).serializeToString(xmlObject);
    }
}


// 辅助方法:获得节点内容
function GetNodeText(NewJsonObject:{[key:string]:any}):any{
    // 如果为空,则直接返回
    if(!Tools._IsEmpty(NewJsonObject)){
        let Result:any = null;
        switch(true){
            case !Tools._IsNull(NewJsonObject["#text"]):
                Result = NewJsonObject["#text"];
                break;
            case !Tools._IsNull(NewJsonObject["#cdata-section"]):
                Result = NewJsonObject["#cdata-section"];
                break;
            default:
                Result = NewJsonObject;
        }
        // 返回结果
        return Result;
    }else{
        return NewJsonObject;
    }
}

/**
 * 辅助方法,xml对象转json
 *
 * @param {XMLDocument} xml
 * @param {boolean} [isAddTag=false]
 * @returns {({[key:string]:any}|Array<any>|any)}
 */
function XmlToJson(xml:XMLDocument|any,isAddTag:boolean=false):{[key:string]:any}|Array<any>|any{
    // 定义一个接收对象
    let JsonObject:{[key:string]:any}|any = {};
    // 当是元素节点,我们就需要将节点里所有的元素属性取出来
    if(xml.nodeType === Node.ELEMENT_NODE){ // 元素节点
        // 获得元素上的属性节点数组
        let AttrArray:Array<any> = xml.attributes;
        // 有存在属性节点才进行遍历
        if(AttrArray.length > 0){
            // 遍历所有属性节点
            for(let j = 0; j < AttrArray.length; j++){
                // 属性前面用‘@’标注，可以自定义
                let tag:string = isAddTag ? "@" : "";
                // 将属性名和值进行一一对应  且保证里面的 特殊符号被替换回来
                JsonObject[tag + AttrArray[j].nodeName] = ResponseReplaceXmlValue(AttrArray[j].value);
            }
        }
    }else if(xml.nodeType === Node.TEXT_NODE){ // 文本
        // 下面正则意思是去掉文本里的空格换行和回车, 且保证里面的 特殊符号被替换回来
        JsonObject = (xml.nodeValue.replace(/[\ +\r\n]/g, "") === "") ? "" : ResponseReplaceXmlValue(xml.nodeValue);        
    }else if(xml.nodeType === Node.CDATA_SECTION_NODE){
        // 这个是直接得到 <![CDATA[内容]]> 里面的内容  且保证里面的 特殊符号被替换回来
        JsonObject = ResponseReplaceXmlValue(xml.nodeValue);
    }
    
    
    // 是否存在子节点,存在子节点就会进行递归查询
    if(xml.hasChildNodes()){
        // 获得所有的子节点数组
        let nodes:NodeList = xml.childNodes;
        // 遍历所有节点
        for (let i = 0; i < nodes.length; i++) {
            // 获得元素的名称
            let nodeName:string = nodes[i].nodeName;
            // 判断元素是否存在 Json 对象中,如果再出现 即是 非undefined,就有可能数数组
            if(typeof(JsonObject[nodeName]) === "undefined"){
                // 继续递归
                let NewJsonObject:any = XmlToJson(nodes[i],isAddTag); // 递归
                // 不为空的才添加 #text:""这种文本节点是没有用的
                if(NewJsonObject !== ""){
                    // 赋值, 如果不需要出现 #text 文本节点,可以通过 isAddTag 进行设置
                    JsonObject[nodeName] = isAddTag ? NewJsonObject : GetNodeText(NewJsonObject);
                }
            }else{
                // 再判断 是否已经是数组对象了
                if(typeof(JsonObject[nodeName].push) === "undefined"){
                    // 将原来的老值提取出来
                    let OldValue:any = JsonObject[nodeName];
                    // 将当前属性转成数组
                    JsonObject[nodeName] = [];
                    // 将老数据添加到数组中
                    JsonObject[nodeName].push(OldValue);
                }
                // 继续递归
                let NewJsonObject:any = XmlToJson(nodes[i],isAddTag); // 递归
                // 不为空,直接添加
                if (NewJsonObject !== "") {
                    // 再网数组里,继续添加数据
                    JsonObject[nodeName].push(isAddTag ? NewJsonObject : GetNodeText(NewJsonObject));
                }
            }
        }
    }
    // 返回json数据
    return JsonObject;
}


// 辅助方法:创建xml内容
function CreateXmlText(Value:any,Key:string,ParentKeyName:string):string{
    let XmlText:string = '';
    // 递归部分,如果是对象,如果是数组
    if(Tools._IsObject(Value)){
        XmlText += JsonToXml(Value,Key); 
    }else if(Tools._IsArray(Value)){
        XmlText += JsonToXml(Value,'',Key);
    }else{
        // 新的key
        let NewKey:string = !Tools._IsEmpty(ParentKeyName) ? ParentKeyName : Key;
        // 区分赋值
        switch(true){
            case Tools._IsString(Value):
                Value = `<![CDATA[${Value}]]>`;
                XmlText += `<${NewKey}>${Value}</${NewKey}>`;
                break;
            case Tools._IsNumber(Value):
                XmlText += `<${NewKey}>${Value}</${NewKey}>`;
                break;
            case Tools._IsBoolean(Value):
                Value = Value ? 'true' : 'false';
                XmlText += `<${NewKey}>${Value}</${NewKey}>`;
                break;
            default:
                Value = Tools._IsNull(Value) ? '' : Value.tostring();
                XmlText += `<${NewKey}>${Value}</${NewKey}>`;
        }
    }
    // 返回结果
    return XmlText;
}


/**
 * 核心方法,将Json转成Xml
 *
 * @param {{[key:string]:any}} JsonData
 * @param {string} [KeyName='xml']
 * @param {string} [ParentKeyName='']
 * @returns {string}
 */
function JsonToXml(JsonData:{[key:string]:any},KeyName:string='xml',ParentKeyName:string=''):string{
    
    // 标准的开头
    let XmlText:string = Tools._IsEmpty(KeyName) ? '' : `<${KeyName}>`;
    // 1. {a:123,b:[1,2,3]}
    // 当执行到 b => 传入的是一个数组 => ([1,2,3], 'b', '')
    // 2. [1,2,3] => 就到了 CreateXmlText 中 value === 数组
    // 需要将 key = '' , ParentKeyName = key(b) => JsonToXml([1,2,3],'','b')
    // 最后就递归循环

    // 如果是 对象
    if(Tools._IsObject(JsonData)){
        // 对象遍历
        Object.keys(JsonData).forEach((Key:string) => {
            XmlText += CreateXmlText(JsonData[Key],Key,'');
        });
    }else if(Tools._IsArray(JsonData)){
        JsonData.forEach((Item:any) => {
            XmlText += CreateXmlText(Item,'',ParentKeyName);
        });
    }

    // 最后闭合
    XmlText += Tools._IsEmpty(KeyName) ? '' : `</${KeyName}>`;

    // 最后返回
    return XmlText;
}


/**
 * 负责 xml 数据的转换
 *
 * @export
 * @class Xml
 */
export class Xml{

    /**
     *  获得XML的开头字符串标准
     *
     * @private
     * @static
     * @param {string} str
     * @param {string} [encodeing='UTF-8']
     * @returns {string}
     * @memberof Xml
     */
    private static _GetXmlStartString(str:string,encodeing:string='utf-8'):string{
        // 替换后返回,合并后的 xml 字符串, version 必须是等于1.0,修改了无法识别
        return '<?xml version="1.0" encoding="$2"?>$1'.replace('$2',encodeing).replace('$1',str);
    }


    /**
     * xml 转 string
     *
     * @static
     * @param {*} data
     * @param {string} [charset]
     * @returns {string}
     * @memberof Xml
     */
    public static _ToString(data:any,charset?:string):string{

        // 定义返回的字符串,首先取到 xml 标准方式的头部
        let ReturnString:string = Xml._GetXmlStartString('',charset);
        // 区分
        switch(true){
            // 如果是元素节点
            case Tools._ToType(data) === "XMLDocument" || Tools._IsElement(data):
                ReturnString += XmlToString(data);
                break
            // 如果是对象
            case Tools._IsObject(data):
                ReturnString += JsonToXml(data);
                break
            // 如果是数组
            case Tools._IsArray(data):
                ReturnString += JsonToXml(data,'xml','data');
                break
            // 如果是字符串
            case Tools._IsString(data):
                // 先定义一个 xml 字符串判断正则规则
                // let XmlRegexp:RegExp = new RegExp('^(\\s*\\<\\?xml\\s*[^?]+\\?\\>)[^]*$','i');
                let XmlRegexp:RegExp = new RegExp('^(\\s*\\<\\?xml\\s*[^?]+\\?\\>)?\\s*\\<(\\w+)\\>[\\s\\S]+\\<\\/\\2\\>\\s*$'); // xml 不能忽略大小写,大写是错误的
                // 字符串,有可能就 xml 的字符串
                // if(/^(\s*\<\?xml\s*[^?]+\?\>)?\s*\<(\w+)\>[^]+\<\/\2\>\s*$/i.test(data)){
                if(XmlRegexp.test(data)){
                    // 先把 <?xml version="1.0" encoding="UTF-8"?> 声明取出来
                    let match:any[] = XmlRegexp.exec(data);
                    // 取出第一个,如果不是 undefined 就是字符串
                    if(!Tools._IsNull(match[1])){
                        // // 使用用户定义的 xml 头信息
                        // ReturnString = match[1];
                        // // 需要将 data 上原来的头信息替换掉
                        // data = data.replace(ReturnString,'');
                        // <?xml version="1.0" encoding="utf-8"?> 多一个属性都会报错,所以我们不需要用户自定义的
                        data = data.replace(match[1],''); // 去掉用户定义的头信息
                    }
                    // 为了保证提交合法的 xml 我们先在本地进行 转成 xml 对象,再转成 xml 字符串
                    ReturnString += XmlToString(StringToXml(data));
                }else{
                    // 解构取值
                    let {d:KeyData,r:KeyRoot} = StringKeys;
                    // 拼接合并
                    ReturnString += MergeTagString(KeyRoot,MergeTagString(KeyData,data));
                }
                break
            default:
                ReturnString += MergeTagString(StringKeys.r,'');
        }

        // 返回转换后的字符串
        return ReturnString;
    }


    /**
     * string 转 xml
     *
     * @static
     * @param {string} xmlString
     * @returns {XMLDocument}
     * @memberof Xml
     */
    public static _ToXml(xmlString:string):XMLDocument{
        return StringToXml(xmlString);
    }


    /**
     * xml 转 json
     *
     * @static
     * @param {string} xml
     * @param {boolean} [isAddTag=false]
     * @returns {*}
     * @memberof Xml
     */
    public static _ToJson(xmlString:string,isAddTag:boolean=false):any{
        return XmlToJson(StringToXml(xmlString),isAddTag);
    }

}