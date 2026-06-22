import { Link } from "react-router-dom";

const imageUrl = (path) => {
  if (!path) return null;
  return path.startsWith("http")
    ? path
    : `${import.meta.env.VITE_API_URL || "http://localhost:3001"}${path}`;
};

function NewsCard({ newsItem }) {
  const image = imageUrl(newsItem.image_url);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      {image && (
        <img
          src={image}
          alt={newsItem.title}
          className="aspect-video w-full object-cover"
        />
      )}
      <div className="flex flex-1 flex-col p-6">
        <span className="text-sm font-bold uppercase tracking-wide text-cyan-700">
          {newsItem.category}
        </span>

        <h3 className="mt-3 text-xl font-black text-slate-950">
          {newsItem.title}
        </h3>

        <p className="mt-2 text-sm font-semibold text-slate-500">
          {newsItem.date}
        </p>

        <p className="mt-4 leading-7 text-slate-600">{newsItem.summary}</p>

        <Link
          to={`/news/${newsItem.id}`}
          className="mt-6 inline-flex w-fit rounded-lg bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
        >
          Read More
        </Link>
      </div>
    </article>
  );
}

export default NewsCard;
