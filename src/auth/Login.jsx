import React, { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
  if (!email) {
    setError("Please enter email");
    return;
  }

  try {
    setLoading(true);
    setError("");

    const res = await fetch(
      `https://apis.ganeshinfotech.org/api/Customer/GetCustomer?id=${email}`
    );

    const data = await res.json();

    console.log("Login Response:", data);

    // ✅ Check status
    if (data?.status === 1) {
      // ✅ Store in session
      sessionStorage.setItem("user", JSON.stringify(data));

      // ✅ Redirect to home
      window.location.href = "/";

    } else {
      // ❌ Invalid user
      setError("Invalid email or user not found");
    }

  } catch (err) {
    console.error(err);
    setError("Something went wrong");
  } finally {
    setLoading(false);
  }
}

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Customer Login</h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button onClick={handleLogin} style={styles.button}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "80vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f7fb",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    width: "320px",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ddd",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#1E4FA5",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "13px",
  },
};