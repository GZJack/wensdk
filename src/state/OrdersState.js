let arr = [];
for (let i = 0; i < 50; i++) {
    if(i % 3 === 0){
        arr.push({name:"zhang"+i,id:"id_"+i,age:i,sex:"女"});
    }else{
        arr.push({name:"wen"+i,id:"id_"+i,age:i+1,sex:"男"});
    }
    
}

export default {
    // 状态值的属性名称,必须时字符串,要求 大驼峰命名法,单词首字母大写,尽可能简写,数组尾数尽量使用 s 结尾
    name:"Orders",
    // 这里是 state 额外配置参数,这里的配置将决定着 mutations actions getters中的方法
    config:{
        // 当前 state 的类型,只有 Object 和 Array 这两种类型
        type:Array, // 选项 ['Object','Array']
        // 是否自动读取写入,当等于 true 的时候,就会自动 读取和写入到 localStorage 本地上
        isAutoReadWrite:true, // 等于 false ,会执行本地删除,以前存在的也会被删除
        // 当 上面设置本地 存储 后 expire , 过期会自动删除
        expire:0, // 0: 表示长期有效, 单位:秒 
        // 读取和写入的时候 是否自动对数据进行加密
        isAutoCrypto:false,
        // 索引字段名称,主要是避免 add 添加数组的时候,避免添加重复的数组,还有可以通过 getters getById("id") 找到指定的数据
        indexKey:"id",
        // 数组是否叠加合并, 一般用在 actions 异步请求中
        isArrayMerger:true,
        // 是否使用数组往尾部添加,[].push,否则就是使用 [].unshift
        isUseArrayPush:false,
        // 是否对状态进行备份,会备份到当前状态的实例下,最多只能还原到上一次修改,主要用于,表单,如购物车,清空失败后,能及时恢复,删除某一条内容失败,也能恢复,最好使用数据比较少的列表上
        isStateBackup:false, // 会备份到当前实例 不可枚举 _state 上
    },
    // 钩子函数,用于监听 状态变化的,当首次加载,可以执行 get 请求
    hooks:{
        // 当状态已经生成,并已经从本地读取完成后,就会发生当前监听
        created(vuevm){
            console.log('vue',vuevm,this);
        },
        // 当状态发生变化后,会执行到该监听函数
        change(newValue,oldValue){

        }
    },
    // 如果是 Object => {name:'lisi',age:18} , 如果是 Array => {data:[]}
    state:{
        data:arr
    },
    // vuex 中 store.commit('my:(会自动增加当前的属性名(System))=>mySystem'),函数名尽量简写
    mutations:{
        
    },
    // vuex 中 store.getters.doneTodos(+System 会自动添加这个属性名)(),函数名尽量简写
    getters:{
        getSex:(state, getters) => (sex) => {
            return state.Orders.data.filter(info => info.sex === sex);
        }
    },
    // vuex 中 store.dispatch('check(+System 会自动添加这个属性名)'),函数名尽量简写
    actions:{
        
    }
    
};