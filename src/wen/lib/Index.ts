
// 本项目 引入依赖的库,并暴露到当前项目里使用
import {Tools,ToolsStaticClass,UriClass} from '../../tools/main';

// 引入二维码类库
import {Qrcode,QrcodeConfig} from "../../qrcode/main";

// 引入请求类
import {Http} from '../../http/main';

// 引入加密类
import {Crypto} from '../../crypto/main';

// 引入缓存
import {Cache} from '../../cache/main';

// 引入数据data类,本地缓存
import {WData} from '../../data/main';

// 浏览器解析判断
import {BrowserClass} from '../../browser/main';

// 条形码
import {Barcode,BarcodeOptions,WBarCode} from '../../barcode/main';

// 配置实例
import {Config} from '../../config/main';

// 本地 cookie
import {Cookie} from '../../cookie/main';

// 扩展 vuex 状态对象
import {Store} from '../../store/main';

// 暴露到当前项目里使用
export {
    // 工具
    Tools,ToolsStaticClass,UriClass,
    // 二维码
    Qrcode,QrcodeConfig,
    // 请求
    Http,
    // 加密
    Crypto,
    // 缓存
    Cache,
    // 本地数据
    WData,
    // 条形码
    Barcode,BarcodeOptions,WBarCode,
    // 浏览器信息
    BrowserClass,
    // 配置
    Config,
    // cookie
    Cookie,
    // vuex 扩展
    Store
};