import { Link } from "react-router-dom";
import FAQItem from "../components/FAQItem";
import faqs from "../data/faqs";

function Support() {
  return (
    <>
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-wide text-cyan-300">
            Customer support
          </p>
          <h1 className="mt-3 text-4xl font-black sm:text-5xl">
            Help for internet and cable concerns.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Get quick troubleshooting steps, answers to common questions, and
            ways to contact support.
          </p>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black text-slate-950">
              Troubleshooting guides
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              [
                "Slow Internet",
                "Restart your modem, check for heavy device usage, and test again near the router.",
              ],
              [
                "No Connection",
                "Check cable connections, modem lights, and power before submitting a support request.",
              ],
              [
                "No Cable Signal",
                "Verify the coaxial cable, TV source input, and set-top box status.",
              ],
            ].map(([title, description]) => (
              <div
                key={title}
                className="rounded-xl border border-slate-200 bg-slate-50 p-6"
              >
                <h3 className="text-xl font-black text-slate-950">{title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-100 py-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black text-slate-950">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <h2 className="text-center text-3xl font-black text-slate-950">
            Contact support
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              ["Hotline", "(043) 123-4567"],
              ["Office Hours", "Monday - Saturday, 8:00 AM - 5:00 PM"],
              ["Email Support", "support@ccn.com"],
            ].map(([title, value]) => (
              <div
                key={title}
                className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center"
              >
                <h3 className="font-black text-slate-950">{title}</h3>
                <p className="mt-3 text-slate-600">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-20 text-white">
        <div className="mx-auto max-w-6xl px-6 text-center lg:px-8">
          <h2 className="text-3xl font-black">Need more help?</h2>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/login"
              className="rounded-lg bg-cyan-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-300"
            >
              Submit Ticket
            </Link>
            <a
              href="tel:+63431234567"
              className="rounded-lg border border-white/20 px-6 py-3 font-bold transition hover:bg-white/10"
            >
              Call Now
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default Support;
