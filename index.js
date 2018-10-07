const Koa = require('koa')
const Router = require('koa-router')
const koaBody = require('koa-body')

const routes = require('./routes')
const errorHandler = require('./middlewares/errorHandler')
const resolver = require('./middlewares/resolver')

const app = new Koa()
const router = new Router()

routes(router)

app
  .use(errorHandler)
  .use(resolver)
  .use(koaBody({ multipart: true }))
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(3000);