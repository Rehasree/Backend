require("dotenv").config();
const { static, Router } = require("express");
const express = require("express");
const path = require("path")
const hbs = require("hbs")
const ejs = require("ejs")
const passport = require("passport")
const localStrategy = require("passport-local")
const methodOverride = require("method-override")
const fs = require("fs")
const bcrypt = require("bcryptjs")
const multer = require("multer")
var upload = multer({ dest: "./assets/uploads/" })
// const { isAuthenticated } = require("./middleware/index")
//var uploadForGigs = multer({ dest: "./assets/uploadsForGigs/" })


const app = express();
require("./db/conn")
const Register = require("./models/register")
const ProjectPart = require("./models/projectEditSchema");
const GigPart = require("./models/anmol");
const EditProfile = require("./models/editProfile");
const { isLoggedIn } = require("./middleware/index")


const bodyParser = require("body-parser");
const editProfile = require("./models/editProfile");
const { profile } = require("console");

const port = process.env.PORT || 3003;

const static_path = path.join(__dirname, "../assets")


const storage = multer.diskStorage({
    destination: "./assets/uploads/",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
})
// const storage = multer.diskStorage({
//     destination: "./assets/uploadsForGigs/",
//     filename2: (req, file, cb) => {
//         cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
//     }
// })

var upload = multer({
    storage: storage
}).single("myimage")


// var uploadi1 = multer({
//     storage1: storage
// }).single("image1")


// var uploadi2 = multer({
//     storage2: storage
// }).single("image2")


// var uploadi3 = multer({
//     storage3: storage
// }).single("image3")


// var uploadi4 = multer({
//     storage4: storage
// }).single("image4")

app.use(require("express-session")({
    secret: "My name is Anmol",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(Register.authenticate()));
passport.serializeUser(Register.serializeUser());
passport.deserializeUser(Register.deserializeUser());

app.use(methodOverride("_method"))
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;

    next();
});

app.use(express.static(static_path))
app.set("view engine", "hbs")
app.set("view engine", "ejs")


app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.render("index");
})
app.get("/index", (req, res) => {
    res.render("index");
})
app.get("/signup", (req, res) => {
    res.render("signup");
})
app.get("/contact", (req, res) => {
    res.render("contact")
})
app.get("/freelancers", (req, res) => {
    res.render("freelancers")
})
app.get("/GigEdit", (req, res) => {
    res.render("GigEdit")
})
app.get("/Homepage2", (req, res) => {
    res.render("Homepage2")
})
app.get("/signin", (req, res) => {
    res.render("signin")
})
app.get("/Profile", (req, res) => {
    res.render("Profile")
})
app.get("/ProfileEdit", (req, res) => {
    res.render("Profile")
})

app.get("/projectEdit", (req, res) => {
    res.render("projectEdit")
})
app.get("/help", (req, res) => {
    res.render("help")
})
app.get("/payment", (req, res) => {
    res.render("payment")
})
app.get("/shortlist", (req, res) => {
    res.render("shortlist")
})
app.get("/sidebar", async (req, res) => {
    try {
        const prjct = await GigPart.find({})
        const prfile = await EditProfile.find({})
        const postedProject = await ProjectPart.find({})

        console.log(postedProject)
        console.log("sending to ejs ", prfile)


        res.render("sidebar", { gigs: prjct, edit: prfile[0], posted: postedProject })
    } catch (err) {
        console.log(err)
    }

})


app.get("/Projects", isLoggedIn, (req, res) => {
    ProjectPart.find({}, (err, projects) => {
        if (err) {
            console.log(err);
        } else {
            res.render("Projects", { projects: projects })
            console.log(projects)
        }
    });

})

app.post("/signup", (req, res) => {
    if (req.body.password === req.body.confirmpassword) {
        const { username, email } = req.body
        var newUser = new Register({ username, email });

        Register.register(newUser, req.body.password, (err, user) => {
            if (err) {

                return res.redirect("/signup");
            }
            passport.authenticate("local")(req, res, () => {

                res.redirect("/index");
            });
        });
    }
    else {
        return res.redirect("/signup");
    }
});

