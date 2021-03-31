import {Tools} from '../../lib/Index';
import {TypeInterface} from './TypeInterface';
import {BarCodeType} from '../BarCode';



/**
 * 标准的128条形码类
 * 
 * 即是128中有,A,B,C, (但EAN128=>与C很相似,长度是为偶数的数字,所以可以放在这里一同处理,只需要配置成)
 *
 * @export
 * @class Code128
 */
export class Code128 implements TypeInterface{

    /**
     * 条形码的数字解构
     *
     * @private
     * @static
     * @type {Array<string>}
     * @memberof Code128
     */
    private static _DigitStructure:Array<string> = [
        "11011001100","11001101100","11001100110","10010011000","10010001100","10001001100","10011001000","10011000100",
        "10001100100","11001001000","11001000100","11000100100","10110011100","10011011100","10011001110","10111001100",
        "10011101100","10011100110","11001110010","11001011100","11001001110","11011100100","11001110100","11101101110",
        "11101001100","11100101100","11100100110","11101100100","11100110100","11100110010","11011011000","11011000110",
        "11000110110","10100011000","10001011000","10001000110","10110001000","10001101000","10001100010","11010001000",
        "11000101000","11000100010","10110111000","10110001110","10001101110","10111011000","10111000110","10001110110",
        "11101110110","11010001110","11000101110","11011101000","11011100010","11011101110","11101011000","11101000110",
        "11100010110","11101101000","11101100010","11100011010","11101111010","11001000010","11110001010","10100110000",
        "10100001100","10010110000","10010000110","10000101100","10000100110","10110010000","10110000100","10011010000",
        "10011000010","10000110100","10000110010","11000010010","11001010000","11110111010","11000010100","10001111010",
        "10100111100","10010111100","10010011110","10111100100","10011110100","10011110010","11110100100","11110010100",
        "11110010010","11011011110","11011110110","11110110110","10101111000","10100011110","10001011110","10111101000",
        "10111100010","11110101000","11110100010","10111011110","10111101110","11101011110","11110101110","11010000100",
        "11010010000","11010011100","1100011101011"
    ];


    /**
     * 特殊索引
     *
     * @private
     * @static
     * @type {{[key:string]:number}}
     * @memberof Code128
     */
    private static _Index:{[key:string]:number} = {
        // 128 a
        "a":103,
        // 128 b
        "b":104,
        // 128 c
        "c":105,
        // 128 stop
        "s":106
    };

    /**
     * 区分出 内容属于哪一类?
     *
     * @private
     * @static
     * @type {{[key:string]:RegExp}}
     * @memberof Code128
     */
    private static _ValidRegexps:{[key:string]:RegExp} = {
        // 128A (Code Set A)
        // ASCII characters 00 to 95 (0–9, A–Z and control codes), special characters, and FNC 1–4
        "a":/^[\x00-\x5F\xC8-\xCF]+$/,
        // 128B (Code Set B)
        // ASCII characters 32 to 127 (0–9, A–Z, a–z), special characters, and FNC 1–4
        "b":/^[\x20-\x7F\xC8-\xCF]+$/,
        // 128C (Code Set C)
        // 00–99 (encodes two digits with a single code point) and FNC1
        "c":/^(\xCF*[0-9]{2}\xCF*)+$/
    };
    

  


    /**
     * 用于存文本 ASCII 码 的数组
     *
     * @private
     * @type {Array<number>}
     * @memberof Code128
     */
    private _Bytes:Array<number>=[];

    /**
     * 条形码的配置
     *
     * @private
     * @type {*}
     * @memberof Code128
     */
    private _Options:any;

    /**
     * 是否使用 EAN128 类型的条形码
     * 
     * 此条形码,必须是符合 Code128 C 的验证,长度为偶数的数字时,才起作用
     *
     * @private
     * @type {boolean}
     * @memberof Code128
     */
    private _IsUseEan128BarCode:boolean = false;

    /**
     * 文本的挂载
     *
     * @private
     * @type {string}
     * @memberof Code128
     */
    private _Text:string;

    /**
     * 错误信息
     *
     * @type {string}
     * @memberof Code128
     */
    public msg:string = '';

