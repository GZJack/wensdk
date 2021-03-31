
/**
 * 工具类
 *
 * @class ToolsStaticClass
 */
export class ToolsStaticClass{


    /**
     * Creates an instance of ToolsStaticClass.
     * @memberof ToolsStaticClass
     */
    constructor(){

    }


    /**
     * 将类数组转成数组
     *
     * @static
     * @param {*} value
     * @returns {Array<any>}
     * @memberof ToolsStaticClass
     */
    static ToArrayFrom(value:any):Array<any>{
        return Array.prototype.slice.call(value);
    }

    /**
     * 将NodeList转成数组形式
     *
     * @static
     * @param {NodeList} nodes
     * @returns {Array<Element>}
     * @memberof ToolsStaticClass
     */
    static NodeListToArray(nodes:NodeList):Array<Element>{
        // 必须保证传过来的是元素列表,才能进行转成数组
        if(ToolsStaticClass.IsNodeList(nodes)){
            return ToolsStaticClass.ToArrayFrom(nodes);
        }else{
            return [];
        }
    }

    /**
     * 获得数据类型
     *
     * @static
     * @param {*} value
     * @returns {string}
     * @memberof ToolsStaticClass
     */
    static ToType(value:any):string{
        return Object.prototype.toString.call(value).slice(8, -1);
    }

    /**
     * 数据是否是元素列表
     *
     * @static
     * @param {*} value
     * @returns {boolean}
     * @memberof ToolsStaticClass
     */
    static IsNodeList(value:any):boolean{
        return ToolsStaticClass.ToType(value) === 'NodeList';
    }

    /**
     * 数据是否字符串
     *
     * @static
     * @param {*} value
     * @returns {boolean}
     * @memberof ToolsStaticClass
     */
    static IsString(value:any):boolean{
        return ToolsStaticClass.ToType(value) === 'String';
    }

    /**
     * 数据是否是数字
     *
     * @static
     * @param {*} value
     * @returns {boolean}
     * @memberof ToolsStaticClass
     */
    static IsNumber(value:any):boolean{
        return ToolsStaticClass.ToType(value) === 'Number';
    }

    /**
     * 数据是否是布尔值
     *
     * @static
     * @param {*} value
     * @returns {boolean}
     * @memberof ToolsStaticClass
     */
    static IsBoolean(value:any):boolean{
        return ToolsStaticClass.ToType(value) === 'Boolean';
    }


    /**
     * 数据是不是一个函数
     *
     * @static
     * @param {*} value
     * @returns {boolean}
     * @memberof ToolsStaticClass
     */
    static IsFunction(value:any):boolean{
        return ToolsStaticClass.ToType(value) === 'Function';
    }

    /**
     * 数据是否是对象
     *
     * @static
     * @param {*} value
     * @returns {boolean}
     * @memberof ToolsStaticClass
     */
    static IsObject(value:any):boolean{
        return ToolsStaticClass.ToType(value) === 'Object';
    }

    /**
     * 数据是否合法的对象属性key名称属性
     *
     * @static
     * @param {string} value
     * @returns {boolean}
     * @memberof ToolsStaticClass
     */
    static IsObjectKeyName(value:string):boolean{
        return ToolsStaticClass.IsString(value) && /^[A-Za-z0-9\_\-]+$/.test(value);
    }

    /**
     * 是否是对象,如不是对象,则转为对象
     *
     * @static
     * @param {*} value
     * @returns {boolean}
     * @memberof ToolsStaticClass
     */
    static IsToBeObject(value:any):boolean{
        if(ToolsStaticClass.IsObject(value)){
            return true;
        }else{
            value = {};
            return true;
        }
    }

    /**
     * 数据是否是数组
     *
     * @static
     * @param {*} value
     * @returns {boolean}
     * @memberof ToolsStaticClass
     */
    static IsArray(value:any):boolean{
        return ToolsStaticClass.ToType(value) === 'Array';
    }

    /**
     * 数据是否是空数组,如果不是数组,则会将变量转化为空数组
     *
     * @static
     * @param {*} value
     * @returns {boolean}
     * @memberof ToolsStaticClass
     */
    static IsEmptyToBeArray(value:any):boolean{
        if(ToolsStaticClass.IsArray(value)){
            return value.length == 0;
        }else{
            value = []; // 是引用赋值的,所有在这里赋值就可以了
            return true;
        }
    }

