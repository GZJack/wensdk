
import {Tools} from '../lib/Index';
import {DB} from './DB';




/**
 * 对应生成的 store 实例
 *
 * @export
 * @class WStore
 */
export class WStore{ 
    
    private _db:DB;
    private _fields:string;
    private _table:string;

    constructor(table:string,fields:string,db:DB){
        this._table = table;
        this._fields = fields;
        this._db = db;
    }


    /**
     * 这是一个使用事务属性
     *
     * @readonly
     * @type {WStore}
     * @memberof WStore
     */
    get t():WStore{
        return this;
    }

    request(WSuccessCB:(DB:IDBDatabase)=>void,WErrorCB:(WError:DOMException)=>void):void{
        // 统一执行一个该函数,后就能拿到真实的 DB 
        return this._db.start(WErrorCB,()=>{
            let Store = null;
            // 是使用事务还是使用普通
            if(true){
                let transaction = this._db._DB.transaction([this._table], 'readwrite');
                
            }else{
                
            }
            WSuccessCB(this._db._DB);
        })
    }


    add(value:any,key?:string):Promise<void|DOMException>{
        // 返回一个Promise对象
        return new Promise((resolve:()=>void,reject:(WError:DOMException)=>void)=>{
            this._db.start(reject,()=>{
                // 正确

                let Request = this._db._DB.transaction([this._table], 'readwrite')
                .objectStore(this._table)
                .add(value);

                Request.onsuccess = function (event) {
                    console.log('数据写入成功');

                    resolve();
                };

                Request.onerror = function (event) {
                    console.log('数据写入失败');
                    reject(Request.error);
                }
                
            })
        });
    }
}