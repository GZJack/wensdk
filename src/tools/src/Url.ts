


import {Tools} from '../main'




/**
 * 基类,用于 WLocation 继承的一些静态方法
 *
 * @class WLBase
 */
class WLBase{

    /**
     * 初始化参数
     *
     * @protected
     * @static
     * @param {WLocation} WVM
     * @memberof WLBase
     */
    protected static _init(WVM:WLocation):void{
        // 给query进行初始化赋值
        let QueryObject:object = Url._QueryToObject(WVM.search);
        // 挂载
        WVM.query = Tools._IsObject(QueryObject) ? QueryObject : {};
    }

    /**
     * 设置查询参数
     *
     * @protected
     * @static
     * @param {WLocation} WVM
     * @param {(object|any)} ObjectData
     * @memberof WLBase
     */
    protected static _SetQuery(WVM:WLocation,ObjectData:object|any):void{
        if(Tools._IsObject(ObjectData) && Tools._IsObject(WVM.query)){
            // 转数组数组遍历
            Object.keys(ObjectData).forEach((key:string)=>{
                // 每遍历一次,都先从属性上拿
                let NewData:any = WVM.query;
                // 将key转成数组进行操作
                let Keys:Array<any> = key.split('.');
                // 在继续遍历
                Keys.forEach((name:string,index:number)=>{
                    // 不存在则添加
                    let IsLast:boolean = Keys.length === (index + 1);
                    // 如果是最后一个了就需要赋值
                    if(IsLast){
                        NewData[name] = ObjectData[key];
                    }else{
                        // 如果是
                        if(NewData[name] === undefined){
                            // 如果是下一个字符串
                            if(isNaN(Keys[index+1])){
                                NewData[name] = {};
                            }else{
                                NewData[name] = [];
                            }
                        }
                    }
                    // 最后重新赋值
                    NewData = NewData[name];
                });
            })
        }
        
    }


    /**
     * 统一处理新增和更新
     *
     * @protected
     * @static
     * @param {WLocation} WVM
     * @param {(string|object)} name
     * @param {*} [value=null]
     * @param {boolean} [IsAdd=true]
     * @memberof WLBase
     */
    protected static _AddUpdate(WVM:WLocation,name:string|object,value:any=null,IsAdd:boolean=true):void{
        // 必须保证存在
        let Datas:object|any = {};
        if(Tools._IsString(name)){
            Datas[(name as string)] = value;
        }else if(Tools._IsObject(name)){
            Datas = name;
        }
        // 遍历添加及修改
        Object.keys(Datas).forEach((key:string)=>{
            // 如果是新增
            if(IsAdd){
                // 就必须是不存在的
                if(!WVM.has(key)){
                    WVM.set(key,Datas[key]);
                }
            }else{
                // 必须是存在的才能更新
                if(WVM.has(key)){
                    WVM.set(key,Datas[key]);
                }
            }
        });
    }
}


/**
 * 自定义类型,实例上会有一些有用的方法
 *
 * @export
 * @class WLocation
 * @extends {WLBase}
 */
export class WLocation extends WLBase{
    /**
     * 原始地址,含协议头和端口,(80,433会隐藏端口)
     *  
     * http://localhost:8081
     * http://wen.io
     * 
     * @type {string}
     * @memberof WLocation
     */
    public origin:string = '';

    /**
     * 协议头,不含 // 双斜线
     * 
     * http:
     * https:
     * 
     * @type {string}
     * @memberof WLocation
     */
    public protocol:string = '';

    /**
     * 主机名+端口(80,433会隐藏端口)
     *  
     * localhost:8081
     * wen.io
     * 
     * @type {string}
     * @memberof WLocation
     */
    public host:string = '';
    
    /**
     * 主机名
     * 
     * localhost
     * wen.io
     * 
     * @type {string}
     * @memberof WLocation
     */
    public hostname:string = '';

    /**
     * 端口(80,433会隐藏端口)
     * 
     * 8081
     * 
     * @type {string}
     * @memberof WLocation
     */
    public port:string = '';

    /**
     * 路径名,含文件名(?问号到端口的字符串)
     *
     * /index.html
     * /test/demo
     * / // 如果什么都没有,则会有一根斜线 /
     * 
     * @type {string}
     * @memberof WLocation
     */
    public pathname:string = '';

