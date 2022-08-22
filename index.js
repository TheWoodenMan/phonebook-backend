const http = require("http");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(express.json());
const PORT = 3001;

// ********** Content ************
let persons = [
	{
		"id": 1,
		"name": "Arto Hellas",
		"number": "040-123456",
	},
	{
		"id": 2,
		"name": "Ada Lovelace",
		"number": "39-44-5323523",
	},
	{
		"id": 3,
		"name": "Dan Abramov",
		"number": "12-43-234345",
	},
	{
		"id": 4,
		"name": "Mary Poppendieck",
		"number": "39-23-6423122",
	},
];

// ********** Handlers ************

// Load landing page
app.get("/", (req, res) => {
	res.send(
		"<h1>Welcome to the Phone Book</h2><a href='/info'><span>Info Page</span></a>"
	);
});

// Return the whole list
app.get("/api/persons", (req, res) => {
	res.json(persons);
});

// Load info page
app.get("/info", (req, res) => {
	let totalPersons = persons.length;
	let timeNow = new Date();
	res.send(
		`<h1>Welcome to the Phone Book</h2> <span>Phonebook has info for ${totalPersons} people</span><br/><span>${timeNow}</span></span><br/><a href='/'><span>Home</span></a>`
	);
});

// Handle request for a single record, n.b. must be a number to match the type of the key in the db
app.get("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id);
	console.log(id);
	const person = persons.find((person) => person.id === id);
	console.log(person);
	if (person) {
		res.json(person);
	} else {
		res.status(404).end();
	}
});

// Delete a single entry, this works by re-filtering the list and excluding the matching id.
// Works since persons is an array of objects.

app.delete("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id);
	persons = persons.filter((person) => person.id !== id);
	res.status(204).end();
});

app.post("/api/persons/", (req, res) => {
	const body = req.body;

	// function to generate a new random id number as requested modified to
	// return a sequential id which is much better practice.
	// const newId = function () {
	//  return Math.ceil(Math.random() * 10000 + persons.length) // example of rand ID but not needed.
	// 	return persons.length + 1;
	// };

	const newId = () => {
		const maxId =
			persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
		return maxId + 1;
	};

	// error message if empty,  calling the return stops the function here
	// if (!body.content) {
	// 	console.log(body.content);
	// 	return res.status(400).json({
	// 		error: "content missing",
	// 	});
	// }

	if (persons.some((person) => body.name === person.name)) {
		return res.status(406).json({
			error: "name must be unique",
		});
	}

	// throw an error if no name or number, else standardise format of the output and
	if (!body.name) {
		return res.status(400).json({
			error: "missing name",
		});
	}

	if (!body.number) {
		return res.status(400).json({
			error: "missing number",
		});
	}
	// } else {
	const person = {
		id: newId(),
		name: body.name,
		number: body.number,
	};

	persons.push(person);

	res.json(person);
});
// });

// ********** Server ************

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
