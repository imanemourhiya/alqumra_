import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MOVIES } from '../data/mockData';
import { FiStar, FiHeart } from 'react-icons/fi';
import { useLang } from '../context/LanguageContext';
import './SimplePage.css';

const FAVORITES_IDS = [1, 3, 7];

export default function FavoritesPage() {
  const { t } = useLang();
  const favorites = MOVIES.filter(m => FAVORITES_IDS.includes(m.id));
  return (
    <div className="simple-page page-enter">
      <div className="container">
        <h1 className="simple-page__title"><FiHeart style={{color:'#e05555'}}/> {t('myFavourites')}</h1>
        <div className="fav-grid">
          {favorites.map((movie, i) => (
            <motion.div key={movie.id} className="fav-card card" initial={{opacity:0, y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}>
              <Link to={`/movies/${movie.id}`}>
                <img src={movie.poster} alt={movie.title} className="fav-poster" />
                <div className="fav-info">
                  <h3 className="fav-title">{movie.title}</h3>
                  <p className="fav-meta"><FiStar style={{color:'var(--accent)'}}/> {movie.rating} · {movie.year}</p>
                  <div className="fav-genres">{movie.genre.slice(0,2).map(g=><span key={g} className="genre-chip">{g}</span>)}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}