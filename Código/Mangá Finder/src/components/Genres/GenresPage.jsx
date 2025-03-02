import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaBookOpen } from 'react-icons/fa';

function GenresPage() {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [page, setPage] = useState(1);

  // Busca os gêneros
  const { data: genres, isLoading: genresLoading, error: genresError } = useQuery({
    queryKey: ['mangaGenres'],
    queryFn: async () => {
      const response = await axios.get('https://api.jikan.moe/v4/genres/manga');
      return response.data.data;
    },
    staleTime: 24 * 60 * 60 * 1000, // Cache por 24 horas
  });

  // Busca os mangás do gênero selecionado
  const { 
    data: mangasByGenre, 
    isLoading: mangasLoading,
    error: mangasError,
    isFetching
  } = useQuery({
    queryKey: ['mangasByGenre', selectedGenre?.mal_id, page],
    queryFn: async () => {
      if (!selectedGenre) return null;
      const response = await axios.get(
        `https://api.jikan.moe/v4/manga?genres=${selectedGenre.mal_id}&page=${page}&limit=12&order_by=score&sort=desc`
      );
      return response.data;
    },
    enabled: !!selectedGenre,
    keepPreviousData: true,
  });

  // Reset a página quando mudar o gênero
  useEffect(() => {
    setPage(1);
  }, [selectedGenre]);

  if (genresLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (genresError) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-600">
        Ocorreu um erro ao carregar os gêneros. Por favor, tente novamente.
      </div>
    );
  }

  const handleGenreClick = (genre) => {
    if (selectedGenre?.mal_id === genre.mal_id) {
      setSelectedGenre(null);
    } else {
      setSelectedGenre(genre);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Explorar por Gênero
      </h1>

      {/* Lista de Gêneros */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-3 justify-center">
          {genres?.map((genre) => (
            <motion.button
              key={genre.mal_id}
              onClick={() => handleGenreClick(genre)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${
                  selectedGenre?.mal_id === genre.mal_id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              {genre.name}
              <span className="ml-2 text-xs">
                ({genre.count?.toLocaleString()})
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Resultados */}
      <AnimatePresence mode="wait">
        {selectedGenre && (
          <motion.div
            key={selectedGenre.mal_id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                {selectedGenre.name}
              </h2>
              {mangasByGenre?.pagination && (
                <div className="text-sm text-gray-600">
                  Página {page} de {mangasByGenre.pagination.last_visible_page}
                </div>
              )}
            </div>

            {/* Loading State */}
            {(mangasLoading || isFetching) && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}

            {/* Error State */}
            {mangasError && (
              <div className="text-center text-red-600 py-8">
                Ocorreu um erro ao carregar os mangás. Por favor, tente novamente.
              </div>
            )}

            {/* Mangá Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mangasByGenre?.data?.map((manga, index) => (
                <motion.div
                  key={manga.mal_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <Link to={`/manga/${manga.mal_id}`}>
                    <div className="relative">
                      <img
                        src={manga.images.jpg.large_image_url}
                        alt={manga.title}
                        className="w-full h-64 object-cover"
                        loading="lazy"
                      />
                      <div className="absolute top-0 right-0 bg-black/60 text-white px-2 py-1 m-2 rounded-lg flex items-center">
                        <FaStar className="text-yellow-400 mr-1" />
                        <span>{manga.score || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                        {manga.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {manga.synopsis || 'Sem sinopse disponível.'}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <FaBookOpen className="mr-1" />
                          <span>{manga.chapters || '?'} caps</span>
                        </div>
                        <span>{manga.status}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Paginação */}
            {mangasByGenre?.pagination && mangasByGenre.pagination.last_visible_page > 1 && (
              <div className="flex justify-center items-center space-x-4 mt-8">
                <button
                  onClick={() => setPage(old => Math.max(old - 1, 1))}
                  disabled={page === 1 || mangasLoading}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <span className="text-gray-600">
                  Página {page} de {mangasByGenre.pagination.last_visible_page}
                </span>
                <button
                  onClick={() => setPage(old => Math.min(old + 1, mangasByGenre.pagination.last_visible_page))}
                  disabled={page === mangasByGenre.pagination.last_visible_page || mangasLoading}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próxima
                </button>
              </div>
            )}
          </motion.div>
        )}

        {!selectedGenre && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-600 mt-8 p-8 bg-gray-50 rounded-lg"
          >
            <p className="text-lg">
              Selecione um gênero acima para ver os mangás relacionados.
            </p>
            <p className="text-sm mt-2">
              Dica: Clique em um gênero para ver os mangás e clique novamente para desselecionar.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default GenresPage; 