
import {CallYou} from './fun';

import {Tools} from './Tools';

import {Test} from './test'
 


var Obj = {
    name:'我们的999',
    'nini':'you 000',
    _my:'3333',
    r:777
};

export class Wen extends Test{
    public name:string = 'zhangsan';
    private _sex:string = '男';
    private static _age:number = 18;

    private _config:object;


    protected wode:string = '#### 666';


    protected _EEE:string = '&&&& 000';

    constructor(){
        super();
    }

    config(config:{name:string,sex:any,age:number}){
        this._config = config;

        console.log(config.name,config.sex,config.age);



        console.log(this.wode,'%%%%%%%%',this._EEE,'$$$$$$$$',Obj);
        


        var WWW = {
            a:123,
            _b:456,
            "rrrt":'eeee'
        };

        WWW.a = 666;


        console.log(WWW,'000000000000000000000000000000000000000000000000000000000000000');
        
        
    }

    static _setName(){
        console.log('设置了',Obj._my,Obj.r,Obj.nini);
        return CallYou('999');
    }

    foryou(msg:string){

        this.config({
            name:'12321231',
            "sex":7777,
            "age":155
        });

        if(Tools.IsString(msg)){
            console.log('is string');
            
        }
        return CallYou(msg);
    }
}