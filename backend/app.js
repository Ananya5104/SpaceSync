const express = require('express');
const mongoose = require('mongoose');  

const app = express();

const mongoURI = 'mongodb+srv://saiananyak:ksaiananya@cluster0.daunp.mongodb.net/SpaceSync';


mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected successfully'))
    .catch((err) => console.log('MongoDB connection error: ', err));


const port = 5000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
