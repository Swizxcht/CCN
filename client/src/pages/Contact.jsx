import contactInfo from "../data/contactInfo";

function Contact() {
  const mapQuery = encodeURIComponent(contactInfo.address);

  return (
    <>
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-wide text-white/80">
            Contact us
          </p>
          <h1 className="mt-3 text-4xl font-black sm:text-5xl">
            Contact Celebrity Cable Network
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/90">
            Reach our office for applications, billing questions, service
            concerns, and coverage inquiries.
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-slate-950">
                Office Address
              </h2>
              <p className="mt-3 leading-7 text-slate-600">
                {contactInfo.address}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-slate-950">
                Contact Numbers
              </h2>
              <p className="mt-3 leading-7 text-slate-600">
                {contactInfo.phone}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-slate-950">
                Email Address
              </h2>
              <p className="mt-3 leading-7 text-slate-600">
                {contactInfo.email}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">
              Facebook Page
            </h2>
            <a
              href={contactInfo.facebook}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex font-bold text-cyan-700"
            >
              Celebrity Cable Network Inc.
            </a>
          </div>
        </div>
      </section>

      <section className="bg-white pb-16">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-3xl font-black text-slate-950">
              Google Maps
            </h2>
            <p className="mt-2 text-slate-600">
              Use the embedded map to locate our office.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <iframe
              title="Google Map"
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
              width="100%"
              height="450"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="bg-white pb-20">
        <div className="mx-auto max-w-6xl px-6 text-center lg:px-8">
          <h2 className="text-3xl font-black text-slate-950">
            Connect With Us
          </h2>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={`tel:${contactInfo.phone}`}
              className="rounded-lg bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-800"
            >
              Call Us
            </a>
            <a
              href={`mailto:${contactInfo.email}`}
              className="rounded-lg border border-slate-300 px-6 py-3 font-bold text-slate-950 transition hover:border-blue-600"
            >
              Email Us
            </a>
            <a
              href={contactInfo.facebook}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-800"
            >
              Visit Facebook
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default Contact;
