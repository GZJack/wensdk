import {Tools} from '../../lib/Index';
import {TypeInterface} from './TypeInterface';
import {BarcodeOptions} from '../BarCode';


/**
 * 将字符串转为数字 封装统一将字符串数字转成纯数字
 *
 * @param {string} str
 * @returns {number}
 */
function CodeStringToNumber(str:string):number{
    return parseInt(str,10);
}

/**
 * 对字符串截取做一下简单的封装
 *
 * @param {string} str
 * @param {number} start
 * @param {number} [length]
 * @returns {string}
 */
function TextSubstr(str:string,start:number,length?:number):string{
   if(str.substr){
       return str.substr(start,length);
   }else{
       // 定义两个
       let FromNum:number = 0;
       let EndNum:number = str.length;
       if(start < 0){
           FromNum = EndNum + start;
       }else{
           FromNum = start;
       }
       EndNum = length > 0 ? length : EndNum;
       return str.substring(FromNum,EndNum);
   }
}


/**
 * 获得校验值
 *
 * @param {Array<number>} CheckBitArray
 * @returns {number}
 */
function GetCheckBitNumber(CheckBitArray:Array<number>):number{
     // 如果长度为 7 ,则是 EAN8 的校验
    let IsCheckEAN8Code:boolean = CheckBitArray.length === 7;
     // 奇偶数总和
     let OddEvenSum:number = 0;
     // 遍历添加
     CheckBitArray.forEach((Item:number,Index:number):void => {
         // 判断奇偶数
         if(((Index + 1) % 2) === 0){
             // EAN 13 奇数需要乘以 3 , EAN 8 偶数 要乘以 3
             OddEvenSum += Item * (IsCheckEAN8Code ? 1 : 3);
         }else{
             // EAN 8 偶数 乘以 3
             OddEvenSum += Item * (IsCheckEAN8Code ? 3 : 1);
         }
     });
     // 最后用 10 减去个位数,拿到对应的值,再取个位数
     return (10 - (OddEvenSum % 10)) % 10;
}


/**
 * 国际通用 , 前三个为国家代码
 *
 * @export
 * @class EAN
 */
export class EAN implements TypeInterface{


    /**
     * 前置码,决定左侧码的排列结构
     *
     * @private
     * @static
     * @type {Array<Array<number>>}
     * @memberof EAN
     */
    private static _StartCodeStructure:Array<Array<number>> = [
        [0,0,0,0,0,0],[0,0,1,0,1,1],[0,0,1,1,0,1],[0,0,1,1,1,0],[0,1,0,0,1,1],
        [0,1,1,0,0,1],[0,1,1,1,0,0],[0,1,0,1,0,1],[0,1,0,1,1,0],[0,1,1,0,1,0]
    ];
    
    /**
     * 条形码的数字解构
     * 
     * 第一个[0]=>对应上面前置码里所对应的 0, [1] => 1 , [2] 为右侧码对应的数据结构
     *
     * @private
     * @static
     * @type {Array<Array<string>>}
     * @memberof EAN
     */
    private static _DigitStructure:Array<Array<string>> = [
        ["0001101", "0100111", "1110010"],
        ["0011001", "0110011", "1100110"],
        ["0010011", "0011011", "1101100"],
        ["0111101", "0100001", "1000010"],
        ["0100011", "0011101", "1011100"],
        ["0110001", "0111001", "1001110"],
        ["0101111", "0000101", "1010000"],
        ["0111011", "0010001", "1000100"],
        ["0110111", "0001001", "1001000"],
        ["0001011", "0010111", "1110100"]
    ];

    /**
     * 分隔符结构
     *
     * @private
     * @static
     * @type {{[key:string]:string}}
     * @memberof EAN
     */
    private static _CutApartStructure:{[key:string]:string} = {
        // 左侧空白区(开始位start)
        "s":"00000000000", // 11 个空白区
        // 左侧超长条码结构 (left)
        "l":"101",
        // 中间超长条码结构 (mid)
        "m":"01010",
        // 右侧超长条码结构 (right)
        "r":"101",
        // 右侧空白区(结束位end) (EAN 8 的左右侧,均是 7 个空白区)
        "e":"0000000" // 7 个空白区
    };

    /**
     * 长条的数字,其数字会替换掉原有的 1 
     *
     * @private
     * @static
     * @type {string}
     * @memberof EAN
     */
    private static _LongBarNumber:string = '2';

