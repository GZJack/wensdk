import {HttpOptions,Options} from '../Options';
import {Tools} from '../../lib/Index';


/**
 * 负责 Http 工具插件类
 *
 * @export
 * @class Utils
 */
export class Utils{

    /**
     * 用于校验 http.request() 起初的配置输入
     * 
     *
     * @static
     * @param {(string|Options|object|any)} options
     * @param {IArguments} args
     * @returns {Options}
     * @memberof Utils
     */
    public static _CheckRequestOptions(options:string|Options|object|any,args:IArguments):Options{
         // 如果第一个是字符串,我们这认为是 请求地址
         if(Tools._IsString(options)){
            // 接下来就默认第二个参数是配置项,而且必须是对象,否则无效
            options = Tools._IsObject(args[1]) ? args[1] : {};
            // 那第一个则是请求气质
            options.url = args[0];
        }else{
            // 如果不是对象的,我们则给一个默认值
            if(!Tools._IsObject(options)){
                // 如果传入的不是对象,后来其他参数,我们均不管
                options = {};
            }
        }

        // 最后返回合成的配置项
        return options;
    }
    
    /**
     * 进行解构赋值
     *
     * @private
     * @static
     * @param {(string|HttpOptions|object)} url
     * @param {(HttpOptions|Options|object|any)} options
     * @param {(object|Array<any>|any)} [data=null]
     * @returns {[string,object,any]}
     * @memberof Utils
     */
    public static _CheckUrlSetData(url:string|HttpOptions|object,options:HttpOptions|Options|object|any,data:object|Array<any>|any=null):[string,object,any]{
        // 如果 url 是一个对象 http.get({url:"xxx/xxx",...})
        if(Tools._IsObject(url)){
            options = (url as HttpOptions);
            url = Tools._IsString(options.url) ? options.url : '';
            // 如果 data 不为 null
            if(Tools._IsNull(data)){
                data = !Tools._IsNull(options.data) ? options.data : null;
            }
        }
        // 保证后面的配置项必须是 Object 对象
        if(!Tools._IsObject(options)){
            options = {};
        }
        // 最后解构赋值
        return [(url as string),options,data];
    }


    /**
     * 固定格式:重新定义对象属性函数 不可以直接修改属性,只可以获取
     *
     * @static
     * @param {object} ObjectData
     * @param {string} Key
     * @param {*} Value
     * @memberof Utils
     */
    public static _ReDefinePropertyOnlyGet(ObjectData:object|any,Key:string,Value:any):void{
        Object.defineProperty(ObjectData,Key,{
            configurable:true, // 允许修改 一次 再用 reDefineProperty 完全不能再修改了
            // 只可以获得,不能直接修改
            get(){
                return Value;
            }
        });
    }

    /**
     * 固定格式:重新定义对象属性函数
     *
     * @static
     * @param {(object|any)} ObjectData
     * @param {string} Key
     * @param {*} Value
     * @memberof Utils
     */
    public static _ReDefineProperty(ObjectData:object|any,Key:string,Value:any):void{
        // 这里定义的属性,均不能修改,不能删除
        Object.defineProperty(ObjectData,Key,{
            // 不可修改删除
            configurable:false,
            // 不可枚举
            enumerable:false,
            // 不可写
            writable:false,
            // 绑定值
            value:Value
        });
    }


    /**
     * 统一赋值一个新的 config ,并冻结
     *
     * @static
     * @param {Options} options
     * @returns {(Options|any)}
     * @memberof Utils
     */
    public static _CopyConfigInResponse(options:Options):Options|any{
        let freezeOptions:any = {};
        return Object.freeze(Tools._Merge(freezeOptions,options));
    }


}

