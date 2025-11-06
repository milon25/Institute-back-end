// const express = require('express');
// const mongoose = require('mongoose');
// const User = require("./model/userModel");
// var cors = require('cors');
// // const nodemailer = require("nodemailer");
// const app = express();
// app.use(cors());


// // const transporter = nodemailer.createTransport({
// //   service: "gmail",
// //   secure: false, 
// //   auth: {
//     // user: "maddison53@ethereal.email",
// //     pass: "jn7jnAPss4f63QBp6D",
// //   },
// // });


// app.use(express.json());
// mongoose.connect('mongodb+srv://SRM:894h4q_b$WrWCW.@cluster0.kbjcadu.mongodb.net/srm?retryWrites=true&w=majority&appName=Cluster0')
//   .then(() => console.log('Connected!'));

// app.post('/registration',async (req, res) => {
//     console.log(req.body)


//     let isUserExists = await User.findOne({email: req.body.email})

//     if(isUserExists){
//         return res.send(`${req.body.email} alrady exists`)

//     }


//     let user = new User({
//         username : req.body.username,
//         email : req.body.email,
//         password : req.body.password
//     }).save()

//   res.send('Registration successfull');
// });






// app.post('/login',async (req, res) => {
//     console.log(req.body)


//     let isUserExists = await User.findOne({email: req.body.email})

//     if(!isUserExists){
//         return res.send(`${req.body.email} not found`)

//     }


//    if(isUserExists.password !== req.body.password){
//     return res.send(`Invalid credential`)
//    }

//   res.send({
//     username: isUserExists.username,
//     email: isUserExists.email

//   });

// });


// app.listen(5000, () => {
//   console.log("✅ Server running on http://localhost:5000");
// });







const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./model/userModel');
const Student = require('./model/studentModel');
const Teacher = require('./model/teacherModel');
const multer = require('multer');
const Book = require('./model/bookModel');
const Leave = require('./model/leaveModel');
const Result = require('./model/resultModel');





const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));


// ✅ MongoDB Connection
mongoose.connect(
  'mongodb+srv://SRM:894h4q_b$WrWCW.@cluster0.kbjcadu.mongodb.net/srm?retryWrites=true&w=majority&appName=Cluster0'
)
  .then(() => console.log('✅ Database connected successfully'))
  .catch(err => console.error('❌ Database connection error:', err));



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)

    console.log(file)
  }
});
const fs = require('fs');
if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads');


const upload = multer({ storage: storage });



// app.post('/uploadbook', upload.single('avatar'), function (req, res, next) {

// const book = new bookModel({
//     name: req.body.name,
//     department: req.body.department,
//     writer: req.body.writer,
//     serial: req.body.serial,
//     url: req.file.path
// }).save();

//  res.send("book uploaded");
//   // req.file is the `avatar` file
//   // req.body will hold the text fields, if there were any


//  });








// ✅ Registration Route
app.post('/registration', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).send('⚠️ All fields are required');
    }


    const isUserExists = await User.findOne({ email });
    if (isUserExists) {
      return res.status(400).send(`⚠️ ${email} already exists`);
    }


    const user = new User({ username, email, password });
    await user.save();

    res.status(201).send('✅ Registration successful');
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).send('❌ Server error during registration');
  }
});

// ✅ Login Route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send('⚠️ Email and password required');
    }

    // Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send(`❌ ${email} not found`);
    }

    // Check password
    if (user.password !== password) {
      return res.status(401).send('❌ Invalid credentials');
    }

    res.status(200).send({
      message: '✅ Login successful',
      user: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).send('❌ Server error during login');
  }
});


// student backend start here


app.post('/createstudent', async (req, res) => {
  try {
    const { studentname, departmentname, studentid, phonenumber } = req.body;

    if (!studentname || !departmentname || !studentid || !phonenumber) {
      return res.status(400).send("⚠️ All fields are required");
    }

    const student = new Student({
      studentname,
      departmentname,
      studentid,
      phonenumber
    });

    await student.save();

    res.status(201).send("✅ Student Created");
  } catch (error) {
    console.error("❌ Error creating student:", error);
    res.status(500).send("❌ Server error while creating student");
  }
});


// app.post('/createstudent', async (req, res) => {



//   let student = new Student({
//   studentname: req.body.studentname,
//   departmentname: req.body.departmentname,
//   studentid: req.body.studentid,
//   phonenumber: req.body.phonenumber
// });

// await student.save();
// res.send("✅ Student Created");
// });



app.get('/allstudent', async (req, res) => {
  let data = await Student.find({})
  res.send(data)


});


app.get('/student/:id', async (req, res) => {

  console.log(req.params.id)
  let data = await Student.find({ _id: req.params.id })
  res.send(data)


});