    /**
     * 校验未通过的错误内容
     *
     * @type {string}
     * @memberof EAN
     */
    public msg:string = '';


    /**
     * 生成条形码的配置
     *
     * @private
     * @type {BarcodeOptions}
     * @memberof EAN
     */
    private _Options:BarcodeOptions;

    /**
     * 条形码文本
     *
     * @private
     * @type {string}
     * @memberof EAN
     */
    private _Text:string;



    // /**
    //  * 是否使用了 EAN8 条形码
    //  *
    //  * @private
    //  * @type {boolean}
    //  * @memberof EAN
    //  */
    // private _IsUseEAN8BarCode:boolean = false;

  


    /**
     * Creates an instance of EAN.
     * @param {(string|number)} text
     * @param {BarcodeOptions} options
     * @memberof EAN
     */
    constructor(text:string|number,options:BarcodeOptions){
        // 将其转换成字符串
        let TextString:any = Tools._IsString(text) || Tools._IsNumber(text) ? text + '' : '';
        this._Text = (TextString as string);
        this._Options = options;
        // 改变一下左边距和右边距,因为左右边距是固定的空白宽度
        options.margin = [0,0];
        // 改变字体大小,因为字体大小是根据宽度决定的
        options.fontsize = options.size[0] * 12;
    }

    /**
     * 获得条形码内容,这个是获得一个数组,
     *
     * @returns {Array<[string,number]>}
     * @memberof EAN
     */
    public text():Array<[string,number]>{
        // 拿到 text
        let text:string = this._Text;
        // 拿到配置
        let {size,margin} = this._Options;
        // 解构拿到宽度
        let [width,height] = size;
        let [marginLeft,marginRigth] = margin;
        // 最后返回该字体数组对象
        let TextArray:Array<[string,number]> = [];

        // 结构拿到对应的值
        let {s,l,m,e} = EAN._CutApartStructure;


        this._Options.fontsize = 5 * width * 2;

        // 判断是 EAN 8 还是 EAN 13
        if(text.length === 8){
            // 无前置码,左边 4 个 右边 4 个,平均分配
            marginLeft = marginLeft + (e.length + l.length) * width + width;
            for (let i = 0; i < text.length; i++) {
                // 将每一个数字与左边距进行放在一个数组中,再添加到数组对象中
                TextArray.push([text[i],marginLeft]);
                // 每个距离都是 7 个模的宽度
                marginLeft += 7 * width;
                // 当等于 3
                if(i == 3){
                    // 右侧的第一个开始需要多加一个中间的宽度
                    marginLeft += m.length * width;
                }
            }
        }else{
            // 前置码 1 个,左边 6 个 右边 6 个,平均分配
            marginLeft = marginLeft + width;
            for (let i = 0; i < text.length; i++) {
                // 将每一个数字与左边距进行放在一个数组中,再添加到数组对象中
                TextArray.push([text[i],marginLeft]);
                
                // 当等于 0
                if(i == 0){
                    // 前置码设置后就是,左侧开始
                    marginLeft += (s.length + l.length) * width;
                }else if(i == 6){
                    // 右侧开始
                    marginLeft += (m.length + 7) * width;
                }else{
                    marginLeft += 7 * width;
                }
            }
        }
        return TextArray;
    }

    /**
     * 校验接口
     * 
     * 声明: 7/12 位的,需要自动添加校验值
     * 
     *       8/13 位的,需要验证校验值
     *
     * @returns {boolean}
     * @memberof EAN
     */
    public valid():boolean{
        // 拿到text
        let text:string = this._Text;
        
        // 错误公共部分
        let msg:string = 'EAN (8 OR 13) bar code';

        // 统一拿到校验码,在这个函数中统一拿到对应的校验值
        let GetCheckNumber = (str:string):number => {
            return GetCheckBitNumber(str.split('').map((Item:string) => CodeStringToNumber(Item)));
        }

        // 要求条形码内容,必须是 7位和12位,这类是不带校验位的
        if(/^[0-9]{7}$|^[0-9]{12}$/.test(text)){
            // 在这里需要给 _Text 后面添加上校验码
            this._Text += GetCheckNumber(text);
            // 这个是合格的,会自动生成校验码
            return true;
        }else if(/^[0-9]{8}$|^[0-9]{13}$/.test(text)){
            // 这个是带校验位的,需要校验一下校验位是否合法

            // 取下最后一位校验值
            let LastOneText:string = TextSubstr(text,-1);
            // 最后判断,是否合法的校验值
            if(LastOneText == GetCheckNumber(TextSubstr(text,0,text.length-1)).toString()){
                // 合法通过
                return true;
            }else{
                // 赋值一个错误 (校验值错误,末尾的X可以省略)
                this.msg = msg + ': error checking value,the ' + LastOneText + ' at the end can be omitted';
                // 返回提示
                return false;
            }
        }else{
            // 赋值一个错误提示 (必须是长度为7/8或12/13的数字)
            this.msg = msg + 'must be a number 7/8 or 12/13 in length';
            // 其他长度是不合法的
            return false;
        }
    }
 

