const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

// --- Описание схем фильмов ---
// Возвращение всех сохраненных пользователем фильмов
const getMovies = (req, res, next) => {
  Movie.find({})
    .populate('owner')
    .then((movies) => res.send({ data: movies }))
    .catch(next);
};

const postMovie = (req, res, next) => {
  const { country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId } = req.body;
  const { _id } = req.user;

  Movie.create({ country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId, owner: _id })
    .then((movie) => res.send({ data: movie }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw new BadRequestError('Переданы неккоректные данные.');
      } else {
        throw new Error('Ошибка. Что-то пошло не так.');
      }
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  const { _id } = req.user;

  Movie.findById(req.params.movieId)
    .orFail(new NotFoundError('Фильм с данным id не найдена.'))
    .then((movie) => {
      if (movie.owner.toString() !== _id) {
        throw new ForbiddenError('Нет прав для удаления фильма.');
      }

      Movie.findByIdAndDelete(req.params.movieId)
        .then((data) => {
          res.send({ data });
        });
    })
    .catch((err) => {
      if (err.name === 'Not Found') {
        throw new NotFoundError('Фильм с указанным _id не найдена.');
      } else if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные.');
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports = {
  getMovies,
  postMovie,
  deleteMovie,
};
