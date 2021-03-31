
import {ToolsStaticClass} from './Index';

import {Url,WLocation} from './Url';

/**
 * 私有的工具类,这里定义公布到内部使用的,是会被替换掉属性的,命名必须以 _ 下划线开头
 * 
 * 这里全部方法都是继承 ToolsClass
 *
 * @class Tools
 */
export class Tools extends ToolsStaticClass{


    /**
     * Creates an instance of Tools.
     * @memberof Tools
     */
    constructor(){
        super();

    }



    /**
     * 将类数组转为数组
     * 
     * 在本 SDK 内部使用
     *
     * @static
     * @param {*} value
     * @returns {Array<any>}
     * @memberof Tools
     */
    public static _ToArrayFrom(value:any):Array<any>{
        return Tools.ToArrayFrom(value);
    }

    /**
     * 将NodeList转成数组形式
     * 
     * 在本 SDK 内部使用
     * 
     * @static
     * @param {NodeList} nodes
     * @returns {Array<Element>}
     * @memberof Tools
     */
    public static _NodeListToArray(nodes:NodeList):Array<Element>{
        return Tools.NodeListToArray(nodes);
    }

    /**
     * 获得数据类型
     * 
     * 在本 SDK 内部使用
     *
     * @static
     * @param {*} value
     * @returns {string}
     * @memberof Tools
     */
    public static _ToType(value:any):string{
        return Tools.ToType(value);
    }

    /**
     * 数据是否是元素列表
     * 
     * 在本 SDK 内部使用
     *
     * @static
     * @param {*} value
     * @returns {boolean}
     * @memberof Tools
     */
    public static _IsNodeList(value:any):boolean{
        return Tools.IsNodeList(value);
    }

    /**
     * 数据是否字符串
     * 
     * 在本 SDK 内部使用
     *
     * @static
     * @param {*} value
     * @returns {boolean}
     * @memberof Tools
     */
    public static _IsString(value:any):boolean{
        return Tools.IsString(value);
    }


    /**
     * 数据是否是数字
     * 
     * 在本 SDK 内部使用
     *
     * @static
     * @param {*} value
     * @returns {boolean}
     * @memberof Tools
     */
    public static _IsNumber(value:any):boolean{
        return Tools.IsNumber(value);
    }

    /**
     * 数据是否是布尔值
     * 
     * 在本 SDK 内部使用
     *
     * @static
     * @param {*} value
     * @returns {boolean}
     * @memberof Tools
     */
    public static _IsBoolean(value:any):boolean{
        return Tools.IsBoolean(value);
    }

    /**
     * 数据是不是一个函数
     * 
     * 在本 SDK 内部使用
     *
     * @static
     * @param {*} value
     * @returns {boolean}
     * @memberof Tools
     */
    public static _IsFunction(value:any):boolean{
        return Tools.IsFunction(value);
    }

    /**
     * 数据是否是对象
     * 
     * 在本 SDK 内部使用
     *
     * @static
     * @param {*} value
     * @returns {boolean}
     * @memberof Tools
     */
    public static _IsObject(value:any):boolean{
        return Tools.IsObject(value);
    }


    /**
     * 数据是否合法的对象属性key名称属性
     * 
     * 在本 SDK 内部使用
     *
     * @static
     * @param {string} value
     * @returns {boolean}
     * @memberof Tools
     */
    public static _IsObjectKeyName(value:string):boolean{
        return Tools.IsObjectKeyName(value);
    }

    /**
     * 是否是对象,如不是对象,则转为对象
     * 
     * 在本 SDK 内部使用
     *
     * @static
     * @param {*} value
     * @returns {boolean}
     * @memberof Tools
     */
    public static _IsToBeObject(value:any):boolean{
        return Tools.IsToBeObject(value);
    }

    /**
     * 数据是否是数组
     * 
     * 在本 SDK 内部使用
     *
     * @static
     * @param {*} value
     * @returns {boolean}
     * @memberof Tools
     */
    public static _IsArray(value:any):boolean{
        return Tools.IsArray(value);
    }

