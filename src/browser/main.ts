
// 引入 原型类
import {BrowserClass} from './src/Index';

// 引入 实例类 (此类已被 new 主要是用在 SDK 内部使用)
import {Browser} from './src/Private';

// 导出提供使用
export {
    BrowserClass,
    Browser
}