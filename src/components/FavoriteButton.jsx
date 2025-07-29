import { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import { useAuthStore } from '../store/useAuthStore';

export default function FavouriteButton({ artisanId }) {
  const { user } = useAuthStore();
  const checkProfile = user?.favourites?.includes(artisanId);
  const [isFav, setFav] = useState(checkProfile || false);

  const toggle = async () => {
    console.log(artisanId)
    const { data } = await axiosInstance.patch(`/users/favourites/${artisanId}`);
    console.log(data)
    setFav(!isFav);
  };

  return (
    <button
      onClick={toggle}
      className={`text-2xl ${isFav ? 'text-red-500' : 'text-gray-400'}`}
    >
      ❤
    </button>
  );
}