'use strict'

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const resilient = require('resilient')

let CircuitBreaker = require('./patterns/circuitBreaker')
let circuitBreaker = new CircuitBreaker(3, 3000);

const app = express()

const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log('Server started on port ' + port)
})
app.use(cors())
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

const servers = {
  itemService: [
    'http://localhost:8001',
    'http://localhost:8002',
    'http://185.251.91.187:1824'
  ],
  orderService : [
    'http://185.251.91.187:1809'
  ],
  paymentService : [
    'http://185.251.91.187:1810',
    'http://185.251.91.187:1811'
  ]
}

let itemService = resilient({ service: { basePath: '', servers: servers.itemService, timeout: 1000 }})//Ilya
let orderService = resilient({ service: { basePath: '', servers: servers.orderService, timeout: 1000 }}) //Polina
let paymentService = resilient({ service: { basePath: '', servers: servers.paymentService, timeout: 1000 }}) //Dima

const items = express.Router();
const orders = express.Router();
const payment = express.Router();



items.get('', async (req, res) => {
  if (circuitBreaker.is_ok(req.originalUrl)) {
    itemService.get(req.originalUrl).then(function (result) {
      if (result.status === 200) {
        console.log('Success:', result.data)
        res.send(result.data)
      }
    }).catch(function (err) {
      circuitBreaker.req_error(req.originalUrl);
      res.send({ cod : 504 })
    })
  } else res.send({ cod : 423 })
})

items.get('/:item_id', async (req, res) => {
  if (circuitBreaker.is_ok(req.originalUrl)) {
    itemService.get(req.originalUrl).then(function (result) {
      if (result.status === 200) {
        console.log('Success:', result.data)
        res.send(result.data)
      }
    }).catch(function (err) {
      circuitBreaker.req_error(req.originalUrl);
      res.send({ cod : 504 })
    })
  } else res.send({ cod : 423 })
})

items.post('', async (req, res) => {
  if (circuitBreaker.is_ok(req.originalUrl)) {
    itemService.post(req.originalUrl, { data : JSON.stringify(req.body) }).then(function (result) {
      if (result.status === 200) {
        console.log('Success:', result.data)
        res.send(result.data)
      }
    }).catch(function (err) {
      circuitBreaker.req_error(req.originalUrl);
      res.send({ cod : 504 })
    })
  } else res.send({ cod : 423 })
})

items.put('/:id/addition/:amount', async (req, res) => {
  if (circuitBreaker.is_ok(req.originalUrl)) {
    itemService.put(req.originalUrl).then(function (result) {
      if (result.status === 200) {
        console.log('Success:', result.data)
        res.send(result.data)
      }
    }).catch(function (err) {
      circuitBreaker.req_error(req.originalUrl);
      res.send({ cod : 504 })
    })
  } else res.send({ cod : 423 })
})

orders.get('', async (req, res) => {
  if (circuitBreaker.is_ok(req.originalUrl)) {
    orderService.get(req.originalUrl).then(function (result) {
      if (result.status === 200) {
        console.log('Success:', result.data)
        res.send(result.data)
      }
    }).catch(function (err) {
      circuitBreaker.req_error(req.originalUrl);
      res.send({ cod : 504 })
    })
  } else res.send({ cod : 423 })
})

orders.get('/:order_id', async (req, res) => {
  if (circuitBreaker.is_ok(req.originalUrl)) {
    orderService.get(req.originalUrl).then(function (result) {
      if (result.status === 200) {
        console.log('Success:', result.data)
        res.send(result.data)
      }
    }).catch(function (err) {
      circuitBreaker.req_error(req.originalUrl);
      res.send({ cod : 504 })
    })
  } else res.send({ cod : 423 })
})

orders.post('/:username', async (req, res) => {
  if (circuitBreaker.is_ok(req.originalUrl)) {
    orderService.post(req.originalUrl).then(function (result) {
      if (result.status === 200) {
        console.log('Success:', result.data)
        res.send(result.data)
      }
    }).catch(function (err) {
      circuitBreaker.req_error(req.originalUrl);
      res.send({ cod : 504 })
    })
  } else res.send({ cod : 423 })
})

orders.post('/:order_id/item', async (req, res) => {
  if (circuitBreaker.is_ok(req.originalUrl)) {
    orderService.post(req.originalUrl, { data : JSON.stringify(req.body) }).then(function (result) {
      if (result.status === 200) {
        console.log('Success:', result.data)
        res.send(result.data)
      }
    }).catch(function (err) {
      circuitBreaker.req_error(req.originalUrl);
      res.send({ cod : 504 })
    })
  } else res.send({ cod : 423 })
})

orders.put('/:order_id/status/:status', async (req, res) => {
  if (circuitBreaker.is_ok(req.originalUrl)) {
    orderService.put(req.originalUrl).then(function (result) {
      if (result.status === 200) {
        console.log('Success:', result.data)
        res.send(result.data)
      }
    }).catch(function (err) {
      circuitBreaker.req_error(req.originalUrl);
      res.send({ cod : 504 })
    })
  } else res.send({ cod : 423 })
})

payment.put('/:order_id/payment', async (req, res) => {
  if (circuitBreaker.is_ok(req.originalUrl)) {
    paymentService.put(req.originalUrl, { data : JSON.stringify(req.body) }).then(function (result) {
      if (result.status === 200) {
        console.log('Success:', result.data)
        res.send(result.data)
      }
    }).catch(function (err) {
      circuitBreaker.req_error(req.originalUrl);
      res.send({ cod : 504 })
    })
  } else res.send({ cod : 423 })
})

app.use('/api/warehouse/items', items);
app.use('/api/orders', orders);
app.use('/api/orders', payment);

// app.all('*', async (req, res) => {})
