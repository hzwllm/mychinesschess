// 全局变量计算多少步，暂时定为5
var step = 5
// 棋盘
try {} catch (e) {
    console.log(e)
}
// 位置类
class position {
    constructor(x, y) {
        this.nx = x
        // 初始高坐标
        this.ny = y
    }
    set nx(val) {
        if (val < 1 || val > 9)
            throw Error('棋子位置不合法');
        this.x = val
    }
    set ny(val) {
        if (val < 1 || val > 10)
            throw Error('棋子位置不合法');
        // this.y=val
        this.y = val
    }
    get nx() {
        return this.x
    }
    get ny() {
        return this.y
    }
    get coord() {
        return {
            x: this.x,
            y: this.y
        }
    }
}
// 棋子的方法限制和运动逻辑 limx[1,9],limy[1,10],mx和my是移动方式，nx，ny是方向-1

class chessmethod extends position {
    constructor(limx, limy, mx, my, x, y) {
        super(x, y)
        this.limx = limx
        this.limy = limy
        this.mx = mx
        this.my = my
    }
    move(nx, ny) {

        if (this.checklimit(this.x + nx * this.mx, this.y + ny * this.my)) {
            return [nx * this.mx, ny * this.my]
        }
        throw Error('不能走')
    }
    checklimit(x, y) {
        console.log(y, this.limy)
        let xf = x <= this.limx[1] && x >= this.limx[0]
        let yf = y <= this.limy[1] && y >= this.limy[0]
        console.log(xf, yf)
        return (xf && yf)
    }
}
// 棋子 type是红黑 1，-1
class chess extends chessmethod {
    constructor(x, y, type, limx, limy, mx, my, name) {
        super(limx, limy, mx, my, x, y)
        // // 初始宽坐标
        // this.nx=x
        // // 初始高坐标
        // this.ny=y
        this.type = type
        this.name = name
    }
    move(nx, ny) {
        let newset = super.move(nx, ny)
        // if(typeof newset == Array){
        // console.log(newset)
        this.nx += newset[0]
        this.ny += newset[1]
        // }
    }
}
var chessmap = {
    che: {
        x: 1,
        y: 1,
        limx: [1, 9],
        limy: [1, 10],
        nx: 1,
        ny: 1
    },
    ma: {
        x: 2,
        y: 1,
        limx: [1, 9],
        limy: [1, 10],
        nx: 1,
        ny: 1
    },
    xiang: {
        x: 3,
        y: 1,
        limx: [1, 9],
        limy: [1, 5],
        nx: 1,
        ny: 1
    },
    shi: {
        x: 4,
        y: 1,
        limx: [4, 6],
        limy: [1, 3],
        nx: 1,
        ny: 1
    },
    jiang: {
        x: 5,
        y: 1,
        limx: [4, 6],
        limy: [1, 3],
        nx: 1,
        ny: 1
    },
    pao: {
        x: 2,
        y: 3,
        limx: [1, 9],
        limy: [1, 10],
        nx: 1,
        ny: 1
    },
    bin: {
        x: 1,
        y: 4,
        limx: [1, 9],
        limy: [4, 10],
        nx: 1,
        ny: 1
    }
}
// 斜着走的棋子
var tezhong = {
    ma: true, //21 12 -21 1-2 2-1 -12 -1-2 -2-1
    xiang: true, // 22 2-2 -22 -2-2
    shi: true, // 1-1 11 -1-1 -11
}
// 地图类
class mychessmap {
    constructor(width, height) {
        // 宽9
        this.width = width
        // 高10
        this.height = height
        // 1先行，-1后行
        this.current = 1
        // 棋盘
        this.map = this.generatormap()
        // 棋子list
        this.chesslist = []
        // 被淘汰的棋子list
        this.outchesslist = []
        this.chesslistinit()
        // 确定棋子位置
        this.chesspositionset()
        // 历史棋盘
        this.historymap = [this.map]
        this.walksteped=0
    }
    // 计算特定的点位有没有棋子
    findchess(x, y) {
        console.log(x, y)
        return this.map[y - 1][x - 1].chessr
    }
    // 针对直线，点与点之间棋子数量的计算（包括自己不包括对面）
    calchesscount(x, y, nx, ny) {
        let count = 0
        if (nx != 0) {
            // 1个是自己两个就是中间有一个
            for (let i = x; i != nx + x; i = i + nx / Math.abs(nx)) {
                if (this.findchess(i, y)) {
                    count++
                }
            }
        }
        if (ny != 0) {
            for (let i = y; i != ny + y; i = i + ny / Math.abs(ny)) {
                if (this.findchess(x, i)) {
                    count++
                }
            }
        }
        return count - 1
    }
    // 检查棋子是否可以移动到此位置
    checkchesscanmove(chesse,nx,ny){
        if (chesse.type != this.current) {
            throw Error('当前回合不是此')
        }

        if (this.findchess(chesse.x + nx, chesse.y + ny) && this.findchess(chesse.x + nx, chesse.y + ny).chess.type == chesse.type) {
            throw Error('不能吃自己的子')
        }

        if (tezhong[chesse.name]) {
            if (chesse.name == 'ma' && (nx * ny * nx * ny) != 4) {
                throw Error('错误的行动，马走日')
            }
            if (chesse.name == 'xiang' && (nx * ny * nx * ny) != 16) {
                throw Error('错误的行动，象走田')
            }
            if (chesse.name == 'shi' && (nx * ny * nx * ny) != 1) {
                throw Error('错误的行动')
            }
            if (chesse.name != 'shi') {
                let px = chesse.x + (Math.abs(nx / 2) == 1 ? nx / 2 : 0)
                let py = chesse.y + (Math.abs(ny / 2) == 1 ? ny / 2 : 0)
                // 挡马腿、挡象腿
                if (this.findchess(px, py)) {
                    throw Error('阻挡前进的步伐')
                }
            }

        } else {
            if (nx * ny != 0 || ((nx * ny == 0) && (nx + ny == 0))) {
                throw Error('错误的行动，只能走直线')
            }
        }
        // 计算路径上的棋子数
        let chesscount = this.calchesscount(chesse.x, chesse.y, nx, ny)
        // 是炮但是对面没有棋子
        if (chesscount == 1 && !tezhong[chesse.name]) {
            if (chesse.name == 'pao' && !this.findchess(chesse.x + nx, chesse.y + ny)) {
                throw Error('对面没有棋子')
            }
            if (chesse.name != 'pao') {
                throw Error('中间有棋子阻挡')
            }
        } else if (!tezhong[chesse.name]) {
            if (chesscount != 0) {
                throw Error('中间有棋子阻挡')
            }
        }
        if (chesse.name == 'bin') {
            if (nx * ny != 0 || (nx * nx > 1) || (ny * ny > 1)) {
                throw Error('兵不能那样走')
            }
            console.log(chesse.y - chesse.limy[0])
            if (Math.abs(chesse.y - chesse.limy[0]) < 2 && nx != 0 && chesse.type == 1) {
                throw Error('未过河前兵不能横着走')
            }
            if (Math.abs(chesse.y - chesse.limy[1]) < 2 && nx != 0 && chesse.type == -1) {
                throw Error('未过河前兵不能横着走')
            }
            if (chesse.type == -1 && ny > 0) {
                throw Error('兵不能后退')
            }
            if (chesse.type == 1 && ny < 0) {
                throw Error('兵不能后退')
            }
        }
        return true
    }
    // 棋子移动
    move(chesse, nx, ny) {
        // chesse是chess实例
        let flag=this.checkchesscanmove(chesse, nx, ny)
        
        if(flag){
            let ox = chesse.x
            let oy = chesse.y
            chesse.move(nx, ny)
            this.changechessposition({
                chess: chesse,
                name: chesse.name
            }, ox, oy)
            // 切换执行顺序
            this.walksteped++
            this.current = 0 - this.current
            this.historymap.push(this.map)
        }
        // 棋子移动成功切换到吃棋子和移动逻辑
        
    }
    // 这个地方通知视图重新渲染，这里将地图棋子位置更改
    changechessposition(chesse, ox, oy) {
        // 原位置重置0
        this.map[oy - 1][ox - 1].chessr = null
        // 判断新位置
        if (this.map[chesse.chess.y - 1][chesse.chess.x - 1].chessr) {
            this.outchesslist.push(this.map[chesse.chess.y - 1][chesse.chess.x - 1].chessr)
        }
        // 地图新位置换成棋子
        this.map[chesse.chess.y - 1][
            [chesse.chess.x - 1]
        ].chessr = chesse

    }
    generatormap() {
        let c = []
        console.log(this.height)
        for (let i = 1; i <= this.height; i++) {
            let d = []
            for (let j = 1; j <= this.width; j++) {
                if (i <= 5) {
                    d.push({
                        type: 1,
                        chessr: null
                    })
                } else {
                    d.push({
                        type: -1,
                        chessr: null
                    })
                }
            }
            c.push(d)
        }
        return c
    }
    chesslistinit() {
        for (let k in chessmap) {
            let c = chessmap[k]
            if (c.x == 5) {
                console.log(c.y)
                this.maincreate(c, k)
            }
            if (k != 'bin' && c.x != 5) {
                this.orcreate(c, k)
                // return
            }
            if (k == 'bin') {
                this.bincreate(c, k)
            }
        }
    }
    create(x, y, z, name, limx, limy, nx, ny) {
        return {
            chess: new chess(x, y, z, limx, limy, nx, ny, name),
            name: name
        }
    }
    orcreate(it, name) {
        // {x:1,y:1,limx:[1,9],limy:[1,10],nx:1,ny:1}
        this.chesslist.push(this.create(it.x, it.y, 1, name, it.limx, it.limy, it.nx, it.ny))
        this.chesslist.push(this.create(10 - it.x, it.y, 1, name, it.limx, it.limy, it.nx, it.ny))
        this.chesslist.push(this.create(10 - it.x, 11 - it.y, -1, name, it.limx, [11 - it.limy[1], 11 - it.limy[0]], it.nx, it.ny))
        this.chesslist.push(this.create(it.x, 11 - it.y, -1, name, it.limx, [11 - it.limy[1], 11 - it.limy[0]], it.nx, it.ny))
    }
    maincreate(it, name) {
        this.chesslist.push(this.create(it.x, it.y, 1, name, it.limx, it.limy, it.nx, it.ny))
        this.chesslist.push(this.create(it.x, 11 - it.y, -1, name, it.limx, [11 - it.limy[1], 11 - it.limy[0]], it.nx, it.ny))
    }
    bincreate(it, name) {
        this.orcreate(it, name)
        it.x = it.x + 2
        this.orcreate(it, name)
        it.x = it.x + 2
        this.maincreate(it, name)
    }
    chesspositionset() {
        let i = 0
        this.chesslist.forEach(it => {
            i++
            // console.log(i)
            this.map[it.chess.y - 1][it.chess.x - 1].chessr = it
            // .chessr=it
        })
    }
}
// socket连接类
class socketconnect {
    constructor(url) {
        this.url = url
        this.myid = Math.random()
        this.heid = undefined
        this.socket = this.init()
        // listener
        this.listeninit()
        this.data = undefined
        // type
        this.type = undefined
        this.hestep = undefined
        this.cb = undefined
        // this.connect()

    }
    init() {
        return new WebSocket(this.url)
    }
    listeninit() {
        this.socket.onopen = (e) => {
            this.socket.send(this.myid)
            this.connect()
        }
        this.socket.onmessage = (e) => {
            //当客户端收到服务端发来的消息时，触发onmessage事件，参数e.data包含server传递过来的数据
            console.log(e.data);
            this.message = e
        }
        this.socket.onclose = (e) => {
            //当客户端收到服务端发送的关闭连接请求时，触发onclose事件
            console.log("close");
        }
        this.socket.onerror = (e) => {
            //如果出现连接、处理、接收、发送数据失败的时候触发onerror事件
            console.log(e);
        }
    }
    move(chesse, nx, ny, cb) {
        let c = {
            chesse: chesse,
            nx: nx,
            ny: ny
        }
        let d = {
            move: c
        }
        let h = JSON.stringify(d)
        this.socket.send('mymovetoinfo:' + h)
    }
    set message(message) {
        if (message.data.indexOf('连接成功targetid:') !== -1) {
            this.tagetid = message.data.split('连接成功targetid:')[1]
        }
        if (message.data.indexOf('type:') !== -1) {
            this.mytype = message.data.split('type:')[1] - 0
        }
        if (message.data.indexOf('hemovetoinfo:') !== -1) {
            this.hemove = JSON.parse(message.data.split('hemovetoinfo:')[1])
        }
        console.log(message)
        this.data = message
    }
    set mytype(v) {
        this.type = v
    }
    get mytype() {
        return this.type
    }
    set tagetid(id) {
        console.log('目标用户的id：' + id)
        this.heid = id
    }
    set hemove(move) {
        this.hestep = move
        console.log(move)
        // 获取棋子
        let y = mymap.selectchess(move.move.chesse.type, move.move.chesse.x, move.move.chesse.y)
        // 清空步长
        mymap.move(y.chessr.chess, move.move.nx, move.move.ny)
        this.hestep = undefined
        return move
    }
    get hemove() {
        return this.hestep
    }

