
import {Tools} from '../lib/Index';
import {JQ} from './JQ';


/**
 * 最后暴露出来的 Q 函数,传入el元素选择器
 *
 * @export
 * @param {*} el
 * @returns {JQ}
 */
export function Q(el:any):JQ{
    return new JQ(el);
}

/**
 * 创建某个标签元素
 * 
 * Q.c 这个是 SDK 内部使用
 */
Q.c = Q.create = function(tag:string):Element|any{
    return document.createElement(tag);
}


interface Fn{
    (e:Document):void;
}

/**
 * 文档加载完成后执行
 */
Q.ready = function(fn:Fn){
    if(Tools._IsFunction(fn)){
        // 执行监听
        document.addEventListener('DOMContentLoaded',function(e){
            fn.apply(this,e);
        },false); 
    }
}

/**
 * 获得当前时间戳
 */
Q.getTime = function():number{
    return (new Date()).getTime();
}


interface cb{
    (e:Document):void;
}

/**
 * 通过 script 从后台获取数据
 */
Q.getScript = function(url:string,success:cb,fail:cb):void{
    // 创建一个 script 标签
    let script:any = Q.c('script');
    // 设置成异步
    script.async = true;
    // 设置类型
    script.type = 'text/javascript';
    // 设置连接
    script.src = url;
   
    // 往 head 头部添加
    let head = document.getElementsByTagName('head')[0];
    // 往head里添加
    if(head){
        head.appendChild(script);
    };

    // 设置两个监听函数,判断是否加载成功
    script.addEventListener('error',function(e:Event){
        head.removeChild(script);
        if(Tools._IsFunction(fail)){
            fail.apply(this,e);
        };
    });
    // 监听成功返回
    script.addEventListener('load',function(e:Event){
        // 
        head.removeChild(script);
        if(Tools._IsFunction(success)){
            success.apply(this,e);
        };
    });
}




    