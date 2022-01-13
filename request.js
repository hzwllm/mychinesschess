// 此文件是请求函数浏览器使用的
function errfunc(xhr){
    xhr.onload = e => {
        console.log('request success');
        // console.log(xhr.responseText);
        console.log(e);
    };
    // 请求结束
    xhr.onloadend = e => {
        console.log('request loadend');
    };
    // 请求出错
    xhr.onerror = e => {
        console.log('request error');
    };
    // 请求超时
    xhr.ontimeout = e => {
        console.log('request timeout');
    };
}
function request1(){
    function requset({method='GET',url='http://localhost:3000',body=null}){
        // window.qw=12345
    var xhr=new XMLHttpRequest()
    xhr.open(method,url,)
    xhr.send(body);
    errfunc(xhr)
    }
    return requset
    
}
export const request=request1({})