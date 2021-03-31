
import {WStorage} from './drivers/Storage';


/**
 * 缓存
 *
 * @export
 * @class Cache
 */
export class Cache {

    /**
     * 将驱动挂载起来,当使用到对应的驱动时,则会通过驱动进行调用
     *
     * @private
     * @type {WStorage}
     * @memberof Cache
     */
    private _driver:WStorage;

    /**
     * Creates an instance of Cache.
     * @memberof Cache
     */
    constructor(key:string=''){
        // 驱动
        this._driver = new WStorage(key,true);
    }

    /**
     * 用于控制绕开公共设置加解密
     *
     * @param {boolean} [isCrypto=true]
     * @returns {Cache}
     * @memberof Cache
     */
    public isCrypto(isCrypto:boolean=true):Cache{
        this._driver.isCrypto(isCrypto);
        return this;
    }

    /**
     * 校验当前 key 是否存在,过期了,也是不存在的,过期,且会删除掉
     *
     * @param {string} name
     * @returns {boolean}
     * @memberof Cache
     */
    public has(name:string):boolean{
        return this._driver.has(name);
    }

    /**
     * 设置缓存
     *
     * @param {string} name
     * @param {*} value
     * @param {number} [expire=0]
     * @memberof Cache
     */
    public set(name:string,value:any,expire:number=0):void{
        this._driver.set(name,value,expire);
    }


    /**
     * 读取缓存
     *
     * @param {string} name
     * @param {*} [defualt=null]
     * @returns {*}
     * @memberof Cache
     */
    public get(name:string,defualt:any=null):any{
        return this._driver.get(name,defualt);
    }

    /**
     * 删除某一个缓存
     *
     * @param {string} name
     * @memberof Cache
     */
    public remove(name:string):void{
        this._driver.remove(name);
    }


    /**
     * 清空所有缓存
     *
     * @memberof Cache
     */
    public clear():void{
        this._driver.clear();
    }

}