    /**
     * Creates an instance of Code128.
     * @memberof Code128
     */
    constructor(text:string|number,options:any){
        // 将其转换成字符串
        let TextString:any = Tools._IsString(text) || Tools._IsNumber(text) ? text + '' : '';
        this._Text = (TextString as string);
        // 将所有的文本转成 ASCII 数组
        this._Bytes = TextString.split('').map((char:String):number => char.charCodeAt(0));
        this._Options = options;

        // 改变字体大小,因为字体大小是根据宽度决定的
        options.fontsize = options.size[0] * 12;

        // 就看类型一不一样咯
        this._IsUseEan128BarCode = options.type === BarCodeType.EAN128;

    }

    /**
     * 校验入口
     *
     * @returns {boolean}
     * @memberof Code128
     */
    public valid():boolean{
        // 赋值一个错误警告提示
        this.msg = 'Code128 bar code must be asscii characters between 0-127 and 200-211';
        // ASCII value ranges 0-127, 200-211
		return /^[\x00-\x7F\xC8-\xD3]+$/.test(this._Text);
    }

    /**
     * 获得文本入口
     *
     * @returns {string}
     * @memberof Code128
     */
    public text():string{
        return this._Text;
    }

    /**
     * 获得解码入口
     *
     * @returns {string}
     * @memberof Code128
     */
    public encode():string{
        // 确保字符串是通过的
        if(this.valid()){
            // 定义一个加密字符串解构的数组,用于接收所有的编码,最后用于输出
            let EncodeAllArray:Array<string> = [];
            // 定义一个校验位的数组,用于最后在校验值的计算
            let CheckBitArray:Array<number> = [];
            // 是否使用了纯数字条形码
            let IsUseNumberCode128C:boolean = false;
            // 是否是使用 Code128C 奇数
            let IsUseCode128CUnEven:boolean = false;

            // 自动识别是使用 A,B,C 这三种中的一种
            // A,B,C的排位: 开始位 + (无) + 数据位 + 验证位 + 结束位
            // 验证位: (开始位ID + 1 * 数据ID ...) % 103 = 验证值
            // EAN128的排位: 开始位 + FNC1(特殊) + 数据位 + 验证位 + 结束位
            // 验证位: (开始位ID + 1 * 特殊位ID + 2 * 数据ID ...) % 103 = 验证值
            // 当text均是数字的时候,但是长度不是偶数,而是奇数的时候,我们可以这样处理
            // 奇数排位: 开始位 C + (无) + 数据位 + 验证位 + 结束位
            // 验证位: (开始位ID + 1 * 数据ID ... + 倒数第二个:(CODEB) x * 100 + 倒数第一个: 即最后一位数字,需要转换,如果是 0 就得转成 Code128 B 0对应的 ID 16) x * 16) % 103 = 验证值

            // 获得开始位+特殊位,即是,A,B,C, (EAN128=>与C很相似,偶数长度的数字,在开始位后面添加一个特殊位 FNC1)
            let GetStartBitAndSpecialBit = ():[string,string] => {
                // 拿到内容
                let text:string = this._Text;
                // 拿到对应的key
                let key:string = 'b';
                let startbit:string = '';
                let specialbit:string = '';
                // 区分
                switch(true){
                    case /^[0-9]+$/.test(text): // 如果全是数字,包含单双
                        key = 'c';
                        IsUseNumberCode128C = true;
                        // 是数字,但是是奇数个
                        if(!Code128._ValidRegexps[key].test(text)){
                            // 是数字,但是使用了奇数,我们则启动对应的奇数处理
                            IsUseCode128CUnEven = true;
                        }else{
                            // 偶数个,但是使用了 ean128
                            if(this._IsUseEan128BarCode){
                                // 取 FNC1, 只有使用了 ean128 才有整个特殊位
                                specialbit = Code128._DigitStructure[102];
                                // 特殊位,也是需要计算的
                                CheckBitArray.push(102);
                            }
                        }
                        break;
                    case Code128._ValidRegexps['b'].test(text): // 含有小写字母
                        key = 'b';
                        break;
                    case Code128._ValidRegexps['a'].test(text): // 不含小写字母
                        key = 'a';
                        break;
                }
                // 从头部添加,最后用于计算
                CheckBitArray.unshift(Code128._Index[key]);
                // 如果是双数
                startbit = Code128._DigitStructure[Code128._Index[key]];
                // 返回 开始位+特殊位
                return [startbit,specialbit];
            }

            // 获得 Ascii 转成 ID 值
            let GetAsciiToCode128IDIndex = (AsciiNumber:number):number => {
                // SP -> DEL (32 - 127) 与 Code128 表 SP -> DEL (0 - 95) 相差 32
                if(AsciiNumber >= 32 && AsciiNumber <= 127){
                    // 这里的是符合 B 含小写字母的
                    return AsciiNumber - 32; // 这里返回的就是 0 - 95 之间 Code128 B 的ID
                }else if(AsciiNumber >= 0 && AsciiNumber < 32){
                    // 小于32,就是一些特殊符号,如换行,空格,换码...
                    // NUT -> US (0 - 31) 与 Code128 表 NUT -> US (64 - 95) 相差 64
                    return AsciiNumber + 64; // 这里返回的就是 64 - 95 之间 Code128 A 的ID
                }else{
                    // SHIFT 就当作 200 - 211
                    return 98;
                }
            }


            // 赋值开始位+特殊位(只有偶数长度的纯数字时才有用,即使用了 EAN128 条形码才有用)
            EncodeAllArray = GetStartBitAndSpecialBit();

            // 开始计算数据位
            if(IsUseNumberCode128C){
                // 拿到原来的值
                let text:string = this._Text;

                // 最后一个数字
                let LastOneText:string = null;
                // 如果是单数,则会使用 EAN128 的排位计算
                if(IsUseCode128CUnEven){
                    // 取到最后一位
                    LastOneText = text.substr(-1);
                    // 去掉最后一位
                    text = text.substr(0,text.length - 1);                
                }

                // 使用两个
                for(let i = 0; i < text.length; i += 2){
                    // 拿到索引
                    let KeyIndex:number = parseInt(text.substr(i,2),10);
                    // 在进行添加
                    EncodeAllArray.push(Code128._DigitStructure[KeyIndex]);
                    // 添加校验位
                    CheckBitArray.push(KeyIndex);
                }

                // 纯数字,但是长度为奇数,需要做以下处理
                if(IsUseCode128CUnEven){
                    // 需要加一个 CODEB 即是 100
                    EncodeAllArray.push(Code128._DigitStructure[100]);
                    // 倒数第二位,添加固定格式 CODEB 
                    CheckBitArray.push(100);

                    // 倒数第一位,需要做一下转换处理,需要通过值,找到对应的ID,才能拿到对应的数据结构

                    // 最后一位,转成 Ascii 值,找到对应的 ID 索引
                    let LastKeyIndex:number = GetAsciiToCode128IDIndex(LastOneText.charCodeAt(0));
                    // 最后再加上,最后的一个数字
                    EncodeAllArray.push(Code128._DigitStructure[LastKeyIndex]);
                    // 索引也需要进行校验计算
                    CheckBitArray.push(LastKeyIndex);
                }
            }else{
                // 遍历, 这里主要是 Code128 A 或 Code128 B 的条形码
                this._Bytes.forEach((AsciiNum:number):void=>{
                    // 需要拿到 Ascii 码 对应的 ID 索引
                    let Code128IdIndex:number = GetAsciiToCode128IDIndex(AsciiNum);
                    // 通过 ID 索引 找到对应的数据结构,并添加到 数据位上
                    EncodeAllArray.push(Code128._DigitStructure[Code128IdIndex]);
                    // 数据的 ID 值是需要进行校验的
                    CheckBitArray.push(Code128IdIndex);
                });
            }
            
            
            // 获得校验位
            let GetCheckBit = ():string => {
                // 所有校验的索引数组,取索引乘以值,进行相加得到总和
                let CheckKeyIndexAll:number = 0;
                // 遍历添加
                CheckBitArray.forEach((Item:number,Index:number):void => {
                    CheckKeyIndexAll += Index > 1 ? Index * Item : Item;
                });
                // 拿总和进行取余, 103 是一个固定基数
                return Code128._DigitStructure[CheckKeyIndexAll % 103];
            }

            // 再添加一个校验位
            EncodeAllArray.push(GetCheckBit());

            // 最后添加结束位
            EncodeAllArray.push(Code128._DigitStructure[Code128._Index['s']]);
            
            // 最后转成字符串传出去
            return EncodeAllArray.join('');
        }else{
            return '';
        }
    }
}