// app.post('/delete', async (req, res) => {
//   let data = await Student.findByIdAndDelete({_id: req.body.id})
//   res.send("Deleted")


// });


app.post('/deletestudent', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.body.id);
    res.status(200).send("✅ Student deleted successfully");
  } catch (error) {
    console.error("❌ Delete error (student):", error);
    res.status(500).send("❌ Server error while deleting student");
  }
});


app.post('/updatestudent', async (req, res) => {
  try {
    const { id, studentname, departmentname, studentid, phonenumber } = req.body;

    const updated = await Student.findByIdAndUpdate(
      id,
      { studentname, departmentname, studentid, phonenumber },
      { new: true }
    );

    if (!updated) {
      return res.status(404).send('❌ Student not found');
    }

    res.status(200).send('✅ Student updated successfully');
  } catch (error) {
    console.error('❌ Update error:', error);
    res.status(500).send('❌ Server error during update');
  }
});

// student backend end here






// tacher backend start here


app.post('/createteacher', async (req, res) => {
  try {
    const { teachername, departmentname, teacherid, phonenumber } = req.body;

    if (!teachername || !departmentname || !teacherid || !phonenumber) {
      return res.status(400).send("⚠️ All fields are required");
    }

    const teacher = new Teacher({
      teachername,
      departmentname,
      teacherid,
      phonenumber
    });

    await teacher.save();

    res.status(201).send("✅ Teacher Created");
  } catch (error) {
    console.error("❌ Error creating teacher:", error);
    res.status(500).send("❌ Server error while creating teacher");
  }
});


// app.post('/createstudent', async (req, res) => {



//   let student = new Student({
//   studentname: req.body.studentname,
//   departmentname: req.body.departmentname,
//   studentid: req.body.studentid,
//   phonenumber: req.body.phonenumber
// });

// await student.save();
// res.send("✅ Student Created");
// });



app.get('/allteacher', async (req, res) => {
  let data = await Teacher.find({})
  res.send(data)


});


app.get('/teacher/:id', async (req, res) => {

  console.log(req.params.id)
  let data = await Teacher.find({ _id: req.params.id })
  res.send(data)


});

// app.post('/delete', async (req, res) => {
//   let data = await Teacher.findByIdAndDelete({_id: req.body.id})
//   res.send("Deleted")


// });


app.post('/deleteteacher', async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.body.id);
    res.status(200).send("✅ Teacher deleted successfully");
  } catch (error) {
    console.error("❌ Delete error (teacher):", error);
    res.status(500).send("❌ Server error while deleting teacher");
  }
});

app.post('/updateteacher', async (req, res) => {
  try {
    const { id, teachername, departmentname, teacherid, phonenumber } = req.body;

    const updated = await Teacher.findByIdAndUpdate(
      id,
      { teachername, departmentname, teacherid, phonenumber },
      { new: true }
    );

    if (!updated) {
      return res.status(404).send('❌ Teacher not found');
    }

    res.status(200).send('✅ Teacher updated successfully');
  } catch (error) {
    console.error('❌ Update error:', error);
    res.status(500).send('❌ Server error during update');
  }
});

// tacher backend end here





// PDF backend start here


app.post('/uploadbook', upload.single('avatar'), async (req, res) => {
  try {
    const newBook = await new Book({
      name: req.body.name,
      department: req.body.department,
      writer: req.body.writer,
      serial: req.body.serial,
      url: req.file.path
    }).save();

    res.status(201).send({ message: "✅ Book uploaded", book: newBook });
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Server error while uploading book");
  }
});





// app.post('/createbook', async (req, res) => {
//   try {
//     const { name, department, writer, serial, file } = req.body;

//     if (!name || !department || !writer || !serial || !file) {
//       return res.status(400).send("⚠️ All fields are required");
//     }

//     const book = new Book({
//       name,
//       department,
//       writer,
//       serial
//     });

//     await book.save();

//     res.status(201).send("✅ Book Created");
//   } catch (error) {
//     console.error("❌ Error creating book:", error);
//     res.status(500).send("❌ Server error while creating book");
//   }
// });




app.get('/allbook', async (req, res) => {
  let data = await Book.find({})
  res.send(data)


});


app.get('/book/:id', async (req, res) => {

  console.log(req.params.id)
  let data = await Book.find({ _id: req.params.id })
  res.send(data)


});



app.post('/deletebook', async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.body.id);
    res.status(200).send("✅ Book deleted successfully");
  } catch (error) {
    console.error("❌ Delete error (book):", error);
    res.status(500).send("❌ Server error while deleting book");
  }
});

