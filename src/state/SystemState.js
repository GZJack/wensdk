
// 导出 System 整个对象
// 每个数据状态都有这个类型的,默认是 Object,保证当前 State 的类型, 因为 Object 和 Array 操作起来是不一样的,所持有的方法也不一样的
export default {
    // 状态值的属性名称,必须时字符串,要求 大驼峰命名法,单词首字母大写,尽可能简写,数组尾数尽量使用 s 结尾
    name:"System",
    // 这里是 state 额外配置参数,这里的配置将决定着 mutations actions getters中的方法
    config:{
        // 当前 state 的类型,只有 Object 和 Array 这两种类型
        type:Object, // 选项 ['Object','Array']
        // 是否自动读取写入,当等于 true 的时候,就会自动 读取和写入到 localStorage 本地上
        isAutoReadWrite:true, // 等于 false ,会执行本地删除,以前存在的也会被删除
        // 当 上面设置本地 存储 后 expire , 过期会自动删除
        expire:0, // 0: 表示长期有效, 单位:秒 
        // 读取和写入的时候 是否自动对数据进行加密
        isAutoCrypto:true,
    },
    state:{
        // 是否开启调试
        debug: process.env.NODE_ENV !== 'production',
        // 版本号
        version:"v1.0.5",
        // 网站的主标题
        title:"wen 后台模板",
        // 左侧菜单的宽度 , 字符串必须带单位
        asidewidth:"220px",
        // 右侧栏头部的高度  字符串,必须带单位
        headerHeigth:"50px",
        // 是否一开始就显示菜单栏,布尔值
        isStartShowAside:false,
        // 是否显示 右侧顶部的导航栏
        isShowHeaderNav:true,
        // 是否显示 tabs 导航条
        isShowPagesTabs:true,
        // 是否显示 面包屑导航栏
        isShowBreadcrumbNav:true,
        // 是否开启 加密获得token
        isCryptoGetToken:true,
        // 当获得 token 时提交加密 key
        tokenKey:"key",
        // appid 每个客户端都会随机生成一个appid
        appid:"",
        // 令牌名称
        tokenName:"token",
        // 提交令牌的方式  "url","head","cookie","all"
        tokenType:"url",
        // 快速生成 appid + v + t
        v(){
            // 直接拼接,无需带 ? 号 
            return `appid=${this.appid}&v=${this.version}&t=${this.time(true)}`;
        },
        // 快速生成统一的 时间戳,默认是生成 13 位的
        time(isTen){
            // 是否标准的 10 位,
            isTen = isTen === true ? true : false;
            let CurrentTimestamp = (new Date()).getTime();
            return isTen === false ? CurrentTimestamp : function(){
                // 截取前10位
                let numStr = CurrentTimestamp + "";
                numStr = numStr.substr(0,10);
                return parseInt(numStr);
            }();
        },
        // 生成一个短字符串,而且是根据时间戳生成的
        shortStr(prefix,len){
            // 设置默认值
            prefix = prefix || "";
            len = len || 6 ;
            // 当前时间戳作为基准
            var id = (new Date()).getTime() + Math.floor(Math.random()*100000);
            // 标准的生成字符串
            var listArray = [0,1,2,3,4,5,6,7,8,9,10,'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
            // 定义一个变量用于接收
            var str = "";

            // 死循环
            while (id) {
                // 取模
                var mod = id % 36;
                // 取整
                id = Math.floor(id/36);
                // 将对应的数组字符串取出来
                str += listArray[mod];
            }

            // 当生成的长度,大于指定的长度,我们就截取
            if(str.length > len){
                str = str.substr(0,len);
            }else{
                // 剩余长度
                var _length = len - str.length;
                // 随机数 
                var num = Math.ceil(Math.random()*10);
                // 补齐一段字符串
                var arr = listArray.slice(num, _length);
                // 最后返回字符串
                str = str + arr.join("");
            }
            // 最后返回的字符串
            return prefix + str;
        }
    },
    // 钩子函数,用于监听 状态变化的,当首次加载,可以执行 get 请求
    hooks:{
        // 当所有的状态已经生成,并已经从本地读取完成后,就会发生当前监听
        created(vuevm){
            let that = this;
            // 获得 appid,只会生成一次,后面是一个自执行函数
            let appid = this.appid !== "" ? this.appid : function(){
                // 简简单单做一个 md5 随机串就可以了
                let key = vuevm.$md5((new Date()).getTime()+"1");
                // 保存当前 appKey
                that.set({appid:key});
                // 返回了 key
                return key;
            }();

            
            // 直接执行该函数就可以了
            this.get({
                // 这两个参数是无意义的,但是后面后台可能会对appid进行统计
                params:{
                    // appid 随机生成
                    appid: appid,
                    // 版本号
                    v: that.version,
                    // 请求的时间戳
                    t: that.time(true)
                },
                // 取消token
                tokenCancel:true
            });
        },
        // 当状态发生变化后,会执行到该监听函数
        change(newValue,oldValue){
            
        }
    },
    mutations:{
        // 设置值的 mutations 函数
        // setSystem(state,config){
        //     // 遍历赋值
        //     Object.keys(config).forEach((key)=>{
        //         // 如果设置的,才会赋值
        //         if(state.System[key] !== undefined){
        //             state.System[key] = config[key];
        //         }
        //     });
        // },
        // // 合并状态属性 方法
        // mergerSystem(state,opt){
        //     if(typeof opt === "object"){
        //         state.System = {...state.System,...opt};
        //     }
        // }
        myname(state,opt){
    
            
        }
    },
    getters:{
        myr(state){
            return state.System;
        }
    },
    actions:{

    }
};