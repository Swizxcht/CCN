function Footer() {
  return (
    <footer className="ccn-footer bg-gray-900 text-gray-100 py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-xl font-semibold text-white">
              Celebrity Cable Network
            </h3>
            <p className="text-sm leading-7 text-gray-300">
              Delivering reliable internet, cable, and complete home connectivity
              with exceptional customer service. We help communities stay
              connected, informed, and entertained.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">
              Products
            </h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>Internet Plans</li>
              <li>Cable Plans</li>
              <li>Installation Services</li>
              <li>Support Packages</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">
              Resources
            </h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>News</li>
              <li>Coverage</li>
              <li>Help Center</li>
              <li>Customer Portal</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>Phone: 0933 868 5527</li>
              <li>Email: celebritycable@yahoo.com</li>
              <li>
                Address: P. Paterno St. Brgy San Diego Zone 2, Tayabas City,
                Quezon Province
              </li>
              <li>Mon - Sat, 8:00 AM - 5:00 PM</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-6 text-sm text-gray-500">
          Copyright 2026 Celebrity Cable Network. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
