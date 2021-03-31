// 导出 User 整个对象
export default {
    // 状态值的属性名称,必须时字符串,要求 大驼峰命名法,单词首字母大写,尽可能简写,数组尾数尽量使用 s 结尾
    name:"User",
    // 这里是 state 额外配置参数,这里的配置将决定着 mutations actions getters中的方法
    config:{
        // 当前 state 的类型,只有 Object 和 Array 这两种类型
        type:Object, // 选项 ['Object','Array']
        // 是否自动读取写入,当等于 true 的时候,就会自动 读取和写入到 localStorage 本地上
        isAutoReadWrite:true, // 等于 false ,会执行本地删除,以前存在的也会被删除
        // 当 上面设置本地 存储 后 expire , 过期会自动删除
        expire:0, // 0: 表示长期有效, 单位:秒 
        // 读取和写入的时候 是否自动对数据进行加密
        isAutoCrypto:false,
    },
    // 如果是 Object => {name:'lisi',age:18} , 如果是 Array => {data:[]}
    state:{
        isLogin:false,
        // 员工的 appid, 自动生成, 这个 appid 是由客户端自动生成的 挂载到 system 下
        // appid:"12321231312312",
        // 员工的 id 登录后 返回并保存到本地
        "userid":"",
        // 是否官方员工
        "isOfficial":false,
        // 随机密钥串,每次登录成功都会产生一个,并且会保存到本地上
        "appsecret":"",
        // 员工头像
        "headimgurl": "",
        // 员工所在的城市
        "city": "",
        // 员工的所在国籍
        "country": "",
        // 员工的性别
        "sex": 0,
        // 员工的姓名
        "name": "",
        // 员工的昵称
        "nickname": "",
        // 员工的手机
        "phone": "",
        // 员工所在的省份
        "province": "",
        // 员工的角色id
        "roleid": 'vip',
        // 用户的 openid
        "openid":"",
        // 用户设置的语言
        "language":"",
        // 员工的固定电话
        "tel": "",
        // 用户的 token, 默认就是一个空的对象
        token:{}
    },
    // vuex 中 store.commit('my:(会自动增加当前的属性名(System))=>mySystem'),函数名尽量简写
    mutations:{
        
    },
    // vuex 中 store.getters.doneTodos(+System 会自动添加这个属性名)(),函数名尽量简写
    getters:{
        
    },
    // vuex 中 store.dispatch('check(+System 会自动添加这个属性名)'),函数名尽量简写
    actions:{
        // 定义一个用户注销登录
        logout(context,options){
            // 线上的数据也需要注销
            context.state.User.set({
                isLogin:false,
            });
            // 注销登录,第一会删除 User 属性
            context.state.User.remove();

            // 判断是否传入了this
            if(options && options.hasThis){
                // 拿到this
                let that = options.that;
                // 注销成功
                that.$message("已注销成功,页面准备跳转");
                // 路由重新跳转到 首页,如果没有登录,会自动去到登录页面
                setTimeout(()=>{
                    window.location.href = '/';
                },2000);
            }
            
        },
        // // 定义一个用户登录的方法
        // login(context,that){
        //     // 不需要写到这里,这里拿到不 http
        //     console.log('this $http',this,that);
        // }
    }
    
};