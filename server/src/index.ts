import express, { Request, Response } from 'express'
import cors from 'cors'
import { errorHandler } from './middlewares/errorHandler.js'
import configs from './configs/index.js'

const app = express()

app.use(express.json())
app.use(
  cors({
    origin: [configs.clientUrl],
  }),
)

app.all('/ping', (req: Request, res: Response) => {
  res.send('pong')
})

app.use(errorHandler)

app.listen(configs.port, () => console.log(`Server up on port ${configs.port}`))
