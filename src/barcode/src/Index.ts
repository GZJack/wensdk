
import {BarCode,BarcodeOptions} from './BarCode';
import {Q, Tools} from '../lib/Index';

export {BarcodeOptions};


/**
 * 创建一个旋转的新画布,将原来的画布内容画上
 *
 * @param {HTMLCanvasElement} OldCanvas
 * @param {number} RotateAngle
 * @param {(canvas:HTMLCanvasElement)=>void} callback
 */
function CreateRotateCanvas(OldCanvas:HTMLCanvasElement,RotateAngle:number,callback:(canvas:HTMLCanvasElement)=>void):void{

    // 解构取值,获得旧画布的宽度和高度
    let {width:OldCanvasWidth,height:OldCanvasHeight} = OldCanvas;

    // 将原有的画布,弄成一个图片元素
    let ImageEl:HTMLImageElement = new Image();
    // 赋值宽高
    ImageEl.width = OldCanvasWidth;
    ImageEl.height = OldCanvasHeight;


    // 对旋转角度进行判断
    if(RotateAngle < 0){
        RotateAngle = 360 + RotateAngle;
    }
    // 然后再取余,当旋转 390° 时, => 30°
    RotateAngle = RotateAngle % 360;
    

    // 这是画布指针的旋转角度
    let CanvasContextAngle:number = RotateAngle * Math.PI/180;

    // 角度坐标, 在 0,90,180,270,360 的时候不好使,始终取 0-90°内进行计算平移的坐标
    let Angle:number = (RotateAngle % 90) * Math.PI/180;
    // 定义一个正弦和余弦的绝对值
    let [AngleSin,AngleCos]:[number,number] = [Math.abs(Math.sin(Angle)),Math.abs(Math.cos(Angle))];
    // 假设旋转 30°
    // 计算边长公式:
    // 直角三角形 => 🔺, 最长的斜边为 c, 最短的直角边为 b, 剩下的边为 a
    // c => 对应着直角 90°, b => 对应的就是30° , a => 对应的就是60°
    // 已知 三个角的角度 和 斜边的长度(即是原来画布的宽度和高度)
    // 结果 
    // b = c * sin(30)
    // a = c * sin(60) 或 a = c * cos(30)
    // 根据上述公式,计算出 分别与 X Y 轴相交的点,及最大的画布范围
    // 分别定义 X Y 轴上各两段的长度
    let [X1,X2]:[number,number] = [AngleSin * OldCanvasHeight,AngleCos * OldCanvasWidth];
    let [Y1,Y2]:[number,number] = [AngleCos * OldCanvasHeight,AngleSin * OldCanvasWidth];
    // 分别合并的长度
    let [X,Y]:[number,number] = [X1+X2,Y1+Y2];

    // 定义新画布的宽高
    let NewCanvasWidthHeigh:[number,number] = [OldCanvasWidth,OldCanvasHeight];
    // 定义画布指针的平移坐标
    let TranslateXY:[number,number] = [0,0];
    // 最后区分对待
    switch(true){
        // case RotateAngle === 0:
        // case RotateAngle === 360:
        //     break;
        case RotateAngle === 90:
            // 直角
            TranslateXY = [OldCanvasHeight,0];
            NewCanvasWidthHeigh = [OldCanvasHeight,OldCanvasWidth];
            break;
        case RotateAngle === 180:
            // 平角
            TranslateXY = [OldCanvasWidth,OldCanvasHeight];
            NewCanvasWidthHeigh = [OldCanvasWidth,OldCanvasHeight];
            break;
        case RotateAngle === 270:
            TranslateXY = [0,OldCanvasWidth];
            NewCanvasWidthHeigh = [OldCanvasHeight,OldCanvasWidth];
            break;
        case RotateAngle > 0 && RotateAngle < 90:
            TranslateXY = [X1,0];
            NewCanvasWidthHeigh = [X,Y];
            break;
        case RotateAngle > 90 && RotateAngle < 180:
            TranslateXY = [Y,X1];
            NewCanvasWidthHeigh = [Y,X];
            break;
        case RotateAngle > 180 && RotateAngle < 270:
            TranslateXY = [X2,Y];
            NewCanvasWidthHeigh = [X,Y];
            break;
        case RotateAngle > 270 && RotateAngle < 360:
            TranslateXY = [0,X2];
            NewCanvasWidthHeigh = [Y,X];
            break;
        // default:
        //     break;
    }


    // 定义一个监听函数,因为会有延迟
    ImageEl.onload = () => {
        // 这里面才开始

        // 定义一个画布
        let canvas:HTMLCanvasElement = Q.c('canvas');

        // 解构提取新画布的宽度和高度
        let [NewCanvasWidth,NewCanvasHeight]:[number,number] = NewCanvasWidthHeigh;
        // 设置宽高
        canvas.width = NewCanvasWidth;
        canvas.height = NewCanvasHeight;

        // 拿到指针
        let ctx:CanvasRenderingContext2D = canvas.getContext('2d');


        // 解构拿到平移的值
        let [TranslateX,TranslateY]:[number,number] = TranslateXY;
        // 最后画笔平移到相对的位置
        ctx.translate(TranslateX,TranslateY);

        // 设置旋转的角度, Y 与 C 边的角度
        ctx.rotate(CanvasContextAngle);

        // 最后将图片画到新的画布上
        ctx.drawImage(ImageEl,0,0,OldCanvasWidth,OldCanvasHeight);

        
        // 保存一次指针
        ctx.save();
        ctx.restore();


        // 最后执行回调
        callback(canvas);
    }



    // 赋值图片地址
    ImageEl.src = OldCanvas.toDataURL();
}