    /**
     * 数据是否是Promise对象
     *
     * @static
     * @param {*} value
     * @returns {boolean}
     * @memberof ToolsStaticClass
     */
    static IsPromise(value:any):boolean{
        return ToolsStaticClass.ToType(value) === 'Promise';
    }

    /**
     * 数据是否是表单对象
     *
     * @static
     * @param {*} value
     * @returns {boolean}
     * @memberof ToolsStaticClass
     */
    static IsFormData(value:any):boolean{
        return (typeof FormData !== 'undefined') && (value instanceof FormData);
    }

    /**
     * 数据是否是null或undefined
     *
     * @static
     * @param {*} value
     * @returns
     * @memberof ToolsStaticClass
     */
    static IsNull(value:any):boolean{
        return value === null || value === undefined;
    }

    /**
     * 数据内容是否为空
     *
     * @static
     * @param {*} value
     * @returns {boolean}
     * @memberof ToolsStaticClass
     */
    static IsEmpty(value:any):boolean{
        if(ToolsStaticClass.IsNull(value)){
            return true;
        }else if(ToolsStaticClass.IsString(value)){
            return (value as string).trim() === '';
        }else if(ToolsStaticClass.IsArray(value)){
            return (value as Array<any>).length == 0;
        }else if(ToolsStaticClass.IsObject(value)){
            return JSON.stringify(value) === '{}';
        }else{
            return false;
        }
    }


    /**
     * 数据是否元素节点
     *
     * @static
     * @param {*} value
     * @returns
     * @memberof ToolsStaticClass
     */
    static IsElement(value:any):boolean{
        return !ToolsStaticClass.IsNull(value) && value.nodeType === 1;
    }

    /**
     * 重定义属性,不可修改,不可枚举,不可再写
     *
     * @static
     * @param {object} ObjectData
     * @param {string} key
     * @param {*} value
     * @memberof ToolsStaticClass
     */
    static ReDefineProperty(ObjectData:object,key:string,value:any):void{
        // 这里定义的属性,均不能修改,不能删除
        Object.defineProperty(ObjectData,key,{
            // 不可修改删除
            configurable:false,
            // 不可枚举
            enumerable:false,
            // 不可写
            writable:false,
            // 绑定值
            value:value
        });
    }


    /**
     * 快速拿到值,并设置默认值
     * 
     * 案例: key 支持多级取值,如 user.info.name
     *
     * @static
     * @param {(object|any)} ObjectData
     * @param {string|number} Key
     * @param {*} [DefuaftValue=null]
     * @returns {*}
     * @memberof ToolsStaticClass
     */
    static ToGet(ObjectData:object|any,Key:string|number,DefuaftValue:any=null):any{
        // 保证不等于 null 
        if(ObjectData !== null && typeof ObjectData == 'object'){
            // 如果没有 带 . 的就直接返回去了
            if(ToolsStaticClass.IsString(Key) && (Key as string).indexOf('.') > 0){
                // 实现多级取值
                // 定义一个老值,用于保证拿到当前的值
                let OldObject:any = ObjectData;
                // 将 Key 转成数组
                let KeyArray:Array<string> = (Key as string).split('.');
                // 定义一个需要返回的值
                let Result:any = DefuaftValue;
                // 直接遍历
                for(let index:number=0;index < KeyArray.length;index++){
                    // 定义新的key
                    let NewKey:any = KeyArray[index];
                    // 转数字或字符串
                    NewKey = !isNaN((NewKey as any)) ? parseInt(NewKey) : NewKey;
                    // 如果取值等于 undefined null
                    if(ToolsStaticClass.IsNull(OldObject[NewKey])){
                        // 清零,拿到默认值
                        Result = DefuaftValue;
                        // 定义一个错误警告,但不影响使用
                        let msg:string = `ToGet get value error: [${NewKey}] attribute does not exist in [${Key}]`;
                        // 报一条警告
                        console.warn ? console.warn(msg) : console.log(msg);
                        break;
                    }else{
                        // 转换
                        OldObject = OldObject[NewKey];
                        // 赋值
                        Result = OldObject;
                    }
                }
                // 返回最终的结果
                return Result;
            }else{
                // 直接返回
                return !ToolsStaticClass.IsNull(ObjectData[Key]) ? ObjectData[Key] : DefuaftValue;
            }
        }else{
            return DefuaftValue;
        }
    }

