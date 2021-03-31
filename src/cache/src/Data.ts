
import {Tools} from '../lib/Index'

/**
 * 所有的缓存数据必须满足此类型
 *
 * @export
 * @class Data
 */
export class Data {
    /**
     * 当前的数据类型
     *
     * @type {string}
     * @memberof Data
     */
    public type:string;

    /**
     * 挂载数据属性
     *
     * @type {*}
     * @memberof Data
     */
    public data:any;

    /**
     * 数据创建的时间戳
     *
     * @type {number}
     * @memberof Data
     */
    public createTime:number;

    /**
     * 更新的时间戳
     *
     * @type {number}
     * @memberof Data
     */
    public updateTime:number;

    /**
     * 超时的时间戳
     *
     * @type {number}
     * @memberof Data
     */
    public timeout:number;

    /**
     * Creates an instance of Data.
     * @param {*} data
     * @param {number} expire
     * @memberof Data
     */
    constructor(data:any,expire:number){
        // 记录类型
        this.type = Tools._ToType(data);
        this.data = data;
        let time = Data.t();
        this.createTime = time;
        this.updateTime = time;
        this.timeout = expire === 0 ? (time * 2) : (time + expire*1000);
    }

    /**
     * 获得时间戳
     *
     * @private
     * @static
     * @returns {number}
     * @memberof Data
     */
    public static t():number{
        return (new Date()).getTime();
    }

    /**
     * 创建数据,
     *
     * @param {*} data
     * @param {number} [expire=0]
     * @returns
     * @memberof Data
     */
    private static _create(data:any,expire:number=0):string{
        // 转成字符串
        return JSON.stringify(new Data(data,Tools._IsNumber(expire) ? expire : 0));
    }


    public static c(data:any,expire:number=0):string{
        return Data._create(data,expire);
    }


    /**
     * 保证必须是数据类型
     *
     * @private
     * @static
     * @param {object} data
     * @returns {boolean}
     * @memberof Data
     */
    private static _IsData(data:object):boolean{
        // 保证只能是这几个属性
        let Keys = ['type','data','updateTime','createTime','timeout'];
        // 长度必须相对
        if(Tools._IsObject(data) && Object.keys(data).length === Keys.length){
            let isData:boolean = true;
            // 还要保证必须是存在此函数中
            Keys.forEach((key)=>{
                if(isData){
                    isData = Tools._InArray(key,Object.keys(data));
                }
            });
            return isData;
        }else{
            return false;
        }
    }

    /**
     * 更新数据
     *
     * @static
     * @param {string} oldDataStr
     * @param {*} newData
     * @returns {string}
     * @memberof Data
     */
    private static _update(oldDataStr:string,newData:any):string{
        // 定义一个跟新的数据对象
        let ObjectData:any = {};
        try {
            // 将传入的本地数据进行序列化
            ObjectData = JSON.parse(oldDataStr);            
            // 如果没有发生错误
            if(Data._IsData(ObjectData)){
                // 更新时间戳
                ObjectData.data = newData;
                ObjectData.type = Tools._ToType(newData);
                ObjectData.updateTime = Data.t();
            }else{
                ObjectData = new Data(newData,0);
            }
        } catch (e) {
            ObjectData = new Data(newData,0);
        }
        // 返回字符串
        return JSON.stringify(ObjectData);
    }

    /**
     * 
     *
     * @static
     * @param {string} oldDataStr
     * @param {*} newData
     * @returns {string}
     * @memberof Data
     */
    public static u(oldDataStr:string,newData:any):string{
        return Data._update(oldDataStr,newData);
    }
}