/**
 * toCanvas() 和 toImage() 统一生成
 *
 * @param {BarcodeOptions} options
 */
function CreateBarCode(options:BarcodeOptions,resolve:(canvas_image:HTMLCanvasElement|HTMLImageElement)=>void,reject:()=>void,rotateAngle:number,isImage:boolean=false):void{
    
    // 解构拿到元素节点名称
    let {el} = options;
    // 拿到挂载条形码的元素节点,往元素节点里插入条形码画布或图片
    let DivEl:HTMLDivElement  = Q(el).get(0);

    
    // 创建成功
    let CreateSuccess = (canvas:HTMLCanvasElement):void => {

        // 这才是最后发送成功的回调
        let SendSuccess = (canvas:HTMLCanvasElement):void => {
             // 清空
            DivEl.innerHTML = '';
            // 判断是否是图片
            if(isImage){
                let ImageEl:HTMLImageElement = new Image();
                // 赋值宽高
                ImageEl.width = canvas.width;
                ImageEl.height = canvas.height;
                // 设置一个监听,担心延迟问题
                ImageEl.onload = () => {
                    // 添加到元素上
                    DivEl.appendChild(ImageEl);
                    // 输出
                    resolve(ImageEl);
                }
                // 赋值图片地址
                ImageEl.src = canvas.toDataURL();
            }else{
                DivEl.appendChild(canvas);
                resolve(canvas);
            }
        }
        
        // 成功才能进行旋转图片的,对不对嘛,其他的都不旋转



        // 生成的新画布,再赋值到原来的变量上
        // 必须保证设置的角度是数字
        if(Tools._IsNumber(rotateAngle)){
            // 创建
            CreateRotateCanvas(canvas,rotateAngle,(canvas:HTMLCanvasElement) => {
                // 旋转后发送
                SendSuccess(canvas);
            });
        }else{
            // 没有旋转,就直接发送
            SendSuccess(canvas);
        }
    }

    // 创建失败
    let CreateFail = ():void => {
        // // 设置字体
        // let message:string = '配置错误';

        // // 再节点上显示一个文本
        // DivEl.appendChild(document.createTextNode(message));

        // 定义一个错误警告
        let WarnMessage:string = 'Bar code is not configured correctly';
        // 发送一条警告,不受调试影响
        Tools._WarnLog(WarnMessage);
        // 调试输出当前配置,受调试影响
        Tools._DebugLog(WarnMessage + ':',options);
        // Promise 返回
        reject();
    }

    // 创建一个条形码对象
    BarCode.create(options).then(CreateSuccess,CreateFail).catch(CreateFail);
}

/**
 * 自定义条形码实例
 *
 * @export
 * @class WBarCode
 */
export class WBarCode{

    /**
     * 条形码的配置
     *
     * @private
     * @type {BarcodeOptions}
     * @memberof WBarCode
     */
    private _Options:BarcodeOptions;

    /**
     * 旋转的角度
     *
     * @private
     * @type {number}
     * @memberof WBarCode
     */
    private _RotateAngle:number = null;

