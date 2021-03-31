
import {BrowserClass} from './Index';

// 供内部SDK使用

class PrivateBrowser extends BrowserClass{
    /**
     * Creates an instance of PrivateBrowser.
     * @memberof PrivateBrowser
     */
    constructor(){
        super(); // 执行父类
    }
}

// 暴露到SDK内部使用
export let Browser = new PrivateBrowser();