    /**
     * 参数段(?后面的参数,不含#锚点)
     * 
     * ?a=123&b=456
     * '' // 没有问号则为空
     *
     * @type {string}
     * @memberof WLocation
     */
    public search:string = '';

    /**
     * 锚点(#id_test) 没有锚点则为空
     * 
     * #id_test
     * '' // 没有井号则为空
     *
     * @type {string}
     * @memberof WLocation
     */
    public hash:string = '';

    /**
     * 完整路径,协议://主机名:端口(80,433隐藏前面的:)/路径?参数#锚点
     *
     * @type {string}
     * @memberof WLocation
     */
    public href:string = '';

    /**
     * 这是我们定义的,会将查询参数,转成对象形式
     * 
     * {a:123,b:456}
     * {}
     * 
     * @type {object}
     * @memberof WLocation
     */
    public query:object = {};


    /**
     * 获得整个链接地址
     *
     * @type {string}
     * @memberof WLocation
     */
    public url:string;



    /**
     * 是否对路由进行 decodeURI 解码
     *
     * @private
     * @type {boolean}
     * @memberof WLocation
     */
    private _IsDecode:boolean = false;


    /**
     * Creates an instance of WLocation.
     * @param {*} config
     * @memberof WLocation
     */
    constructor(config:any){
        super();
        // 开始遍历赋值
        Tools._ForEachSetObjectValue(this,config);
       

        // 执行初始化
        WLocation._init(this);
        
        
    }
    

    /**
     * 校验当前查询条件的属性是否存在
     *
     * @param {string} name
     * @returns {boolean}
     * @memberof WLocation
     */
    public has(key:string):boolean{
        if(Tools._IsString(name) && Tools._IsObject(this.query)){
            // 每遍历一次,都先从属性上拿
            let NewData:any = this.query;
            // 将key转成数组进行操作
            let Keys:Array<any> = key.split('.');
            // 我们一开始就假设有这个值
            let HasKeyValue:boolean = true;
            // 在继续遍历
            Keys.forEach((name:string)=>{
                // 如果不存在
                if(NewData[name] === undefined){
                    HasKeyValue = false;
                }
                // 再赋予新值,继续校验
                if(HasKeyValue){
                    NewData = NewData[name];
                }
            });
            // 最后返回结果
            return HasKeyValue;
        }else{
            return false;
        }
    }


    /**
     * 设置查询参数,存在则修改,不存在添加
     *
     * @param {(string|object)} name
     * @param {*} [value=null]
     * @returns {WLocation}
     * @memberof WLocation
     */
    public set(name:string|object,value:any=null):WLocation{
        // name 如果是字符串
        if(Tools._IsString(name)){
            let ObjData:object|any = {};
            ObjData[(name as string)] = value;
            WLocation._SetQuery(this,ObjData);
        }else if(Tools._IsObject(name)){
            WLocation._SetQuery(this,name);
        }
        // 返回当前实例
        return this;
    }


    /**
     * 添加查询条件,不存在才能添加,存在则不添加
     *
     * @param {(string|object)} name
     * @param {*} [value=null]
     * @returns {WLocation}
     * @memberof WLocation
     */
    public add(name:string|object,value:any=null):WLocation{
        // 统一处理
        WLocation._AddUpdate(this,name,value,true);
        // 返回当前实例
        return this;
    }

    /**
     * 更新查询添加,存在才能修改,不存在不能修改
     *
     * @param {(string|object)} name
     * @param {*} [value=null]
     * @returns {WLocation}
     * @memberof WLocation
     */
    public update(name:string|object,value:any=null):WLocation{
        // 统一处理
        WLocation._AddUpdate(this,name,value,false);
        // 返回当前实例
        return this;
    }

    /**
     * 只可以取值,不能获得值
     *
     * @readonly
     * @memberof WLocation
     */
    get Url(){
        // 进行拼接,
        let QueryString:string = '';
        // 必须是对象,且不为空
        if(Tools._IsObject(this.query) && !Tools._IsEmpty(this.query)){
            // 进行转化成字符串,并添加一个 ? 号
            QueryString = '?' + Url._QueryToString(this.query);
            // 是否对参数进行解密
            if(this._IsDecode){
                QueryString = decodeURI(QueryString);
            }else{
                QueryString = encodeURI(QueryString);
            }
        }
        // 最后拼接成合法的 Url 
        return `${this.protocol}//${this.host}${this.pathname}${QueryString}${this.hash}`;
    }

    
    /**
     * 对 路由进行 decodeURI 解码
     *
     * @readonly
     * @memberof WLocation
     */
    get decode(){
        this._IsDecode = true;
        // 返回当前实例
        return this;
    }

}



