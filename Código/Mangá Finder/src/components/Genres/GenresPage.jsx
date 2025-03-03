import { useState, useEffect } from 'react';
import { useQuery, useQueries, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaBookOpen, FaChevronRight } from 'react-icons/fa';

function GenresPage() {
  const queryClient = useQueryClient();
  const [loadedGenres, setLoadedGenres] = useState([]);

  // Busca os gêneros
  const { data: genres, isLoading: genresLoading, error: genresError } = useQuery({
    queryKey: ['mangaGenres'],
    queryFn: async () => {
      const response = await axios.get('https://api.jikan.moe/v4/genres/manga');
      return response.data.data;
    },
    staleTime: 24 * 60 * 60 * 1000, // Cache por 24 horas
  });

  // Carrega os mangás para cada gênero em sequência
  useEffect(() => {
    if (!genres) return;

    const loadGenreManga = async () => {
      for (const genre of genres) {
        if (!loadedGenres.includes(genre.mal_id)) {
          try {
            const response = await axios.get(`https://api.jikan.moe/v4/manga`, {
              params: {
                genres: genre.mal_id,
                limit: 10,
                order_by: 'score',
                sort: 'desc'
              }
            });
            
            queryClient.setQueryData(['mangasByGenre', genre.mal_id], response.data.data);
            setLoadedGenres(prev => [...prev, genre.mal_id]);
            
            // Aguarda 1 segundo entre as requisições para respeitar o rate limit da API
            await new Promise(resolve => setTimeout(resolve, 1000));
          } catch (error) {
            console.error(`Erro ao carregar mangás do gênero ${genre.name}:`, error);
          }
        }
      }
    };

    loadGenreManga();
  }, [genres]);

  // Busca os mangás de cada gênero individualmente
  const genreQueries = useQueries({
    queries: (genres || []).map(genre => ({
      queryKey: ['mangasByGenre', genre.mal_id],
      queryFn: async () => {
        // Retorna undefined se ainda não foi carregado
        return queryClient.getQueryData(['mangasByGenre', genre.mal_id]);
      },
      enabled: loadedGenres.includes(genre.mal_id),
    })),
  });

  if (genresLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  if (genresError) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-600 dark:text-red-400">
        Ocorreu um erro ao carregar os gêneros. Por favor, tente novamente.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
        Explorar por Gênero
      </h1>

      <div className="space-y-12">
        {genres?.map((genre, index) => {
          const mangaData = genreQueries[index]?.data;
          const isLoading = !loadedGenres.includes(genre.mal_id);

          return (
            <div key={genre.mal_id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {genre.name}
                  <span className="ml-2 text-lg text-gray-600 dark:text-gray-400">
                    ({genre.count?.toLocaleString()} mangás)
                  </span>
                </h2>
                <Link
                  to={`/generos/${genre.mal_id}`}
                  className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  Ver mais
                  <FaChevronRight className="text-sm" />
                </Link>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-48">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {mangaData?.map((manga) => (
                    <motion.div
                      key={manga.mal_id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow"
                    >
                      <Link to={`/manga/${manga.mal_id}`}>
                        <div className="relative">
                          <img
                            src={manga.images.jpg.large_image_url}
                            alt={manga.title}
                            className="w-full h-48 object-cover"
                            loading="lazy"
                          />
                          <div className="absolute top-0 right-0 bg-black/60 text-white px-2 py-1 m-2 rounded-lg flex items-center">
                            <FaStar className="text-yellow-400 mr-1" />
                            <span>{manga.score || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="p-3">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                            {manga.title}
                          </h3>
                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                              <FaBookOpen className="mr-1" />
                              <span>{manga.chapters || '?'}</span>
                            </div>
                            <span>{manga.type}</span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GenresPage; 