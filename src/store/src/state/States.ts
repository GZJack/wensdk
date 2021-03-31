
import {Options} from './Options';
import { Tools } from '../../lib/Index';


// 当前 SDK 所有的状态都会被存在这个变量上
let AllStates:{[key:string]:Options} = {};

/**
 * 构造每一个状态的属性及添加
 *
 * @export
 * @class States
 */
export class States{




    /**
     * 每一个属性都从这里挂载
     *
     * @static
     * @param {*} state
     * @memberof States
     */
    public static create(state:any):void{
        
        // 保证必须是对象,且必须有 name 属性
        if(Tools._IsObject(state) && Tools._IsObjectKeyName(state.name)){
            // 拿到名称
            let {name} = state;
            // 拿到新的配置项
            let NewOptions:Options = new Options(state);

            // 提取钩子函数
            let HooksFn = NewOptions.hooks;



            // 均挂载到这个实例上
            AllStates[name] = NewOptions;

        }

        console.log("拿到所有的状态",AllStates);
    }


    /**
     * 唤醒所有的钩子函数,该钩子函数只要监听了,都会被响应,生成只响应一次
     *
     * @static
     * @memberof States
     */
    public static _CallHooksCreatedFn():void{
        // 执行对象中所有的钩子函数
        Object.keys(AllStates).forEach((key:string)=>{
            // 如果存在,并且是函数,则唤醒它
            if(Tools._IsFunction(AllStates[key].hooks.created)){
                AllStates[key].hooks.created.call(AllStates[key],123);
            }
        })
    }

}