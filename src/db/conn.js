const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/backend3", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log("connection successful");
}).catch((e) => {
    console.log(e);
})