    /**
     * Creates an instance of WBarCode.
     * @param {BarcodeOptions} options
     * @memberof WBarCode
     */
    constructor(options:BarcodeOptions){
        this._Options = options;
    }

    /**
     * 需要旋转的角度
     *
     * @param {number} [angle=90]
     * @returns {WBarCode}
     * @memberof WBarCode
     */
    public rotate(angle:number=90):WBarCode{
        // 保证必须是数字
        this._RotateAngle = Tools._IsNumber(angle) ? angle : null;
        // 返回当前实例
        return this;
    }

    /**
     * 生成 canvas 画布
     *
     * @returns {Promise<HTMLCanvasElement>}
     * @memberof WBarCode
     */
    public toCanvas():Promise<HTMLCanvasElement>{
        return new Promise((resolve:(canvas:HTMLCanvasElement)=>void,reject:()=>void)=>{
            CreateBarCode(this._Options,resolve,reject,this._RotateAngle,false);
        });
    }

    /**
     * 生成 image 图片
     *
     * @returns {Promise<HTMLImageElement>}
     * @memberof WBarCode
     */
    public toImage():Promise<HTMLImageElement>{
        return new Promise((resolve:(image:HTMLImageElement)=>void,reject:()=>void)=>{
            CreateBarCode(this._Options,resolve,reject,this._RotateAngle,true);
        });
    }


}


/**
 * 条形码类
 *
 * @export
 * @class Barcode
 */
export class Barcode{

    /**
     * 默认的配置
     *
     * @private
     * @static
     * @type {BarcodeOptions}
     * @memberof Barcode
     */
    private static _DefualtOptions:BarcodeOptions = {
        "el":'',
        "text":'',
        "format":'',
        "size":[2,100],
        "margin":[10,10],
        "type":1,
        "bgcolor":'#ffffff',
        "linecolor":'#000000',
        "displaytext":true,
        "fontsize":28,
        "textalign":'center'
    };

    /**
     * 这里可以做一些公共配置
     * Creates an instance of Barcode.
     * @memberof Barcode
     */
    constructor(){
        
    }

    /**
     * 校验并设置条形码配置
     *
     * @private
     * @static
     * @param {*} options
     * @returns {{[key:string]:any}}
     * @memberof Barcode
     */
    private static _CheckSetOptions(options:BarcodeOptions):{[key:string]:any}{
        // 定义一个返回的对象结果集
        let Result:{[key:string]:any} = {};
        // 遍历
        Object.keys(Barcode._DefualtOptions).forEach((key:string)=>{
            // 保证类型一致
            if(Tools._ToType((options as any)[key]) === Tools._ToType((Barcode._DefualtOptions as any)[key])){
                // 比较特殊
                let str1 = 'size',str2 = 'margin';
                // 处理两个比较特殊的
                if(Tools._InArray(key,[str1,str2])){
                    // 统一处理
                    let CheckArrayNumber = (NumberArray:number[]):boolean => {
                        let IsOk = true;
                        // 遍历校验
                        NumberArray.forEach((Item:number)=>{
                            if(IsOk){
                                // 保证里面设置的内容必须是数字,且大于等于
                                IsOk = Tools._IsNumber(Item) && Item >= 0;
                            }
                        })
                        return IsOk;
                    }
                    // 尺寸设置,必须保证里面两个都是数字
                    if(CheckArrayNumber((options as any)[key])){
                        // 设置宽度,最大值 0 - 6
                        if(key === str1){
                            // 解构取值
                            let [width,height] = (options as any)[key];
                            // 保证宽度必须是 0-6的数字
                            width = width > 0 && width <= 6 ? width : 2;
                            // 保证二维码的高度,必须大于30
                            height = height >= 30 ? height : 30;
                            // 最后赋值
                            Result[key] = [width,height];
                        }else{
                            // 赋值两边的间距
                            Result[key] = (options as any)[key];
                        }
                    }
                }else{
                    // 普通的直接赋值
                    Result[key] = (options as any)[key];
                }
            }
        });
        // 最后返回结果集
        return Result;
    }

    /**
     * 创建一个封装条形码实例
     *
     * @param {BarcodeOptions} options
     * @returns {WBarCode}
     * @memberof Barcode
     */
    public create(options:BarcodeOptions):WBarCode{
        // 合并配置,并new一个封装实例
        return new WBarCode(Tools._MergeConfig(Barcode._DefualtOptions,Barcode._CheckSetOptions(options)));
    }
    
}