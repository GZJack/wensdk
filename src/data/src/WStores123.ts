
import {Tools} from '../lib/Index';

import {WIndexedDB} from './WIndexedDB';

/**
 * 避免重复的声明 Promise 回调函数
 *
 * @export
 * @param {Function} fn
 * @returns {Function}
 */
export function promisify(fn:Function):(options?:any)=>Promise<IDBDatabase|IDBObjectStore|DOMException>{
    // 返回一个函数
    return function():Promise<IDBDatabase|IDBObjectStore|DOMException>{
       // 拿到原来的参数,然后在后面传入
       let args:Array<any> = Tools._ToArrayFrom(arguments); // 将类数组转成普通数组
       // 返回一个 Promise 对象
       return new Promise((resolve:(result:IDBDatabase|IDBObjectStore)=>void,reject:(error:DOMException)=>void)=>{
           // 往里再添加一个回调函数,当传入的参数来决定失败与否,这里没有失败
           args.push((result:IDBDatabase|IDBObjectStore,error:DOMException)=>{
               if(result){
                    resolve && resolve(result);
               }else{
                    reject && reject(error);
               }
               
           });
           fn.apply(null,args);
       });
    }
}


export class WStores{
    
    private _Stores:IDBObjectStore;

    private _Db:WIndexedDB;

    private _Table:string;

    constructor(vm:WIndexedDB,table:string){
        this._Db = vm;
        this._Table = table;
    }

    // c(){
    //     return promisify((callback:(r:any,e:any)=>void)=>{
    //         this._Stores = database.createObjectStore(table,{autoIncrement:true});
    //     })();
    // }


    add(datas:object){
        // 返回一个Promise对象
        return promisify((callback:(r:any,e:any)=>void)=>{
             // 保证所有的 Promise 添加完成后
             Promise.all([
                this._Db.start(this._Table)
                // 保证
                ]).then((_Stores:IDBObjectStore|any)=>{


                    console.log('回调函数中',_Stores);
                    

                    // let dbRequest:IDBRequest<IDBValidKey> = _Stores.add(datas);

                    // dbRequest.addEventListener('error',(ev:Event)=>{
                    //     callback(null,ev);
                    // })

                    // dbRequest.addEventListener('success',(ev:Event)=>{

                    //     callback(ev,null);
                    // })

                }).catch((error)=>{
                    callback(null,error);
                })
        })();
    }
}