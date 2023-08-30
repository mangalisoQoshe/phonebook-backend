const express = require("express");
const morgan = require("morgan");
const cors = require("cors")
const app = express();

app.use(express.static("dist"))
app.use(express.json());
app.use(cors())
morgan.token("req-body", (req) => JSON.stringify(req.body));
app.use(
  morgan(
    ":method :url :status :response-time ms - :res[content-length] :req-body"
  )
);

let Phonebook = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/info", (request, response) => {
  const currentTime = new Date();
  const sizePhonebook = Phonebook.length;
  response.send(
    `<p>Phonebook has info for ${sizePhonebook} <br /> ${currentTime}</p>`
  );
});

app.get("/api/persons/", (request, response) => {
  response.json(Phonebook);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const entry = Phonebook.find((e) => e.id === id);
  entry
    ? response.json(entry)
    : response.status(400).json({ error: "content missing" });
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  Phonebook = Phonebook.filter((phonebook) => phonebook.id !== id);
  response.status(204).end();
});

const generateId = () => {
  const maxId =
    Phonebook.length > 0
      ? Math.max(...Phonebook.map((phonebook) => phonebook.id))
      : 0;
  return maxId + 1;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;
  const NameExist = Phonebook.some((phonebook) => phonebook.name === body.name);
  if (!body.name || !body.number || NameExist) {
    return response.status(400).json({ error: "name must be unique" });
  }
  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };
  Phonebook = Phonebook.concat(person);
  response.json(person);
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
