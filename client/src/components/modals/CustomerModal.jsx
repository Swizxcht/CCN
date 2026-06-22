function CustomerModal({
  customer,
  onClose,
}) {

  if (!customer)
    return null;

  return (

    <div
      className="
      fixed
      inset-0
      bg-black/50
      flex
      items-center
      justify-center
      z-50
    "
    >

      <div
        className="
        bg-white
        p-6
        rounded-xl
        w-full
        max-w-md
        "
      >

        <h2
          className="
          text-2xl
          font-bold
          mb-4
        "
        >
          Customer Details
        </h2>

        <p>
          <strong>ID:</strong>
          {customer.id}
        </p>

        <p>
          <strong>Name:</strong>
          {customer.name}
        </p>

        <p>
          <strong>Email:</strong>
          {customer.email}
        </p>

        <p>
          <strong>Role:</strong>
          {customer.role}
        </p>

        <p>
          <strong>Status:</strong>
          {customer.status}
        </p>

        <button
          onClick={onClose}
          className="
          mt-4
          bg-red-500
          text-white
          px-4
          py-2
          rounded
          "
        >
          Close
        </button>

      </div>

    </div>

  );

}

export default CustomerModal;