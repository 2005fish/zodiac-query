import express from 'express'
import cors from 'cors'
import { config } from './config.js'
import { initSchema } from './db/schema.js'

const app = express()

app.use(cors())
app.use(express.json())

// Initialize database
initSchema()

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

app.listen(config.port, () => {
  console.log(`Server running at http://localhost:${config.port}`)
})
