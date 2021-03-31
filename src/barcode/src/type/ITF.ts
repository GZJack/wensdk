
import {Tools} from '../../lib/Index';
import {TypeInterface} from './TypeInterface';

/**
 * 条形码的类型
 *
 * @export
 * @class ITF
 */
export class ITF implements TypeInterface{

    /**
     * 条形码的数字解构
     *
     * @private
     * @static
     * @memberof ITF
     */
    private static _DigitStructure:{[key:string]:string} = {
        "0": "00110",
        "1": "10001",
        "2": "01001",
        "3": "11000",
        "4": "00101",
        "5": "10100",
        "6": "01100",
        "7": "00011",
        "8": "10010",
        "9": "01010"
    };

    /**
     * 开始的固定解构
     *
     * @private
     * @static
     * @memberof ITF
     */
    private static _StartStructure = '1010';

    /**
     * 结束的固定解构
     *
     * @private
     * @static
     * @memberof ITF
     */
    private static _EndStructure = '11101';

    /**
     * 必须是偶数的数字才能生成二维码
     *
     * @private
     * @static
     * @memberof ITF
     */
    private static _ValidRegexp = /^([0-9][0-9])+$/;
    
    
    /**
     * 生成条形码的配置
     *
     * @private
     * @type {*}
     * @memberof ITF
     */
    private _Options:any;


    /**
     * 生成条形码的内容
     *
     * @private
     * @type {(string|number)}
     * @memberof ITF
     */
    private _Text:string;


    /**
     * 暴露出去的错误
     *
     * @type {string}
     * @memberof ITF
     */
    public msg:string = '';

    /**
     * Creates an instance of ITF.
     * @param {(string|number)} text
     * @param {*} options
     * @memberof ITF
     */
    constructor(text:string|number,options:any){
        // 将其转换成字符串
        let TextString:any = Tools._IsString(text) || Tools._IsNumber(text) ? text + '' : '';
        this._Text = (TextString as string);
        this._Options = options;
    }

    /**
     * 校验内容,并赋值错误信息,当错误了,才会去读取错误信息
     *
     * @returns {boolean}
     * @memberof ITF
     */
    public valid():boolean{
        // 设置一个错误信息 (ITF条形码必须是长度为偶数的数字)
        this.msg = 'ITF bar code must be a number of even lengths.';
        // 校验
        return this._Text.search(ITF._ValidRegexp) !== -1;
    }

    /**
     * 拿到原有的文本
     *
     * @returns {string}
     * @memberof ITF
     */
    public text():string{
        return this._Text;
    }

    /**
     * 将合格的内容进行加密成 0101 格式
     *
     * @returns {string}
     * @memberof ITF
     */
    public encode():string{
        // 拼接成最后的结果
        let result:string = '';
        // 保证必须是合法的
        if(this.valid()){
            // 添加头部的固定解构
            result += ITF._StartStructure;
            // 拿到内容
            let text:string = this._Text;
            // 将字符串进行一对一对地计算
            let calculatePair = (twoNumbers:string):string => {
                // 每一项返回的结果
                let itemResult:string = '';
                // 分别将第一个和第二个数字取出
                let number1Struct = ITF._DigitStructure[twoNumbers[0]];
                let number2Struct = ITF._DigitStructure[twoNumbers[1]];
                // 遍历五次,分别将 第一个数 转成 条, 第二个数转成 空
                for (let i = 0; i < 5; i++) {
                    // 第一个数对应的解构中的 1 转换成 3 条, 0 转成 1 条
                    itemResult += (number1Struct[i] == "1") ? "111" : "1";
                    // 第二个数对应的结构中的 1 转换成 3 空, 0 转成 1 空
                    itemResult += (number2Struct[i] == "1") ? "000" : "0";
                }
                // 最后返回每一项的结果
                return itemResult;
            }

            // 以2步进行遍历取值
            for(let i = 0; i < text.length; i += 2) {
                // 最后将两个数进行计算
                result += calculatePair(text.substr(i, 2))
            }
            // 再添加尾部固定解构
            result += ITF._EndStructure;
            // 最后返回结果
            return result
        }else{
            return '';
        }
    }
}