/**
 * 处理 url 的静态类
 *
 * @export
 * @class Url
 */
export class Url{
    
    

    /**
     * 创建 Url 会根据传入的 Url 解析成 Location 对象类型的一个对象
     * 
     * 1. 对象为引用赋值,我们只需要在这里面完成修改就可以了
     *
     * @static
     * @param {string} Uri
     * @returns {WLocation}
     * @memberof Url
     */
    public static _CreateQueryByUri(Uri:string):WLocation{
        // 将 uri 分别提取 
        return Url._ParseUrl(Uri);
    }


    /**
     * 这是专门提供给 Http 使用的
     *
     * @static
     * @param {string} BaseUrl
     * @param {string} Uri
     * @returns {WLocation}
     * @memberof Url
     */
    public static _CreateHttpQueryByBaseUrlUri(BaseUrl:string,Uri:string):WLocation{
        // 最终的 url
        let UrlString:string = '';
        // 首先判断 Uri 是否带有协议头
        if(/^[A-z]{2,5}\:\/\/.+/.test(Uri)){
            UrlString = Uri;
        }else{
            // 没有协议头的,再看看基础路由是不是为空
            if(Tools._IsString(BaseUrl) && !Tools._IsEmpty(BaseUrl)){
                // 对请求路由进行编码
                let RequestUriString:string = encodeURI(Uri);
                // 我们需要对 Uri 进行分割,提取 pathname query 即是 /a/b?type=json&
                let [RequestPathNameString,RequestQueryString]:string[] = ['',''];
                // 左边第一个 ? 作为 分割点, 左边为路径,右边为查询参数
                let SymbolIndex:number = RequestUriString.indexOf('?');
                // 如果等于 -1 即是没有参数
                if(SymbolIndex < 0){
                    // 无查询条件
                    RequestPathNameString = RequestUriString;
                }else{
                    // 路径
                    RequestPathNameString = RequestUriString.substring(0,SymbolIndex);
                    // 查询条件
                    RequestQueryString = RequestUriString.substring(SymbolIndex,RequestUriString.length);
                }

                // 需要将基础路由提取出来,利用对基础路由进行一次路由解析
                let BaseUrlParseUrl:WLocation = Url._ParseUrl(BaseUrl);
                // 对生成的解析出来的路由进行浅拷贝,并将 分割出来的路径名称进行重新设置合并, 主要是解决掉 ./a ./../a a/b/c 这一类的 Url
                let NewPathName:string = Url._SetPathName(RequestPathNameString,Tools._ToShallowCopyObject(BaseUrlParseUrl),true);
                // 最后是 (协议+主机名+端口) + 新的路径名 + 原有的查询条件 = 合并成请求的最终路径
                UrlString = BaseUrlParseUrl.origin + NewPathName + RequestQueryString;

                // console.log("新地址",RequestPathNameString,BaseUrlParseUrl,NewPathName,UrlString);
                
                // 最后将合并成的真实路径,进行最终的路由解析

            }else{
                UrlString = Uri;
            }
        }
        // 合并后进行生成
        return Url._ParseUrl(UrlString);
    }

    


    /**
     * 设置值,如果不符合则使用默认值
     *
     * @private
     * @static
     * @param {(string|undefined|any)} NewValue
     * @param {string} DefualtValue
     * @returns {string}
     * @memberof Url
     */
    private static _SetUrl(NewValue:string|undefined|any,DefualtValue:string):string{
        return NewValue && NewValue !== '' ? NewValue : DefualtValue;
    }


