/*\
|*|
|*|  :: cookies.js ::
|*|
|*|  A complete cookies reader/writer framework with full unicode support.
|*|
|*|  https://developer.mozilla.org/en-US/docs/DOM/document.cookie
|*|
|*|  This framework is released under the GNU Public License, version 3 or later.
|*|  http://www.gnu.org/licenses/gpl-3.0-standalone.html
|*|
|*|  Syntaxes:
|*|
|*|  * docCookies.setItem(name, value[, end[, path[, domain[, secure]]]])
|*|  * docCookies.getItem(name)
|*|  * docCookies.removeItem(name[, path], domain)
|*|  * docCookies.hasItem(name)
|*|  * docCookies.keys()
|*|
\*/

/**
 * 负责本地的Cookie操作,方法与 localStorage 很像
 *
 * @export
 * @class Cookie
 */
export class Cookie{

    /**
     * 获取 cookie 内容
     *
     * @static
     * @param {string} Key
     * @returns {string}
     * @memberof Cookie
     */
    public static getItem(Key:string):string{
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(Key).replace(/[-.+*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    }


    /**
     * 设置 cookie 内容
     *
     * @static
     * @param {string} Key
     * @param {string} Value
     * @param {(string|number|Date|any)} [End]
     * @param {string} [Path]
     * @param {string} [Domain]
     * @param {string} [Secure]
     * @returns {boolean}
     * @memberof Cookie
     */
    public static setItem(Key:string,Value:string,End?:string|number|Date|any,Path?:string,Domain?:string,Secure?:string):boolean{
        if (!Key || /^(?:expires|max\-age|path|domain|secure)$/i.test(Key)) { return false; }
        let Expires:string = "";
        if (End) {
          switch (End.constructor) {
            case Number:
                // Infinity 表示无穷大
                Expires = End === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + End;
                break;
            case String:
                Expires = "; expires=" + End;
                break;
            case Date:
                Expires = "; expires=" + End.toUTCString();
                break;
          }
        }
        document.cookie = encodeURIComponent(Key) + "=" + encodeURIComponent(Value) + Expires + (Domain ? "; domain=" + Domain : "") + (Path ? "; path=" + Path : "") + (Secure ? "; secure" : "");
        return true;
    }

    /**
     * 移除 cookie 内容
     *
     * @static
     * @param {string} Key
     * @param {string} [Path]
     * @param {string} [Domain]
     * @returns {boolean}
     * @memberof Cookie
     */
    public static removeItem(Key:string,Path?:string,Domain?:string):boolean{
        if (!Key || !Cookie.hasItem(Key)) { return false; }
        document.cookie = encodeURIComponent(Key) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + ( Domain ? "; domain=" + Domain : "") + ( Path ? "; path=" + Path : "");
        return true;
    }

    /**
     * 校验是否存在该 cookie 项
     *
     * @static
     * @param {string} Key
     * @returns {boolean}
     * @memberof Cookie
     */
    public static hasItem(Key:string):boolean{
        return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(Key).replace(/[-.+*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    }

    /**
     * 获得所有的 cookie key
     *
     * @static
     * @returns {Array<string>}
     * @memberof Cookie
     */
    public static keys():Array<string>{
        let aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
        for(let nIdx = 0; nIdx < aKeys.length; nIdx++){ 
            aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
        }
        return aKeys;
    }
}

/**
 * SDK 内部使用
 *
 * @export
 * @class CookiePrivate
 */
export class CookiePrivate{

    /**
     * SDK 内部使用
     *
     * @static
     * @param {string} Key
     * @param {string} Value
     * @param {(string|number|Date|any)} [End]
     * @param {string} [Path]
     * @param {string} [Domain]
     * @param {string} [Secure]
     * @returns {boolean}
     * @memberof CookiePrivate
     */
    public static _SetItem(Key:string,Value:string,End?:string|number|Date|any,Path?:string,Domain?:string,Secure?:string):boolean{
        return Cookie.setItem(Key,Value,End,Path,Domain,Secure);
    }

    /**
     * 移除 cookie 内容
     *
     * @static
     * @param {string} Key
     * @param {string} [Path]
     * @param {string} [Domain]
     * @returns {boolean}
     * @memberof CookiePrivate
     */
    public static _RemoveItem(Key:string,Path?:string,Domain?:string):boolean{
        return Cookie.removeItem(Key,Path,Domain);
    }
}