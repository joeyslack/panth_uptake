import * as fs from 'fs'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config()
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

import Fastify from 'fastify'

const API_KEY = process.env.API_KEY

const app = Fastify({
  logger: true
})

// Declare a route
app.get('/', function (req, reply) {
  reply.send({ 'Panth.ai': 'Learning Index ONLINE. Please provide API_KEY for active usage' })
})

// Run the server!
app.listen({port: 3000}, async (err, address) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
  app.log.info(`server listening on ${address}`)
})


app.get('/list', function (req, reply) {
  // var items = glob('/buceket/.pdf');
  // reply.send({ 'Panth.ai': 'Learning Index' })

  if (!req.query['API_KEY']) {
    return reply.send({error: 'NO API KEY PROVIDED'})
  }

  var files = [];
  fs.readdirSync('./files').forEach(file => {
    files.push('http://localhost:3000/' + file);
  });


  reply.send({files: files});
})

app.get('/*', async function (req, reply) {

  const { data, error } = await supabase
  .from('access')
  .insert([
    { key: API_KEY, file: req.params },
  ])
  .select()

  reply.send({record: "UPSERT COMPLETE"})
})
