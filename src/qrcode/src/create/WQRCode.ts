

import {QRCode,QRErrorCorrectLevel} from './QRCode';
import {Tools,Q} from '../../lib/Index';

/**
 * 生成二维码的基本配置
 *
 * @interface WQRCodeOptions
 */
export interface WQRCodeOptions{
    // 挂载的元素节点
    el?:string|Element,
    // 二维码的内容
    text:string,
    // 二维码的尺寸
    size?:number,
    // 容错级别
    level?:number,
    // 二维码 logo
    logo?:string|Element
}

/**
 * 避免多次定义 Promise 回调
 *
 * @param {Function} fn
 * @returns {Function}
 */
function promisify(fn:Function):Function{
     return function(){
        // 拿到原来的参数,然后在后面传入
        let args:Array<any> = Tools._ToArrayFrom(arguments); // 将类数组转成普通数组
        // 返回一个 Promise 对象
        return new Promise((resolve:(result:any)=>void,reject:any)=>{
            // 往里再添加一个回调函数,当传入的参数来决定失败与否,这里没有失败
            args.push((result:any)=>{
                resolve(result);
            });
            fn.apply(null,args);
        });
     }
 }


/**
 * 画logo白色背景
 *
 * @param {*} ctx
 * @returns
 */
function drawLogoBg(ctx:any){
     // x,y 左上角坐标, wh logo的背景大小
     return function(x: number,y: number,w: number,h: number,r: number):void{
        let minSize = Math.min(w, h);
        if (r > minSize / 2) {
          r = minSize / 2;
        }
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
     }
}

/**
 * 设置挂载和执行回调
 *
 * @param {Element|null} elDiv
 * @param {HTMLCanvasElement} canvas
 * @param {(result:any)=>void} resolve
 */
function setElDivResolve(elDiv:Element|null,canvas:HTMLCanvasElement,resolve:(result:any)=>void):void{
    // 如果挂载元素为null的情况下,我们则不执行挂咋
    if(!Tools._IsNull(elDiv)){
        // 清空原来的元素
        elDiv.innerHTML = '';
        // 加入画布 (二维码+logo)
        elDiv.appendChild(canvas);
    }
    // 执行一个换掉,将画布传出去
    resolve(canvas);
}

/**
 * 专门画logo
 * 
 * 第一层,传入画布上下文和尺寸
 *
 * @param {*} ctx
 * @param {number} size
 * @returns {(ImageElement:Element,elDiv:Element,canvas:HTMLCanvasElement)=>(resolve:(result:any)=>void)=>void}
 */
function drawLogo(ctx:any,size:number):(ImageElement:Element,elDiv:Element,canvas:HTMLCanvasElement)=>(resolve:(result:any)=>void)=>void{
    // 第二层传入元素节点
    return function(ImageElement:Element|null,elDiv:Element,canvas:HTMLCanvasElement):(resolve:(result:any)=>void)=>void{
        // 第三层传入一个回调函数
        return function(resolve:(result:any)=>void):void{
            // 添加一个监听事件
            ImageElement.addEventListener('load',()=>{
                // 设置logo的配置尺寸和背景颜色
                let bgColor = '#ffffff';
                let borderRadius = 8;
                let borderSize = 0.02; // 0.05
                let logoSize = 0.15;
                let logoWidth = size * logoSize;
                let logoXY = (size * (1 - logoSize)) / 2;
                let logoBgWidth = size * (logoSize + borderSize);
                let logoBgXY = (size * (1 - logoSize - borderSize)) / 2;

                // 画 logo 背景
                drawLogoBg(ctx)(logoBgXY,logoBgXY,logoBgWidth,logoBgWidth,borderRadius);
                // 填充背景颜色
                ctx.fillStyle = bgColor;
                ctx.fill();
                // 画logo图片
                ctx.drawImage(ImageElement,logoXY,logoXY,logoWidth,logoWidth);

                // 设置画布挂载及回调
                setElDivResolve(elDiv,canvas,resolve);
            });
            // 错误事件
            ImageElement.addEventListener('error',()=>{
                // 发送一条警告日志
                Tools._WarnLog('qrcode load logo image failed');
                // 设置画布挂载及回调
                setElDivResolve(elDiv,canvas,resolve);
            });
        };
    };
}

