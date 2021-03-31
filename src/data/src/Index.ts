import {Tools} from '../lib/Index';
import {WIndexedDB} from './WIndexedDB';
import {DB} from './DB';

import {get,set} from './Idb';

/**
 * 这个类是模仿 dexie.js 使用简单地处理前台的数据
 *
 * @export
 * @class WData
 */
export class WData{

    /**
     * 所有的DB数据库实例对象
     *
     * @private
     * @type {{[key:string]:WIndexedDB}}
     * @memberof WData
     */
    private _DBs:{[key:string]:WIndexedDB}={};


    

    constructor(){

    }

    /**
     * 创建一个 DB 数据库实例
     *
     * @param {string} dbname
     * @returns {WIndexedDB}
     * @memberof WData
     */
    create(dbname:string):WIndexedDB{
        // 正确传入
        if(Tools._IsString(dbname) && !Tools._IsEmpty(dbname)){
            // 如果存在则拿出原来的实例
            if(!Tools._IsNull(this._DBs[dbname])){
                // 把存在的直接返回
                return this._DBs[dbname];
            }else{
                console.log(dbname);
                
                // 创建
                let db:WIndexedDB = new WIndexedDB(dbname);
                // 记录
                this._DBs[dbname] = db;
                // 返回
                return db;
            }
        }
        // 返回一个null
        return null;
    }



    public build(dbname:string):DB{
        return new DB(dbname);
    }

    

    




    public set(key:string,value:any){
        return set(key,value);
    }

    public get(key:string){
        return get(key);
    }
}