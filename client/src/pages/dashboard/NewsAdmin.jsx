/* eslint-disable react-hooks/immutability */
import { useEffect, useMemo, useState } from "react";
import IconButton from "../../components/admin/IconButton";
import Pagination from "../../components/admin/Pagination";
import { DeleteIcon, EditIcon, PlusIcon } from "../../components/icons";
import AlertModal from "../../components/modals/AlertModal";
import ConfirmModal from "../../components/modals/ConfirmModal";
import {
  createNews,
  deleteNews,
  getNews,
  updateNews,
} from "../../services/newsService";

const pageSize = 10;
const inputClass =
  "w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100";

const emptyForm = {
  id: null,
  title: "",
  category: "Announcement",
  summary: "",
  content: "",
  image: null,
};

function NewsAdmin() {
  const [newsItems, setNewsItems] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [alert, setAlert] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const data = await getNews();
      setNewsItems(data);
    } catch (error) {
      console.error(error);
    }
  };

  const totalPages = Math.max(1, Math.ceil(newsItems.length / pageSize));
  const paginatedNews = useMemo(
    () => newsItems.slice((page - 1) * pageSize, page * pageSize),
    [newsItems, page]
  );

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const openCreate = () => {
    setFormData(emptyForm);
    setAlert(null);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setFormData({
      id: item.id,
      title: item.title,
      category: item.category,
      summary: item.summary || "",
      content: item.content || "",
      image: null,
    });
    setAlert(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    setConfirmAction({
      title: "Delete News Article",
      message: "This will permanently delete the selected news article.",
      confirmText: "Delete",
      variant: "danger",
      run: async () => {
        try {
          await deleteNews(id);
          setAlert({
            type: "success",
            title: "News Deleted",
            message: "The news article was deleted.",
          });
          loadNews();
        } catch (error) {
          console.error(error);
          setAlert({
            type: "error",
            title: "Delete Failed",
            message: "Unable to delete article.",
          });
        }
      },
    });
  };

  const runConfirmAction = async () => {
    const action = confirmAction;
    setConfirmAction(null);
    await action?.run();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.category || !formData.content) {
      setAlert({
        type: "warning",
        title: "Missing Details",
        message: "Title, category, and content are required.",
      });
      return;
    }

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("category", formData.category);
    payload.append("summary", formData.summary || "");
    payload.append("content", formData.content);
    if (formData.image) {
      payload.append("image", formData.image);
    }

    try {
      if (formData.id) {
        await updateNews(formData.id, payload);
        setAlert({
          type: "success",
          title: "News Updated",
          message: "The news article was updated.",
        });
      } else {
        await createNews(payload);
        setAlert({
          type: "success",
          title: "News Created",
          message: "The news article was created.",
        });
      }

      setShowModal(false);
      setFormData(emptyForm);
      loadNews();
    } catch (error) {
      console.error(error);
      setAlert({
        type: "error",
        title: "Save Failed",
        message: "Unable to save article.",
      });
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">
            Content
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">
            News Management
          </h1>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 font-bold text-white transition hover:bg-slate-800"
        >
          <PlusIcon />
          Add News
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-180 text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                {["Title", "Category", "Image", "Date", "Actions"].map((heading) => (
                  <th
                    key={heading}
                    className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {paginatedNews.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-slate-500">
                    No news articles yet.
                  </td>
                </tr>
              ) : (
                paginatedNews.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 font-bold text-slate-950">
                      {item.title}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {item.category}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {item.image_url ? "Uploaded" : "None"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{item.date}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <IconButton
                          label="Edit article"
                          variant="primary"
                          onClick={() => openEdit(item)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          label="Delete article"
                          variant="danger"
                          onClick={() => handleDelete(item.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-950">
                  {formData.id ? "Edit News" : "Create News"}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Publish announcements, advisories, and promos.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-slate-300 px-3 py-2 font-bold text-slate-600"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                className={inputClass}
                required
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleChange}
                className={inputClass}
                required
              />
              <textarea
                name="summary"
                placeholder="Summary"
                value={formData.summary}
                onChange={handleChange}
                className={`${inputClass} min-h-24`}
              />
              <textarea
                name="content"
                placeholder="Content"
                value={formData.content}
                onChange={handleChange}
                className={`${inputClass} min-h-44`}
                required
              />
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  News Image
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className={inputClass}
                />
                {formData.id && (
                  <p className="mt-2 text-xs font-semibold text-slate-500">
                    Uploading a new image replaces the current article image.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="rounded-lg bg-slate-950 px-5 py-3 font-bold text-white transition hover:bg-slate-800"
              >
                {formData.id ? "Update Article" : "Create Article"}
              </button>
            </form>
          </div>
        </div>
      )}
      <ConfirmModal
        open={Boolean(confirmAction)}
        title={confirmAction?.title}
        message={confirmAction?.message}
        confirmText={confirmAction?.confirmText}
        variant={confirmAction?.variant}
        onConfirm={runConfirmAction}
        onCancel={() => setConfirmAction(null)}
      />
      <AlertModal
        open={Boolean(alert)}
        type={alert?.type}
        title={alert?.title}
        message={alert?.message}
        onClose={() => setAlert(null)}
      />
    </div>
  );
}

export default NewsAdmin;
