
import {Wen} from './uglity/main'



// declare global {
//     interface Window {
//         Wen: Wen;
//     }
// }


// 挂载window上
//(window as any).Wen = Wen;


var wen = new Wen();

(window as any).wen = wen;

wen.foryou('666');