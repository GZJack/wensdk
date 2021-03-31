/**
 * 状态的配置接口
 *
 * @export
 * @interface StateConfig
 */
export interface StateConfig{
     // 当前 state 的类型,只有 Object 和 Array 这两种类型
     type?:Function; // 选项 ['Object','Array']
     // 是否自动读取写入,当等于 true 的时候,就会自动 读取和写入到 localStorage 本地上
     isAutoReadWrite?:boolean; // 等于 false ,会执行本地删除,以前存在的也会被删除
     // 当 上面设置本地 存储 后 expire , 过期会自动删除
     expire?:number; // 0: 表示长期有效, 单位:秒 
     // 读取和写入的时候 是否自动对数据进行加密
     isAutoCrypto?:boolean;
}

/**
 *  状态的配置类实例
 *
 * @export
 * @class Config
 */
export class Config{
    /**
     * 状态的类型,默认是对象
     *
     * @type {Function}
     * @memberof Config
     */
    public type:Function = Object;

    /**
     * 是否自动读写到本地上
     *
     * @type {boolean}
     * @memberof Config
     */
    public isAutoReadWrite:boolean = true;

    /**
     * 本地缓存的失效
     *
     * @type {number}
     * @memberof Config
     */
    public expire:number = 0;

    /**
     * 是否自动加解密到本地上
     *
     * @type {boolean}
     * @memberof Config
     */
    public isAutoCrypto:boolean = true;

    /**
     * Creates an instance of Config.
     * @param {StateConfig} options
     * @memberof Config
     */
    constructor(options:StateConfig){

    }
}