    /**
     * 获得解码内容
     *
     * @returns {string}
     * @memberof EAN
     */
    public encode():string{
        // 保证必须是合格的
        if(this.valid()){
            // 定义一个数组,用于接收条形码逻辑结构
            let EANAllBarCodeArray:Array<string> = [];

            // 一个替换函数,将原来的 1, 替换成 2 长条的 
            let LongBarReplace = (str:string):string => {
                return str.replace(/1/g,EAN._LongBarNumber);
            }
            
            // 结构拿到对应的值
            let {s,l,m,r,e} = EAN._CutApartStructure;

            // 拿到条形码所有内容
            let text:string = this._Text; // 能进到这里的,text 一定是 13 位 或 8 位 的数字字符串

            // 是否是使用了 EAN 8
            let IsUseEAN8BarCode:boolean = text.length === 8 ? true : false; 

            // 通过解构赋值 ('前置码(不要了)') ['左侧码','右侧码','验证码']
            let CodeTextArray:Array<string> = ['','',''];

            // 通过前置码拿到排列的逻辑
            let ByStartCodeToArray:Array<number> = [];

            // 如果使用了 EAN 8
            if(IsUseEAN8BarCode){
                CodeTextArray = [TextSubstr(text,0,4),TextSubstr(text,4,3),TextSubstr(text,-1)];
                // 赋值左侧码的排列逻辑
                ByStartCodeToArray = EAN._StartCodeStructure[0]; // [0,0,0,0] => 取 L 列
            }else{
                // 通过解构赋值
                CodeTextArray = [TextSubstr(text,1,6),TextSubstr(text,7,5),TextSubstr(text,-1)];
                // 将首位转成数字,并且通过前置码拿到左侧码的排列逻辑
                ByStartCodeToArray = EAN._StartCodeStructure[CodeStringToNumber(TextSubstr(text,0,1))];
         
            }
            
            // 左侧部分,不含前置码,右侧部分,不含验证码,验证码部分
            let [leftCodeText,rightCodeText,checkCodeText] = CodeTextArray;
           
            // 添加起始位空白区, EAN 8 和结束位是一致的
            EANAllBarCodeArray.push(IsUseEAN8BarCode ? e : s);
            // 添加左侧分隔符,并替换成长条输出
            EANAllBarCodeArray.push(LongBarReplace(l));

            
            // 左侧逻辑

            // 拿到就开始遍历
            for (let i = 0; i < leftCodeText.length; i++) {
                // 将每一项转为数字
                let LeftItemNumber:number = CodeStringToNumber(leftCodeText[i]);
                // 添加左侧数据结构
                EANAllBarCodeArray.push(EAN._DigitStructure[LeftItemNumber][ByStartCodeToArray[i]]);

            }

            // 添加中间分隔符,并替换成长条输出
            EANAllBarCodeArray.push(LongBarReplace(m));



            // 右侧逻辑

            // 遍历右侧部分,剩下了5个字符
            for (let j = 0; j < rightCodeText.length; j++) {
                // 将每一项转为数字
                let RightItemNumber:number = CodeStringToNumber(rightCodeText[j]);
                // 添加右侧数据结构
                EANAllBarCodeArray.push(EAN._DigitStructure[RightItemNumber][2]);

            }

            // 添加校验位
            EANAllBarCodeArray.push(EAN._DigitStructure[CodeStringToNumber(checkCodeText)][2]);

            // 添加右侧分隔符,并替换成长条输出
            EANAllBarCodeArray.push(LongBarReplace(r));
            // 添加结束位空白区
            EANAllBarCodeArray.push(e);
            
            // 最后合并输出
            return EANAllBarCodeArray.join('');
        }else{
            return '';
        }
    }
}