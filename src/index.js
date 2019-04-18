import './css/x.scss'
import a from './a'
import c from './c'
import _ from 'lodash'

console.log(_)
$('body').append('<div>123456</div>')
console.log(1 + a.a, c.c)
new Promise((resove, reject) => {
    console.log('promise')
})
//如果有需要babel-polyfill转义的语法 那么会打包到vender.js里面 因为走的是node_module

// import '@babel/polyfill' 
// "useBuiltIns": "usage",  可以注掉polyfill