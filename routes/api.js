import express from 'express';
const router = express.Router();
import { Menu } from '../models/menu.js';
import { User } from '../models/user.js';
import { createProxyMiddleware } from 'http-proxy-middleware';
import jsonwebtoken from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
config();
import multer, { memoryStorage } from 'multer';
import AWS from 'aws-sdk';
import { withAuth } from '../middleware/middleware.js';
import auth from '../auth.js';
import bcrypt from 'bcrypt';
const app = express();
app.use(cookieParser());

const secret = process.env.SECRET;

app.use('/api/', createProxyMiddleware({ target: 'http://localhost:6000', changeOrigin: true }));

var storage = memoryStorage({
	destination: function (req, file, callback) {
		callback(null, '');
	},
});
var multipleUpload = multer({ storage: storage }).array('file');
var upload = multer({ storage: storage }).single('file');

var storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads');
	},
	filename: (req, file, cb) => {
		cb(null, file.fieldname + '-' + Date.now());
	},
});

// POST route to register a user
router.post('/register', async (req, res) => {
	const { email, password, phone, name } = req.body;
	// console.log("the user details submitted:",req.body,email, password, phone, name)
	const user = new User({ email, password, name, phone });
	await user
		.save()
		.then((result) => {
			res.status(201).send({
				message: 'User Created Successfully',
				result,
			});
		})
		.catch((error) => {
			res.status(500).send({
				message: 'Error creating user',
				error,
			});
		});
});

router.post('/authenticate',  (req, res)=> {
  const { email, password } = req.body;
	User.findOne({ email })
		.then((user) => {
			user.isCorrectPassword(password, (err, same) => {
				if (err) {
					res.status(500).json({
						error: 'Internal error please try again',
					});
				} else if (!same) {
					res.status(401).json({
						error: 'Incorrect password',
					});
				} else {
					// Issue token
					const token = jsonwebtoken.sign(
						{
							userId: user._id,
							userEmail: user.email,
							username:user.name,
							rId: user.restaurantId
						},
						'RANDOM-TOKEN',
						{ expiresIn: '1h' }
					);
					console.log("the response from login",user )
					res.status(200).send({
						message: 'Login Successful',
						email: user.email,
						rId: user.restaurantId,
						username:user.name,
						userId: user._id,
						token,
					});
				}
			});
		})
		.catch((e) => {
			res.status(404).send({
				message: 'Email not found',
				e,
			});
		});
});

// free endpoint
router.get("/free-endpoint", (req, res) => {
  res.json({ message: "You are free to access me anytime" });
});

// authentication endpoint
router.get("/auth-endpoint", auth, (req, res) => {
  res.json({ message: "You are authorized to access me" });
});

router.get('/secret', withAuth, function (req, res) {
	res.send('The password is potato');
});

// Get Menu items
router.get('/menuGet', (req, res, next) => {
	Menu.find({})
		.then((data) => res.json(data))
		.catch(next);
});

router.post('/uploadImages', multipleUpload, function (req, res) {
	const file = req.files;
	let s3bucket = new AWS.S3({
		accessKeyId: process.env.IAM_USER_KEY,
		secretAccessKey: process.env.IAM_USER_SECRET,
		Bucket: process.env.BUCKET_NAME,
	});
	s3bucket.createBucket(function () {
		let Bucket_Path = 'Videos Mac/TeacherPortal/';
		//Where you want to store your file
		var ResponseData = [];

		file.map((item) => {
			var params = {
				Bucket: process.env.BUCKET_NAME,
				Key: Bucket_Path + item.originalname,
				Body: item.buffer,
				ACL: 'public-read',
			};
			s3bucket.upload(params, function (err, data) {
				if (err) {
					res.json({ error: true, Message: err });
				} else {
					ResponseData.push(data);
					if (ResponseData.length == file.length) {
						res.json({ error: false, Message: 'File Uploaded    SuceesFully', Data: ResponseData });
					}
				}
			});
		});
	});
});

router.post('/menu', async (req, res) => {
	console.log('the menu req', req.body);
	if (req.body) {
		let Menusave = new Menu(req.body);
		console.log('the return repsonse1', Menusave);
		try {
			const dataToSave = await Menusave.save();
			console.log('the return repsonse2', dataToSave);
			res.status(200).json(dataToSave);
		} catch (error) {
			res.status(400).json({ message: error.message });
		}
		// .then(item=>{
		//     // req.session.message = 'details submitted';
		//     console.log("the return repsonse2",item);
		//     res.send(item);
		//     // res.status(200).send(item);
		// })
		// .catch(error=>{
		//     res.status(400).send(("unable to save to database").toString(),error);
		// })
	} else {
		res.json({
			error: 'The input field is empty dd',
		});
	}
});

router.delete('/menu/:id', (req, res, next) => {
	Menu.findOneAndDelete({ _id: req.params.id })
		.then((data) => res.json(data))
		.catch(next);
});

export default router;
