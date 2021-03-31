## Wen JS SDK 开发文明规范

### 开发规范

1. 项目目录结构和文件

/lib 是当前 src 下源码所依赖的库,(从其他项目引进,并爆出给 src 下使用)  
/lib/Index.ts 引入和爆出文件  

/src 是源码  
/src/main.ts 是暴露出自己 src 下创造出的类库

/src/xxx 子项目  

/src/xxx/lib 是当前子项目 src 里源码所依赖的库,(从其他项目引进,并爆出给 src 下使用)  
/src/xxx/lib/Index.ts 子项目需要的依赖,引入和爆出  

/src/xxx/src 子项目的源码  
/src/xxx/src/main.ts 是暴露出子项目 src 下创造出来的类库 (别的 /lib/Index.ts 就可以过来引入该类库到自己的 src 下使用)  

/src/xxx/src/yyy (yyy) 则是子项目的分类文件夹,(不能作为子项目的子项目)  
/src/xxx/src/yyy/Index.ts 分类下的类文件

2. 类的命名和文件名首字母大写  

3. 遵循以上两点  


### 使用规范  

1. 二次封装,需要在 new Wen(); 前进行 Wen.use(Xxx); 进行注册封装  

2. 在使用 SDK 里的 API 是需要进行 new Wen(); 并将得到的实例,挂载的 window 全局上  