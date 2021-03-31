
/**
 * 通用的 Base64 加解密
 *
 * @export
 * @class Base64
 */
export class Base64{

    /**
     * 
     *
     * @private
     * @static
     * @type {string}
     * @memberof Base64
     */
    private static _keyStr:string;

    constructor(){
        Base64._keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    }


    /**
     * utf-8 加密私有静态函数
     *
     * @private
     * @static
     * @param {string} input
     * @returns {string}
     * @memberof Base64
     */
    private static _utf8Encode(input:string):string{
        input = input.replace(/\r\n/g, "\n");
        let output:string = "";
        for (let n = 0; n < input.length; n++) {
            let c = input.charCodeAt(n);
            if (c < 128) {
                output += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                output += String.fromCharCode((c >> 6) | 192);
                output += String.fromCharCode((c & 63) | 128);
            } else {
                output += String.fromCharCode((c >> 12) | 224);
                output += String.fromCharCode(((c >> 6) & 63) | 128);
                output += String.fromCharCode((c & 63) | 128);
            }
    
        }
        return output;
    }


    /**
 * utf-8 解密私有静态函数
 */
    private static _utf8Decode(input:string) {
        let output:string = "";
        let i:number = 0;
        let c1, c2, c3;
        let c = c1 = c2 = 0;
        while (i < input.length) {
            c = input.charCodeAt(i);
            if (c < 128) {
                output += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = input.charCodeAt(i + 1);
                output += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = input.charCodeAt(i + 1);
                c3 = input.charCodeAt(i + 2);
                output += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return output;
    }


    /**
     * 加密
     *
     * @param {string} input
     * @returns {string}
     * @memberof Base64
     */
    public encode(input:string):string{
        let output:string = "";
        let _keyStr:string = Base64._keyStr;
        let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        let i = 0;
        // 调用私有加密静态函数
        input = Base64._utf8Encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    }

    /**
     * 解密
     *
     * @param {string} input
     * @returns {string}
     * @memberof Base64
     */
    public decode(input:string):string{
        let output:string = "";
        let _keyStr:string = Base64._keyStr;
        let chr1, chr2, chr3;
        let enc1, enc2, enc3, enc4;
        let i:number = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        // 使用解密私有静态方法
        output = Base64._utf8Decode(output);
        return output;
    } 
}