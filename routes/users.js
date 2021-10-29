const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, updateUserInfo, getUserInfo,
} = require('../controllers/users');

// --- Описание основных роутов для пользователя ---
router.get('/me', getUserInfo);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().min(2).max(30),
  }),
}), updateUserInfo);

module.exports = router;