    /**
     * 根据情形的不同,对路径进行重新设置及定义
     * 
     * 已经测试合格
     *
     * @private
     * @static
     * @param {string} PathName
     * @param {*} NewLocation
     * @param {boolean} [IsHasNoProHost=false]
     * @returns {string}
     * @memberof Url
     */
    private static _SetPathName(PathName:string,NewLocation:any,IsHasNoProHost:boolean=false):string{

        // 如果返回的是 /
        if(PathName !== '/'){
            // 如果携带协议头或者携带了主机名的,我们就不处理
            if(!IsHasNoProHost){
                return PathName;
            }else{
                // 未带 / , 会默认是同级目录下进行的 
                let CurrentPathName:string = NewLocation.pathname;
                // 取出前面是不是带 . 点的
                let NewPathName:string = '';
                // 区分
                switch(true){
                    case /^\/?\.+/.test(PathName):
                        // 说明
                        // 1. 只带 . (一个开头) (当前访问地址: http://xx.xxx.com/aa/bb/index.html)
                        // 例子: ./a/b/c/test.js => http://xx.xxx.com/aa/bb/a/b/c/test.js
                        // 解释: 以当前访问地址最后作为文件名index.html的同级目录下的文件


                        // 2. 带两个 .. (两个) (当前访问地址: http://xx.xxx.com/aa/bb/index.html)
                        // 例子: ../a/b/c/test.js => http://xx.xxx.com/aa/a/b/c/test.js
                        // 解释: 两个点,多上了一级,与index.html文件的上一级目录

                        // 3. 带多一级的 ./../ 三个点的 (当前访问地址: http://xx.xxx.com/aa/bb/index.html)
                        // 例子和解释,结果是和带 .. 两个点的一致

                        // 4. 带多一级的 ../../ 四个点的 (当前访问地址: http://xx.xxx.com/aa/bb/index.html)
                        // 例子: ./a/b/c/test.js => http://xx.xxx.com/a/b/c/test.js
                        // 解释: 四个点的,多上了两级
                        
                        // 将当前的路劲取过来,并正则转成数组
                        let CurrentPathNameArray:Array<string> = CurrentPathName.match(/\/([^\/]*)/g);

                        // 如果第一个是 / 斜线 /../../ 是直接到网站根目录的
                        if(PathName.substr(0,1) === '.'){
                            // 将需要请求的路径,提取出数组 ['./','../','../'] 
                            let PathNameArray:Array<string> = PathName.match(/([\.]+)\//g);
                            
                            // 如果请求的数组长度大于当前的的时候 则 ['/'] ,不然就是小于等于,才进行处理
                            if(PathNameArray.length <= CurrentPathNameArray.length){
                                // 进行循环比对,并删除或清除当前的路径数组
                                PathNameArray.forEach((path:string)=>{
                                    // 当只有 ./a/b/test.js 起作用, ./../a/b/test.js 相当于 ../a/b/test.js 相当于上了一层,及去掉文件名
                                    if(path === './' && PathNameArray.length === 1){
                                        // ./ 清除一个文件名,即是当前目录
                                        CurrentPathNameArray[CurrentPathNameArray.length-1] = '/';
                                    }else{
                                        // ../ 清除一个目录,即是上一层目录
                                        CurrentPathNameArray.pop();
                                    }
                                });
                                // 如果 ../ 是需要多去掉一层的
                                if(PathNameArray[0] === '../'){
                                    // 再去掉一层,这样子就符合了
                                    CurrentPathNameArray.pop();
                                }
                            }else{
                                // 如果超过了,就不需要再处理
                                CurrentPathNameArray = ['/'];
                            }
                        }else{
                            // 类似 /../  /../../ 都是直接去到网站根目录下
                            CurrentPathNameArray = ['/'];
                        }
                        
                        // 满足正则条件进来的,就是有 ./ ../ /../../ 等字符串,所以我们最后得将这些 ../ ./ 去掉, 拿到剩余得部分进行拼接
                        PathName = PathName.replace(/\/?([\.]+)\//g,'');

                        // 再将当前路径数组,转为字符串
                        let CurrentPathNameString:string = CurrentPathNameArray.join('');

                        // 最后拼接成对应的路径,但是需要校验最后一个字符串是不是 / 斜线,没有则添加
                        NewPathName = (CurrentPathNameString.substr(-1) === '/' ? CurrentPathNameString : CurrentPathNameString + '/') + PathName;
                        break;
                    case PathName.substr(0,1) !== '/': // 如果首位没有 / 则进行添加
                        // 替换掉最后的文件名  /a/b/index.html  => 去掉 index.html, / 替换也是 => 还是 /
                        CurrentPathName = CurrentPathName.replace(/[^\/]*$/,'');
                        // 最后拼接上要访问的路径
                        NewPathName = CurrentPathName+PathName;
                        break;
                    default:
                        NewPathName = PathName;
                }
                // 返回新的路径
                return NewPathName;
            }
        }else{
            return '/';
        }
    }


    /**
     * 解析路由地址,返回一个 WLocation 对象
     *
     * @static
     * @param {string} Uri
     * @returns {WLocation}
     * @memberof Url
     */
    public static _ParseUrl(Uri:string):WLocation{
        // 保证 Uri 必须是字符串
        Uri = Tools._IsString(Uri) ? Uri : '';
        // 获得当前地址对象
        let WindowLocation:any = (window as any).location;
        // 浅拷贝获得 location 所有的值
        let NewLocation:any = Tools._ToShallowCopyObject(WindowLocation ? WindowLocation : {});

        // 首先 协议头: [a-zA-Z]
        // 冒号+反斜线: ://
        // 主机名: IPV4 、IPV6 、域名
        // 冒号+端口: :8080
        // 路径: /test 、./test 、../test 、./../test 、test/index.html 、index.html 、 / (这些一类都是路径,含文件名)
        // 查询: ?a=123&b[0]=1&b[1]=2 (?至#,中的部分)
        // 锚点: #id_test (#至\s的部分)

        // 情况分类
        // 带协议头完整路径
        // 例如1: http://www.baidu.com/test/index.html?a=123&b[0]=1&b[1]=2
        // 特点1: 含有(://)就代表是有主机名的
        // 例如2：//www.baidu.com/test/index.html?a=123&b[0]=1&b[1]=2
        // 特点2：含有(//),是有主机名称的,而是使用同域的协议头
        // 不带协议头,同域的相对路径
        // 例如1: www.baidu.com/test/index.html?a=123&b[0]=1&b[1]=2 、9000/index.html
        // 特点1：没有(://或//或:),(www.baidu.com 、9000)则都为路径
        // 例如2：index.html 、/index.html 、./index.html 、/
        // 特点2：均认为是路径
        // 例如3：:9000/index.html
        // 特点3：含有(:\d),则认为是含有端口的

        // 开始部分
        // 一:首尾要去掉空格换行,并进行编码
        Uri = encodeURI(Tools._Trim(Uri));
        // 二:一条正则取出所有对应的部分内容 ([^\/\:]+ 只支持IPV4和域名,暂时不支持IPV6)
        let UriMatchs:Array<string|number|undefined> = Uri.match(/^(([A-z]+\:)?(?=(\/\/)))?((?:(\/\/))([^\/\:]+))?(\:(\d{1,5})(?=[\/\s]))?([^\?]+)(\?[^\#]+)?(\#[^\s]+)?$/);
        // 长正则一次取出对应的内容
        // let UriMatchs:Array<string|number|undefined> = Uri.match(/^(?:([^\:\/]*\:)\/\/)?(?:(?:\/{2}|\s*)([^\:\/]*\.(?:com|cn|net|xyz|co|io|xin|top|cc|vip|shop|wang|info|org|tv|site|store|\d{1,3})))?(?:\:(\d+))?(\.*\/*[^\?\#]*)?(\?[^\#]*)?(\#[^\s]*)?$/);
    
        // 如果不符合,则会出现 UriMatchs = null
        if(Tools._IsNull(UriMatchs)){
            return Url._ParseUrl(''); // 返回一个空的链接生成
        }

        // 三:若缺失的部分,从当前域进行提取(如:协议头 、主机名 、端口)
        // es6 解构取值
        let [,,protocol,,,,hostname,,port,pathname,search,hash] = UriMatchs;
        

        // 定义一个 当前的路由地址 是否有携带协议头
        let HasNoProtocol:boolean = Tools._IsEmpty(protocol);
        // 是否携带了主机名
        let HasNoHostName:boolean = Tools._IsEmpty(hostname);

        // 如果没有设置协议头需要拿到当前的协议头及端口
        let SetPort:string = '';
        // 先看看原来的地址上有没有 协议头和主机名
        if(HasNoProtocol && HasNoHostName){
            SetPort = NewLocation.port;
        }
        
        // 校验并赋值默认值
        protocol = Url._SetUrl(protocol,NewLocation.protocol);
        // 主机名 主机名必须是正确的
        hostname = Url._SetUrl(((checkHostname:any) => {
            // 如果是字符串才进行判断
            if(Tools._IsString(checkHostname)){
                // 满足以下其中一种即可
                switch(true){
                    case Tools.IsDomain(checkHostname):
                    case Tools.IsIPV4(checkHostname):
                    // case Tools.IsIPV6(checkHostname): 暂时不支持 IPV6
                        return checkHostname;
                    default:
                        return null;
                }
            }else{
                return checkHostname;
            }
        })(hostname),NewLocation.hostname);

        // 端口
        port = Url._SetUrl(port,SetPort);
        // 需要处理路径, 如果路劲前没有 / 斜线 =>  aaa/bbb ,还有 带 . 点 => ./aaa/bbb 还有 ./../aaa/bbb
        pathname = Url._SetPathName(Url._SetUrl(pathname,'/'),NewLocation,(HasNoProtocol && HasNoHostName));
        // 查询参数
        search = Url._SetUrl(search,'');
        // 哈希
        hash = Url._SetUrl(hash,'');

        // 可省略的端口,自动计算出来的
        let isOmissionPort:boolean = ((checkProtocol:string,checkPort:string) => {
            switch(true){
                case checkProtocol == 'http:' && checkPort == '80':
                    return true;
                case checkProtocol == 'https:' && checkPort == '443':
                    return true;
                default:
                    return false;
            }
        })(protocol,port);


        // console.log("解析结果",UriMatchs);
        // console.log("协议头:",protocol);
        // console.log("主机名:",hostname);
        // console.log("端口:",port);
        // console.log("路径:",pathname);
        // console.log("查询条件:",search);
        // console.log("哈希值:",hash);
        // console.log("是否忽略",isOmissionPort);
        
        // 最终端口, http => 80 端口是可以省略的
        let newPort:string = port !== '' && !isOmissionPort ? ':' + port : '';

        // 最后返回 WLocation 实例
        return new WLocation({
            "origin":`${protocol}//${hostname}${newPort}`,
            "protocol":protocol,
            "host":`${hostname}${newPort}`,
            "hostname":hostname,
            "port":isOmissionPort ? '' : port,
            "pathname":pathname,
            "search":search,
            "hash":hash,
            "href":`${protocol}//${hostname}${newPort}${pathname}${search}${hash}`,
            "query":{}
        });
    }


    /**
     * 将 Query 字符串 转成对象
     *
     * @static
     * @param {string} QueryUrlString
     * @returns
     * @memberof Url
     */
    public static _QueryDecode(QueryUrlString:string):object{
        // 对 url 进行编码
        QueryUrlString = encodeURI(QueryUrlString);

        // 将参数
        let Params:Array<string> = QueryUrlString.split('&');

        // 定义一个全局对象用于赋值并返回
        let Data:any = {};
        // 循环所有参数
        Params.forEach((Items) => {
            // 拿到 key value 数组
            let [Key,Value] = Items.split('=');
            // 单单对key解码
            Key = decodeURI(Key);
            // 将两边空格
            Key = Key.trim();

            // 对 key 进行解析
            if(/^.+\[.*\]$/.test(Key)){
                // 先做一个赋值
                let NewData = Data;
                // 拿到 key [0][name]
                let [,KeyName,KeysString] = Key.match(/^([^\[]+)(\[.+\])$/);
                // 用于取出 [key] 里的 key 值
                let Reg = new RegExp(/^\[([^\]]*)\]/);
                // 取出下一个
                let [SunStr,KeyIndex]:Array<any> = KeysString.match(Reg);
                // 对第一层属性赋值
                if(NewData[KeyName] === undefined){
                    // 如果是数字 isNaN('1') => false
                    if(!isNaN(KeyIndex)){
                        // 初始化
                        NewData[KeyName] = [];
                    }else{
                        // 初始化
                        NewData[KeyName] = {};
                    }
                }
                // 这是拿到第一层的值 [] 或 {}
                NewData = NewData[KeyName];

                // 循环取出 第一个[key]
                while (Reg.test(KeysString)){
                    // 取出第一个
                    [SunStr,KeyIndex] = KeysString.match(Reg);
                    // 取出就删除 等于剩余的字符串
                    KeysString = KeysString.substring(SunStr.length);
                    // 是否还能继续
                    let IsLast = KeysString === '' ? true : false;

                    // 
                    if(IsLast){
                        // 如果是最后了就赋值
                        NewData[KeyIndex] = Value;
                    }else{

                        // 校验是否存在,不存在才添加
                        if(NewData[KeyIndex] === undefined){
                            // 如果不是数字
                            if(isNaN(KeyIndex)){
                                // 初始化
                                NewData[KeyIndex] = [];
                            }else{
                                // 初始化
                                NewData[KeyIndex] = {};
                            }
                        }
                    }
                    // 再把最新的赋值,覆盖变量上,用于下次校验, 这个值
                    NewData = NewData[KeyIndex];
                }
            }else{
                // 没有 [] 这类字符串
                Data[Key] = Value;
            }
        });
        // 最后返回值
        return Data;
    }


    /**
     * 将对象深度解码,解码出来就是键值对对象
     *
     * @static
     * @param {(object|any)} ObjectData
     * @param {string} [Prefix='']
     * @returns {*}
     * @memberof Url
     */
    public static _QueryEncode(ObjectData:object|any,Prefix:string=''):object{
        // 赋值的对象
        let NewObjectData:any = {};
        // 遍历拿到 key
        for (let key in ObjectData) {
            // 拼接成一个新的key
            let NewKey:string = Prefix === '' ? key : `${Prefix}[${key}]`;

            // 将数组和对象分别提取出来,再进行递归
            if(Tools._IsObject(ObjectData[key]) || Tools._IsArray(ObjectData[key])){
                // 将递归的进行合并赋值
                NewObjectData = Tools._Merge(NewObjectData,Url._QueryEncode(ObjectData[key],NewKey));
            }else{
                // 然后拼接成的新key作为key进行赋值
                NewObjectData[NewKey] = ObjectData[key];
            }
        }
        // 返回新的对象
        return NewObjectData;
    }


    /**
     * 将参数对象转成字符串url参数
     *
     * @static
     * @param {(object|any)} ObjectData
     * @returns {string}
     * @memberof Url
     */
    public static _QueryToString(ObjectData:object|any):string{
        // 将对象深度解码成 键值对的对象
        let NewObjectData:any = Url._QueryEncode(ObjectData);
        // 定义返回的字符串
        let QueryArray:string[] = [];
        // 转成字符串
        Object.keys(NewObjectData).forEach((key)=>{
            // 将等号进行拼接成字符串,添加到数组中
            QueryArray.push(`${key}=${NewObjectData[key]}`);
        });
        // 转成字符串
        return QueryArray.join('&');
    }


    /**
     * 将查询参数转成对象
     *
     * @static
     * @param {string} UrlString
     * @returns {object}
     * @memberof Url
     */
    public static _QueryToObject(UrlString:string):object{
        // 我们只需要 ? 至 # 之间的内容
        let QueryUrlArray = UrlString.match(/\?([^\#]+)/);
        // 解码
        return QueryUrlArray ? Url._QueryDecode(QueryUrlArray[1]) : {};
    }


}



/**
 * 是暴露出去的类,用于操作 Uri
 *
 * @export
 * @class UriClass
 */
export class UriClass{


    /**
     * 解析路由,成一个 WLocation 对象
     *
     * @param {string} Uri
     * @returns {WLocation}
     * @memberof UriClass
     */
    public ParseUri(Uri:string):WLocation{
        return Url._ParseUrl(Uri);
    }

    /**
     * 将对象查询条件,转成 字符串的 Get 查询条件
     *
     * @param {object} QueryObject
     * @returns {string}
     * @memberof UriClass
     */
    public QueryToString(QueryObject:object):string{
        return Url._QueryToString(QueryObject);
    }

    /**
     * 将 Get 的字符串查询条件,转化成 对象形式
     *
     * @param {string} UrlString
     * @returns {object}
     * @memberof UriClass
     */
    public QueryToObject(UrlString:string):object{
        return Url._QueryToObject(UrlString);
    }

    /**
     * 将深度的对象,编码成 键值对对象形式
     *
     * @param {object} QueryObject
     * @returns {object}
     * @memberof UriClass
     */
    public QueryEncode(QueryObject:object):object{
        return Url._QueryEncode(QueryObject)
    }

    /**
     * 将 Get 的查询条件,解码成 对象形式
     *
     * @param {string} QueryUrlString
     * @returns {object}
     * @memberof UriClass
     */
    public QueryDecode(QueryUrlString:string):object{
        return Url._QueryDecode(QueryUrlString);
    }

}