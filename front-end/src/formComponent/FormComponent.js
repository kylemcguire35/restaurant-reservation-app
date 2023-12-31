import React from "react";

function FormComponent({ formData, setFormData }) {
  function formatPhoneNumber(input) {
    if (input) {
      const numericInput = input.replace(/\D/g, "");
      return numericInput.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    }
  }

  const formattedPhoneNumber = formatPhoneNumber(formData.mobile_number);

  const handleChange = ({ target }) => {
    let value = target.value;
    if (target.name === "people") value = parseInt(target.value);
    setFormData({
      ...formData,
      [target.name]: value,
    });
  };

  return (
    <form className="py-3">
      <div className="form-row">
        <div className="col-sm-12 col-md-6">
          <label className="form-label">First Name</label>
          <input
            className="form-control"
            id="first_name"
            type="text"
            name="first_name"
            onChange={handleChange}
            value={formData.first_name}
            placeholder="First Name"
            required
          />
        </div>
        <div className="col-sm-12 col-md-6">
          <label className="form-label">Last Name</label>
          <input
            className="form-control"
            id="last_name"
            type="text"
            name="last_name"
            onChange={handleChange}
            value={formData.last_name}
            placeholder="Last Name"
            required
          />
        </div>
        <div className="col-sm-12 col-md-6">
          <label className="form-label">Mobile Number</label>
          <input
            className="form-control"
            id="mobile_number"
            type="tel"
            name="mobile_number"
            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
            onChange={handleChange}
            value={formattedPhoneNumber}
            placeholder="Mobile Number"
            required
          />
        </div>
        <div className="col-sm-12 col-md-6">
          <label className="form-label">Date of Reservation</label>
          <input
            className="form-control"
            id="reservation_date"
            type="date"
            name="reservation_date"
            onChange={handleChange}
            value={formData.reservation_date}
            required
          />
        </div>
        <div className="col-sm-12 col-md-6">
          <label className="form-label">Time of Reservation</label>
          <input
            className="form-control"
            id="reservation_time"
            type="time"
            name="reservation_time"
            onChange={handleChange}
            value={formData.reservation_time}
            required
          />
        </div>
        <div className="col-sm-12 col-md-6">
          <label className="form-label">People in the Party</label>
          <input
            className="form-control"
            type="number"
            id="people"
            name="people"
            min="1"
            onChange={handleChange}
            value={formData.people}
            placeholder="Party of _______"
            required
          />
        </div>
      </div>
    </form>
  );
}

export default FormComponent;
