import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

function PopularManga() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['popularManga'],
    queryFn: async () => {
      const response = await axios.get('https://api.jikan.moe/v4/top/manga');
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-600 dark:text-red-400">
        Ocorreu um erro ao carregar os mangás populares. Por favor, tente novamente.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
        Mangás Mais Populares
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data?.data?.map((manga, index) => (
          <motion.div
            key={manga.mal_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          >
            <Link to={`/manga/${manga.mal_id}`}>
              <div className="relative">
                <img
                  src={manga.images.jpg.large_image_url}
                  alt={manga.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-0 left-0 bg-blue-600 text-white px-3 py-1 rounded-br-lg">
                  #{index + 1}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{manga.title}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaStar className="text-yellow-500 mr-1" />
                    <span className="text-gray-700 dark:text-gray-200">{manga.score || 'N/A'}</span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {manga.members?.toLocaleString()} membros
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{manga.synopsis}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {manga.genres?.slice(0, 3).map((genre) => (
                    <span
                      key={genre.mal_id}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-300"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default PopularManga; 