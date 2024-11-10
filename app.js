const { program } = require('commander')
const express = require('express')
const fs = require('fs')
const path = require('path')

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

const notesDir = options.cache

app.get('/notes/:noteName', (req, res) => {
	const notePath = path.join(notesDir, req.params.noteName)
	if (!fs.existsSync(notePath)) {
		return res.status(404).send('Not found')
	}
	const noteContent = fs.readFileSync(notePath, 'utf-8')
	res.send(noteContent)
})

app.put('/notes/:noteName', express.text(), (req, res) => {
	const notePath = path.join(notesDir, req.params.noteName)
	if (!fs.existsSync(notePath)) {
		return res.status(404).send('Not found')
	}
	fs.writeFileSync(notePath, req.body)
	res.send('Updated')
})

app.delete('/notes/:noteName', (req, res) => {
	const notePath = path.join(notesDir, req.params.noteName)
	if (!fs.existsSync(notePath)) {
		return res.status(404).send('Not found')
	}
	fs.unlinkSync(notePath)
	res.send('Deleted')
})

app.get('/notes', (req, res) => {
	const notes = fs.readdirSync(notesDir).map(name => ({
		name,
		text: fs.readFileSync(path.join(notesDir, name), 'utf-8'),
	}))
	res.json(notes)
})

app.post('/write', express.urlencoded({ extended: true }), (req, res) => {
	const notePath = path.join(notesDir, req.body.note_name)
	if (fs.existsSync(notePath)) {
		return res.status(400).send('Note already exists')
	}
	fs.writeFileSync(notePath, req.body.note)
	res.status(201).send('Created')
})

app.get('/UploadForm.html', (req, res) => {
	res.sendFile(path.join(__dirname, 'UploadForm.html'))
})