import {Crypto} from './src/Index';

// 这个是用于 SDK 内部使用的,避免 new 太多次
const cyt:Crypto = new Crypto();

// 导出
export {
    // 爆出未 new 用来挂载到 wen 上
    Crypto,
    cyt
}