    /**
     * 快速设置默认参数
     * 
     * 案例: key 支持多级设置值,如 user.info.name
     *
     * @static
     * @param {(object|any)} ObjectData
     * @param {(string[]|string|number)} Keys
     * @param {(Array<any>|any)} DefuaftValues
     * @param {boolean} [IsSetNoNull=true]
     * @returns {*}
     * @memberof ToolsStaticClass
     */
    static ToSet(ObjectData:object|any,Keys:string[]|string|number,DefuaftValues:Array<any>|any,IsSetNoNull:boolean=true):any{
        // 保证传入的是对象
        if(!ToolsStaticClass.IsNull(ObjectData) && typeof ObjectData === 'object'){
            // 如果是数组
            if(ToolsStaticClass.IsArray(Keys)){
                // 遍历赋值默认值
                (Keys as Array<string>).forEach((key:string,index:number) => {
                    // 默认情况下强制设置 值等于 null和非null 的属性,如果是开关闭设置,只能设置 null 的属性 
                    if(ToolsStaticClass.IsNull(ObjectData[key]) || IsSetNoNull){
                        ObjectData[key] = ToolsStaticClass.ToGet(DefuaftValues,index,null);
                    }
                });
            }else if(ToolsStaticClass.IsString(Keys)){
                // 定义一个老值
                let OldObject:any = ObjectData;
                // 将其转成数组
                let KeysArray:Array<string> = (Keys as string).split('.');
                // 得将最后一个 Key 提前取出来,保证最后一个 key 是进行赋值的
                let LastKeyString:string|number = KeysArray.pop();
                // 再看最后一个是不是数字
                let IsLastNumber:boolean = !isNaN((LastKeyString as any));
                // 如果最后一个是数字,就转成数字
                LastKeyString = IsLastNumber ? parseInt(LastKeyString) : LastKeyString;

                // 将最后的 key 进行循环取值, 不能通过 ToGet() 去取值
                KeysArray.forEach((key:string,index:number) => {
                    // 是否还有下一个key
                    let HasNextKey:boolean = !ToolsStaticClass.IsNull(KeysArray[index+1]);
                    // 下一个是数字还是字符串, 如果没有最后一个 就需要看看之前提出最后的一个key是不是数字
                    let NextKeyIsNumber:boolean = (HasNextKey && !isNaN((KeysArray[index+1] as any))) || (!HasNextKey && IsLastNumber);

                    // 如果不是是字符串,0,1,2,3,数字, 如果有 length 就是数组或类数组了
                    let NewKey:any = !isNaN((key as any)) && ToolsStaticClass.IsNumber(OldObject.length) ? parseInt(key) : key;

                    // 对原来的类型进行区分
                    switch(ToolsStaticClass.ToType(OldObject[NewKey])){
                        case "Null":
                        case "Undefined":
                            OldObject[NewKey] = NextKeyIsNumber ? [] : {};
                            break;
                        case "String":
                        case "Number":
                        case "Boolean":
                            // 把原来的值赋值上去
                            OldObject[NewKey] = NextKeyIsNumber ? [OldObject[NewKey]] : {"_":OldObject[NewKey]};
                            break;
                        // 默认就不管了
                        // 要么数组,要么类数组,要么就是对象,要么就是函数,Promise ... 也都是 typeof xx == 'object'                            
                    }

                    // 取这个数组,放回到老数组上
                    OldObject = OldObject[NewKey];
                });

                // 最后的赋值,必须强制设置值
                if(ToolsStaticClass.IsNull(OldObject[LastKeyString]) || IsSetNoNull){
                    OldObject[LastKeyString] = DefuaftValues;
                }

            }else if(ToolsStaticClass.IsNumber(Keys)){
                // 是否是数组
                if(ToolsStaticClass.IsNull(ObjectData[(Keys as number)]) || IsSetNoNull){
                    ObjectData[(Keys as number)] = DefuaftValues;
                }
            }
            return ObjectData;
        }else{
            return ObjectData;
        }
    }


