import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaStar, FaBookOpen, FaCalendar, FaUsers } from 'react-icons/fa';

function MangaDetails() {
  const { id } = useParams();

  const { data: manga, isLoading, error } = useQuery({
    queryKey: ['mangaDetails', id],
    queryFn: async () => {
      const response = await axios.get(`https://api.jikan.moe/v4/manga/${id}/full`);
      return response.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-600">
        Ocorreu um erro ao carregar os detalhes do mangá. Por favor, tente novamente.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <div className="md:flex">
          <div className="md:w-1/3">
            <img
              src={manga?.images?.jpg?.large_image_url}
              alt={manga?.title}
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="md:w-2/3 p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{manga?.title}</h1>
            {manga?.title_japanese && (
              <h2 className="text-xl text-gray-700 mb-4">{manga.title_japanese}</h2>
            )}
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center">
                <FaStar className="text-yellow-500 mr-2" />
                <span>Nota: {manga?.score || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <FaBookOpen className="text-blue-500 mr-2" />
                <span>Capítulos: {manga?.chapters || 'Em andamento'}</span>
              </div>
              <div className="flex items-center">
                <FaCalendar className="text-green-500 mr-2" />
                <span>Publicado: {manga?.published?.string || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <FaUsers className="text-purple-500 mr-2" />
                <span>Membros: {manga?.members?.toLocaleString()}</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Sinopse</h3>
              <p className="text-gray-700 leading-relaxed">{manga?.synopsis}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Gêneros</h3>
              <div className="flex flex-wrap gap-2">
                {manga?.genres?.map((genre) => (
                  <span
                    key={genre.mal_id}
                    className="px-3 py-1 bg-gray-200 rounded-full text-sm text-gray-700"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>

            {manga?.authors?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Autores</h3>
                <div className="flex flex-wrap gap-2">
                  {manga.authors.map((author) => (
                    <span
                      key={author.mal_id}
                      className="text-gray-700"
                    >
                      {author.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default MangaDetails; 