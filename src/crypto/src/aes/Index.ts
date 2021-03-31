import {Aes} from './Aes';

/**
 * Aes 加解密
 *
 * @export
 * @class AesClass
 */
export class AesClass{

    /**
     * 解密密钥
     *
     * @private
     * @type {string}
     * @memberof AesClass
     */
    private _password:string='0';

    /**
     * 位数
     *
     * @private
     * @type {number}
     * @memberof AesClass
     */
    private _bits:number;

    constructor(password:string='0',bits:number=256){
        this._password = password;
        this._bits = bits;
    }

    /**
     * Aes 加密
     *
     * @param {string} text
     * @returns {string}
     * @memberof AesClass
     */
    public encode(text:string):string{        
        return Aes.e(text,this._password,this._bits);
    }

    /**
     * Aes 解密
     *
     * @param {string} text
     * @returns {string}
     * @memberof AesClass
     */
    public decode(text:string):string{
        return Aes.d(text,this._password,this._bits);
    }
}