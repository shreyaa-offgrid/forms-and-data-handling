const usersStorage = require('../storages/usersStorage');
const { body, validationResult, matchedData } = require('express-validator');

const alphaErr = 'must only contain letters.';
const lengthErr = 'must be between 1 and 10 characters.';

const validateUser = [
  body('firstName').trim()
    .isAlpha().withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 10 }).withMessage(`First name ${lengthErr}`),
  body('lastName').trim()
    .isAlpha().withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 10 }).withMessage(`Last name ${lengthErr}`),
  body('email').trim().normalizeEmail()
    .isEmail().withMessage('Please enter a valid email address'),
  body('age').optional({checkFalsy: true})
    .isInt({min:18, max: 120}).withMessage('Age must be between 18 and 120'),
  body('bio').optional({checkFalsy: true})
    .isLength({max: 200}).withMessage('Bio must be less than 200 characters long.')
];

exports.usersListGet = (req, res) => {
  res.render('index', {
    title: 'User list',
    users: usersStorage.getUsers(),
  });
};

exports.usersCreateGet = (req, res) => {
  res.render('createUser', {
    title: "Create user",
  });
};

exports.usersCreatePost = [
  validateUser,
  (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).render('createUser', {
        title: 'Create user',
        errors: errors.array(),
      });
    }
    const {firstName, lastName, email, age, bio} = matchedData(req);
    usersStorage.addUser({firstName, lastName, email, age, bio});
    res.redirect('/');
  }
];

exports.usersUpdateGet = (req, res) => {
  const user = usersStorage.getUser(req.params.id);
  res.render('updateUser', {
    title: 'update user',
    user: user,
  });
};

exports.usersUpdatePost = [
  validateUser,
  (req, res)=>{
    const user = usersStorage.getUser(req.params.id);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).render('updateUser', {
        title: 'Update User',
        user: user,
        errors: errors.array(),
      });
    }
    const {firstName, lastName, email, age, bio} = matchedData(req);
    usersStorage.updateUser(req.params.id, {firstName, lastName, email, age, bio});
    res.redirect('/');
  }
]

exports.usersDeletePost = (req, res) => {
  usersStorage.deleteUser(req.params.id);
  res.redirect('/');
}

exports.usersSearchGet = (req, res) => {
  const { name } = req.query;

  let results = [];

  if (name) {
    const users = usersStorage.getUsers();

    results = users.filter(user =>
      user.firstName.toLowerCase().includes(name.toLowerCase()) ||
      user.lastName.toLowerCase().includes(name.toLowerCase())
    );
  }

  res.render('search', {
    name,
    results,
  });
};
