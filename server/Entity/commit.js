import { Entity, Schema } from 'redis-om'
import client from '../Client/client.js'
import { Octokit } from '@octokit/core'

class Commit extends Entity {}

client.execute(['FLUSHDB'])

const commitSchema = new Schema(Commit, {
  message: { type: 'text' },
  autor: { type: 'string' },
  url: { type: 'string' }
})

const commitRepository = client.fetchRepository(commitSchema)

await commitRepository.createIndex()

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const response = octokit.request('GET https://api.github.com/repos/{owner}/{repo}/commits', {
  owner: process.env.GITHUB_OWNER,
  repo: process.env.GITHUB_REPO
});

response.then(function(result) {
  result.data.map((commit) => {
    saveDataToRedis(
       commit.commit.message,
       commit.commit.author.name,
       commit.html_url,
     )
  })
})

function saveDataToRedis(message, author, url) {
  const commit = commitRepository.createEntity()

  commit.autor = author
  commit.message = message
  commit.url = url

  commitRepository.save(commit)
}

export default commitRepository