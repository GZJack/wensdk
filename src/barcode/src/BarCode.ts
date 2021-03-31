
import {TypeInterface} from './type/TypeInterface';

import {ITF} from './type/ITF';
import {Code128} from './type/Code128';
import {EAN} from './type/EAN';

import {Tools,Q} from '../lib/Index';


/**
 * 枚举条形码可用的类型
 *
 * @enum {number}
 */
export enum BarCodeType{
    CODE128,
    EAN128,
    ITF,
    EAN
}

/**
 * 条形码的配置接口
 *
 * @interface BarcodeOptions
 */
export interface BarcodeOptions{
    // 条形码缩放在的元素节点上
    el:string;
    // 条形码的内容
    text:string|number;
    // 内容的输出格式,只对 Code 128 和 ITF 起作用, '' 是默认, (xxx xxx xxx xxx) 默认就是居中计算
    format?:string;
    // 类型
    type?:BarCodeType;
    // 尺寸
    size?:[number,number];
    // 左右的边距
    margin?:[number,number]; 
    // 背景颜色
    bgcolor?:string;
    // 线条的颜色
    linecolor?:string;
    // 显示文本内容
    displaytext?:boolean;
    // 字体大小
    fontsize?:number;
    // 设置文本内容的对齐方式
    textalign?:CanvasTextAlign;
}

// /**
//  * 通过Canvas元素设置字体的大小,并获得字体的宽度
//  *
//  * @param {number} fontsize
//  * @param {string} text
//  * @returns {number}
//  */
function GetByCanvasToTextWidth(fontsize:number,text:string):number{
    // 创建一个 canvas 元素
    let canvas = Q.c('canvas');
    // 拿到指针
    let ctx = canvas.getContext('2d');
    // 设置字体大小
    ctx.font = fontsize + 'px monospace';
    // 最后返回字体的宽度
    return ctx.measureText(text).width;
}

/**
 * 条形码主类
 *
 * @export
 * @class BarCode
 */
export class BarCode{
    /**
     * 条形码的配置
     *
     * @private
     * @type {BarcodeOptions}
     * @memberof BarCode
     */
    private _Options:BarcodeOptions;

    /**
     * 当前使用的类型
     *
     * @private
     * @type {TypeInterface}
     * @memberof BarCode
     */
    private _Type:TypeInterface;

    // /**
    //  * 当前画布
    //  *
    //  * @private
    //  * @type {HTMLCanvasElement}
    //  * @memberof BarCode
    //  */
    // private _Canvas:HTMLCanvasElement;

    /**
     * 当前画布
     *
     * @type {HTMLCanvasElement}
     * @memberof BarCode
     */
    public c:HTMLCanvasElement;

    /**
     * 当前画布的指针
     *
     * @private
     * @type {CanvasRenderingContext2D}
     * @memberof BarCode
     */
    private _Context:CanvasRenderingContext2D;


    /**
     * 加密得字符串长度
     *
     * @private
     * @type {number}
     * @memberof BarCode
     */
    private _EncodeStringLength:number = 0;



    /**
     * monospace 字体的 高/宽 的比例,如字体 fontsize=30, 30/15 = 2
     *
     * @private
     * @static
     * @type {number}
     * @memberof BarCode
     */
    private static _TextHeigthWidthScale:number = 2;


    /**
     * 是否设置了 字体等比宽度
     *
     * @private
     * @static
     * @type {boolean}
     * @memberof BarCode
     */
    private static _IsSetHeigthWidthScale:boolean = false;


    /**
     * Creates an instance of BarCode.
     * @param {BarCodeOptions} options
     * @memberof BarCode
     */
    constructor(options:BarcodeOptions){
        this._Options = options;
        // 解构取值
        let {type,text} = options;
        // 创建一个元素
        let _Canvas:HTMLCanvasElement = Q.c('canvas');
        // this._Canvas = _Canvas;
        this.c = _Canvas;
        // var Context:CanvasRenderingContext2D = _Canvas.getContext("2d");
        this._Context = _Canvas.getContext('2d');
        // 获得类型
        this._Type = BarCode._GetType(type,text,options);
        // 如果没有设置等比宽度,如果没有设置,则我们进行设置
        if(!BarCode._IsSetHeigthWidthScale){
            // 测试的字体大小
            let TestFontSize:number = 30;
            // 得到字体宽度
            let TextWidth:number = GetByCanvasToTextWidth(TestFontSize,'2');
            // 保证必须是数字
            if(Tools._IsNumber(TextWidth)){
                // 将设置字体的大小除以得到的字体宽度
                let TextHeigthWidthScale:number = TestFontSize / TextWidth;
                // 如果在这个范围,则进行设置,否则就默认
                if(TextHeigthWidthScale > 0 && TextHeigthWidthScale < 4){
                    // 最后设置等比例
                    BarCode._TextHeigthWidthScale = TextHeigthWidthScale;
                    // 修改已经计算出来了,下次就不会计算了
                    BarCode._IsSetHeigthWidthScale = true;
                }
            }
        }
    }