    /**
     * 执行浅(第一层属性)拷贝对象,并返回新的对象
     *
     * @static
     * @param {any} value
     * @returns {object}
     * @memberof ToolsStaticClass
     */
    static ToShallowCopyObject(value:any):object{
        // 定义一个新对象
        let newObject:any = new Object();
        // 保证必须是对象
        if(typeof value === 'object'){
            // 遍历第一层,如果第一层就是数字和字符串的,就可以使用
            for (let key in value) {
                newObject[key] = value[key];
            }
        }
        // 最后返回的就是浅拷贝的对象
        return newObject;
    }

    /**
     * 执行深(递归下去)拷贝对象,并返回新的对象
     *
     * @static
     * @param {any} value
     * @returns {object}
     * @memberof ToolsStaticClass
     */
    static ToDeepCopyObject(value:any):object{
        // 如果不是对象直接返回
        if(typeof value !== 'object'){
            return value; // 递归的时候起作用
        }
        // 定义新的对象
        let newObject:any = null;
        // 对数据进行区分
        switch(true){
            // 数组,保证深复制后任然是数组,则需要生成一个新的数组对象
            case ToolsStaticClass.IsArray(value):
                newObject = new Array();
                break;
            // 对象,保证修改原来的对像,则需要生成一个新的对象
            case ToolsStaticClass.IsObject(value):
                newObject = new Object();
                break;
            // 默认的情况下
            default:
                newObject = value;
        }

        // 遍历并递归
        for (let key in value) {
            // 将值进行递归,不是对象才进行赋值
            if (Object.prototype.hasOwnProperty.call(value, key)){
                newObject[key] = ToolsStaticClass.ToDeepCopyObject(value[key]);
            } 
        }
        // 最后返回的就是深度拷贝的对象
        return newObject;
    }

    /**
     * 字符串数据是否存在该数组中,可选择忽略大小写
     *
     * @static
     * @param {string} Item
     * @param {Array<string>} Items
     * @param {boolean} [IsIgnore=true] 忽略大小写
     * @returns {boolean}
     * @memberof ToolsStaticClass
     */
    static InArray(Item:string,Items:Array<string>,IsIgnore:boolean=true):boolean{
        // 假设不通过
        let HasIn = false;
        // 遍历校验
        for (let index = 0; index < Items.length; index++) {
            // 是否启动忽略大小写
            if(IsIgnore){
                // 忽略大小写
                if(Item.toString().toUpperCase() === Items[index].toString().toUpperCase()){
                    HasIn = true;
                    break;
                }
            }else{
                if(Item.toString() === Items[index].toString()){
                    HasIn = true;
                    break;
                }
            }
        }
        // 返回校验结果
        return HasIn;
    }

    /**
     * 合并对象或数组
     *
     * @static
     * @template T
     * @param {...Array<T>} Args
     * @returns {T}
     * @memberof ToolsStaticClass
     */
    static Merge<T extends {[key:string]:any}|any[]>(...Args:Array<T>):T{
        // 先看看是不是对象还是数组
        if(!ToolsStaticClass.IsNull(Args[0])){
            if(ToolsStaticClass.IsObject(Args[0])){           
                // 拿到原型的,或者重新定义的 {...{}} => 得来的
                let assign:any =  Object.assign || function(ObjectData:object|any):object{
                    for (let s, i = 1, n = arguments.length; i < n; i++) {
                        s = arguments[i];
                        // 区分是对象还是数组
                        for (let p in s){
                            if (Object.prototype.hasOwnProperty.call(s, p)){
                                ObjectData[p] = s[p];
                            } 
                        }
                    }
                    // 最后返回合并后的数据
                    return ObjectData;
                }
                // 最后执行
                return assign.apply({},Args);
            }else if(ToolsStaticClass.IsArray(Args[0])){
                // 拿到原型的
                let concat = Array.prototype.concat;
                // 数组合并
                return concat.apply([],Args);
            }
        }
        // 如果类型不正确则返回该原型
        return (Args as any);
    }


    /**
     * 获得当前浏览器的时间戳,13位,10位
     *
     * @static
     * @param {boolean} [IsTime=false]
     * @returns {number}
     * @memberof ToolsStaticClass
     */
    static GetTime(IsTime:boolean=false):number{
         // 获得一个日期
         let date:Date = new Date();
         // 最终返回时间戳
         let time = date.getTime ? date.getTime() : Date.parse(date.toDateString());
         // 最后截取
         return IsTime ? parseInt((time.toString()).substr(0,10)) : time;
    }

