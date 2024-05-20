const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const middleware = require("../middleware/middleware");
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
      user: 'mz2692174@gmail.com',
      pass: 'lknyyhomfxmfqpav'
    //   Haslo123!
  }
});

const generateToken = (user) => {
    return jwt.sign(
        {id: user._id, username: user.username, role: user.role},
        process.env.JWT_TOKEN,
        {expiresIn: '30m'}
    );
};

const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        // const user = await User.findOne({ $or: [{ email }, { username: email }] });
        const user = await User.findOne({email});
        // const user = await User.findOne({email: "marcelina212121@gmail.com"});
        if (!user) {
            console.log("user")
            console.log(user)
            console.log("req")
            console.log(req.body)
            return res.status(500).json({ message: 'Użytkownik nie został znaleziony' });
        }

        if(!user.isActive){
            return res.status(400).json({ message: 'Konto nie zostało aktywowane' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(500).json({ message: 'Niepoprawne dane logowania' });
        }

        const token = generateToken(user);

        res.cookie('jwtToken', token, {httpOnly: true});
        req.session.currentUserId = await user.id
        req.session.isLoggedIn = await middleware.isLoggedIn(req);
        req.session.isAdmin = await middleware.isAdmin(req);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Błąd serwera' });
    }
};

const logout = async (req, res) => {
    res.clearCookie('jwtToken');
    req.session.isLoggedIn = await middleware.isLoggedIn(req);
    req.session.isAdmin = await middleware.isAdmin(req);
    res.redirect('/');
};

const createUser = async (req, res) => {
    if (req.body.password !== req.body.confirmPassword) {
        return res.status(400).json({ message: 'Hasła nie są identyczne' });
    }

    const activationToken = crypto.randomBytes(20).toString('hex');
    const tokenExpires = Date.now() + 7200000;  // Wygaśnie za 2h
    const user = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        activationToken: activationToken,
        tokenExpires: tokenExpires
    });

    try {
        const newUser = await user.save();

        const mailOptions = {
            from: 'mz2692174@gmail.com',
            to: newUser.email,
            //   to: newUser.email, newUser.email2
            subject: 'Aktywacja konta',
            text: `Aby aktywować konto, kliknij w poniższy link: \nhttp://${req.headers.host}/api/activate/${activationToken}`
        };

        transporter.sendMail(mailOptions, function(error, info){
            // TODO res.status napisać front
            if (error) {
                console.log(error);
                res.status(500).json({ message: 'Błąd podczas wysyłania emaila.' });
            } else {
                console.log('Email wysłany: ' + info.response);
                res.status(201).json(newUser);
            }
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const activateUser = async (req, res) => {
  try {
      const user = await User.findOne({ activationToken: req.params.token, tokenExpires: { $gt: Date.now() } });
      if (!user) {
          return res.status(400).json({ message: 'Token aktywacyjny jest nieprawidłowy lub wygasł.' });
      }

      user.isActive = true;
      user.activationToken = undefined;
      user.tokenExpires = undefined;

      await user.save();
      // TODO res.status napisać front
      req.session.isLoggedIn = await middleware.isLoggedIn(req);
      req.session.isAdmin = await middleware.isAdmin(req);
      res.redirect('/home');
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
};

const changepassword = async (req, res) => {
    try {
        const newPassword = req.body.newPassword;
        if (!newPassword) {
            return res.status(400).json({ message: 'Brak hasła w żądaniu' });
        }

        if (req.body.newPassword !== req.body.confirmNewPassword) {
            return res.status(400).json({ message: 'Hasła nie są identyczne' });
        }

        const currentUser = await User.findById(req.session.currentUserId)
        const oldPassword = req.body.currentPassword;
        const isMatch = await bcrypt.compare(oldPassword, currentUser.password);
        if (!isMatch){
            return res.status(400).json({ message: 'Błędne aktualne hasło' });
        }

        // const user = await User.findByIdAndUpdate(req.params.id, { password: newPassword }, {
        //     new: true,
        //     fields: 'password'
        // });
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(req.session.currentUserId, { password: hashedNewPassword });

        res.status(200).json({ message: 'Hasło zostało zmienione' });
    } catch (err) {
        console.log(err)
        console.log(err.message)
        res.status(404).json({ message: 'Wystąpił nieoczekiwany błąd' });
    }
}

const adminPanel = async (req, res) => {
    const token = req.cookies.jwtToken;
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    const user = await User.findById(decoded.id);
    const allUsers = await User.find();
    res.render('users', { 
        // computer: computer,
        isLoggedIn: req.session.isLoggedIn, 
        isAdmin: req.session.isAdmin,
        username: user.username,
        users: allUsers
    });
}

const createUserByAdmin = async (req, res) => {
    try {
      if (!req.body.activateUser) {
        await createUser(req, res);
      } else {
        const user = new User({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            isActive: true
        });
        const newUser = await user.save();
        res.status(201).json(newUser);
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: 'Nie znaleziono użytkownika o podanym ID' });
        }
        res.status(200).json({ message: 'Użytkownik został pomyślnie usunięty' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Wystąpił błąd serwera podczas usuwania użytkownika' });
    }
};

const changePrivileges = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Nie znaleziono użytkownika o podanym ID' });
        }

        user.role = user.role === 'user' ? 'admin' : 'user';
        await user.save();

        res.status(200).json({ message: 'Uprawnienia użytkownika zostały pomyślnie zmienione' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Wystąpił błąd serwera podczas zmiany uprawnień użytkownika' });
    }
};



module.exports = {
  login,
  createUser,
  activateUser,
  logout,
  changepassword,
  adminPanel,
  createUserByAdmin,
  deleteUser,
  changePrivileges
}