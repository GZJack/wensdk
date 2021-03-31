import {Options} from './../Options';
import {Url as ToolsUrl,Tools,cyt} from '../../lib/Index';
import {Xml} from '../utils/Xml';
import {Headers} from './Headers';

/**
 * 将多种数据类型转成字符串
 *
 * @param {*} data
 * @returns {string}
 */
function DataToString(data:any):string{
    // 定义返回的字符串
    let ReturnString:string = '';
    // 对数据进行区分转换
    switch(true){
        // 对象或数组
        case Tools._IsArray(data) || Tools._IsObject(data):
            ReturnString = JSON.stringify(data);
            break;
        // 元素对象
        case Tools._ToType(data) === "XMLDocument":
            ReturnString = Xml._ToString(data);
            break;
        // 字符串
        case Tools._IsString(data):
            ReturnString = data;
            break;
        // 数字
        case Tools._IsNumber(data):
            ReturnString = data.toString();
            break;
        // 布尔值
        case Tools._IsBoolean(data):
            ReturnString = data ? 'true' : 'false';
            break;
        // 默认
        default:
            ReturnString = data.toString ? data.toString() : '';
    }
    // 返回结果字符串
    return ReturnString;
}

/**
 * 将多种数据类型转成 FormData
 *
 * @param {*} data
 * @returns {FormData}
 */
function DataToFormData(data:any):FormData{
    // 定义一个 FormData
    let NewFormData:FormData = new FormData();
    // 区分对待
    switch(true){
        case Tools._ToType(data) === 'HTMLFormElement':
            NewFormData = new FormData(data);
            break;
        case Tools._IsFormData(data):
            NewFormData = data;
            break;
        case Tools._IsObject(data) || Tools._IsArray(data):
            //  判断是数组还是对象
            let IsArray:boolean = Tools._IsArray(data);
            // 遍历 key 可以是字符串,或者每一项
            Object.keys(data).forEach((key,index)=>{
                // 将数组和对象分开进行添加
                NewFormData.append(IsArray ? index.toString() : key,DataToString(IsArray ? key : data[key]));
            })
            break;
        default:
            // 以 _ 下划线为键名,值为字符串
            NewFormData.set('_',DataToString(data));
    }

    // 返回最终结果
    return NewFormData;
}

/**
 * 请求数据类
 *
 * @export
 * @class Data
 */
export class Data{


    /**
     * 创建出data值
     *
     * @private
     * @static
     * @param {Options} config
     * @memberof Data
     */
    private static _CreateData(config:Options):void{
        // 拿出 content-type 是不是需要加密
        let {data,charset,contentType} = config;

        // 如果数据是null,则不需要进行这么多的校验
        if(Tools._IsNull(data)) return null; // 就不会继续往下执行了


        // 定义新数据
        let NewData:any = null;
        // 区分内容
        switch(contentType){
            case 'json':
            case 'e+json':
                // 如果是对象或者数组,就直接 JSON.stringify 
                NewData = JSON.stringify(Tools._IsObject(data) || Tools._IsArray(data) ? data : {"_":DataToString(data)}); 
                break;
            case 'text':
            case 'e+text':
            case 'plain':
            case 'e+plain':
                // 对数据进行转换成字符串
                NewData = DataToString(data);
                break;
            case 'xml':
            case 'e+xml':
            case 't-xml':
            case 'e+t-xml':
                // 则需要将内容转换为字符串的 xml
                NewData = Xml._ToString(data,charset);
                break;
            case 'formdata':
                // 如果数据原来就是 FormData 就直接等于
                NewData = DataToFormData(data);
                // 目前还没有解决 FormData 带 content-type 的最好办法,这里选这删除
                // 删除 content-type
                // PHP 可以在 $_POST 上拿到数据
                Headers.d(config);
                break;
            default:
                // 拼接成 url 的方式

                // 保证数据必须是有的
                if(Tools._IsNull(data)){
                    NewData = null;
                }else{
                    // 使用工具模块中的 Url 处理提交的 参数类型
                    NewData = encodeURI(ToolsUrl._QueryToString(Tools._IsObject(data) || Tools._IsArray(data) ? data : {"_":data}));
                }
        }

        // 如果是 e+json,则需要加密
        if(/^e\+\w+$/.test(contentType)){
            // 保证加密的内容必须是 string 类型,否则提交的就是 null
            if(Tools._IsString(NewData)){
                // 进行加密,得到的一定是字符串
                NewData = cyt.e(NewData);
            }else{
                // 既要加密又不是 string 类型,不做提交
                NewData = null;
            }
        }
        
        // 最后将 处理好的 data,放回去
        config.data = NewData;
    }

    /**
     * 暴露接口
     *
     * @static
     * @param {Options} config
     * @memberof Data
     */
    public static c(config:Options):void{
        Data._CreateData(config);
    }
}