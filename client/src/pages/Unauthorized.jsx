import { Link } from "react-router-dom";

function Unauthorized() {
  return (
    <div className="max-w-xl mx-auto py-20 px-6">

      <h1 className="text-4xl font-bold text-red-600 mb-4">
        Unauthorized
      </h1>

      <p>
        You do not have permission to access this page.
      </p>
      <Link
  to="/"
  className="
  inline-block
  mt-6
  bg-blue-900
  text-white
  px-6
  py-3
  rounded-lg"
>
  Back Home
</Link>

    </div>
  );
}

export default Unauthorized;