/**
 * 创建一个画logo函数
 *
 * @param {*} ctx
 * @param {number} size
 * @param {*} logo
 * @returns {(elDiv:Element|null,canvas:HTMLCanvasElement)=>(resolve:(result:any)=>void)=>void}
 */
function createDrawLogo(ctx:any,size:number,logo:any):(elDiv:Element,canvas:HTMLCanvasElement)=>(resolve:(result:any)=>void)=>void{
    // 第二层传入元素节点
    return function(elDiv:Element,canvas:HTMLCanvasElement):(resolve:(result:any)=>void)=>void{
        // 第三层传入一个回调函数
        return function(resolve:(result:any)=>void):void{
            // 如果logo是string
            if(Tools._IsString(logo) && !Tools._IsEmpty(logo)){
                // 创建一个图片元素
                let LogoImage:HTMLImageElement = new Image();
                // 画logo
                drawLogo(ctx,size)(LogoImage,elDiv,canvas)(resolve);
                // 图片内容
                let SrcText:string|any = /^data\:.+\;base64\,/.test(logo as string) ? logo : Tools._ToParseUrl(logo as string).Url;
                // 加载图片
                LogoImage.src = SrcText;
            }else if(Tools._IsElement(logo)){
                // 画logo
                drawLogo(ctx,size)(logo as HTMLImageElement,elDiv,canvas)(resolve);
            }else{
                // 不画 logo,只设置挂载和输出
                setElDivResolve(elDiv,canvas,resolve);
            }
        };
    };
}

/**
 * 自己另外封装的二维码库,支持logo且支持下载二维码的类
 *
 * @export
 * @class WQRCode
 */
export class WQRCode{
    /**
     * 定义一个配置
     *
     * @private
     * @type {WQRCodeOptions}
     * @memberof WQRCode
     */
    private _options:WQRCodeOptions;

    /**
     * Creates an instance of WQRCode.
     * @param {WQRCodeOptions} options
     * @memberof WQRCode
     */
    constructor(options:WQRCodeOptions){
        // 校验配置
        this._options = WQRCode._CheckOptions(options);
    }

    /**
     * 校验并返回容错级别,如果内容长度大于26个字
     *
     * @private
     * @static
     * @param {*} options
     * @returns {number}
     * @memberof WQRCode
     */
    private static _CheckCorrectLevel(options:any):number{
        // 如果是对象就进行返回
        if(Tools._IsObject(options)){
            // 拿到内容 和 logo
            let {level,logo,text} = options;
            // 如果设置了容错级别,则使用用户设置的级别
            if(!isNaN(level)){
                // 
                level = parseInt(level);
                // 如果满足,则设置
                return Tools._InArray(level+'',['0','1','2','3']) ? level : QRErrorCorrectLevel.H;
            }else{
                // 如果设置了 logo 则选用最大的 容错级别
                if(Tools._IsString(logo) && !Tools._IsEmpty(logo)){
                    return QRErrorCorrectLevel.H;
                }else if(Tools._IsString(text)){
                    // 对于内容少的QrCode，增大容错率
                    if(text.length > 76){
                        return QRErrorCorrectLevel.L;
                    }else if(text.length > 36){
                        return QRErrorCorrectLevel.M;
                    }else if(text.length > 16){
                        return QRErrorCorrectLevel.Q;
                    }else{
                        return QRErrorCorrectLevel.H;
                    }
                }else{
                    return QRErrorCorrectLevel.H;
                }
            }
        }else{
            return QRErrorCorrectLevel.H;
        }
    }

    /**
     * 校验二维码配置信息
     *
     * @private
     * @static
     * @param {*} options
     * @returns {(WQRCodeOptions|any)}
     * @memberof WQRCode
     */
    private static _CheckOptions(options:any):WQRCodeOptions|any{
        // 定义一个默认的配置
        let defualtOptions:any = {
            // "width":256,
            // "height":256,
            "size":256,
            "correctLevel": WQRCode._CheckCorrectLevel(null),
            // "background": '#ffffff',
            // "foreground": '#000000',
        };
        // 保证必须时对象
        if(Tools._IsObject(options)){
            // 拿到尺寸
            let size = Tools._IsNull(options.size) ? 256 : options.size;
            // 保证必须是数字
            size = isNaN(size) ? 256 : parseInt(size);
            
            // 如果传入了设置,将内容进行合并
            defualtOptions = Tools._MergeObject(defualtOptions,{
                "width":size,
                "height":size,
                "correctLevel":WQRCode._CheckCorrectLevel(options)
            },options);
            
        }
        // 返回合并的结果
        return defualtOptions;
    }

