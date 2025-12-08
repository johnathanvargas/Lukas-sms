const express = require('express')
const cors = require('cors')
const supabase = require('./supabaseClient')
const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/plants', async (req, res) => {
  const { data, error } = await supabase.from('plants').select('*').limit(100)
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

app.get('/health', (req, res) => res.send('OK'))

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server listening on ${port}`))
