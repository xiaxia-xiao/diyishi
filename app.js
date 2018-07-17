// 导入express模块
let express = require('express');
// 导入验证码模块svg-captha
let svgCaptcha = require('svg-captcha');
// 导入path模块
let path = require('path');
// 导入路由模块
let router = express.Router();
//导入session
 let session = require('express-session');
// bodyParser
let bodyParser = require('body-parser')
// MongoClient 模块
let MongoClient = require('mongodb').MongoClient;

// Connection 地址
const url = 'mongodb://localhost:27017';
 
// Database 数据名字
const dbName = 'lxi';

// 创建app
let app = express();
// 使用中间件
app.use(bodyParser.urlencoded({ extended: false }));
// 静态页面进行托管
app.use(express.static('static'));

 app.use(session({
     secret: 'keyboard cat love west blue flower hahahaha'
 }))

// 使用get方法访问页面,服务器端继续读取文件并返回
// 路由1
app.get('/login',(req,res)=>{
  res.sendFile(path.join(__dirname,"static/views/login.html"));
   
})

// 路由2
// 使用post提交数据过来验证用户登录
app.post("/login",(req,res)=>{
    // 获取form表单提交的数据
    // 接收数据
    let userName =req.body.userName;
    let userPass =req.body.usePass;
    //验证码
    let code = req.body.code;
    // 跟session中的验证码进行比较
    if(code==req.session.captcha){
    // console.log('验证码正确');
    // 设置session
    req.session.userInfo = {
        userName,
        userPass
    }
    // 去首页
    res.redirect('/index');
    }else{
        res.setHeader('content-type', 'text/html');
        res.send('<script>alert("验证码失败");window.location.href="/login"</script>');
    }
    // 比较数据
    // let userName = req.bo
    // console.log(req);
    // res.send("login");
})


// 路由3
// 生成图片的功能
// 把这个路径给login页面的图片地址
app.get("/login/captchaImg.png",(req, res)=> {
    // 生成一张图片并返回
    var captcha = svgCaptcha.create();
    // 打印验证码
    console.log(captcha.text);
    // 保存验证码的值到session中,方便后续使用
    req.session.captcha = captcha.text;
    // 获取session中的值
    // console.log(req.session.info);
    // 保存 验证码的值 到 session 方便后续的使用
    // 为了比较时简单 直接转为小写
    req.session.captcha = captcha.text.toLocaleLowerCase();
    res.type('svg');
     res.status(200).send(captcha.data);
  })

// 路由4
// 访问首页index 
app.get('/index',(req,res)=>{
    // 判断是有session
    if(req.session.userInfo){
        // 有session直接读取文件
        res.sendFile(path.join(__dirname,"/static/views/index.html"));
    }else{
        // 没有session直接打回login页
        res.getHeader('content-type','text/html');
        res.send('<script>alert("请登录");window.location.href="/login"</script>');
    }
})
// 路由5
// 登出页面操作.删除session的值
app.get('/logout',(req,res)=>{
    delete req.session.userInfo;
    // 跳到登录页
    res.redirect('/login');
})

// 路由6
// 展示注册页面
app.get('/register',(req,res)=>{
// 直接读取返回注册页
res.sendFile(path.join(__dirname,'/static/views/register.html'));
})
// 路由7
// 获取用户的数据
app.post('/register',(req,res)=>{
   // 获取用户的数据 
   console.log(req);
   let userName = req.body.userName;
   let userPass = req.body.userPass; 
   console.log(userName);
   console.log(userPass);
// Use connect method to connect to the server
MongoClient.connect(url, (err, client)=> {
    const db = client.db(dbName);
    // 选择使用的集合
   let collection = db.collection('xueshengxt');
    // 查询数据
    collection.find({
    userName
    }).toArray((err,doc)=>{
        console.log(doc);
        if(doc.length==0){
        // 没有用过
        collection.insertOne({
            userName,
            userPass
        },(err,result)=>{
            console.log(err);
            // 注册成功了
            res.setHeader('content-type','text/html');
            res.send("<script>alert('欢迎入坑');window.location='/login'</script>")
            // 关闭数据库连接即可
            client.close();
        })
        }
    })
   
  });

})



// 监听
app.listen(80,'127.0.0.1',()=>{
console.log('success');
});



