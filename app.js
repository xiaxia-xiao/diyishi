// 导入express模块
let express = require('express');
// 导入验证码模块svg-captha
let svgCaptcha = require('svg-captcha');
// 导入path模块
let path = require('path');
let router = express.Router();
//导入session
 let session = require('express-session');


// 创建app
let app = express();
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
    // req.session.captcha = captcha.text.toLocaleLowerCase();
    res.type('svg');
     res.status(200).send(captcha.data);
  })

// 监听
app.listen(80,'127.0.0.1',()=>{
console.log('success');
});



