
import {Tools} from '../lib/Index';

import {WStores,promisify} from './WStores123'


/**
 * 实现简单封装 indexedDB 
 *
 * @export
 * @class WIndexedDB
 */
export class WIndexedDB{
    
    /**
     * 数据库实例
     *
     * @private
     * @type {IDBFactory}
     * @memberof WIndexedDB
     */
    private _WIndexedDb:IDBFactory=null;

    /**
     * 数据库请求实例
     *
     * @private
     * @type {IDBOpenDBRequest}
     * @memberof WIndexedDB
     */
    private _RequestDB:IDBOpenDBRequest=null;


    private _DbName:string='';

    private _Version:number=1;

    private _DBData:IDBDatabase=null;

    private _Store:IDBObjectStore=null;


    private _Stores:{[key:string]:WStores}={};

    private _DB:Promise<IDBDatabase>;

    /**
     * Creates an instance of WIndexedDB.
     * @memberof WIndexedDB
     */
    constructor(dbname:string){

        
        this._DbName = dbname;
        
        // this._RequestDB.addEventListener('upgradeneeded',(ev:IDBVersionChangeEvent)=>{
        //     this._DB = this._RequestDB.result;
        //     console.log(2,ev);
        // })
    }



    getStore(table:string){
        this._DB = new Promise((resolve:(DB:IDBDatabase)=>void,reject:(DB:DOMException)=>void)=>{
            // 赋值实例
            let _WIndexedDb = WIndexedDB._getIndex();
            // 打开一个数据库
            let _RequestDB = _WIndexedDb.open(this._DbName,1);
            // 错误
            _RequestDB.onerror = () => reject(_RequestDB.error);
            // 成功
            _RequestDB.onsuccess = () => resolve(_RequestDB.result);
            // 挂载
            _RequestDB.onupgradeneeded = () => {
                _RequestDB.result.createObjectStore(table);
            }
        })
    }


    // get abc(){
    //     let that = this;
    //     return {
    //         add(obj){
    //            return that._DB.then((DB:IDBDatabase)=>{
    //                 return new Promise((resolve:(DB:IDBDatabase)=>void,reject:(DB:DOMException)=>void) => {

    //                 }
    //             })
    //         }
    //     }
    // }


    start(table:string){
        return promisify((callback:(r:any,e:any)=>void)=>{
            // 如果存在了实例
            if(this._RequestDB){
                callback(this._RequestDB,null);
            }
            // 赋值实例
            this._WIndexedDb = WIndexedDB._getIndex();
            // 打开一个数据库
            this._RequestDB = this._WIndexedDb.open(this._DbName,this._Version);

            console.log('数据库中',this._RequestDB);
            

            // 监听链接成功或失败
            this._RequestDB.addEventListener('error',(ev:Event)=>{
                callback(null,ev);
            });
            this._RequestDB.addEventListener('success',(ev:Event)=>{
                
                
            });

            this._RequestDB.addEventListener('upgradeneeded',(ev: IDBVersionChangeEvent)=>{
                // console.log(1,ev);
                // // let a:IDBOpenDBRequest
                // this._DB = this._RequestDB.result;

                // let request:IDBRequest<any>|any = ev.target;
                // console.log(this._DB,request.result);
                
                // let _Stores = this._DB.createObjectStore(table,{autoIncrement:true});
                // console.log('数据库中',_Stores);
                // callback(_Stores,null);
            })
        })(); 
    }

    db(dbname:string):Promise<IDBDatabase|IDBObjectStore|DOMException>{
        // 执行返回一个 Promise 对象
        return promisify((callback:(WDB?:IDBDatabase,WError?:DOMException)=>void)=>{

            // console.log('1 是');
            
            // // 赋值实例
            this._WIndexedDb = WIndexedDB._getIndex();
            // // 打开一个数据库
            let _RequestDB = this._RequestDB = this._WIndexedDb.open(this._DbName,this._Version);
            // // 错误
            _RequestDB.onerror = () => callback(null,_RequestDB.error);
            // // 成功
            _RequestDB.onsuccess = () => {
                this._DBData = _RequestDB.result;
                callback(_RequestDB.result,null)
            };
            // _RequestDB.onsuccess = function(e:any){
            //     console.log('成功了',this);


            //     let db = e.target.result; 

            //     if (!db.objectStoreNames.contains('abc')){
            //         let co = db.createObjectStore('abc',{'id':100});

            //         console.log(co);
                    

            //         co.add({a:123})
            //     };

            //     // if (!db.objectStoreNames.contains('iam')){
            //     //     co1=db.createObjectStore('iam');
            //     // }; 
                
            //     //this.result.createObjectStore('abc');
            //     // callback(this.result,null)
            // };
            // // 挂载
            _RequestDB.onupgradeneeded = function(event:any){
                // console.log('2 是',this);
                // // this.result.createObjectStore('abc');

                // console.log("openDb.onupgradeneeded",evt);

                let db = event.target.result;
                console.log('数据库打开成功1');
      
                if (!db.objectStoreNames.contains('person')) {
                    let objectStore = db.createObjectStore('person', { keyPath: 'id' });

                    objectStore.createIndex('name', 'name', { unique: true });
                }

                // var store = evt.target.result.createObjectStore('abc',{ keyPath: 'id', autoIncrement: true });
                // store.createIndex('name', 'name', { unique: true });
                // store.createIndex('title', 'title', { unique: false });
                // store.createIndex('year', 'year', { unique: false });


                // callback(this.result,null)


                //   
                //     
                //         DB_STORE_NAME, { keyPath: 'id', autoIncrement: true });

                //     store.createIndex('biblioid', 'biblioid', { unique: true });
                //     store.createIndex('title', 'title', { unique: false });
                //     store.createIndex('year', 'year', { unique: false });
                //     };
            }

            // //_RequestDB.result.createObjectStore('abc');


            // let _WIndexedDb = WIndexedDB._getIndex();
            // 打开一个数据库
//   var request = _WIndexedDb.open("toDoList", 4);
 
  // This handler is called when a new version of the database
  // is created, either when one has not been created before
  // or when a new version number is submitted by calling
  // window.indexedDB.open().
  // This handler is only supported in recent browsers.

//  request.onsuccess = function(event:any){
//     var db:IDBDatabase = event.target.result;

//     db.onerror = function(event:any) {
//         //   note.innerHTML += '<li>Error loading database.</li>';
//         };
    
        
//         db.onversionchange = function(ev){
//             console.log(ev);
            
//         }
    
    
//         callback(db,null)
//  }


//   request.onupgradeneeded = function(event:any) {
//     var db:IDBDatabase = event.target.result;
    
//     db.onerror = function(event:any) {
//     //   note.innerHTML += '<li>Error loading database.</li>';
//     };

    
//     db.onversionchange = function(ev){
//         console.log(ev);
        
//     }


//     callback(db,null)

//     // Create an objectStore for this database
    
//     // var objectStore = db.createObjectStore("abc", { keyPath: "taskTitle" });
    
//     // // define what data items the objectStore will contain
    
//     // objectStore.createIndex("hours", "hours", { unique: false });
//     // objectStore.createIndex("minutes", "minutes", { unique: false });
//     // objectStore.createIndex("day", "day", { unique: false });
//     // objectStore.createIndex("month", "month", { unique: false });
//     // objectStore.createIndex("year", "year", { unique: false });

//     // objectStore.createIndex("notified", "notified", { unique: false });
    
//     // note.innerHTML += '<li>Object store created.</li>';
//   };
        })();
    }



