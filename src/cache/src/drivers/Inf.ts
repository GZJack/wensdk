/**
 * 驱动,均使用该继承该接口,实现统一的接口方法
 *
 * @export
 * @interface CacheInterface
 */
export interface CacheInterface{
    // 生成的一个用户key 需要 key + name => 生成一个本地存储的 key 
    key:string;
    // 校验是否存在该值
    has(name:string):boolean;
    // 设置
    set(name:string,value:any,expire?:number):void;
    // 取值
    get(name:string,defualt?:any):any;
    // 删除该值
    remove(name:string):void;
    // 清空
    clear():void;
}