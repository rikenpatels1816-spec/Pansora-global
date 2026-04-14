import React, { useState } from "react";

export default function Profile() {
  const userData = JSON.parse(sessionStorage.getItem("user"));

  const [form, setForm] = useState({
    name: userData?.Cust_Name || "",
    email: userData?.Cust_Email || "",
    contact: userData?.Cust_Contact || "",
    address: userData?.Cust_Address || "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleUpdate() {
    setLoading(true);
    setMessage("");

    try {
      // 🔥 Replace with your API later
      console.log("Updated Data:", form);

      // simulate API
      setTimeout(() => {
        // update session
        const updatedUser = {
          ...userData,
          Cust_Name: form.name,
          Cust_Email: form.email,
          Cust_Contact: form.contact,
          Cust_Address: form.address,
        };

        sessionStorage.setItem("user", JSON.stringify(updatedUser));

        setMessage("Profile updated successfully ✅");
        setLoading(false);
      }, 1000);

    } catch (err) {
      setMessage("Update failed ❌");
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        <h2 style={styles.title}>Update Profile</h2>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          style={styles.input}
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          style={styles.input}
        />

        <input
          name="contact"
          value={form.contact}
          onChange={handleChange}
          placeholder="Contact Number"
          style={styles.input}
        />

        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          style={styles.textarea}
        />

        <button onClick={handleUpdate} style={styles.button}>
          {loading ? "Updating..." : "Update Profile"}
        </button>

        {message && <p style={styles.message}>{message}</p>}

      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "80vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f7fb",
  },
  card: {
    width: "380px",
    background: "#fff",
    padding: "30px",
    borderRadius: "14px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.1)",
  },
  title: {
    marginBottom: "20px",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    height: "80px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#1E4FA5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  message: {
    marginTop: "10px",
    textAlign: "center",
    fontSize: "14px",
  },
};