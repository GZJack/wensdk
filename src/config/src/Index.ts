import {Tools} from '../lib/Index';

// SDK所有配置挂载变量
let SDKAllConfig = {};

/**
 * 负责整个 SDK 配置项,灵活使用
 *
 * @export
 * @class Config
 */
export class Config{
    /**
     * 设置配置
     *
     * @static
     * @param {string} Key
     * @param {*} Value
     * @memberof Config
     */
    public static Set(Key:string,Value:any):void{
        Tools._ToSet(SDKAllConfig,Key,Value);
    }

    /**
     * 获取配置
     *
     * @static
     * @param {string} [Key=null]
     * @param {*} [Default=null]
     * @returns {*}
     * @memberof Config
     */
    public static Get(Key:string=null,Default:any=null):any{
        // 如果为空,或不是字符串,则返回整个配置 
        return Tools._IsString(Key) && !Tools._IsEmpty(Key) ? Tools._ToGet(SDKAllConfig,Key,Default) : SDKAllConfig;
    }
}