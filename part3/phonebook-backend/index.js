require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const Contact = require("./models/contact");
const cors = require("cors");

app.use(cors());
app.use(express.static("build"));
app.use(express.json());

//Method - Url - Status - Content Length - Response Time - res object
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

morgan.token("body", function (req) {
  return JSON.stringify(req.body);
});

app.get("/", (request, response) => {
  response.send("<h1>Dev Server!</h1>");
});

app.get("/info", (req, res) => {
  Contact.find({}).then((contacts) => {
    res.send(`<div>
    <div>Phonebook has info for ${contacts.length} people</div>
    <div>${new Date().toString()}</div>
    </div>`);
  });
});

app.get("/api/persons", (req, res) => {
  Contact.find({}).then((persons) => {
    res.json(persons.map((person) => person.toJSON()));
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Contact.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person.toJSON());
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  //We do not need this because we are using Mongoose Validators which are set on the schema to require both name and number
  // if (body.name === undefined || body.number === undefined) {
  //   return response.status(400).json({ error: "content missing" });
  // }

  const contact = new Contact({
    name: body.name,
    number: body.number,
  });

  contact
    .save()
    .then((savedContact) => {
      response.json(savedContact.toJSON());
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const contact = {
    name: body.name,
    number: body.number,
  };

  Contact.findByIdAndUpdate(request.params.id, contact, { new: true })
    .then((updatedContact) => {
      response.json(updatedContact.toJSON());
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Contact.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError" && error.message.includes("ObjectId")) {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
