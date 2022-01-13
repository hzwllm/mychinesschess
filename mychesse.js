// 全局变量计算多少步，暂时定为5
var step=5
// 棋盘
try{}
catch(e){
    console.log(e)
}
// 位置类
class position{
    constructor(x,y){
        this.nx=x
        // 初始高坐标
        this.ny=y
    }
    set nx(val){
        if(val<1||val>9)
        throw  Error('棋子位置不合法');
        this.x=val
    }
    set ny (val){
        if(val<1||val>10)
        throw  Error('棋子位置不合法');
        // this.y=val
        this.y=val
    }
    get nx(){
        return this.x
    }
    get ny(){
        return this.y
    }
    get coord(){
        return {
            x:this.x,
            y:this.y
        }
    }
}
// 棋子的方法限制和运动逻辑 limx[1,9],limy[1,10],mx和my是移动方式，nx，ny是方向-1

class chessmethod extends position{
    constructor(limx,limy,mx,my,x,y){
        super(x,y)
        this.limx=limx
        this.limy=limy
        this.mx=mx
        this.my=my
    }
    move(nx,ny){
        if(this.checklimit(this.x+nx*this.mx,this.y+ny*this.my)){
            return [nx*this.mx,ny*this.my]
        }
        throw Error('不能走')
    }
    checklimit(x,y){
        let xf= x<=this.limx[1]&&x>=this.limx[0]
        let yf= y<=this.limy[1]&&y>=this.limy[0]
        console.log(xf,yf)
        return (xf&&yf)
    }
}
// 棋子 type是红黑 1，-1
class chess extends chessmethod{
    constructor(x,y,type,limx,limy,mx,my){
        super(limx,limy,mx,my,x,y)
        // // 初始宽坐标
        // this.nx=x
        // // 初始高坐标
        // this.ny=y
        this.type=type
    }
    move(nx,ny){
        let newset=super.move(nx,ny)
        // if(typeof newset == Array){
            // console.log(newset)
            this.nx+=newset[0]
            this.ny+=newset[1]
        // }
    }
}
var chessmap={
    che:{x:1,y:1,limx:[1,9],limy:[1,10],nx:1,ny:1},
    ma:{x:2,y:1,limx:[1,9],limy:[1,10],nx:1,ny:1},
    xiang:{x:3,y:1,limx:[1,9],limy:[1,5],nx:1,ny:1},
    shi:{x:4,y:1,limx:[4,6],limy:[1,3],nx:1,ny:1},
    jiang:{x:5,y:1,limx:[4,6],limy:[1,3],nx:1,ny:1},
    pao:{x:2,y:3,limx:[1,9],limy:[1,10],nx:1,ny:1},
    bin:{x:1,y:4,limx:[1,9],limy:[4,10],nx:1,ny:1}
}
class mychessmap{
    constructor(width,height){
        // 宽9
        this.width=width
        // 高10
        this.height=height
        // 棋盘
        this.map=this.generatormap()
        this.chesslist=[]
        this.chesslistinit()
        this.chesspositionset()
    }
    generatormap(){
        let c=[]
        console.log(this.height)
        for(let i =1;i<= this.height;i++){
            let d=[]
            for(let j=1;j<= this.width;j++){
                if(i<=5){
                d.push({type:-1,chessr:null})
                }else{
                    d.push({type:-1,chessr:null})
                }
            }
            c.push(d)
        }
        return c
    }
    chesslistinit(){
        for(let k in chessmap){
            console.log(k)
            let c=chessmap[k]
            if(c.y==5){
                this.maincreate(c,k)
            }
            if(k!='bin'&&c.y!=5){
                this.orcreate(c,k)
                // return
            }
            if(k=='bin'){
                this.bincreate(c,k)
                }
        }
    }
    create(x,y,z,name,limx,limy,nx,ny){
        return {
            chess:new chess(x,y,z,limx,limy,nx,ny),
            name:name
        }
    }
    orcreate(it,name){
        // {x:1,y:1,limx:[1,9],limy:[1,10],nx:1,ny:1}
       this.chesslist.push(this.create(it.x,it.y,1,name,it.limx,it.limy,it.nx,it.ny)) 
       this.chesslist.push(this.create(10-it.x,it.y,1,name,it.limx,it.limy,it.nx,it.ny)) 
       this.chesslist.push(this.create(10-it.x,11-it.y,-1,name,it.limx,[11-it.limy[1],11-it.limy[0]],it.nx,it.ny)) 
       this.chesslist.push(this.create(it.x,11-it.y,-1,name,it.limx,[11-it.limy[1],11-it.limy[0]],it.nx,it.ny)) 
    }
    maincreate(it,name){
        this.chesslist.push(this.create(it.x,it.y,1,name,it.limx,it.limy,it.nx,it.ny)) 
        this.chesslist.push(this.create(it.x,11-it.y,-1,name,it.limx,[11-it.limy[1],11-it.limy[0]],it.nx,it.ny)) 
    }
    bincreate(it,name){
        this.orcreate(it,name)
        it.x=it.x+2
        this.orcreate(it,name)
        it.x=it.x+2
        this.maincreate(it,name)
    }
    chesspositionset(){
        let i=0
        this.chesslist.forEach(it=>{
            i++
            // console.log(i)
            this.map[it.chess.y-1][it.chess.x-1].chessr=it
            // .chessr=it
        })
    }
}

var mymap=new mychessmap(9,10)
export const data= mychess
// console.log(mymap)
// // console.log(mymap.chesslist)
// console.log(mymap.map)
// console.log(mymap.chesslist.length)
