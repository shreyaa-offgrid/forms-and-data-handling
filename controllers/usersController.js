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
    .isLength({ min: 1, max: 10 }).withMessage(`Last name ${lengthErr}`)
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
    const {firstName, lastName} = matchedData(req);
    usersStorage.addUser({firstName, lastName});
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
    const {firstName, lastName} = matchedData(req);
    usersStorage.updateUser(req.params.id, {firstName, lastName});
    res.redirect('/');
  }
]

exports.usersDeletePost = (req, res) => {
  usersStorage.deleteUser(req.params.id);
  res.redirect('/');
}
