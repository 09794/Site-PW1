import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaStar, FaBookOpen, FaHeart, FaUsers, FaCalendar, FaClock } from 'react-icons/fa';

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-600 dark:text-red-400">
        Ocorreu um erro ao carregar as informações do mangá. Por favor, tente novamente.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          to={-1}
          className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
        >
          ← Voltar
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Imagem do Mangá */}
          <div className="md:w-1/3 lg:w-1/4">
            <img
              src={manga.images.jpg.large_image_url}
              alt={manga.title}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Informações Principais */}
          <div className="p-6 md:w-2/3 lg:w-3/4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {manga.title}
                </h1>
                {manga.title_japanese && (
                  <h2 className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                    {manga.title_japanese}
                  </h2>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="flex items-center text-yellow-400 mb-1">
                    <FaStar className="mr-1" />
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      {manga.score || 'N/A'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {manga.scored_by?.toLocaleString()} votos
                  </div>
                </div>

                <div className="text-center">
                  <div className="flex items-center text-pink-500 mb-1">
                    <FaHeart className="mr-1" />
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      {manga.favorites?.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Favoritos
                  </div>
                </div>

                <div className="text-center">
                  <div className="flex items-center text-blue-500 mb-1">
                    <FaUsers className="mr-1" />
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      {manga.members?.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Membros
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {manga.status === 'Publishing' && 'Em publicação'}
                  {manga.status === 'Finished' && 'Finalizado'}
                  {manga.status === 'On Hiatus' && 'Em hiato'}
                  {manga.status === 'Discontinued' && 'Descontinuado'}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tipo</div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {manga.type}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Capítulos</div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {manga.chapters || '?'}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Volumes</div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {manga.volumes || '?'}
                </div>
              </div>
            </div>

            {/* Gêneros */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Gêneros
              </h3>
              <div className="flex flex-wrap gap-2">
                {manga.genres?.map((genre) => (
                  <Link
                    key={genre.mal_id}
                    to={`/generos/${genre.mal_id}`}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Datas */}
            <div className="flex flex-wrap gap-6 mb-6 text-sm text-gray-600 dark:text-gray-400">
              {manga.published?.from && (
                <div className="flex items-center">
                  <FaCalendar className="mr-2" />
                  <span>
                    Publicado em: {new Date(manga.published.from).toLocaleDateString('pt-BR')}
                    {manga.published.to && ` até ${new Date(manga.published.to).toLocaleDateString('pt-BR')}`}
                  </span>
                </div>
              )}
            </div>

            {/* Sinopse */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Sinopse
              </h3>
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                {manga.synopsis || 'Sem sinopse disponível.'}
              </p>
            </div>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          {/* Autores */}
          {manga.authors?.length > 0 && (
              <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Autores
              </h3>
                <div className="flex flex-wrap gap-2">
                  {manga.authors.map((author) => (
                    <span
                      key={author.mal_id}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm"
                    >
                      {author.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {/* Serialização */}
          {manga.serializations?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Serialização
              </h3>
              <div className="flex flex-wrap gap-2">
                {manga.serializations.map((serialization) => (
                  <span
                    key={serialization.mal_id}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm"
                  >
                    {serialization.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Temas */}
          {manga.themes?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Temas
              </h3>
              <div className="flex flex-wrap gap-2">
                {manga.themes.map((theme) => (
                  <span
                    key={theme.mal_id}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm"
                  >
                    {theme.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Demografia */}
          {manga.demographics?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Demografia
              </h3>
              <div className="flex flex-wrap gap-2">
                {manga.demographics.map((demographic) => (
                  <span
                    key={demographic.mal_id}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm"
                  >
                    {demographic.name}
                  </span>
                ))}
              </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MangaDetails; 