    /**
     * 数据是否是空数组,如果不是数组,则会将变量转化为空数组
     * 
     * 在本 SDK 内部使用
     *
     * @static
     * @param {*} value
     * @returns {boolean}
     * @memberof Tools
     */
    public static _IsEmptyToBeArray(value:any):boolean{
        return Tools.IsEmptyToBeArray(value);
    }

    /**
     * 数据是否是Promise对象
     * 
     * 在本 SDK 内部使用
     *
     * @static
     * @param {*} value
     * @returns {boolean}
     * @memberof Tools
     */
    public static _IsPromise(value:any):boolean{
        return Tools.IsPromise(value);
    }

    /**
     * 数据是否是表单对象
     * 
     * 在本 SDK 内部使用
     *
     * @static
     * @param {*} value
     * @returns {boolean}
     * @memberof Tools
     */
    public static _IsFormData(value:any):boolean{
        return Tools.IsFormData(value);
    }

    /**
     * 数据是否是null或undefined
     * 
     * 在本 SDK 内部使用
     *
     * @static
     * @param {*} value
     * @returns {boolean}
     * @memberof Tools
     */
    public static _IsNull(value:any):boolean{
        return Tools.IsNull(value);
    }

    /**
     * 数据内容是否为空
     * 
     * 在本 SDK 内部使用
     *
     * @static
     * @param {*} value
     * @returns {boolean}
     * @memberof Tools
     */
    public static _IsEmpty(value:any):boolean{
        return Tools.IsEmpty(value);
    }


    /**
     * 数据是否元素节点
     * 
     * 在本 SDK 内部使用
     *
     * @static
     * @param {*} value
     * @returns {boolean}
     * @memberof Tools
     */
    public static _IsElement(value:any):boolean{
        return Tools.IsElement(value);
    }

    /**
     * 重定义属性,不可修改,不可枚举,不可再写
     * 
     * 在本 SDK 内部使用
     *
     * @static
     * @param {object} ObjectData
     * @param {string} key
     * @param {*} value
     * @returns {void}
     * @memberof Tools
     */
    public static _ReDefineProperty(ObjectData:object,key:string,value:any):void{
        return Tools.ReDefineProperty(ObjectData,key,value);
    }

    

    /**
     * 快速拿到值,并设置默认值 注明:(只能单一取值)
     * 
     * 在本 SDK 内部使用
     *
     * @static
     * @param {(object|any)} ObjectData
     * @param {(string|number)} Key
     * @param {*} [DefuaftValue=null]
     * @returns {*}
     * @memberof Tools
     */
    public static _ToGet(ObjectData:object|any,Key:string|number,DefuaftValue:any=null):any{
        return Tools.ToGet(ObjectData,Key,DefuaftValue);
    }

    /**
     * 快速设置默认参数,注明:(取绝于Keys,为数组时,为批量设置值,当为字符串,单一设置值,可以深度设置,user.info.name)
     * 
     * 案例: Keys 支持多级设置值,如 user.info.name
     * 
     * 在本 SDK 内部使用
     *
     * @static
     * @param {(object|any)} ObjectData
     * @param {string[]|string|number} Keys
     * @param {Array<any>|any} DefuaftValues
     * @param {boolean} [IsSetNoNull=true]
     * @returns {*}
     * @memberof Tools
     */
    public static _ToSet(ObjectData:object|any,Keys:string[]|string|number,DefuaftValues:Array<any>|any,IsSetNoNull:boolean=true):any{
        return Tools.ToSet(ObjectData,Keys,DefuaftValues,IsSetNoNull);
    }


    /**
     * 设置对象属性不可枚举
     * 
     * 在本 SDK 内部使用
     *
     * @static
     * @param {*} ObjectData
     * @param {string} key
     * @memberof Tools
     */
    private static _SetPropertysEnumerableNo(ObjectData:any,key:string):void{
        // 设置不可枚举
        Object.defineProperty(ObjectData,key,{
            enumerable:false,
            configurable:true,
            writable:true,
            value:ObjectData[key]
        });
    }

