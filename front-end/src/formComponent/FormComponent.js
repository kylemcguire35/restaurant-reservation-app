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
    <form>
      <label>
        First Name
        <input
          id="first_name"
          type="text"
          name="first_name"
          onChange={handleChange}
          value={formData.first_name}
          placeholder="First Name"
          required
        />
      </label>
      <label>
        Last Name
        <input
          id="last_name"
          type="text"
          name="last_name"
          onChange={handleChange}
          value={formData.last_name}
          placeholder="Last Name"
          required
        />
      </label>
      <label>
        Mobile Number
        <input
          id="mobile_number"
          type="tel"
          name="mobile_number"
          pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
          onChange={handleChange}
          value={formattedPhoneNumber}
          required
        />
      </label>
      <label>
        Date of Reservation
        <input
          id="reservation_date"
          type="date"
          name="reservation_date"
          onChange={handleChange}
          value={formData.reservation_date}
          required
        />
      </label>
      <label>
        Time of Reservation
        <input
          id="reservation_time"
          type="time"
          name="reservation_time"
          onChange={handleChange}
          value={formData.reservation_time}
          required
        />
      </label>
      <label>
        People in the Party
        <input
          type="number"
          id="people"
          name="people"
          min="1"
          onChange={handleChange}
          value={formData.people}
          required
        />
      </label>
    </form>
  );
}

export default FormComponent;
