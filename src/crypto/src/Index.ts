import {Base64} from './base64/Index';
import {md5} from './md5/Index';
import sha1 from './sha1/Index';
import {e,d} from './ed/Index';

import {AesClass} from './aes/Index';


export class Crypto{
    /**
     * base64 加解密
     *
     * @type {Base64}
     * @memberof Crypto
     */
    public base64:Base64;

    /**
     * md5 加密
     *
     * @memberof Crypto
     */
    public md5:(sMessage:string,bit:number)=>string;

    /**
     * sha1 加密
     *
     * @memberof Crypto
     */
    public sha1:(message:string)=>string;

    /**
     * 前端加密提交到后端解密
     *
     * @memberof Crypto
     */
    public e:(text:string)=>string;

    /**
     * 后端加密到前端解密
     *
     * @memberof Crypto
     */
    public d:(text:string,defualt?:any,isOutJson?:boolean) => string|any;

    /**
     * 原型类,未new的类
     *
     * @type {AesClass}
     * @memberof Crypto
     */
    public Aes:AesClass|any;

    /**
     * 这个是实例
     *
     * @type {AesClass}
     * @memberof Crypto
     */
    public aes:AesClass;

    /**
     * Creates an instance of Crypto.
     * @memberof Crypto
     */
    constructor(){

        this.base64 = new Base64();

        this.md5 = md5;

        this.sha1 = sha1;

        this.e = e;

        this.d = d;

        this.Aes = AesClass;

        this.aes = new AesClass();

    }
}