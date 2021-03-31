
import {BrowserClass} from './Index';

/**
 * 通过 Url 绑定浏览器,当执行到对应的链接,与当前的浏览器不相符,则会跳转到对应的链接
 * 
 * 比如:使用 Chrome 访问了 http://ie.xxx.com 的时候,则会找到是否 对应的 chrome 的链接,有则跳转,无则找默认的,否则不变
 * 
 *     例如: PC 端 http://www.xxx.con , mobile 端 http://m.xxx.com,如果设置了,用PC端访问手机端的时候,则会自动跳转到PC端的链接
 *          
 *     还可以对系统进行设置:
 *     例如: iOS Android Windows Linux 进行设置,对应的链接
 * @export
 * @class ByUrl
 */
export class ByUrl{

    /**
     * 把浏览器实例存起来一份
     *
     * @private
     * @type {BrowserClass}
     * @memberof ByUrl
     */
    private _browser:BrowserClass;

    /**
     * Creates an instance of ByUrl.
     * @param {BrowserClass} browser
     * @memberof ByUrl
     */
    constructor(browser:BrowserClass){
        // 挂载该实例
        this._browser = browser;
    }
}