    /**
     * 拿到对应的类型实例,保证能够找到对应的类型,否则选中默认的
     *
     * @private
     * @static
     * @param {number} type
     * @param {(string|number)} text
     * @param {BarcodeOptions} options
     * @returns {TypeInterface}
     * @memberof BarCode
     */
    private static _GetType(type:number,text:string|number,options:BarcodeOptions):TypeInterface{
        let TypeInstance:TypeInterface = null;
        // 区别类型
        switch(type){
            case BarCodeType.CODE128:
            case BarCodeType.EAN128:
                TypeInstance = new Code128(text,options);
                break;
            case BarCodeType.ITF:
                TypeInstance = new ITF(text,options);
                break;
            case BarCodeType.EAN:
                TypeInstance = new EAN(text,options);
                break;
            default:
                // 默认使用 Code128 
                TypeInstance = new Code128(text,options);
        }
        // 最后返回最后的实例
        return TypeInstance;
    }

    /**
     * 校验并获得默认颜色
     *
     * @private
     * @static
     * @param {string} color
     * @param {string} defualtColor
     * @returns {string}
     * @memberof BarCode
     */
    private static _GetCheckColor(color:string,defualtColor:string):string{
        return /^\#[0-9A-z]{6}$/.test(color) ? color : defualtColor;
    }


    /**
     * 设置条形码内容的样式
     *
     * @private
     * @static
     * @param {string} text
     * @param {string} format
     * @param {number} encodelength
     * @param {BarcodeOptions} options
     * @returns {(string|Array<[string,number]>)}
     * @memberof BarCode
     */
    private static _SetTextStyle(text:string,format:string,encodelength:number,options:BarcodeOptions):string|Array<[string,number]>{
        // 如果不是字符串,我们直接返回
        if(Tools._IsString(text)){
            // 条件
            // 字符串且不能为空
            // 满足: xxx xxx 必须是 字母 x 和 空格
            // 替换所有的空格,得到的长度需要和text的长度相等,我们才进行样式解析
            // 满足以上条件,则进行解析
            if(Tools._IsString(format) && !Tools._IsEmpty(format) && /^x+\s(x+\s)*x+$/i.test(format) && format.replace(/\s+/g,'').length === text.length){
                // 这里设置字符串的样式
                // 定义字符数组
                let TextArray:Array<[string,number]> = [];
                // 从配置上拿到
                let {size,fontsize,margin} = options;
                // 拿到宽度
                let [width,height] = size;
                let [marginLeft] = margin;
                // 转成的格式数组,[2,4,4,2] 数字表示字符串长度
                let FormatArray:Array<number> = format.split(' ').map((XStr:string):number => XStr.length);
                // 得计算内容的总宽度
                let TextTotalWidth:number = width * encodelength;
                // 设置字体的最小值和最大值,如果超过最大值,获得小过最小值,则使用默认值
                let [fontSizeMin,fontSizeMax] = [8 * width,18 * width];

                // 决定字体的大小,如果太大,或者太小,则取默认的中间值
                fontsize = fontsize <= fontSizeMax && fontsize >= fontSizeMin ? fontsize : 12 * width;
                // 如果字体过大,需要重写字体大小
                options.fontsize = fontsize; // 保证最后的字体是符合的

                // 字体宽度 = 字体大小 / 高度与宽度的比例
                let fontwidth:number = fontsize / BarCode._TextHeigthWidthScale;
                // 提取内容分段中间的空格数 xxx xxx xxx 中间两个空格
                let midblanknumber:number = FormatArray.length - 1;
                // 计算所有的空白总宽度 (加密的总长度,减去内容的总长度)
                let allblankwidth:number = TextTotalWidth - text.length * fontwidth;
                // 分别计算只有中间空格的宽度,和首尾分别添加一个空格的宽度
                let onlyMidBlankWidth:number = allblankwidth / midblanknumber; // 只是中间的宽度
                let twoLRBlankWidth:number = allblankwidth / (midblanknumber + 2); // 含两边的宽度

                // 情况分析
                // 如果添加两边空格, 只要大于一个 字体宽度,就可以往两边添加空格
                if(twoLRBlankWidth >= fontwidth){
                    // 左边距加一个空格
                    marginLeft += twoLRBlankWidth;
                    // 然后改变中间的宽度
                    onlyMidBlankWidth = twoLRBlankWidth; // 如果这个宽度还是大于 2 个字体宽度 则继续缩小
                }
                


                // 定义一个最大的空格宽度 , 2 个字体宽度
                let maxMidBlankWidth:number = 2 * fontwidth;
                // 对左边距做一个校验
                // 分情况决定
                // 如果中间的空格长度大于等于 2 个字体宽度的时候 2 * fontwidth , 我们将中间空格转为 2 个字体宽度,首尾增加剩余空白的一半

                // 定义一个最后的空格宽度,该宽度是用来最后计算的
                let blankWidth:number = 0;
                // 过大了
                if(onlyMidBlankWidth >= maxMidBlankWidth){
                    // 赋值给最大值,3个字体宽度
                    blankWidth = maxMidBlankWidth;
                    // 计算出缩小部分总和的一半
                    marginLeft += (onlyMidBlankWidth - maxMidBlankWidth) * midblanknumber / 2;
                }else{
                    // 赋值合格的中间空格长度
                    blankWidth = onlyMidBlankWidth;
                }


                // 定义开始和结束位置
                let LeftStart = 0;
                let RightEnd = 0;
                // 遍历并截取
                FormatArray.forEach((Item:number) => {
                    // 右边先行
                    RightEnd += Item;
                    // 往里添加一个数组['内容',左边距]
                    TextArray.push([text.substring(LeftStart,RightEnd),marginLeft]);
                    // 左边递增
                    LeftStart += Item;
                    // 计算左边距
                    marginLeft += Item * fontwidth + blankWidth;
                });
                
                // 最后返回一个数组
                return TextArray;
            }else{
                return text;
            }
        }else{
            return text;
        }
    }


