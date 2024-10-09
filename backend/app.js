const express = require('express');
const mongoose = require('mongoose');  
const auth = require('./routes/auth');
const cors = require('cors')

const app = express();
app.use(express.json());
app.use(cors());


const mongoURI = 'mongodb+srv://saiananyak:ksaiananya@cluster0.daunp.mongodb.net/SpaceSync';


mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected successfully'))
    .catch((err) => console.log('MongoDB connection error: ', err));


app.use('/auth', auth)

const port = 5000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