    version(version:number):WIndexedDB{
        return this;
    }


    table(table:string,fileds?:string):Promise<IDBDatabase|IDBObjectStore|DOMException>{
        return promisify((callback:(WStore?:IDBObjectStore,WError?:DOMException)=>void)=>{
            // 先拿到db
            this.db(this._DbName).then((WDB:IDBDatabase)=>{
                console.log('3 是',WDB);

                // WDB.createObjectStore('aa',{keyPath:'id'})

                // var objectStore:IDBObjectStore = WDB.createObjectStore(table, { keyPath: "id" });

               

                    // objectStore.createIndex("hours", "hours", { unique: false });
                    // objectStore.createIndex("minutes", "minutes", { unique: false });
                    // objectStore.createIndex("day", "day", { unique: false });
                    // objectStore.createIndex("month", "month", { unique: false });
                    // objectStore.createIndex("year", "year", { unique: false });

                    // objectStore.createIndex("notified", "notified", { unique: false });

                // // 拿到了 DB
                // //WDB.createObjectStore(table);
                // console.log('4 是');
                // const transaction = WDB.transaction(table,'readwrite');

                var trans1:IDBTransaction = this._DBData.transaction(["person"], "readwrite");

                trans1.oncomplete = function(ev){
                    console.log(ev);
                    
                }
                // var trans2 = WDB.transaction(["foo1"], "readwrite");
                // var objectStore2 = trans2.objectStore("foo")
                var objectStore1 = trans1.objectStore("person")
                // objectStore2.put("2", "key");
                objectStore1.add({name:'zhansan'});
                //const transaction = DB.transaction(this.storeName, type);
                // transaction.oncomplete = () => callback(transaction.objectStore(table),null);
                // transaction.onabort = transaction.onerror = () => callback(null,transaction.error);

                // callback(objectStore,null)

            })
        })();
    }



    add(value:any){
        return promisify((callback:(WResult?:null,WError?:DOMException)=>void) => {
            // 拿到 Store
            let Store = this.table('abc').then((WStore:IDBObjectStore)=>{
                console.log('5 是');
                let re = WStore.add(value);
                callback(null,null);
            }).catch((WError:DOMException)=>{
                callback(null,WError);
            })
        })();
    }


    stores(stores:object|any):WIndexedDB{
        let that = this;
        // 必须是对象
        if(Tools._IsObject(stores)){
            Object.keys(stores).forEach((key:string)=>{
                Object.defineProperty(this,key,{
                    get(){
                        if(that._Stores[key]){
                            return that._Stores[key];
                        }else{
                            let store:WStores = new WStores(that,key);
                            that._Stores[key] = store;
                            return store;
                        }
                        
                    },
                    set(newval){
                        // stores[key] = newval;
                    }
                })
            });
        }
        return this;
    }

    /**
     * 拿到数据库实例
     *
     * @private
     * @static
     * @returns {IDBIndex}
     * @memberof WIndexedDB
     */
    private static _getIndex():IDBFactory{
        // 做不同浏览器的兼容模式
        return (window as any).indexedDB || (window as any).mozIndexedDB || (window as any).webkitIndexedDB || (window as any).msIndexedDB;
    }


    // public table(table:string):WIndexedDB{
    //     // 
    //     this._TableName = table;
    //     setTimeout(()=>{
    //         this._Store = this._DB.createObjectStore(table,{autoIncrement:true});
    //         this._Store.add({
    //             name:'张三',
    //             age:18
    //         })

    //     },2000)
        

        
    //     return this;
    // }



    // public add(obj:any){
    //     //this._Store.add(obj)
    // }





}