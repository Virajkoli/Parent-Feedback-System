const express = require("express");
const path = require("path");
const feedback = require("./models/feedback");
const session = require("express-session");
const adminModel = require("./models/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/feedback", (req, res) => {
  res.render("feedback");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/showFeedbacks", (req, res) => {
  const message = req.query.message || ""; // Set default to an empty string if no message is provided

  feedback
    .find()
    .then((feedbacks) => {
      res.render("showFeedbacks", { feedbacks, message }); // Always pass 'message'
    })
    .catch((err) => {
      console.error("Error retrieving feedbacks:", err);
      res.status(500).send("Error retrieving feedbacks.");
    });
});

app.get("/adminDashboard" , async (req , res) => {
  let admins = await adminModel.find();
  res.render("adminDashboard" , {admins});
})

app.get("/showFeedbacks" , async (req , res) => {
  res.render("showFeedbacks");
})

app.get("/logout" , (req , res) => {
  res.cookie("token" , "");
  res.redirect("login")
})

app.post("/feedback", async (req, res) => {
  const feedbackData = new feedback({
    // Personal Information
    studentName: req.body.student_name,
    rollNo: req.body.roll_no,
    phone: req.body.phone,
    email: req.body.email,

    // Parent Information
    parentName: req.body.parent_name,
    parentPhone: req.body.parent_phone,
    parentEmail: req.body.parent_email,

    // Feedback on Student
    studentPerformance: req.body.student_performance,
    studentComments: req.body.student_comments,

    // Feedback on Teacher
    teacherAbility: req.body.teacher_ability,
    teacherComments: req.body.teacher_comments,

    // Feedback on College
    collegeFacilities: req.body.college_facilities,
    collegeComments: req.body.college_comments,

    // Feedback on Various Aspects
    attendance: req.body.attendance,
    performance: req.body.performance,
    facultyInteraction: req.body.faculty_interaction,
    examinationProcess: req.body.examination_process,
    feeStructure: req.body.fee_structure,
    resultSatisfaction: req.body.result_satisfaction,

    // Feedback on Cleanliness
    cleanliness: req.body.cleanliness,
    cleanlinessComments: req.body.cleanliness_comments,
  });

  feedbackData
    .save()
    .then(() => {
      console.log("Feedback saved successfully!");
      res.render("thanks");
    })
    .catch((err) => {
      console.error("Error saving feedback:", err);
      res.status(500).send("Error saving feedback.");
    });
});

app.post("/deleteFeedback/:id", (req, res) => {
  const feedbackId = req.params.id;

  feedback
    .findByIdAndDelete(feedbackId)
    .then(() => {
      console.log(`Feedback with ID ${feedbackId} deleted successfully.`);
      res.redirect(
        `/showFeedbacks?message=Feedback with ID ${feedbackId} deleted successfully`
      );
    })
    .catch((err) => {
      console.error("Error deleting feedback:", err);
      res.status(500).send("Error deleting feedback.");
    });
});

app.post("/adminLogin", async (req, res) => {
  let { username, password } = req.body;

  let admin = await adminModel.findOne({ username });
  if (!admin) return res.send("Something went wrong !");

  //It means user is in database , user has his/her account  so now compare the password

  bcrypt.compare(password, admin.password, (err, result) => {
    if (result) {
      let token = jwt.sign({ username: username, adminid: admin._id }, "shhhh");
      res.cookie("token", token);
      res.redirect("/adminDashboard");
    } else res.redirect("/login");
  });
});

app.post("/adminAdd", async (req, res) => {
  let { username, password } = req.body;

  let admin = await adminModel.findOne({ username });
  if (admin) return res.send("Admin already registered !");

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      let admin = await adminModel.create({
        username,
        password: hash,
      });

      let token = jwt.sign({ username: username, adminid: admin._id }, "shhhh");
      res.cookie("token", token);
      res.redirect("/adminDashboard")
    });
  });
});


app.listen(3000);
