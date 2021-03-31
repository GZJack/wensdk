import {StateConfig,Config} from './Config';
import { Tools } from '../../lib/Index';
import {Hooks} from './Hooks';

// 导出一个配置接口
export interface StateOptions{
     // 状态值的属性名称,必须时字符串,要求 大驼峰命名法,单词首字母大写,尽可能简写,数组尾数尽量使用 s 结尾
     name:string;
     // 这里是 state 额外配置参数,这里的配置将决定着 mutations actions getters中的方法
     config?:StateConfig;
     // 如果是 Object => {name:'lisi',age:18} , 如果是 Array => {data:[]}
     state:{[key:string]:any};
     // vuex 中 store.commit('my:(会自动增加当前的属性名(System))=>mySystem'),函数名尽量简写
     mutations?:{[key:string]:Function};
     // vuex 中 store.getters.doneTodos(+System 会自动添加这个属性名)(),函数名尽量简写
     getters?:{[key:string]:Function};
     // vuex 中 store.dispatch('check(+System 会自动添加这个属性名)'),函数名尽量简写 
     actions?:{[key:string]:Function};
     // 钩子函数,用于监听 状态变化的,当首次加载,可以执行 get 请求
     hooks?:{
          // 当状态已经生成,并已经从本地读取完成后,就会发生当前监听
          created?:(vuevm:any) => void,
          // 当状态发生变化后,会执行到该监听函数
          change?:(newValue:any,oldValue:any) => void
    };
}



/**
 * 导出一个标准配置实例
 *
 * @export
 * @class Options
 */
export class Options{

    /**
     * 状态的名称 System => this.$z.System
     *
     * @type {string}
     * @memberof Options
     */
    public name:string = '';

    /**
     * 当前状态的配置
     *
     * @type {StateConfig}
     * @memberof Options
     */
    public config:StateConfig;


    /**
     * 当前状态所有的属性都挂载这个属性上
     *
     * @type {{[key:string]:any}}
     * @memberof Options
     */
    public state:{[key:string]:any} = {};

    /**
     * 所有的状态修改函数都挂载到这个属性上
     *
     * @type {{[key:string]:Function}}
     * @memberof Options
     */
    public mutations:{[key:string]:Function} = {};

    /**
     * 获得属性上的值
     *
     * @type {{[key:string]:Function}}
     * @memberof Options
     */
    public getters:{[key:string]:Function} = {};

    /**
     * 异步提交
     *
     * @type {{[key:string]:Function}}
     * @memberof Options
     */
    public actions:{[key:string]:Function} = {};


    /**
     * 当前状态的钩子函数
     *
     * @type {{[key:string]:Function}}
     * @memberof Options
     */
    public hooks:{[key:string]:Function} = {};

    /**
     * Creates an instance of Options.
     * @param {StateOptions} stateoptions
     * @memberof Options
     */
    constructor(stateoptions:StateOptions){

        // 保证必须是一个对象
        if(Tools._IsObject(stateoptions)){

            // 分别处理
            // 1. 处理钩子函数
            this.hooks = Hooks.c(Tools._IsObject(stateoptions.hooks) ? stateoptions.hooks : {});
        }

        
    }

}