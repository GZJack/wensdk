
import {Tools} from '../lib/Index';


/**
 * 浏览器类工具,用来分析浏览器,及客户端
 * 
 * 功能实现:
 * 1. 浏览器名称,版本,引擎,系统,设备,语言 (最基本的)
 * 2. 有一些通用的方法,判断当前的浏览器, IsIE(),IsWechat(),IsPc(),IsAndroid() 等有效的方法
 * 3. 设置固定模式 如:(IE浏览器就访问 http://ie.xxx.com),有设置才会跳转的,甚至能加版本,低于或高于这个版本的才进行跳转
 * 4. 设置浏览器最低版本限制,如:(IE < 8),要是设置了 3,则会跳转到 适合 IE 的链接, 否则就清空 body, 在页面上提示版本太低,(支持添加一些网页模板html,如:提供下载官方提供的浏览器链接)
 * 5. 可以设置指定(浏览器,系统,设备)访问,如果指定只能微信客户端访问,当用其他浏览器访问,则清空页面内容,什么都不显示,开发模式,会在控制台输出一条调试日志
 *
 * @export
 * @class BrowserClass
 */
export class BrowserClass{

    /**
     * 浏览器名称
     *
     * @type {string}
     * @memberof BrowserClass
     */
    public browser:string;

    /**
     * 浏览器版本
     *
     * @type {string}
     * @memberof BrowserClass
     */
    public version:string;

    /**
     * 浏览器引擎
     *
     * @type {string}
     * @memberof BrowserClass
     */
    public engine:string;

    /**
     * 浏览器运行的系统
     *
     * @type {string}
     * @memberof BrowserClass
     */
    public os:string;

    /**
     * 浏览器运行系统版本
     *
     * @type {string}
     * @memberof BrowserClass
     */
    public osVersion:string;

    /**
     * 支持的语言
     *
     * @type {string}
     * @memberof BrowserClass
     */
    public language:string;

    /**
     * 浏览器运行的设备
     * 
     * PC - 电脑
     * Tablet - 平板或PDA
     * Mobile - 手机
     *
     * @type {string}
     * @memberof BrowserClass
     */
    public device:string;

    
    /**
     * Creates an instance of BrowserClass.
     * @memberof BrowserClass
     */
    constructor(){

        // 拿到 navigator 对象
        let BrowserNavigator:Navigator = Tools._ToGet((window as any),'navigator',{"userAgent":'',"language":''});
        // 拿到标识符
        let BrowserUserAgent:string = BrowserNavigator.userAgent;


    }


    /**
     * 启动,当配置完成后,需要启动
     *
     * @memberof BrowserClass
     */
    public Start():void{

    }



    public SetUrl(){
 
    }

    public IsWechat():boolean{
        return true;
    }

}