    // 如何建立与第三方连接
    connect() {
        this.socket.send('needconnect:' + this.myid)
    }
}
// 基础权重表
var chessweightlist = {
    che: 1000,
    ma: 500,
    xiang: 100,
    shi: 100,
    jiang: 10000,
    pao: 500,
    bin: 50
}
// 机器人类
class robot {
    constructor(type, step) {
        // 控制棋子的类型
        this.type = type
        // 运算的步长
        this.step = step
        // 存储结构
        this.mycallist=[]
    }
    // 计算下一个回合
    // 对棋子进行权重赋值 将10000 车800 马炮500 象士100 兵50
    // 创建一种结构，存储下次个回合的棋子权重,
    // 初始运动，轮询所有空白位，计算各个棋子到达的权重变化 查询数据库查找专家棋盘
    // 智能应该怎么写--开局应该怎么开枚举所有111种走法？？需不需要录入棋谱
    calcularnextstep(mychessmap,map,walksteped) {
        if(walksteped){
            
        }else{

        }
    }
    // 计算总权重
    // 权重与危险和安全值相关，除将以外权重安全+100 危险-100 将危险-99999
    calweight(mychessmap,map, type) {
        let weight = 0
        map.forEach(it => {
            it.forEach(it2 => {
                if(it2.chessr){
                    weight += it2.chessr.chess.type == type ? this.calchessweight(mychessmap,it2.chessr.chess) : 0
                }
            })
        })
        return weight
    }
    // 区分函数区分棋子