    /**
     * 生成 canvas
     *
     * @returns {Promise<HTMLCanvasElement>}
     * @memberof WQRCode
     */
    toCanvas():Promise<HTMLCanvasElement>{
        // 返回一个 Promise 对象
        return promisify(function(options:WQRCodeOptions,resolve:(result:any)=>void){
            // 整一个设定好的画布
            const canvas = document.createElement('canvas');
            // 解构赋值,拿到尺寸和logo
            let {el,size,logo}= options;
            canvas.width = size;
            canvas.height = size;
            // 拿到画布的上下文对象
            const ctx = canvas.getContext('2d');
            // 有无logo,都需要画的二维码
            ctx.clearRect(0,0,size,size);
            ctx.rect(0,0,size,size);
            // 将原来的canvas作为底板二维码
            ctx.fillStyle = ctx.createPattern(QRCode.c(options),'no-repeat');
            ctx.fill();

            /**
             * 下面有几种情况:
             * 1. 有无挂载元素 el 
             *  1.1 无挂载,我们就无需挂载
             *  1.2 el 的类型 字符串[#id .class tag[a,p](标签)], dom(元素)
             * 2. 有无传入 logo
             *  2.1 无传入,我们不管它
             *  2.2 logo 的类型 字符串[path,base64], dom(元素)
             */


            // 有无元素
            if(!Tools._IsNull(el)){
                // 通过 Q 函数拿到挂载二维码的 元素节点
                let elDiv:Element = Q(el).els[0]; // 拿到第一个元素,其他的不管
                // 创建画 logo 挂载及回调
                createDrawLogo(ctx,size,logo)(elDiv,canvas)(resolve);
            }else{
                // 创建logo,回调,不用挂载
                createDrawLogo(ctx,size,logo)(null,canvas)(resolve); 
            }

        })(this._options);
    }


    /**
     * 生成二维码图片
     *
     * @returns {Promise<HTMLImageElement>}
     * @memberof WQRCode
     */
    toImage():Promise<HTMLImageElement>{
        let that = this;
        return promisify(function(options:WQRCodeOptions,resolve:(result:any)=>void){
            // 提取 el 出来
            let {el,size} = options;
            // 删除 el
            delete options.el;
            // 然后生成 canvas
            that.toCanvas().then(function(canvas:HTMLCanvasElement){
                // 创建一个图片
                let ImageCanvas:HTMLImageElement = new Image();
                // 设置宽高
                ImageCanvas.width = size;
                ImageCanvas.height = size;
                // 绑定图片
                ImageCanvas.src = canvas.toDataURL();
                // 判断是否有元素
                if(!Tools._IsNull(el)){
                    // 拿到该元素挂载节点
                    let elDiv = Q(el).els[0];
                    elDiv.innerHTML = '';
                    elDiv.appendChild(ImageCanvas);
                    // 发送出去
                    resolve(ImageCanvas);
                }else{
                    // 发送出去
                    resolve(ImageCanvas);
                }
            });
        })(this._options);
    }

    /**
     * 下载二维码
     * 
     * 这个下载函数,请在toImage().then(()=>{这里使用})
     *
     * @param {HTMLImageElement} QrcodeImage
     * @param {string} [name]
     * @memberof WQRCode
     */
    download(QrcodeImage:HTMLImageElement,name?:string):void{
        // 创建一个a便签
        let link:HTMLAnchorElement = (Q.c('a') as HTMLAnchorElement);
        link.download = Tools._IsString(name) ? name : 'image';
        link.href = Tools._IsElement(QrcodeImage) ? QrcodeImage.src : '';
        link.dispatchEvent(new MouseEvent('click'));
    }
}