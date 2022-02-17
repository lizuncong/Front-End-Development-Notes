### 简介
Hybrid App最核心的点就是Native端与H5端之间的双向通讯层，也就是我们常说的JSBridge

#### JS调用客户端(Native)的方法
- JS上下文注入
- 弹窗拦截。常用的三个方法：
    + alert: 可以被webview的onJsAlert监听
    + confirm: 可以被webview的onJsConfirm监听
    + prompt: 可以被webview的onJsPrompt监听
- URL Schema

#### 客户端(Native)调用JS的方法，也就是客户端如何执行JS的回调方法
- loadUrl
- evaluatingJavaScript
- stringByEvaluatingJavaScriptFromString

#### JS调用客户端的方法：JS上下文注入
Native端不通过任何拦截的方法，直接获取JavaScript环境上下文，并直接将一个native对象或者方法注入到JS里面，使JS可以直接调用。

Android 与 IOS 分别拥有对应的挂载方式。分别对应是:
- 一、苹果UIWebview JavaScriptCore注入
>客户端注入。UIWebView通过KVC的方法直接拿到整个WebView当前所拥有的JS上下文documentView.webView.mainFrame.javaScriptContext，然后把任何遵循JSExport协议的对象直接注入JS，让JS能够直接控制和操作

>JS调用。在没经过客户端注入的时候，直接调用callNativeFunction会报 callNativeFunction is not defined这个错误，说明此时JS上下全文全局，是没有这个函数的，调用无效。在执行完客户端注入后，此时JS上下文全局对象下面，就拥有了这个callNativeFunction的函数对象，就可以正常调用，从而传递数据到Native

代码示例
```js
// iOS端代码 拿到当前webView的JS上下文
JSContext *context = [webview valueForKeyPath: @"documentView.webView.mainFrame.javaScriptContext"]
// 给context上下文注入callNativeFunction函数当作JS对象
context[@"callNativeFunction"] = ^( JSValue * data){
    // 1 解读JS传过来的JSValue data数据
    // 2 取出指令参数，确认要发起的native调用的指令是什么
    // 3 取出数据参数，拿到JS传过来的数据
    // 4 根据指令调用对应的native方法，传递数据
    // 5 此时还可以将客户端的数据同步返回
}

// JS端代码 准备要传给native的数据，包括指令，数据，回调等
const data = {
    action: 'xxxx',
    params: 'xxxx',
    callback: 'xxxx'
}
// 直接使用客户端注入的函数
callNativeFunction(data)
```

- 二、苹果WKWebView Message Handler注入
>客户端注入。WKWebView性能不仅比UIWebView好，也更改了JS与Native交互的方式，提供了专有的交互APIMessageHandler。需要注意的是如果当前WebView没用了，需要销毁，需要先移除这个对象注入，否则会造成内存泄漏，WebView和所在VC循环引用，无法销毁

>JS调用。这里不是直接注入到JS上下文全局对象里，addMessageHandler方法注入的对象被放到了全局对象下一个Webkit对象下面。
并且调用方式和UIWebView方法也不同，UIWebView可以让js任意操作所注入自定义对象的所有方法，而addMessageHandler注入其实只给注入对象起了一个名字nativeObject，但这个对象的能力是不能任意指定的，只有一个函数postMessage
```js
// ios端
// 配置对象注入
[self.webView.configuration.userContentController addScriptMessageHandler:self name:@"nativeObject"];
// 移除对象注入
[self.webView.configuration.userContentController removeScriptMessageHandlerForName:@"nativeObject"];


// JS端代码 准备要传给native的数据，包括指令，数据，回调等
const data = {
    action: 'xxxx',
    params: 'xxxx',
    callback: 'xxxx'
}
// 传递给客户端
window.webkit.messageHandlers.nativeObject.postMessage(data)
```
- 三、安卓WebView addJavascriptInterface注入
```js
// 安卓端 通过addJavaScriptInterface()将Java对象映射到JS对象
// 参数1: JavaScript对象名 参数2: Java对象名
mWebView.addJavaScriptInterface(new AndroidtoJs(), "nativeObject")

// JS端代码 准备要传给native的数据，包括指令，数据，回调等
const data = {
    action: 'xxxx',
    params: 'xxxx',
    callback: 'xxxx'
}
// 直接使用客户端注入的函数
nativeObject.callFunction(data)
```


#### JS调用客户端的方法：弹窗拦截
通过调用alert/confirm/prompts方法，并传递参数。然后客户端监听这些事件。这种方式要求参数遵循一定的规范，客户端才能根据这个规范判断是JS需要调用客户端的方法，还是说正常的弹窗调用。由于prompt是几个里面唯一可以自定义返回值，可以做同步交互的，所以在目前的使用中，prompt是使用的最多的
- 安卓的拦截方式：onJsPrompt。
- UIWebView的拦截方式：不支持截获任何一种弹框。
- WKWebView的拦截方式：webView:runJavaText InputPanelWith Prompt:balbala。
```js
// JS中调用
const data = {
    action: 'xxxx',
    params: 'xxxx',
    callback: 'xxxx'
}
const jsonData = JSON.stringify([data])
// 发起弹窗
prompt(jsonData)


// 客户端代码  客户端拦截
@Override
public boolean onJsPrompt(WebView view, String url, String message, String defaultValue, JsPromptResult result){
    // 1 根据传来的字符串反解出数据，判断是否是所需要的拦截而非常规H5弹窗
    if(是){
        // 2 取出指令参数，确认要发起的native调用的指令是什么
        // 3 取出数据参数，拿到JS传过来的数据
        // 4 根据指令调用对应的native方法，传递数据
        return true
    }
    // 如果是正常的弹窗则展示弹窗
    return super.onJsPrompt(view, url, message, defaultValue, result)
}
```


