// 引入依赖库暴露出来的类
import {Tools} from '../lib/Index';
import {Q} from './Index';
import {SetCssStyle} from './css';
import {El_fn,El_ready,El_click,El_on} from './event';


export class JQ{

    /**
     * 选中的元素节点都,放在一个数组中进行操作
     *
     * @type {Array<Element>}
     * @memberof JQ
     */
    public els:Array<Element>;

    /**
     * Creates an instance of JQ.
     * @param {*} el
     * @memberof JQ
     */
    constructor(el:any){
        // 意指,是将选中的元素都放在一个元素的数组内
        if(typeof el === 'string'){
            // 如果是 id 节点
            if(/^#\w+$/.test(el)){
                this.els = [document.querySelector(el)];
            }else{
                this.els = Tools._NodeListToArray(document.querySelectorAll(el));
            };
        }else{
            // 如果是元素节点
            if(Tools._IsElement(el)){
                // 传入的是元素节点
                this.els = [el];
            }else{
                // 未知节点
                this.els = [Q.c('div')];
            };
        };
    }

    /**
     * 设置 元素的样式
     *
     * @param {(string|object)} name
     * @param {(string|never)} value
     * @returns {JQ}
     * @memberof JQ
     */
    css(name:string|object,value:string|never):JQ{
        SetCssStyle(this.els,name,value);
        // 返回当前实例
        return this;
    }

    /**
     * 设置元素隐藏
     *
     * @returns {JQ}
     * @memberof JQ
     */
    public hide():JQ{
        this.css('display','none');
        // 返回当前实例
        return this;
    }

    /**
     * 设置元素显示
     *
     * @returns {JQ}
     * @memberof JQ
     */
    public show():JQ{
        this.css('display','block');
        // 返回当前实例
        return this;
    }

    /**
     * 元素单击事件
     *
     * @param {El_fn} fn
     * @returns {JQ}
     * @memberof JQ
     */
    public click(fn:El_fn):JQ{
        El_click(this.els,fn);
        // 返回当前实例
        return this;
    }

    /**
     * 元素监听事件
     *
     * @param {string} name
     * @param {El_fn} fn
     * @returns {JQ}
     * @memberof JQ
     */
    on(name:string,fn:El_fn):JQ{
        El_on(this.els,name,fn);
        // 返回当前实例
        return this;
    }

    /**
     * 监听文档是否加载完成
     *
     * @param {El_fn} fn
     * @memberof JQ
     */
    ready(fn:El_fn){
        El_ready(false,this.els,fn);
    }


    addClass(name:string){
        
    }


    public get(index:number):Element|any{
        return this.els[index];
    }

}

