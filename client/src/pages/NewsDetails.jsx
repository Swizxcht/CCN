import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getNewsById } from "../services/newsService";

const imageUrl = (path) => {
  if (!path) return null;
  return path.startsWith("http")
    ? path
    : `${import.meta.env.VITE_API_URL || "http://localhost:3001"}${path}`;
};

function NewsDetails() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const data = await getNewsById(id);
        setArticle(data);
      } catch (err) {
        setError("Article not found.");
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [id]);

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Loading article...</div>;
  }

  if (error || !article) {
    return <div className="p-10 text-center text-gray-500">Article not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <span className="text-blue-900 font-semibold">{article.category}</span>
      <h1 className="text-4xl font-bold mt-4 mb-4">{article.title}</h1>
      <p className="text-gray-500 mb-8">{article.date}</p>
      {imageUrl(article.image_url) && (
        <img
          src={imageUrl(article.image_url)}
          alt={article.title}
          className="mb-8 aspect-video w-full rounded-xl object-cover"
        />
      )}
      <p className="leading-8 whitespace-pre-line">{article.content}</p>
    </div>
  );
}

export default NewsDetails;
