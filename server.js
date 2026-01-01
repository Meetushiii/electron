import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose';
import path from 'path';
import geoip from 'geoip-country';
import cookieParser from 'cookie-parser';

import EmailEntry from './models/EmailEntry.js';
import Src from './models/SrcSchema.js';


const app = express();
const PORT = 3000;
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))
app.use(express.static('public'));
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('[+] Database Connected');
  })
  .catch(err => console.log(err))


// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}


app.get('/', async (req, res) => {
  try {
    const src = req.query.src?.toLowerCase().trim();
    const COOLDOWN_MS = 5 * 60 * 1000;

    if (src) {
      const visitCookie = `src_${src}`;

      if (!req.cookies[visitCookie]) {
        await Src.updateOne(
          { code: src },
          { $inc: { visits: 1 } }
        );

        res.cookie(visitCookie, '1', {
          maxAge: COOLDOWN_MS,
          httpOnly: true,
          sameSite: 'lax'
        });
      }
    }

    res.render('index', { src: src || null });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// API endpoint to register email
app.post('/api/register', async (req, res) => {
  const {
    email,
    src
  } = req.body;
  

  // Validate email
  if (!email || !email.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Email is required'
    });
  }

  const emailTrimmed = email.trim().toLowerCase();

  if (!isValidEmail(emailTrimmed)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format'
    });
  }


  // checking if the email already exists in the database
  const emailExists = await EmailEntry.findOne({
    email: emailTrimmed
  });
  if (emailExists) {
    return res.status(409).json({
      success: false,
      message: 'This email is already registered.'
    });
  }

  const ip = req.ip;

  const geo = geoip.lookup(ip);

  // api abuse prevention
  // there is 30 second second cooldown on email entries for the same ip
  const lastEmailEntry = await EmailEntry.findOne({ ip }).sort({ createdAt: -1 }).lean();
  if (lastEmailEntry) {
    const now = Date.now();
    const lastTime = new Date(lastEmailEntry.createdAt).getTime();

    const diffInSeconds = (now - lastTime) / 1000;
    // 30 seconds cool downnn
    if (diffInSeconds < 30) {
      return res.status(429).json({
        success: false,
        message: 'Please wait for some time before submitting again.'
      });
    }
  }

  const inviteSrc = await Src.findOne({code: src});

  if(inviteSrc){
    
    inviteSrc.registrations += 1;
    await inviteSrc.save()
  }



  const newEmailEntry = new EmailEntry({
    email: emailTrimmed,
    time: Date.now(),
    ip: req.ip,
    locationCode: geo ? geo.country : null,
    src: inviteSrc?inviteSrc.code:null
  })


  try {
    await newEmailEntry.save()
    return res.status(200).json({
      success: true,
      message: 'Email registered successfully.'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
});




// Start server
app.listen(PORT, () => {
  console.log(`[+] Server running on http://localhost:${PORT}`);
});