    /**
     * 循环遍历对象属性,校验,如果属性名称长度小于等于2,我们则认为是压缩过的属性
     * 
     * 在本 SDK 内部使用
     *
     * @static
     * @param {*} ObjectData
     * @memberof Tools
     */
    public static _ForEachObjectProperty(ObjectData:any):void{
        // 遍历,如果 key 的长度 小于等于 2 的,我们当作是压缩后私有属性
        Object.keys(ObjectData).forEach((key:string) => {
            // 判断
            if(key.length <= 2){
                // 只设置属性,不管方法
                Tools._SetPropertysEnumerableNo(ObjectData,key)
            }
            
            // 如果还是对象,则继续
            if(Tools._IsObject(ObjectData[key])){
                // 递归
                Tools._ForEachObjectProperty(ObjectData[key]);
            }
        });
    }

    /**
     * 执行浅(第一层属性)拷贝对象,并返回新的对象
     * 
     * 在本 SDK 内部使用
     *
     * @static
     * @param {*} value
     * @returns {object}
     * @memberof Tools
     */
    public static _ToShallowCopyObject(value:any):object{
        return Tools.ToShallowCopyObject(value);
    }

    /**
     * 执行深(递归下去)拷贝对象,并返回新的对象
     * 
     * 在本 SDK 内部使用
     *
     * @static
     * @param {*} value
     * @returns {object}
     * @memberof Tools
     */
    public static _ToDeepCopyObject(value:any):object{
        return Tools.ToDeepCopyObject(value);
    }

    /**
     * 字符串数据是否存在该数组中,可选择忽略大小写
     * 
     * 在本 SDK 内部使用
     *
     * @static
     * @param {string} Item
     * @param {Array<string>} Items
     * @param {boolean} [IsIgnore=true]
     * @returns {boolean}
     * @memberof Tools
     */
    public static _InArray(Item:string,Items:Array<string>,IsIgnore:boolean=true):boolean{
        return Tools.InArray(Item,Items,IsIgnore);
    }


    /**
     * 合并对象或数组
     * 
     * 在本 SDK 内部使用
     *
     * @static
     * @template T
     * @param {...Array<T>} Args
     * @returns {T}
     * @memberof Tools
     */
    public static _Merge<T extends {[key:string]:any}|any[]>(...Args:Array<T>):T{
        return Tools.Merge.apply(Tools,Args);
    }


    /**
     * 合并对象,由于 Object.assign 需要的版本太高了,暂时不使用先
     * 
     * 在本 SDK 内部使用
     *
     * @static
     * @template T
     * @param {T} ObjectData
     * @param {...Array<object>} args
     * @returns {T}
     * @memberof Tools
     */
    public static _MergeObject<T extends {[key:string]:any}>(ObjectData:T,...args:Array<object>):T{
        // 先拷贝一份
        let NewCopyObject:any = Tools._ToDeepCopyObject(ObjectData);
        // 取出所需要覆盖的对象
        args.forEach((Items:object|any)=>{
            // 进行深拷贝一次
            Items = Tools._ToDeepCopyObject(Items);
            // 再取出所有的key
            Object.keys(Items).forEach((key:string)=>{
                // 最后赋值到原对象上
                NewCopyObject[key] = Items[key];
            });
        });
        // 再返回新的结果
        return NewCopyObject;
    }


    /**
     * 每个插件需要配置时,对参数的合并,保证传入的必须是对象,才能进行合并
     * 
     * 在本 SDK 内部使用
     *
     * @static
     * @template T
     * @param {T} DefaultConfig
     * @param {object} Options
     * @returns {T}
     * @memberof Tools
     */
    public static _MergeConfig<T extends {[key:string]:any}>(DefaultConfig:T,Options:object):T{
        // 保证传入的配置参数必须是对象,否则就是返回默认配置
        if(Tools._IsObject(DefaultConfig) && Tools._IsObject(Options)){
            return Tools._MergeObject(DefaultConfig,Options);
        }else{
            return DefaultConfig;
        }
    }


    /**
     * 解析路由地址,成对象,将路由分成多个部分
     * 
     * 在本 SDK 内部使用
     *
     * @static
     * @param {string} [uri]
     * @returns {WLocation}
     * @memberof Tools
     */
    public static _ToParseUrl(uri?:string):WLocation{
        return Url._CreateQueryByUri(uri);
    }


