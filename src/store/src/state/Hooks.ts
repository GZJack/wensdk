import {Tools} from '../../lib/Index';

/**
 * 负责处理 状态上的钩子函数,校验并挂载
 *
 * @export
 * @class Hooks
 */
export class Hooks{

    /**
     * 所有要监听的函数名称
     *
     * @private
     * @type {string[]}
     * @memberof Hooks
     */
    private static _Keys:string[] = ['created','change'];
    

    /**
     * 实际的操作方法
     *
     * @private
     * @static
     * @param {{[key:string]:Function}} HooksObject
     * @returns {{[key:string]:Function}}
     * @memberof Hooks
     */
    private static _CheckAndAddHooks(HooksObject:{[key:string]:Function}):{[key:string]:Function}{
        // 定义一个接收
        let Fns:any = {};
        // 遍历
        Hooks._Keys.forEach((hookname:string)=>{
            // 判断是否是函数
            if(Tools._IsFunction(HooksObject[hookname])){
                Fns[hookname] = HooksObject[hookname];
            }
        });
        // 返回处理好的
        return Fns;
    }


    /**
     * 暴露的接口
     *
     * @static
     * @param {{[key:string]:Function}} HooksObject
     * @returns {{[key:string]:Function}}
     * @memberof Hooks
     */
    public static c(HooksObject:{[key:string]:Function}):{[key:string]:Function}{
        return Hooks._CheckAndAddHooks(HooksObject);
    }
}