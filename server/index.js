import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import connectDb from './config/connect.js';
import userRoutes from './routes/userRoutes.js'
import notesRoutes from './routes/notesRoutes.js'
import announcementRoutes from "./routes/announcementRoutes.js"

const app = express();
const port = process.env.SERVER_PORT || 5000;
const db_url = process.env.MONGODB_URI;
const db_name = process.env.MONGODB_NAME;

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = ['https://exclutch.vercel.app', 'http://localhost:3000'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));


app.use(express.json());


app.get("/api", (req, res)=>{
  res.send("Exclutch API says hello to the over-enthusiast who tried to seek into it!")
})

app.use("/api/users", userRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/requests", announcementRoutes);


connectDb(db_url, db_name);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
