const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
mongoose.connect("mongodb://localhost:27017/electronapp", {useNewUrlParser: true})

.then((db) => console.log("DB is connected succesfully"))
.catch((err) => console.log(err));
