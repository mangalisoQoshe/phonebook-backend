require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const Person = require("./models/person");

app.use(express.static("dist"));
app.use(express.json());
app.use(cors());
morgan.token("req-body", (req) => JSON.stringify(req.body));
app.use(
  morgan(
    ":method :url :status :response-time ms - :res[content-length] :req-body"
  )
);

app.get("/info", (request, response) => {
  const currentTime = new Date();
  const sizePhonebook = Phonebook.length;
  response.send(
    `<p>Phonebook has info for ${sizePhonebook} <br /> ${currentTime}</p>`
  );
});

app.get("/api/persons/", (request, response) => {
  Person.find({}).then((person) => {
    response.json(person);
  });
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

app.delete("/api/persons/:id", (request, response) => {
  console.log("hey", request.params.id);
  Person.deleteOne({_id:request.params.id}).then((deletedPerson) => {
  });
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({ error: "Name and number not found" });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((Savedperson) => {
    response.json(Savedperson);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
