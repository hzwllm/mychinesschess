// http://47.101.149.254:59000
var serverTarget = 'technogym1.idigitalforce.com';
exports.transrou = [{
        ip: serverTarget,
        proxy: 'https',
        host: '',
        route: '/manage'
    },
    {
        ip: serverTarget,
        proxy: 'https',
        host: '',
        route: '/vimg'
    },
    {
        ip: serverTarget,
        proxy: 'https',
        host: '',
        route: '/openapi'
    },{
        ip: serverTarget,
        proxy: 'https',
        host: '',
        route: '/rs'
    },
    {
        ip: serverTarget,
        proxy: 'https',
        host: '',
        route: '/client'
    },
]
// '/manage': {
//     target: serverTarget ,
//     changeOrigin: true
//   },
//   '/openapi': {
//     target: serverTarget,
//     changeOrigin: true
//   },
//   '/rs': {
//     target: serverTarget ,
//     changeOrigin: true
//   },
//   '/vimg': {
//     target: serverTarget,
//     changeOrigin: true
//   },
//   '/client': {
//     target: serverTarget,
//     changeOrigin: true
//   },