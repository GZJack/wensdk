import {Tools} from '../lib/Index';


export class Validate{

    private _Rules:{[key:string]:string};

    private _Scenes:{[key:string]:string[]};

    private _Messages:{[key:string]:string};

    private _Datas:{[key:string]:string};

    /**
     * Creates an instance of Validate.
     * @param {{[key:string]:string}} rules
     * @param {{[key:string]:string}} messages
     * @memberof Validate
     */
    constructor(rules:{[key:string]:string},messages:{[key:string]:string},scenes:{[key:string]:string[]},datas:{[key:string]:string}){

    }

    public rules(rules:{[key:string]:string}|string):Validate{
        // 如果是字符串
        if(Tools._IsObject(rules)){

        }else if(Tools._IsString(rules)){
            
        }
        return this;
    }

    public scenes():Validate{
        return this;
    }

    public messages():Validate{
        return this;
    }

    public datas():Validate{
        return this;
    }

    public check():boolean{
        return true;
    }
}