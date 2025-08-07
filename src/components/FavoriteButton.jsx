import { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import { useAuthStore } from '../store/useAuthStore';
import { Heart, HeartOff} from 'lucide-react';



export default function FavouriteButton({ artisanId }) {
  const { user } = useAuthStore();
  const checkProfile = user?.favourites?.includes(artisanId);
  const [isFav, setFav] = useState(checkProfile || false);

  const toggle = async () => {
    const { data } = await axiosInstance.patch(`/users/favourites/${artisanId}`);
    setFav(!isFav);
  };

  return (
    <button
      onClick={toggle}
      className={`text-2xl ${isFav ? 'text-red-500' : 'text-gray-400'}`}
    >
      {isFav ? <Heart /> : <HeartOff /> }
    </button>
  );
}