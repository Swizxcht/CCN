import { useEffect, useState } from "react";
import NewsCard from "../components/NewsCard";
import { getNews } from "../services/newsService";

function News() {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const data = await getNews();
        setNewsItems(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  return (
    <>
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-wide text-cyan-300">
            Updates
          </p>
          <h1 className="mt-3 text-4xl font-black sm:text-5xl">
            News and announcements
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Stay updated with announcements, promotions, service advisories, and
            maintenance schedules.
          </p>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          {loading ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center font-semibold text-slate-500">
              Loading news...
            </div>
          ) : newsItems.length ? (
            <div className="grid gap-6 md:grid-cols-3">
              {newsItems.map((item) => (
                <NewsCard key={item.id} newsItem={item} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center font-semibold text-slate-500">
              No announcements are available right now.
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default News;
