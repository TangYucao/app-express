const express = require("express");
const Joi = require("joi"); //用来验证post的用户输入是否符合规则，比如密码长度至少8位

const app = express();
app.use(express.json());
//npm i -g nodemon
//nodemon index.js
// app.get();这个express框架使得http get不需要if语句。
// app.post();new
// app.put();update
// app.delete();
courses = [
  {
    id: 1,
    name: "260p"
  },
  {
    id: 2,
    name: "271p"
  },
  {
    id: 3,
    name: "238p"
  }
];
app.get("/", (req, res) => {
  res.send("hello world!!");
});
app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find(c => c.id == parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with the given ID was not found.");
  res.send(course);
});

app.post("/api/courses", (req, res) => {
  const result = validateCourse(req.body);
  if (result.error) {
    //400 bad request
    res.status(400).send(result.error.details[0].message);
    return;
  }
  const course = {
    id: courses.length + 1,
    name: req.body.name
  };
  courses.push(course);
  res.send(course);
});
app.put("/api/courses/:id", (req, res) => {
  //not exist return 404
  const course = courses.find(c => c.id == parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with the given ID was not found.");

  //invalid input return 400
  const result = validateCourse(req.body);
  if (result.error)
    //400 bad request
    return res.status(400).send(result.error.details[0].message);
  //update course return the updated course
  course.name = req.body.name;
  res.send(course);
});
app.delete("/api/courses/:id", (req, res) => {
  //not exist return 404
  const course = courses.find(c => c.id == parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with the given ID was not found.");

  //update courses
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(courses);
});

// export PORT = 5000
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port} ....`));
function validateCourse(course) {
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };
  return Joi.validate(course, schema);
}
