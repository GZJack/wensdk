// 引入依赖库暴露出来的类
import {Tools} from '../lib/Index';


export interface El_fn{
    (e:Document):void
}

function setEvent(els:Array<Element>,name:string,fn:El_fn):void{
    els.forEach((el:any)=>{
        if(Tools._IsElement(el)){
            el.addEventListener(name,fn);
        }
    })
}

export function El_click(els:Array<Element>,fn:El_fn):void{
    setEvent(els,'click',fn);
}

export function El_on(els:Array<Element>,name:string,fn:El_fn):void{
    setEvent(els,'click',fn);
}



export function El_ready(isDoc:boolean,els:Array<Element>,fn:El_fn):void{
    if(isDoc){
        if(document.addEventListener){
            // 执行监听
            document.addEventListener('DOMContentLoaded',function(e){
                fn.apply(this,e);
            },false); 
        }
    }else{
        setEvent(els,'DOMContentLoaded',function(e:Document){
            fn.apply(this,e);
        })
    }
}