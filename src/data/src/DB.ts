import {Tools} from '../lib/Index';
import {WStore} from './WStore';


/**
 * 静态类 用于挂载所有的 store 实例
 *
 * @class WStores
 */
class WStores{
    /**
     * 挂载 store 对象的
     *
     * @static
     * @type {{[key:string]:WStore}}
     * @memberof WStores
     */
    public static _Stores:{[key:string]:WStore}={};
}


/**
 * DB 类
 *
 * @export
 * @class DB
 */
export class DB{
    /**
     * DB 实例
     *
     * @public
     * @type {IDBDatabase}
     * @memberof DB
     */
    public _DB:IDBDatabase=null;

    /**
     * 数据库名称
     *
     * @private
     * @type {string}
     * @memberof DB
     */
    private _DbName:string='';

    /**
     * 数据库的版本号
     *
     * @private
     * @type {number}
     * @memberof DB
     */
    private _Version:number=1;


    /**
     * 字段名对象
     *
     * @private
     * @type {{[key:string]:string}}
     * @memberof DB
     */
    private _Stores:{[key:string]:string}|any={};


    /**
     * Creates an instance of DB.
     * @param {string} dbname
     * @memberof DB
     */
    constructor(dbname:string){
        this._DbName = dbname;
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

    /**
     * 设置
     *
     * @param {number} version
     * @returns {DB}
     * @memberof DB
     */
    public version(version:number):DB{
        // 必须是数字,取绝对值,并且四舍五入
        this._Version = Tools._IsNumber(version) ? Math.round(Math.abs(version)) : 1;
        // 返回当前实例
        return this;
    }

    /**
     * 设置 store 仓库
     *
     * @param {{[key:string]:string}} stores
     * @memberof DB
     */
    public stores(stores:{[key:string]:string}){        
        // 保证this
        let that:any = this;
        // 保证命名不能是当前实例上的属性
        let names:Array<string> = Object.keys(this);
        // 必须是对象
        if(Tools._IsObject(stores)){
            // 一次 stores 就会合并一次
            this._Stores = Tools._MergeObject(this._Stores,stores);
            // 遍历设置劫持
            Object.keys(stores).forEach((key:string)=>{
                // 在该实例上做劫持
                Object.defineProperty(that,key,{
                    // 只做获得劫持,设置劫持不做
                    get(){
                        // 如果存在该实例直接返回
                        if(WStores._Stores[key]){
                            return WStores._Stores[key];
                        }else{
                            // 不存在,有可能用户会设置成到当前实例上函数名及属性
                            if(Tools._InArray(key,names)){
                                return that[key];
                            }else{
                                // 创建一个新的 store
                                let store:WStore = new WStore(key,stores[key],that);
                                // 记录起来这个 store
                                WStores._Stores[key] = store;
                                // 返回 store 
                                return store;
                            }
                        }
                        
                    }
                })
            });
        }
    }

    


    public start(WErrFn:(WError:DOMException)=>void,WSucFn:()=>void):void{

        // 如果已经有了 db
        if(this._DB){
            return WSucFn();
        }

        // 拿到数据库实例
        let WIndexedDB:IDBFactory = DB._getIndex();
        // 打开数据库
        let Request:IDBOpenDBRequest = WIndexedDB.open(this._DbName,this._Version);

        let that = this;
        // 监听
        Request.onerror = function(even:Event|any){
            console.log('数据库打开报错');
            WErrFn(Request.error);
        }

        Request.onsuccess = function(even:Event|any){
            console.log('数据库打开成功');
            that._DB = Request.result;
            WSucFn();
        }

        // 版本变化时升级时,触发,创建数据库时,也会触发
        Request.onupgradeneeded = function(even:Event|any){
            // 拿到 db 实例
            let DB:IDBDatabase = even.target.result;
            console.log('数据库打开成功1');
            // 如果创建表时发生错误
            DB.onerror = function(even_error:Event|any){
                // 先监听,但是啥也不做
            }
            // 如果版本发生变化
            DB.onversionchange = function(even_version:IDBVersionChangeEvent){
                // 先监听,但是啥也不做 
            }
            // 最后遍历添加表
            Object.keys(that._Stores).forEach((store_name:string)=>{
                // 不存在则添加 
                if (!DB.objectStoreNames.contains(store_name)){
                    // 拿到所有的字段值
                    let fields = that._Stores[store_name];
                    let objectStore:IDBObjectStore=null;
                    // 如果字段为空
                    if(fields===''){
                        // 默认配置
                        objectStore = DB.createObjectStore(store_name,{autoIncrement:true});
                    }else{
                        objectStore = DB.createObjectStore(store_name, {keyPath: 'id'});

                        // objectStore.createIndex('name','name',{unique:true});
                    }
                    
                }
            })
            
        }

    }


    add(value:any):Promise<void>{
        return new Promise((resolve:()=>void,reject:(WError:DOMException)=>void)=>{

            this.start(reject,()=>{
                // 正确

                let Request = this._DB.transaction(['person'], 'readwrite')
                .objectStore('person')
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
        })
    }
}