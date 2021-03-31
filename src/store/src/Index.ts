import {Tools} from '../lib/Index';
import {StateOptions,Options} from './state/Options';
import {States} from './state/States';


/**
 * 功能介绍: Store 是与 Vuex 中的 store 配合使用
 * 设计:
 * 1. 通过 Store.use() 或  Wen.Store.use() => 进行注册我们需要挂载的状态实例
 * 2. 通过 Vue.use() 将 Store 注册到 Vue 实例上
 * 3. 通过 install() => 使用 Vue.mixin() => 拿到 vue 的实例上的 store 实例,这样子我们的 stroe 就有了 commit 的能力
 * 4. 有可能用户用了 Vue.use() 但是未使用 vuex 就会造成没有 commit 的能力,所以得发出警告
 * 
 * 功能:
 * 1. 综合地赋值一些相同的方法,保证能快速地使用,如:this.$z.User.get(id) => 就自动发送一条查询请求,获得的正确的内容,并自动 commit
 * 2. 统一获取 列表数据, 如: 获取未完成,已完成的数据 getter
 */

/**
 * 这个是一个 vue 数据 控制类,其通过ajax绑定与后端进行数据交换
 *
 * @export
 * @class Store
 */
export class Store{

    /**
     * vue 组件上的 stroe 实例的挂载
     * 
     * 当 vue install 注册后,就会挂载,当存在了,则不会继续挂载
     *
     * @private
     * @static
     * @type {*}
     * @memberof Store
     */
    private static $store:any = null;

    /**
     * vue 组件实例 vue
     *
     * @private
     * @static
     * @type {*}
     * @memberof Store
     */
    private static vm:any = null;

    constructor(){

    }




    /**
     * 注册 单个或多个 数据
     * @param state  
     */
    public static use(state:{[key:string]:any}|Array<{[key:string]:any}>):void{
        // 如果是对象,则默认是一个状态,数组则是批量注册
        if(Tools._IsObject(state)){
            // 创建
            States.create(state);
        }else if(Tools._IsArray(state)){
            // 如果是数组
            state.forEach((Item:any)=>{
                // 必须保证是对象才可以继续创建
                if(Tools._IsObject(Item)){
                    States.create(Item);
                }
            });
        }
    }


    /**
     * Vue 的标准注册模式
     * 在执行注册时,使用混入,拿到 vue 的实例
     * @param Vue  
     * @param options 
     */
    public static install(Vue:any,options:{[key:string]:any}):void{
        console.log("有没有到这里");
        
        // 使用混入
        Vue.mixin({
            // 混入,在每个组件构建时，都会触发这个函数
            beforeCreate():any{

                // 说明: 

                // 父组件 即是 new Vue({el:"app",store})
                if(this.$options && this.$options.store){
                    // 临时挂载在 _createstate_root 此
                    this._createstate_root = this;
                    // 并且挂载起 _createstate_store 保证所有的组件都是调用同一个实例 this.$options.store 最原始的
                    this._createstate_store = this.$options.store;

                    // 当得到真实的的 $store 就不要在赋值了
                    if(!Store.$store){
                        Store.$store = this.$options.store; // 最原始的
                        Store.vm = this;
                    }
                }else if(this.$parent){
                    // 子组件,保证其有父组件的  Vue 的渲染 父 -> 子 -> 孙
                    this._createstate_root = this.$parent._createstate_root;
                }else{
                    // Vue 的渲染 父 -> 子 -> 孙, 这里主要是 this.$parent === undefined ,这里一般不是渲染根组件以后发生的 子组件
                    return null;// 一般时在渲染 new Vue({el:"#app"}) 前发生的
                }

                // 将 $z 指向到 this.$store.state,缩短了书写方式
                Object.defineProperty(this,"$z",{
                    get(){
                        // 获得唯一的 根实例的 原始实例
                        return this._createstate_root._createstate_store.state;
                    }
                });

                console.log("我们加载成功了",this);


                // 后面是挂载加密函数,因为 $base64 $md5 $sha1 $e $d 都是挂载在 Vue 根实例上
                if(this.$options && this.$options.store){
                    // // 如果有就添加,没有就不用管
                    // crypto.$base64 = this.$base64 ? this.$base64 : crypto.$base64;
                    // crypto.$md5 = this.$md5 ? this.$md5 : crypto.$md5;
                    // crypto.$sha1 = this.$sha1 ? this.$sha1 : crypto.$sha1;
                    // crypto.$e = this.$e ? this.$e : crypto.$e;
                    // crypto.$d = this.$d ? this.$d : crypto.$d;
                    // // 生成,并挂载到 CreateState 静态属性上
                    // CreateState.$aes = new Aes("local.key");

                    
                    

                    // // 主组件开始渲染,根实例上已经有加密函数,这时的加密函数也已经挂载完成
                    // // 这时需要执行自动读取本地数据,因为从本地读书数据,不能new的时候,就自动判断是否加载,所以需要在这里统一执行
                    // CreateState.CallAutoReadCallFn(); // 执行自动读取本地数据
                }

            },
            // 在组件创建完成后触发
            created():void{
                // 检测到根组件,创建完成后,执行, 在此之前, $http $sha1 $md5 ... 都挂载完成了, 设置 main.js 中的 beforeCreate(){} 周期函数也已经被执行
                if(this.$options && this.$options.store){
                    // 此时 main.js 中的 beforeCreate(){} 周期函数已经执行完成

                    // 1. 本地读取所有数据完成后,就会执行 钩子函数 created 创建完成
                    // CreateState.CallHooksCreatedFn();
                }
                console.log("春天在哪里");
                
                // 钩子函数 created 创建完成
                States._CallHooksCreatedFn();
            }
        });
    } 
}