    /**
     * 私有,画文本的方法
     *
     * @private
     * @memberof BarCode
     */
    private _DrawText():void{
        // 拿到文本内容
        let text:string|Array<[string,number]> = this._Type.text();

        // 拿到画布的宽度
        let CanvasWidth:number = this.c.width;
        // 解构拿到需要的配置
        let {size,format,fontsize,textalign,margin} = this._Options;
        // 解构拿到 条和空的宽度, 及条和空的高度
        let [width,height] = size;
        let [marginLeft,marginRight] = margin;

        // 给内容设置一下间距 xxx xxx xxx xxx 
        text = BarCode._SetTextStyle((text as any),format,this._EncodeStringLength,this._Options);
        
        

        // 计算出写文字的坐标 X,Y
        let TextX:number = CanvasWidth/2;
        let TextY:number = height + fontsize * 0.1;

        // 拿到当前画布的指针
        // let ctx:CanvasRenderingContext2D = this._Context;
        let ctx:CanvasRenderingContext2D = this.c.getContext('2d');

        // 设置字体样式
        ctx.font = fontsize + 'px monospace';
        ctx.textBaseline = "bottom";
        ctx.textBaseline = "top";


        // 如果是字符串,就直接画出来
        if(Tools._IsString(text)){
            // 区别文字的对齐方式
            switch(textalign){
                case 'left':
                    TextX = marginLeft;
                    break;
                case 'right':
                    TextX = CanvasWidth - marginRight;
                    break;
                default:
                    // 默认就是中间对齐
                    textalign = 'center';
                    TextX = CanvasWidth/2;
            }
            // 设置对齐方式
            ctx.textAlign = textalign;

            // 开始画字体文字
            ctx.fillText((text as string),TextX,TextY);

        }else if(Tools._IsArray(text)){
            // 遍历画出来
            (text as any).forEach((Items:[string,number,number]):void => {
                // 保证必须是数组
                if(Tools._IsArray(Items)){
                    // 解构拿到对应的值
                    let [str,leftnum,rigthnum] = Items;
                    // ctx.textAlign = 'left';
                    ctx.fillText(str,leftnum,TextY);
                }
            });
        }

        // 恢复到原状态
        ctx.restore();
        // 保存一下当前的状态
        ctx.save(); // 保存当前状态
    }

