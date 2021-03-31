// 引入接口
import {CacheInterface} from './Inf';
import {Tools,Crypto,cyt} from '../../lib/Index';
import {Data} from '../Data';

/**
 * 实现本地缓存 localStorage 且必须继承 统一的接口
 *
 * @export
 * @class WStorage
 * @implements {CacheInterface}
 */
export class WStorage implements CacheInterface{

    /**
     * 当前的用户 key,每一个用户都会有一个本地的key,即便是同一个数据名称,不同的用户是读不到别的用户信息
     *
     * @type {string}
     * @memberof WStorage
     */
    public key:string = '';

    /**
     * 是否对数据进行加密
     *
     * @private
     * @type {boolean}
     * @memberof WStorage
     */
    private _IsEncode:boolean;

    /**
     * 这个为主要控制加解密
     *
     * @private
     * @type {boolean|null}
     * @memberof WStorage
     */
    private _IsCrypto:boolean|null=null;

    /**
     * 加密模块
     *
     * @private
     * @type {Crypto}
     * @memberof WStorage
     */
    private _Crypto:Crypto;

    /**
     * aes 加解密实例对象
     *
     * @private
     * @type {*}
     * @memberof WStorage
     */
    private _aes:any;

    /**
     * localStorage 缩写实例
     *
     * @private
     * @type {Storage}
     * @memberof WStorage
     */
    private l:Storage;

    /**
     * Creates an instance of WStorage.
     * @param {string} [key='']
     * @memberof WStorage
     */
    constructor(key:string='',isEncode:boolean=true){
        // 赋值到属性上
        this.key = Tools._IsString(key) ? key : '';
        this._IsEncode = isEncode;
        // 挂载加密,使用统一的内部加密实例
        this._Crypto = cyt;
        // 挂载 localStorage
        this.l = localStorage;
        // 挂载加解密对象
        this._aes = new cyt.Aes(key);

    }


    /**
     * 拿到 key
     *
     * @private
     * @param {string} name
     * @returns {string}
     * @memberof WStorage
     */
    private _getKey(name:string):string{
        // 保证必须是字符串
        name = Tools._IsString(name) ? name : '';
        // 继续加密并获得 缓存的 key
        return this._Crypto.sha1(this.key + name);
    }

    /**
     * 校验数据缓存是否存在,存在且过期,则删除,返回并不存在
     *
     * @param {string} name
     * @returns {boolean}
     * @memberof WStorage
     */
    public has(name:string):boolean{
        // 拿到 key
        let key = this._getKey(name);
        let hasValue = this.l.getItem(key);
        // 先看看返回的值是不是null
        if(!Tools._IsString(hasValue)){
            return false;
        }
        // 看看是否使用了加密
        if(this._IsEncode){
            // 解密... 等待解密函数
            hasValue = this.d(hasValue);
        }
        // 最后将其转成对象
        let ObjectData:any = {};
        try {
            ObjectData = JSON.parse(hasValue);
        } catch (e) {
            ObjectData = null;
            // 删除掉
            this.remove(name);
        }
        // 再校验是否过期了
        if(Tools._IsObject(ObjectData)){
            // 拿到当前时间戳
            let Time = Data.t();
            let Timeout = ObjectData['timeout'];
            // 必须是存在的,且是数字,且不超时
            if(!Tools._IsNull(Timeout) && !isNaN(Timeout) && parseInt(Timeout) >= Time){                
                return true;
            }else{
                // 删除过期的
                this.remove(name);
                return false;
            }
        }else{
            // 这是不存在的
            return false;
        }
    }

    /**
     * 对写入的缓存内容加密
     *
     * @private
     * @param {string} str
     * @returns {string}
     * @memberof WStorage
     */
    private e(str:string):string{
        // let encode:(text:string)=>string = this._aes.encode;
        // console.log(this._IsCrypto,this._IsEncode,Tools._IsNull,encode);
        
        // 如果等于null,则使用默认的
        if(Tools._IsNull(this._IsCrypto)){
            return this._IsEncode ? this._aes.encode(str) : str;
        }else{
            // 加密
            return this._IsCrypto ? this._aes.encode(str) : str;
        }
        
    }

    /**
     * 对读取的缓存内容解密
     *
     * @private
     * @param {string} str
     * @returns {string}
     * @memberof WStorage
     */
    private d(str:string):string{
        // let decode:(text:string)=>string = ;
        // 为null的时候使用默认的
        if(Tools._IsNull(this._IsCrypto)){
            return this._IsEncode ? this._aes.decode(str) : str;
        }else{
            // 解密
            return this._IsCrypto ? this._aes.decode(str) : str;
        }
        
    }


    /**
     * 这个加解密是可以绕开 new 时构造定义的加解密
     *
     * @param {boolean} [isCrypto=true]
     * @returns {WStorage}
     * @memberof WStorage
     */
    public isCrypto(isCrypto:boolean=true):WStorage{
        // 赋值控制加解密
        this._IsCrypto = isCrypto;
        // 返回当前实例
        return this;
    }


    /**
     * 设置某一个缓存
     *
     * @param {string} name
     * @param {*} value
     * @param {number} [expire=0]
     * @memberof WStorage
     */
    public set(name:string,value:any,expire:number=0):void{
        let key = this._getKey(name);
        // 设置,要求 不存在则新增,存在则修改
        if(this.has(name)){
            // 修改
            this.l.setItem(key,this.e(Data.u(this.d(this.l.getItem(key)),value)));
        }else{
            this.l.setItem(key,this.e(Data.c(value,expire)));
        }

        // 当使用了 isCrypto 篡改全局配置时,设置完成后需要还原
        this._IsCrypto = null;
    }

    /**
     * 读取某一个缓存
     *
     * @param {string} name
     * @param {*} [defualt=null]
     * @returns {*}
     * @memberof WStorage
     */
    public get(name:string,defualt:any=null):any{
        // 现在是否存在或过期
        if(this.has(name)){
            // 读取
            let value:any = this.l.getItem(this._getKey(name));
            // 先去加解密
            value = this.d(value);
            // 将其转成对象,这里是不可能报错的了
            try {
                value = JSON.parse(value);
            } catch (e) {
                this.remove(name);
                value = {'data':defualt};
            }

            // 当使用了 isCrypto 篡改全局配置时,设置完成后需要还原
            this._IsCrypto = null;

            // 最后返回结果
            return value.data;
        }else{
            return defualt;
        }
    }

    /**
     * 删除某一个缓存
     *
     * @param {string} name
     * @memberof WStorage
     */
    public remove(name:string):void{
        this.l.removeItem(this._getKey(name));
    }

    /**
     * 清除所有缓存
     *
     * @memberof WStorage
     */
    public clear():void{
        this.l.clear();
    }
}