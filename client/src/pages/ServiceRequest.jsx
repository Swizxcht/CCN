import { useState } from "react";
import AlertModal from "../components/modals/AlertModal";
import { createRequest } from "../services/serviceRequestService";

function ServiceRequest() {

  const [form, setForm] = useState({
    issue_type: "No Internet",
    issue_description: "",
    contact_number: "",
    address: ""
  });
  const [alert, setAlert] = useState(null);

  const submit = async (event) => {
    event.preventDefault();

    try {
      await createRequest(form);
      setAlert({
        type: "success",
        title: "Request Submitted",
        message: "Your service request was submitted.",
      });
      setForm({
        issue_type: "No Internet",
        issue_description: "",
        contact_number: "",
        address: ""
      });
    } catch (error) {
      console.error(error);
      setAlert({
        type: "error",
        title: "Submission Failed",
        message: "Failed to submit request. Please login and try again.",
      });
    }
  };

  return (
    <div className="p-6">

      <h1>Service Request</h1>

      <form onSubmit={submit} className="space-y-4">
        <select
          name="issue_type"
          value={form.issue_type}
          onChange={(e) => setForm({ ...form, issue_type: e.target.value })}
          className="border p-2 w-full"
        >
          <option value="No Internet">No Internet</option>
          <option value="Slow Internet">Slow Internet</option>
          <option value="Cable Issue">Cable Issue</option>
          <option value="Relocation">Relocation</option>
          <option value="New Installation">New Installation</option>
        </select>

        <input
          name="issue_description"
          value={form.issue_description}
          placeholder="Description"
          onChange={(e) => setForm({ ...form, issue_description: e.target.value })}
          className="border p-2 w-full"
          required
        />

        <input
          name="contact_number"
          value={form.contact_number}
          placeholder="Contact Number"
          onChange={(e) => setForm({ ...form, contact_number: e.target.value })}
          className="border p-2 w-full"
          required
        />

        <input
          name="address"
          value={form.address}
          placeholder="Address"
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="border p-2 w-full"
          required
        />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2">
          Submit Request
        </button>
      </form>
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

export default ServiceRequest;