    /**
     * 私有,画条形码的方法,必须先画条形码,在画文本文字
     *
     * @private
     * @memberof BarCode
     */
    private _DrawBarcode():void{
        // 拿到画布
        let canvas:HTMLCanvasElement = this.c;
        
        // 解构配置
        let {size,margin,bgcolor,linecolor,fontsize,displaytext} = this._Options;
        let [width,height] = size;
        let [marginLeft,marginRight] = margin;

        // 拿到加密的内容
        let text:string = this._Type.encode();

        // 记录一份加密的字符串长度,用于 画内容时,解决样式的时候进行计算排列距离
        this._EncodeStringLength = text.length;

        // 先计算整个画布的宽高(含条形码+文字)的宽度和高度
        let CanvasWidth:number = text.length * width + marginLeft + marginRight;
        let CanvasHeight:number = height + fontsize * (displaytext ? 1.2 : 0);

        // 给画布设置宽高
        canvas.width = CanvasWidth;
        canvas.height = CanvasHeight;

        // let ctx:CanvasRenderingContext2D = this._Context;
        let ctx:CanvasRenderingContext2D = this.c.getContext('2d');

        // 对当前的画布进行清空到原始的画布
        ctx.clearRect(0,0,CanvasWidth,CanvasHeight);

        // 背景颜色
        if(Tools._IsString(bgcolor) && !Tools._IsEmpty(bgcolor)){
            ctx.fillStyle = BarCode._GetCheckColor(bgcolor,'#ffffff');
            ctx.fillRect(0,0,CanvasWidth,CanvasHeight);
        }

        // 指针向左侧移动一个左边距
        // ctx.translate(marginLeft, 0);


        // 线条的颜色
        ctx.fillStyle = BarCode._GetCheckColor(linecolor,'#000000');

        // 遍历画线条
        for (let i:number = 0; i < text.length; i++) {
            // 计算画线条的左边距
            let x:number = i * width + marginLeft;
            // 当等于1的时候画实线
            if(text[i] === "1"){
                // 画标准的线条
                ctx.fillRect(x,0,width,height);
            }else if(text[i] !== '0' && text[i] !== '1'){
                // 画超长的线条
                ctx.fillRect(x,0,width,height + (displaytext ? (fontsize * 1.2)/2 : 0));
            }
        }

        // ctx.restore();
        // if (options.displayValue) {
        //     _drawBarcodeText(content)
        // }
        // uri = canvas.toDataURL("image/png");

        // 设置样式
        // canvas.style.width= width + 'px';
        // canvas.style.height= height + 'px';

        // 设置一个监听函数
        // canvas.ontouchstart=function(e){
        //     e.preventDefault();
        //     e.stopImmediatePropagation();
        // }

        // 恢复到原状态
        ctx.restore();
        // 保存一下当前的状态
        ctx.save(); // 保存当前状态
    }


    /**
     * 暴露出去的画字体的方法,最后画文本
     *
     * @memberof BarCode
     */
    public t():void{
        this._DrawText();
    }

    /**
     * 暴露出去画条形码的方法,必须先画条形码
     *
     * @memberof BarCode
     */
    public b():void{
        this._DrawBarcode();
    }


    /**
     * 验证配置是否有效的
     *
     * @returns {boolean}
     * @memberof BarCode
     */
    public v():boolean{
        return this._Type.valid();
    }


    /**
     * 暴露出去,拿到错误信息
     *
     * @readonly
     * @type {string}
     * @memberof BarCode
     */
    public get m():string{
        return this._Type.msg;
    }


    /**
     * 创建出条形码,并校验是否能创建
     *
     * @static
     * @param {BarcodeOptions} options
     * @returns {Promise<HTMLCanvasElement>}
     * @memberof BarCode
     */
    public static create(options:BarcodeOptions):Promise<HTMLCanvasElement>{
        // 返回 Promise 对象
        return new Promise((resolve:(canvas:HTMLCanvasElement)=>void,reject:(canvas:HTMLCanvasElement)=>void):any => {
            // 是否需要显示文本
            let {displaytext} = options;
            // 创建实例
            let bar:BarCode = new BarCode(options);
            // 先执行校验是否通过
            if(bar.v()){
                // 画条形码是必须的,且先画
                bar.b();
                // 显示文本内容才能进行画字体
                displaytext && bar.t();
                // 最后将画布返回出去
                resolve(bar.c);
            }else{
                // 发送一条警告
                Tools._WarnLog(bar.m);
                // 发送一个空白的画布出去
                reject(bar.c);
            }
        });
    }

}