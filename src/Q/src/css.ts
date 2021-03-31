
// 引入依赖库暴露出来的类
import {Tools} from '../lib/Index';


// 设置样式
function setCss(els:Array<Element>,CssObject:any):void{
    Object.keys(CssObject).forEach((name:string) => {
        els.forEach((el:any) => {
            // 保证元素不能是 null 或 undefined el.nodeType === 1
            if(Tools._IsElement(el)){
                el.style[name] = CssObject[name];
            }
        })
    })
}

/**
 * 设置 css 样式
 *
 * @export
 * @param {Array<Element>} els
 * @param {(string|object)} name
 * @param {(string|never)} value
 */
export function SetCssStyle(els:Array<Element>,name:string|object,value:string|never):void{
     // 如果是字符串
     if(typeof name === 'string'){
        setCss(els,{[name]:value});
    }else if(Tools._IsObject(name)){
        setCss(els,name);
    };
}