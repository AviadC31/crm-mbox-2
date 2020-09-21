const api = require('./server/api')
const express = require('express')
const path = require('path')
const index = require('postcss-normalize')
const app = express()
const port = process.env.PORT || 5000

app.use(express.static(path.join(__dirname, 'node_modules')))
app.use(express.urlencoded({ extended: false }))
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
  next()
})

app.use(express.json())
app.use(express.static('build'))
// app.use("*", (req, res) => res.sendFile(path.resolve("build", "index.html")));

app.use('/api/', api)
// if(process.env.NODE_ENV === 'production'){
//   app.use(express.static('client/build'))
//   app.get('*',(req,res)=>{
//     res.sendFile((path.join(__dirname, 'crmApp','build','index.html')))
//   })
// }



app.listen(port, () => console.log(`server up and running on port ${port}`))