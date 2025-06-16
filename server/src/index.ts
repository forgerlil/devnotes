import express from 'express'
import cors from 'cors'
import { errorHandler } from './middlewares/errorHandler.js'
import configs from './configs/index.js'
import routes from './routes/index.js'

const app = express()

app.use(express.json())
app.use(
  cors({
    origin: [configs.clientUrl],
  }),
)
app.use(routes)
app.use(errorHandler)

app.listen(configs.port, () => console.log(`Server up on port ${configs.port}`))
