import Express from 'express'
import commitRepository from './Entity/commit.js'
import 'dotenv/config'
import { Octokit } from '@octokit/core'
import bodyParser from 'body-parser'

const app = new Express()
const port = 3001

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/commits', async (req, res) => {
  const commits = await commitRepository.search().return.all();

  res.json(commits)
})

app.post('/search', async (req, res) => {
  console.log(req.body.message)
  const commits = await commitRepository.search().where('message').matches(req.body.message).return.all()

  res.json(commits)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})