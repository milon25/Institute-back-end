const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./model/userModel');
const Student = require('./model/studentModel');
const Teacher = require('./model/teacherModel');
const multer = require('multer');
const Book = require('./model/bookModel');
const Payment = require('./model/paymentModel');
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
const { default: axios } = require('axios');
if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads');


const upload = multer({ storage: storage });







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




app.get('/allstudent', async (req, res) => {
  let data = await Student.find({})
  res.send(data)


});


app.get('/student/:id', async (req, res) => {

  console.log(req.params.id)
  let data = await Student.find({ _id: req.params.id })
  res.send(data)


});



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





app.get('/result', async (req, res) => {
  let data = await Result.find({}).populate("studentid")
  res.send(data)
});

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
  // return numeric with 2
  return Number(cgpa.toFixed(2));
}

// Result backend end here



// Paymnet backend start here




app.post("/payment",async (req,res)=>{
 console.log(new Date().getFullYear())
 let month = new Date().getMonth() + 1
 let date = new Date().getDate()
 let year = new Date().getFullYear()
 let amount = req.body.amount
 let trans = new Date().getTime()


 console.log(month)

let paymentCount = await Payment.find({year: year})
if (paymentCount.length != month){

  let dueAmount = (month - paymentCount.length) * 100
  amount = dueAmount

}

console.log(amount)




 let paymentExist = await Payment.findOne({month: month})
 if(paymentExist){
  return res.send({message: "Payment is done for this month"})
 }

 try {
    const payload = {
      store_id: "aamarpaytest",
      tran_id: trans,
      success_url: "http://www.merchantdomain.com/successpage.html",
      fail_url: "http://www.merchantdomain.com/failedpage.html",
      cancel_url: "http://www.merchantdomain.com/cancelpage.html",
      amount: amount,
      currency: "BDT",
      signature_key: "dbb74894e82415a2f7ff0ec3a97e4183",
      desc: "Merchant Registration Payment",
      cus_name: req.body.studentname,
      cus_email: "payer@merchantcusomter.com",
      cus_add1: "House B-158 Road 22",
      cus_add2: "Mohakhali DOHS",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1206",
      cus_country: "Bangladesh",
      cus_phone: "+8801704",
      type: "json",
    };

    // Aamarpay Sandbox URL (no hidden characters)
    const url = "https://sandbox.aamarpay.com/jsonpost.php";

    const response = await axios.post(url, payload, {
      headers: { "Content-Type": "application/json" },
    });



     let payment = new Payment ({

       date: date,
          month: month,
          year: year,
          amount: amount,
          studentname: req.body.studentname,
          trans: trans

     }).save()


    res.send(response.data);


  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Payment request failed",
      error: error.message,
    });
  }
});




app.get("/duepayment",async(req,res)=>{
   console.log(new Date().getFullYear())
 let month = new Date().getMonth() + 1
 
 let year = new Date().getFullYear()

  let paymentCount = await Payment.find({year: year})
if (paymentCount.length != month){

  let dueAmount = (month - paymentCount.length) * 100
  amount = dueAmount 

}


 let paymentExist = await Payment.findOne({month: month})

 if(paymentExist){

  
 if(paymentExist.amount != amount){
  res.send(amount - paymentExist.amount)

  res.send(amount)
 }else{
  res.send(0)
 }


 }else{
  res.send(amount
  )
 }


})






// Payment backend end here


app.listen(5000, () => {
  console.log('🚀 Server running on http://localhost:5000');
});



