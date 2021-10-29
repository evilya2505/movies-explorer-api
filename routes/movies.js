const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies, postMovie, deleteMovie,
} = require('../controllers/movies');

// --- Описание основных роутов для пользователя ---
router.get('/', getMovies);
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(/^https?:\/\/((www\.)?[\w-]+\.\w{2,6})\/?/),
    trailer: Joi.string().required().regex(/^https?:\/\/((www\.)?[\w-]+\.\w{2,6})\/?/),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().regex(/^https?:\/\/((www\.)?[\w-]+\.\w{2,6})\/?/),
    movieId: Joi.string().required(),
  }),
}), postMovie);
router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24).required(),
  }),
}), deleteMovie);

module.exports = router;