import { Link, useLocation, useNavigate} from 'react-router-dom';
import FavouriteButton from './FavoriteButton';
import ShareButton from './ShareButton';
import { capitalizeWords } from '../utils/capitalize';
import { useAuthStore } from '../store/useAuthStore';



export default function ArtisanCard({ artisan }) {
  const { _id, name, artisanProfile} = artisan;
  const skills = artisanProfile?.skills?.slice(0).join(', ') || '';
   const location = useLocation();
   const {user} = useAuthStore()

    return (
    <div className="bg-white rounded shadow p-4 flex flex-col">
      <div className="flex items-center mb-2">
        <div className="flex-1">
          {location.pathname === "/directory" ? <h3 className="font-semibold text-charcoal">{name}</h3> : 
          <h3 className="font-semibold text-charcoal">{name}  <ShareButton artisanId={_id} /></h3>}
          <p className="text-sm text-black-600">{capitalizeWords(skills)}</p>
        {location.pathname === "/directory" && <p className="text-xs text-black-500">{artisan?.artisanProfile?.location?.name}</p>}
        </div>
        {user && <FavouriteButton artisanId={_id} /> }
      </div>
      

      <div className="flex items-center justify-between mt-auto">
       {artisan?.artisanProfile?.rating && <span className="text-yellow-500 text-sm">⭐ {artisan?.artisanProfile?.rating?.toFixed(0)}</span>}
        <Link to={`/artisans/${_id}`} className="text-blue-600 dark:text-blue-400 text-sm">
          View Profile
        </Link>
      </div>
    </div>
  );
}