    // 计算点位安全值和危险值
    caldanganres(mychessmap,map,x,y,type) {
        let safecount=0
        map.forEach(it => {
            it.forEach(it2 => {
                if(it2.chessr){
                    safecount += it2.chessr.chess.type == type ? this.calchesscanget(mychessmap,it2.chessr.chess,x,y) : -this.calchesscanget(mychessmap,it2.chessr.chess,x,y)
                }
            })
        })
        return safecount*100
    }
    // 计算某个棋子是否可到达此位置，x，y是目标的位置，
    calchesscanget(mychessmap,chess,x,y) {
        // x,y是相对与棋子的位置
        let flag=mychessmap.checkchesscanmove(chess,x-chess.x,y-chess.y)
        // 如果能到达返回1
        return flag?1:0
    }
    // 计算棋子权重
    calchessweight(mychessmap,map,chess) {
        let ininweight=chessweightlist[chess.name]
        let safeval=this.caldanganres(mychessmap,map,chess.x,chess.y,type)
        return ininweight+safeval
    }

}
// 第二个人的逻辑
// 接入第二个人的解决方案
// 从整体上来1.两个人共用一个地图map，实例在服务器保存，记住对局id，通过对局id来check棋子and修改棋子，
// 几种下棋模式，人机，人人，一个人玩，残局，不包含模式的话一个人可以操作双方棋子
// 不同的人新建一个不同的xhr脚本，使用xhr还是socket？？
// 通过xhr请求来对每次的值进行修改，象棋的话可以xhr，socket都可以
// 两个人分别用两个地图map实例，每次更新地图--效率低排除
// 棋子移动逻辑
// 不需要继承棋盘
class playmode {
    constructor() {
        // super(9,10)
        // 0人机，1人人，2oneman，3残局
        this.modelist = [0, 1, 2, 3]
        this.currentmode = undefined
        // 初始地图
        this.rawmap = undefined
        // 红方
        this.redmap = undefined
        // 黑方
        this.blackmap = undefined
        // rawchessmap
        this.chessmap = undefined
        this.player1 = undefined
        this.player2 = undefined
        // 网络连接类mode 1生效
        this.serversocket = undefined
        // 人机连接类mode 0生效
        this.robot = undefined
        this.selectmode(1)
        // type
    }
    selectmode(index) {
        this.currentmode = this.modelist[index]
        // 暂未增加根据mode进行判断的逻辑
        this.chessmap = new mychessmap(9, 10)
        // 生成地图
        this.map = this.chessmap.map
        if (index == 1) {
            this.serversocket = new socketconnect('ws://localhost:8888')
        }
        // 生成玩家id
        this.playerinit(1, 2)
    }
    move(chesse, nx, ny) {
        if (this.currentmode == 1 && !this.serversocket.hemove) {
            this.serversocket.move(chesse, nx, ny)
        }
        this.chessmap.move(chesse, nx, ny)
        // 通知红黑棋子表更新
        this.map = this.chessmap.map
    }
    // 用来区分棋盘和棋子
    selectchess(type, x, y) {
        let select = type == 1 ? this.redmap : this.blackmap
        console.log(x, y, type)
        console.log(select)
        let c = select.find(it => it.chessr && it.chessr.chess.x == x && it.chessr.chess.y == y)
        console.log(c)
        if (!c) {
            throw Error('棋子选择错误')
        }
        return c
    }
    set map(map) {
        this.rawmap = map
        // 红棋
        let red = []
        let black = []
        // 红黑棋子
        map.forEach(it => {
            red = red.concat(it.filter(itm => itm.chessr && itm.chessr.chess.type == 1))
            black = black.concat(it.filter(itm => itm.chessr && itm.chessr.chess.type == -1))
        })
        this.redmap = red
        // 黑棋
        this.blackmap = black
        return this.rawmap
    }
    get map() {
        return this.rawmap
    }
    // 清空棋盘退出游戏
    clearmode() {
        this.currentmode = undefined
        this.map = undefined
        this.player1 = undefined
        this.player2 = undefined
    }
    // 初始化玩家
    playerinit(id1, id2) {
        // 随机颜色
        let type = Math.floor(Math.random() * 2)
        type = type == 1 ? 1 : -1
        this.player1 = {
            id: id1,
            type: type
        }
        this.player2 = {
            id: id2,
            type: 0 - type
        }
    }
    // 匹配玩家
    getplayer() {}
    // 匹配人机
    getcomputer() {}
    // 匹配自身
    getmyself() {}
    // 玩家相互连接的socket
    netbyplayer() {}
}

// 68719476736 68亿 用什么判断优劣
// var mymap=new mychessmap(9,10)
var mymap = new playmode()
// console.log(mymap)
// mymap.map[0][0]
// mymap.map[0][0].chessr.chess.move(1,1)
// x,y
// mymap.move(mymap.map[0][1].chessr.chess,1,2)
// // mymap.move(mymap.map[9][10].chessr.chess,1,0)
// console.log(mymap.historymap.length)
// console.log(mymap.historymap)

export {
    mymap
}
// console.log(mymap)
// // console.log(mymap.chesslist)
// console.log(mymap.map)
// console.log(mymap.chesslist.length)