// PDF backend end here





// Leave backend start here

app.post("/leave", async (req, res) => {
  try {
    const { studentname, departmentname, studentid } = req.body;
    let existingLeave = await Leave.findOne({ studentid });

    if (existingLeave) {
      existingLeave.total += 1;
      await existingLeave.save();
      return res.send(existingLeave);
    }

    const newLeave = new Leave({ studentname, departmentname, studentid });
    await newLeave.save();
    res.send(newLeave);
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Error creating leave");
  }
});

// ✅ READ all Leave
app.get("/leave", async (req, res) => {
  const leaves = await Leave.find();
  res.send(leaves);
});

// ✅ UPDATE Leave (Render-safe POST fallback)
app.post("/updateleave", async (req, res) => {
  try {
    const { id, studentname, departmentname, studentid } = req.body;
    const updatedLeave = await Leave.findByIdAndUpdate(
      id,
      { studentname, departmentname, studentid },
      { new: true }
    );
    res.send(updatedLeave);
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Error updating leave");
  }
});

// ✅ DELETE Leave (Render-safe POST fallback)
app.post("/deleteleave", async (req, res) => {
  try {
    const { id } = req.body;
    const deletedLeave = await Leave.findByIdAndDelete(id);
    res.send({ message: "🗑️ Leave deleted successfully", deletedLeave });
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Error deleting leave");
  }
});



// Leave backend end here







// Result backend start here





// app.post("/result", async (req, res) => {
  
//   // console.log(req.body.studentid)
//   // console.log(req.body.departmentname)
//   // console.log(req.body.result)

 

//   let result = new Result ({

//     studentid: req.body.studentid,
//     departmentname: req.body.departmentname,
//     result: req.body.result, 
//     cgpa: gpaCalculation(req.body.result)

//   }).save()

//   res.send("Result Publish")
// });



// function gpaCalculation(result){
//  let total = 0
//   result.map((item)=>{
//     console.log(item.result)
//     if(item >= 80){
//       total += 4
//     }else if (item.result >= 75){
//       total += 3.75
//     }else if(item.result >= 70){
//       total += 3.50
//     }else if (item.result >= 60){
//       total += 3.25
//     }else if ( item.result >= 55){
//       total += 3.00
//     }else if ( item.result <= 50){
//       total += 0
//     }

//   })

//   let cgpa = total / result.length
//    return cgpa.toFixed(2)
// }



// app.get('/result', async (req, res) => {
//   let data = await Result.find({}).populate("studentid")
//   res.send(data)
// });




app.post("/result", async (req, res) => {
  try {
    const { studentid, departmentname, result } = req.body;

    if (!studentid || !departmentname || !Array.isArray(result)) {
      return res.status(400).send({ error: "Missing fields or invalid result format" });
    }

    // obossoi number dite hobe
    const normalized = result.map(r => ({
      subject: r.subject || "",
      result: Number(r.result) || 0
    }));

    const cgpa = gpaCalculation(normalized);

    const saved = await new Result({
      studentid,
      departmentname,
      result: normalized,
      cgpa
    }).save();

    res.status(201).send({ message: "Result Published", saved });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Server error" });
  }
});

// DELETE route  r rsult remove
app.delete("/result/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const removed = await Result.findByIdAndDelete(id);
    if (!removed) return res.status(404).send({ error: "Result not found" });
    res.send({ message: "Result deleted", removed });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Server error" });
  }
});

function gpaCalculation(resultArray){
  // resultArray should be [{subject, result:number}, ...]
  if (!Array.isArray(resultArray) || resultArray.length === 0) return 0.00;

  const getGradePoint = (score) => {
    const s = Number(score);
    if (isNaN(s)) return 0.0;
    if (s >= 80) return 4.00;
    if (s >= 75) return 3.75;
    if (s >= 70) return 3.50;
    if (s >= 65) return 3.25;
    if (s >= 60) return 3.00;
    if (s >= 55) return 2.75;
    if (s >= 50) return 2.50;
    if (s >= 45) return 2.25;
    if (s >= 40) return 2.00;
    return 0.00;
  };

  let totalPoints = 0;
  let subjectCount = 0;

  resultArray.forEach(item => {
    const score = item.result !== undefined ? Number(item.result) : 0;
    const gp = getGradePoint(score);
    totalPoints += gp;
    subjectCount += 1;
  });

  if (subjectCount === 0) return 0.00;
  const cgpa = totalPoints / subjectCount;
  // return numeric with 2 decimals
  return Number(cgpa.toFixed(2));
}






// Result backend end here


// ✅ Start Server
app.listen(5000, () => {
  console.log('🚀 Server running on http://localhost:5000');
});











