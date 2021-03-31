// 拿到加密函数
import {cyt} from '../../main';
import {Tools} from '../../lib/Index';


/**
 * 将内容放置开头
 */
function start(code:Array<any>,num:number,key8:string){
    let numStr = num.toString();
    let numLength = numStr.length;
    code.splice(0,0,numLength.toString());
    code.splice(1,0,key8);
    code.splice(2,0,numStr);
    return code;
}

/**
 * 本地js加密,提交到后台解密
 *
 * @export
 * @param {string} text
 * @returns {string}
 */
export function e(text:string):string{
    // 先判断是否存在 base64 和 md5
    if(!Tools._IsString(text) || Tools._IsEmpty(text)) return text;
    // 时间戳 + md5 生成密钥 (取前8个字符串,再进行MD5)
    let secretKey:string = cyt.md5(Tools._GetTime().toString(),32);
    // 进行 base64 加密
    text = cyt.base64.encode(text);
    // 取8个
    let key8:string = secretKey.substr(0,8);
    // 取出前面8个进行md5加密
    secretKey = cyt.md5(key8,32);
    // 字符串长度
    let textLength:number = text.length;
    // 随机数 (0,输入的字符串长度)
    let r = Tools._Random(0,textLength);
    // 密文
    let code = [];
    // 循环
    for (let i = 0; i < textLength; i++) {
        // 原字符
        code.push(text[i])
        // 等于加密的位置的时候
        if(i>=r){
            // 没有超出就往里面加
            if(secretKey[i-r]){
                code.push(secretKey[i-r])
            }
        }
    }
    
    // 执行串改
    start(code,r,key8);
    // 第二次加密
    return key8 + cyt.base64.encode(code.join(''));
}


/**
 * 后台php加密,返回到前端js解密
 *
 * @export
 * @param {String} text
 * @returns {string}
 */
export function d(text:string,defualt?:any,isOutJson:boolean=false):string|any{
    // 先判断是否存在 base64 和 md5
    if(!Tools._IsString(text) || Tools._IsEmpty(text)) return Tools._IsNull(defualt) ? defualt : text;
    // 第一步 进行 base64
    let base64Str:string = cyt.base64.decode(text);
    // 字符长度
    let strLength:number = base64Str.length;
    // 新数组
    var newArr:Array<string> = [];
    for (let i = 0; i < strLength; i+=2) {
        newArr.push(base64Str[i]);
    }
    // 结果
    base64Str = cyt.base64.decode(newArr.join(''));
    // 第一个 first 标识符
    let first:string = base64Str.substr(0,3);
    // 如果返回的
    if(first !== "<<<"){
        return defualt ? defualt : false;
    }
    // 最后一个 last 标识符
    let last:string = base64Str.substr(-3,3);
    if(last !== ">>>"){
        return defualt ? defualt : false;
    }
    // 再次获得字符串长度
    strLength = base64Str.length -6;
    // 获得真实结果
    base64Str = base64Str.substr(3,strLength)
    // 最后返回真实的结果
    // 返回是否是json
    if(isOutJson !== true){
        // 返回字符串
        return base64Str;
    }else{
        try {
            return JSON.parse(base64Str);
        } catch (error) {
            return defualt ? defualt : base64Str;
        }
    }
}