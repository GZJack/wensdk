
var OUTPUT_TYPES = ['hex', 'array', 'digest', 'arrayBuffer'];


import {Sha1} from './Sha1';


/**
 * Sha1 类
 *
 * @class Sha1Class
 */
class Sha1Class{

    /**
     * 创建一个输出方法,即是 sha1(msg) 的原型
     *
     * @static
     * @param {string} outputType
     * @returns {(message:string)=>string}
     * @memberof Sha1Class
     */
    public static _CreateOutputMethod(outputType:string):(message:string)=>string{
        return function sha1(message:string):string{
            // 执行创建一个sha1
            return new Sha1(true).update(message)[outputType]();
        }
    }

    // public static create():Sha1{
    //     return new Sha1(false);
    // }

    // public static update(message:string):Sha1{
    //     return Sha1Class.create().update(message);
    // }

    /**
     * 默认使用这种哈希的,与php相同
     *
     * @static
     * @returns {(message:string)=>string}
     * @memberof Sha1Class
     */
    public static hex():(message:string)=>string{
        return Sha1Class._CreateOutputMethod('hex');
    }

    // public static array():(message:string)=>string{
    //     return Sha1Class._CreateOutputMethod('array');
    // }

    // public static digest():(message:string)=>string{
    //     return Sha1Class._CreateOutputMethod('digest');
    // }
    // public static arrayBuffer():(message:string)=>string{
    //     return Sha1Class._CreateOutputMethod('arrayBuffer');
    // }
}


// 导出并执行
export default (function sha1():(message:string)=>string{
    // 使用这个默认的
    return Sha1Class.hex();
})();