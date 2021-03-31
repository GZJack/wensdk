
/**
 * 类型的接口,声明类的时候,需要按这个标准进行声明
 *
 * @export
 * @interface TypeInterface
 */
export interface TypeInterface{
    // 验证内容是否有效的
    valid:()=>boolean;
    // 获得文本
    text:()=>string|Array<[string,number]>;
    // 加密成二维码文本
    encode:()=>string;
    // 错误的信息
    msg:string;
}