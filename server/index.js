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

app.use(function timeLog(req, res, next) {
  //console.log('Time: ', Date.now());
  next();
});

const servers = {
  itemService: [
    'http://item-service:1824'
  ],
  orderService : [
    'http://order-service:1809'
  ],
  paymentService : [
    'http://payment-service:1810'
  ]
}

let itemService = resilient({ service: { basePath: '', servers: servers.itemService, timeout: 5000 }})//Ilya
let orderService = resilient({ service: { basePath: '', servers: servers.orderService, timeout: 5000 }}) //Polina
let paymentService = resilient({ service: { basePath: '', servers: servers.paymentService, timeout: 5000 }}) //Dima
//
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
      console.log(err)
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
      console.log(err)
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
      console.log(err)
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
      console.log(err)
      circuitBreaker.req_error(req.originalUrl);
      res.send({ cod : 504 })
    })
  } else res.send({ cod : 423 })
})

orders.get('', async (req, res) => {
  if (circuitBreaker.is_ok(req.originalUrl)) {
    console.log(req.originalUrl);
    orderService.get(req.originalUrl).then(function (result) {
      if (result.status === 200) {
        console.log('Success:', result.data)
        res.send(result.data)
      }
    }).catch(function (err) {
      console.log(err)
      circuitBreaker.req_error(req.originalUrl);
      res.send({ cod : 504 })
    })
  } else res.send({ cod : 423 })
})

orders.get('/:order_id([0-9])', async (req, res) => {
  if (circuitBreaker.is_ok(req.originalUrl)) {
    orderService.get(req.originalUrl).then(function (result) {
      if (result.status === 200) {
        console.log('Success:', result.data)
        res.send(result.data)
      }
    }).catch(function (err) {
      console.log(err)
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
      console.log(err)
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
      console.log(err)
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
      console.log(err)
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
      console.log(err)
      circuitBreaker.req_error(req.originalUrl);
      res.send({ cod : 504 })
    })
  } else res.send({ cod : 423 })
})

orders.get('/allnames', async (req, res) => {
  let time =Date.now();
  if (circuitBreaker.is_ok(req.originalUrl)) {
    await orderService.get('/api/orders').then(async function (result) {
      if (result.status === 200) {
        let array_id = [];
        for (let order of JSON.parse(result.data)) {
          for (let item of order.items){
            array_id.push(item.id);
          }
        }
        let set_id = Array.from(new Set(array_id))
        let set_names = [];
        for (let i = 0; i < set_id.length; i++){
          await itemService.get('/api/warehouse/items/' + set_id[i]).then(async function (result) {
            if (result.status === 200) {
              set_names.push({ id: set_id[i], name: JSON.parse(result.data).name})
            }
          })
        }
        res.send(set_names)
      }
    }).catch(function (err) {
      console.log(err)
      circuitBreaker.req_error(req.originalUrl);
      res.send({ cod : 504 })
    })
  } else res.send({ cod : 423 })
})

app.use('/api/warehouse/items', items);
app.use('/api/orders', orders);
app.use('/api/orders', payment);

// app.all('*', async (req, res) => {})