app.post("/signin", passport.authenticate("local", {

    failureRedirect: "/signin"
}), (req, res) => {
    console.log(req.user)
    res.redirect("/index")

});


app.post("/projectEdit", upload, async (req, res) => {
    try {
        const inputEmployee = await new ProjectPart({
            companyName: req.body.companyName,
            startDate: req.body.startDate,
            applyBy: req.body.applyBy,
            duration: req.body.duration,
            stipend: req.body.stipend,
            skills: req.body.skills,
            openings: req.body.openings,
            weblink: req.body.weblink,
            jobJD: req.body.jobJD,
            workJD: req.body.workJD,
            myimage: req.file.filename

        })
        const registered = await inputEmployee.save();
        res.status(201).redirect("/Projects")
    } catch (error) {
        res.status(400).send(error);
    }
})

app.post("/sidebar", async (req, res) => {
    try {
        const updateDetails = await new EditProfile({
            fullName: req.body.fullName,
            about: req.body.about,
            headLine: req.body.headLine,
            email: req.body.email,
            mobile: req.body.mobile,
            address: req.body.address,
            profile: req.user._id
        })

        const registered = await updateDetails.save();
        console.log("new details are ", registered)
        res.status(201).redirect("/sidebar")
    } catch (error) {
        res.status(400).redirect("/index")
    }
})
app.put("/sidebar", async (req, res) => {
    try {
        const updateDetails = {
            fullName: req.body.fullName,
            about: req.body.about,
            headLine: req.body.headLine,
            email: req.body.email,
            mobile: req.body.mobile,
            address: req.body.address,

        }
        // EditProfile.findOne(profile)
        const newDetails = await EditProfile.findOneAndUpdate({ profile: req.user._id }, updateDetails, { new: true })
        console.log(" updated are ", newDetails)

        res.status(201).redirect("/sidebar")
    } catch (error) {
        res.status(201).redirect("/sidebar")
    }
})

app.post("/GigEdit", async (req, res) => {
    console.log(req.body);
    try {
        const inputGig = new GigPart({
            gigTitle: req.body.gigTitle,
            describeGig: req.body.describeGig,
            subCategory: req.body.subCategory,
            price: req.body.price,
            // image1: req.file.filename,
            // image2: req.file.filename,
            // image3: req.file.filename,
            // image4: req.file.filename

        })
        console.log(inputGig)
        const registered = await inputGig.save();
        console.log(registered)
        res.status(201).redirect("/sidebar")
    } catch (error) {
        res.status(400).send(error);
    }
})



app.get("/delete/:id", function (req, res, next) {
    var id = req.params.id;
    var del = ProjectPart.findByIdAndDelete(id);

    del.exec(function (err) {
        if (err) throw err;
        res.redirect("/sidebar")
    })
})

app.get("/edit/:id", function (req, res, next) {
    var id = req.params.id;
    var edit = ProjectPart.findById(id);

    edit.exec(function (err, data) {
        if (err) throw err;
        res.render('edit', { records: data })
    })
})

app.post("/update/", upload, function (req, res, next) {

    var update = ProjectPart.findByIdAndUpdate(req.body.id, {
        companyName: req.body.companyName,
        startDate: req.body.startDate,
        applyBy: req.body.applyBy,
        duration: req.body.duration,
        stipend: req.body.stipend,
        skills: req.body.skills,
        openings: req.body.openings,
        weblink: req.body.weblink,
        jobJD: req.body.jobJD,
        workJD: req.body.workJD,
        myimage: req.file.filename
    });

    update.exec(function (err, data) {
        if (err) throw err;
        res.redirect("/Projects")
    })
})

app.listen(port, () => {
    console.log(`server is running at port no ${port}`)
})