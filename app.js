const { program } = require('commander')
const express = require('express')

program
	.requiredOption('-h, --host <host>', 'Server host')
	.requiredOption('-p, --port <port>', 'Server port')
	.requiredOption('-c, --cache <cacheDir>', 'Cache directory')

program.parse(process.argv)
const options = program.opts()

const app = express()
const PORT = options.port
const HOST = options.host

app.listen(PORT, HOST, () => {
	console.log(`Server running at http://${HOST}:${PORT}`)
})
