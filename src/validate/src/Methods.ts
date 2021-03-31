
import {Tools} from '../lib/Index';

interface Fn{
    (value:string,params:string,alias:string,message:string):boolean;
}

/**
 * 所有默认的验证方法
 *
 * @export
 * @class Methods
 */
export class Methods{

    private static _IsString(value:string):boolean{
        return Tools._IsString(value);
    }

    static IsRequire(value:string):boolean{
        return !Tools._IsEmpty(value);
    }

    static IsLength(value:string,params:string,alias:string,message:string):boolean{

       
        return true;
    }
}