#### JS调用客户端的方法：URL Schema
安卓和iOS都可以通过拦截跳转页URL请求，然后解析这个scheme协议。真正的url地址应该照常放过，只有协议名符合我们约定的规则的url才应该被客户端拦截。拦截下来的url不会导致webview继续跳转错误地址，因此无感知，相反拦截下来的url我们可以读取其中路径当做指令，读取其中参数当做数据，从而根据约定调用对应的native原生代码

- 安卓的拦截方式：shouldOverride UrlLoading。
- UIWebView的拦截方式：webView: shouldStartLoadWithRequest :navigationType。
- WKWebView的拦截方式：webView: decidePolicyForNavigationAction :decisionHandler。
```js
// JS端代码 有几种方式可以发起请求
// 1. 在HTML中写上A标签直接填写假请求地址
// <a href='weixin://dl/scan?k1=v1&k2=v2&k3=v3&callback=_invoke_scan_callback_'>A标签</a>
// 2. 在JS中用location.href跳转
location.href = 'weixin://dl/scan?k1=v1&k2=v2&k3=v3&callback=_invoke_scan_callback_'
// 3. 在JS中创建一个iframe，然后插入dom中跳转
const iframe = document.createElement('iframe')
iframe.style.display = 'none'
// iframe.src = 'weixin://dl/scan'
iframe.src = 'weixin://dl/scan?k1=v1&k2=v2&k3=v3&callback=_invoke_scan_callback_'
document.body.appendChild(iframe)

// 客户端代码
@Override
public boolean shouldOverrideUrlLoading(WebView view, String url){
    // 1. 根据url，判断是否是所需要拦截的调用
    if(是){
        // 2 取出路径，确认要发起的native调用的指令是什么
        // 3 取出参数 拿到JS传过来的数据
        // 4 根据指令调用对应的native方法，传递数据
        return true
    }

    return super.shouldOverrideUrlLoading(view, url)
}
```


#### 客户端调用JS的方法：loadUrl
安卓4.4以前是没有evaluatingJavaScript这个API的，只能通过loadUrl来调用JS方法，但是传入的url并不是一个链接，而是以“javascript：”开头的js代码，但是无法获取该方法的返回值。
```js
// js端代码  在全局环境下定义一个函数
function calljs(data){
    console.log(JSON.parse(data))
    // 1. 识别客户端传来的数据
    // 2. 对数据进行分析，从而调用或执行其他逻辑
}


// 安卓客户端代码
// mWebView.loadUrl("javascript: 方法名('参数,需要转为字符串')");
mWebView.loadUrl("javascript: calljs(\'{data: xxxx, data2: xxx}\')");
```

#### 客户端调用JS的方法：evaluatingJavaScript
ios以及安卓4.4以后都提供了evaluatingJavaScript这个API。通过 evaluateJavascript 异步调用 JS 方法,并且能在 onReceiveValue 中拿到返回值。
```js
// js端代码  在全局环境下定义一个函数
function calljs(data){
    console.log(JSON.parse(data))
    // 1. 识别客户端传来的数据
    // 2. 对数据进行分析，从而调用或执行其他逻辑
}

//安卓端代码：异步执行JS代码,并获取返回值
mWebView.evaluateJavascript("javascript: 方法名('参数,需要转为字符串')", new ValueCallback() {
        @Override
        public void onReceiveValue(String value) {
    		//这里的value即为对应JS方法的返回值
        }
});

// iOS端代码： 
NSString *paramsString = [self _serializeMessageData:data];
NSString *javascriptCommand = [NSString stringWithFormat:@"calljs('%@')", paramsString]
// 要求必须在主线程执行JS
if([[NSThread currentThread] isMainThread]){
    [self.webView evaluateJavaScript:javascriptCommand completionHandler:nil]
} else {
    __strong typeof(self)strongSelf = self;
    dispatch_sync(dispatch_get_main_queue(), ^{
        [strongSelf.webView evaluateJavaScript:javascriptCommand completionHandler:nil]
    })
}
```

#### 客户端调用JS的方法：stringByEvaluatingJavaScriptFromString
在 iOS 中 Native 通过stringByEvaluatingJavaScriptFromString调用 Html 绑定在 window 上的函数。
```js
// Swift
webview.stringByEvaluatingJavaScriptFromString("方法名('参数')")
// oc
[webView stringByEvaluatingJavaScriptFromString:@"方法名(参数);"];
```

#### 客户端调用JS的方法：WKUser 执行JS代码
对于iOS的WKWebView，除了evaluatingJava，还有WKUser这个方式可以执行JS代码，他们之间是有区别的，这个虽然是一种通信方式，但并不能随时随地进行通信。

- evaluatingJava 是在客户端调用的时候js端会立刻执行代码。
- WKUser 是预先准备好JS代码，当WKWebView加载Dom的时候，执行当条JS代码。
```js
// 在loadurl之前使用
// time是一个时机参数，可选dom开始加载/dom加载完毕，2个时机进行执行js
// 构建userscript
WKUserScript *script = [[WKUserScript alloc] initWithSource:source injectionTime:time forMainFrameOnly:mainOnly]
WKUserContentController *userController = webView.userContentController;
// 配置userscript
[userController addUserScript:script]
```