    /**
     * 遍历给对象赋值,如果对象不存在该属性,则新增
     * 
     * 在本 SDK 内部使用
     *
     * @static
     * @param {*} ObjectData
     * @param {*} ValueData
     * @memberof Tools
     */
    public static _ForEachSetObjectValue(ObjectData:any,ValueData:any):void{        
        // 以赋值为准,多余的值,继续添加到实例上
        Object.keys(ValueData).forEach((key)=>{
            ObjectData[key] = ValueData[key];
        });
    }

    /**
     * 发出一条警告日志
     * 
     * 在本 SDK 内部使用
     *
     * @static
     * @param {string} Message
     * @memberof Tools
     */
    public static _WarnLog(Message:string):void{
        // 发出一条警告日志
        console.warn ? console.warn(Message) : console.log(Message);
    }

    /**
     * 发出一条调试日志输出
     * 
     * 在本 SDK 内部使用
     *
     * @static
     * @param {*} Message
     * @param {...any[]} Args
     * @memberof Tools
     */
    public static _DebugLog(Message:any,...Args:any[]):void{
        // 把第一个内容添加回到头部,余下的,再通过 apply 放回到 console.log 函数上
        Args.unshift(Message);
        // 发出一条调试日志
        (window.Wen as any) && (window.Wen as any).debug && console.log.apply(null,Args);
    }

    /**
     * 抛出一条错误
     * 
     * 在本 SDK 内部使用
     *
     * @static
     * @param {string} Message
     * @memberof Tools
     */
    public static _TypeError(Message:string):void{
        throw new TypeError(Message);
    }


    /**
     * 发出一条普通日志输出
     * 
     * 在本 SDK 内部使用
     *
     * @static
     * @param {*} Message
     * @memberof Tools
     */
    public static _Log(Message:any):void{
        // 发出一条普通日志
        console.log(Message);
    }


    /**
     * 获得当前浏览器的时间戳,13位,10位
     * 
     * 在本 SDK 内部使用
     *
     * @static
     * @param {boolean} [IsTime=false]
     * @returns {number}
     * @memberof Tools
     */
    public static _GetTime(IsTime:boolean=false):number{
        return Tools.GetTime(IsTime);
    }


    /**
     * 产生随机整数，包含下限值，但不包括上限值
     * 
     * 在本 SDK 内部使用
     *
     * @static
     * @param {number} lower 下限
     * @param {number} upper 上限
     * @returns {number} 返回在下限到上限之间的一个随机整数
     * @memberof Tools
     */
    public static _Random(lower:number, upper:number):number{
        return Tools.Random(lower,upper);
    }


    /**
     * 首尾替换特殊符号,默认替换首尾空格
     * 
     * 在本 SDK 内部使用
     *
     * @static
     * @param {string} value
     * @param {string} [symbol]
     * @returns {string}
     * @memberof Tools
     */
    public static _Trim(value:string,symbol?:string):string{
        // 替换首尾特殊符号
        return Tools.Trim(value,symbol);
    }

    /**
     * 左边替换特殊符号,默认替换空格
     * 
     * 在本 SDK 内部使用
     *
     * @static
     * @param {string} value
     * @param {string} [symbol]
     * @returns {string}
     * @memberof Tools
     */
    public static _LTrim(value:string,symbol?:string):string{
        // 替换首尾特殊符号
        return Tools.LTrim(value,symbol);
    }

    /**
     * 右边替换特殊符号,默认替换空格
     * 
     * 在本 SDK 内部使用
     *
     * @static
     * @param {string} value
     * @param {string} [symbol]
     * @returns {string}
     * @memberof Tools
     */
    public static _RTrim(value:string,symbol?:string):string{
        // 替换首尾特殊符号
        return Tools.RTrim(value,symbol);
    }


    /**
     * 替换所有的空格
     *
     * @static
     * @param {string} value
     * @returns {string}
     * @memberof Tools
     */
    public static _ReplaceAllSpaces(value:string):string{
        return value.replace(/\s+/g,'');
    }


}