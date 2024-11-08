const express = require('express');
const mongoose = require('mongoose');  
const auth = require('./routes/auth');
const workspaceRoutes = require('./routes/workspaceRoutes')
const ownerRoutes = require('./routes/ownerRoutes')
const userRoutes = require('./routes/userRoutes')
const path = require('path')
const cors = require('cors')

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', 
}));


const mongoURI = 'mongodb+srv://saiananyak:ksaiananya@cluster0.daunp.mongodb.net/SpaceSync';


mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected successfully'))
    .catch((err) => console.log('MongoDB connection error: ', err));

    app.use('/workspaceImages', express.static(path.join(__dirname, 'public/workSpaceImages')));
app.use('/auth', auth)
app.use('/workspaces',workspaceRoutes)
app.use('/owners',ownerRoutes)
app.use('/users',userRoutes)

const port = 5000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
