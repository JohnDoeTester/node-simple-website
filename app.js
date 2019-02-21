var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var nodemailer = require("nodemailer");

var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function(req, res) {
  res.render("index", { title: "Computer Not Working?" });
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.get("/contact", function(req, res) {
  res.render("contact");
});

app.post("/contact/send", function(req, res) {
  let { name, email, message } = req.body;
  console.log(name);
  console.log(email);
  console.log(message);
  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let account = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "erin.purdy6@ethereal.email", // generated ethereal user
        pass: "bGdyQV1akq5a2FFAdZ" // generated ethereal password
      }
    });

    // setup email data with unicode symbols
    let mailOptions = {
      from: name + email, // sender address
      to: "erin.purdy6@ethereal.email", // list of receivers
      subject: "Submit from website", // Subject line
      text: message, // plain text body
      html: "<b>messages</b>" // html body
    };

    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions);

    console.log("Message sent: %s", info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  }

  main().catch(console.error);
});

app.listen(3000);
console.log("Server is running on port 3000...");