    /**
     * 产生随机整数，包含下限值，但不包括上限值
     *
     * @static
     * @param {number} lower 下限
     * @param {number} upper 上限
     * @returns {number} 返回在下限到上限之间的一个随机整数
     * @memberof ToolsStaticClass
     */
    static Random(lower:number, upper:number):number{
        return Math.floor(Math.random() * (upper - lower)) + lower;
    }

    /**
     * 首尾替换特殊符号,默认替换首尾空格
     *
     * @static
     * @param {string} value
     * @param {string} [symbol='s']
     * @returns {string}
     * @memberof ToolsStaticClass
     */
    static Trim(value:string,symbol:string='s'):string{
        // 替换首尾特殊符号
        return value.replace(new RegExp(`^\\${symbol}*|\\${symbol}*$`,'g'),'');
    }

    /**
     * 左边替换特殊符号,默认替换空格
     * 
     * @static
     * @param {string} value
     * @param {string} [symbol='s']
     * @returns {string}
     * @memberof ToolsStaticClass
     */
    static LTrim(value:string,symbol:string='s'):string{
        // 替换首尾特殊符号
        return value.replace(new RegExp(`^\\${symbol}*`,'g'),'');
    }

    /**
     * 右边替换特殊符号,默认替换空格
     *
     * @static
     * @param {string} value
     * @param {string} [symbol='s']
     * @returns {string}
     * @memberof ToolsStaticClass
     */
    static RTrim(value:string,symbol:string='s'):string{
        // 替换首尾特殊符号
        return value.replace(new RegExp(`\\${symbol}*$`,'g'),'');
    }


    /**
     * 数据是否是有效的 ipv4 ip地址
     *
     * @static
     * @param {string} value
     * @returns {boolean}
     * @memberof ToolsStaticClass
     */
    static IsIPV4(value:string):boolean{
        return /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/.test(value);
    }

    /**
     * 数据是否是有效的 ipv6 ip地址
     *
     * @static
     * @param {string} value
     * @returns {boolean}
     * @memberof ToolsStaticClass
     */
    static IsIPV6(value:string):boolean{
        return /^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)|::([\da−fA−F]1,4:)0,4((25[0−5]|2[0−4]\d|[01]?\d\d?)\.)3(25[0−5]|2[0−4]\d|[01]?\d\d?)|::([\da−fA−F]1,4:)0,4((25[0−5]|2[0−4]\d|[01]?\d\d?)\.)3(25[0−5]|2[0−4]\d|[01]?\d\d?)|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)|([\da−fA−F]1,4:)2:([\da−fA−F]1,4:)0,2((25[0−5]|2[0−4]\d|[01]?\d\d?)\.)3(25[0−5]|2[0−4]\d|[01]?\d\d?)|([\da−fA−F]1,4:)2:([\da−fA−F]1,4:)0,2((25[0−5]|2[0−4]\d|[01]?\d\d?)\.)3(25[0−5]|2[0−4]\d|[01]?\d\d?)|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)|([\da−fA−F]1,4:)4:((25[0−5]|2[0−4]\d|[01]?\d\d?)\.)3(25[0−5]|2[0−4]\d|[01]?\d\d?)|([\da−fA−F]1,4:)4:((25[0−5]|2[0−4]\d|[01]?\d\d?)\.)3(25[0−5]|2[0−4]\d|[01]?\d\d?)|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}|:((:[\da−fA−F]1,4)1,6|:)|:((:[\da−fA−F]1,4)1,6|:)|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)|([\da−fA−F]1,4:)2((:[\da−fA−F]1,4)1,4|:)|([\da−fA−F]1,4:)2((:[\da−fA−F]1,4)1,4|:)|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)|([\da−fA−F]1,4:)4((:[\da−fA−F]1,4)1,2|:)|([\da−fA−F]1,4:)4((:[\da−fA−F]1,4)1,2|:)|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?|([\da−fA−F]1,4:)6:/.test(value);
    }


    /**
     * 数据是否是有效的 域名 地址
     *
     * @static
     * @param {string} value
     * @returns {boolean}
     * @memberof ToolsStaticClass
     */
    static IsDomain(value:string):boolean{
        return /^([0-9a-zA-Z][0-9a-zA-Z-]{0,62}\.)+([0-9a-zA-Z][0-9a-zA-Z-]{0,62})\.?$/.test(value);
    }

}