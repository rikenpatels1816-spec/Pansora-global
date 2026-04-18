import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/Css/Login.css";

export default function Login() {
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ msg: "", show: false });
  const [loginEmail, setLoginEmail] = useState("");
  const [registerForm, setRegisterForm] = useState({
    Cust_Name: "",
    Cust_Email: "",
    Cust_Address: "",
    Cust_Contact: "",
  });

  const navigate = useNavigate();

  function showToast(msg) {
    setToast({ msg, show: true });
    setTimeout(() => setToast({ msg: "", show: false }), 3000);
  }

  async function handleLogin() {
    if (!loginEmail) return showToast("Please enter your email");
    try {
      setLoading(true);
      const res = await fetch(
        `https://apis.ganeshinfotech.org/api/Customer/GetCustomer?id=${loginEmail}`
      );
      const data = await res.json();
      const user = data?.data?.[0];
      if (user?.status === 1) {
        sessionStorage.setItem("user", JSON.stringify(user));
        navigate("/");
      } else {
        showToast("Invalid credentials");
      }
    } catch {
      showToast("Login failed");
    } finally {
      setLoading(false);
    }
  }

async function handleRegister() {
  if (
    !registerForm.Cust_Name ||
    !registerForm.Cust_Email ||
    !registerForm.Cust_Contact ||
    !registerForm.Cust_Address
  ) {
    return showToast("Please fill all fields");
  }

  try {
    setLoading(true);

    const payload = {
  Cust_Name: registerForm.Cust_Name,
  Cust_Email: registerForm.Cust_Email,
  Cust_Address: registerForm.Cust_Address,
  Cust_Contact: registerForm.Cust_Contact,
};

const res = await fetch(
  "https://apis.ganeshinfotech.org/api/Customer/CustomerDetails",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload), // ✅ FIXED
  }
);

    const data = await res.json();

    console.log("Response:", data);

   if (data?.success === true) {
      showToast("Account created! Please sign in.");
      setActiveTab("login");
    } else {
      showToast(data?.message || "Registration failed");
    }

  } catch (err) {
    console.error(err);
    showToast("Something went wrong");
    console.log("Register Payload:", registerForm);
console.log("Register Response:", data);
  } finally {
    setLoading(false);
  }
}



  return (
    <div className="authWrap">


      {/* ── RIGHT FORM PANEL ── */}
      <div className="authRight">
        <div className="authFormBox">
          

          {/* TABS */}
          <div className="authTabRow">
            <button
              className={`authTab ${activeTab === "login" ? "authTabActive" : ""}`}
              onClick={() => setActiveTab("login")}
            >
              Sign in
            </button>
            <button
              className={`authTab ${activeTab === "register" ? "authTabActive" : ""}`}
              onClick={() => setActiveTab("register")}
            >
              Create account
            </button>
          </div>

          {/* LOGIN PANEL */}
          {activeTab === "login" && (
            <div className="authPanel" key="login">

              <div className="authField">
                <label>Email address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>

              <button className="authBtn" onClick={handleLogin} disabled={loading}>
                {loading ? "Signing in..." : "Sign in →"}
              </button>

            </div>
          )}

          {/* REGISTER PANEL */}
          {activeTab === "register" && (
            <div className="authPanel" key="register">

              <div className="authFieldRow">
                <div className="authField">
                  <label>Full name</label>
                  <input
                    type="text"
                    placeholder="Jane Doe"
                    value={registerForm.Cust_Name}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, Cust_Name: e.target.value })
                    }
                  />
                </div>
                <div className="authField">
                  <label>Contact</label>
                  <input
                    type="tel"
                    placeholder="+1 ..."
                    value={registerForm.Cust_Contact}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, Cust_Contact: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="authField">
                <label>Email address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={registerForm.Cust_Email}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, Cust_Email: e.target.value })
                  }
                />
              </div>

              <div className="authField">
                <label>Address</label>
                <textarea
                  placeholder="Street, City, State..."
                  value={registerForm.Cust_Address}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, Cust_Address: e.target.value })
                  }
                />
              </div>

              <button className="authBtn" onClick={handleRegister} disabled={loading}>
                {loading ? "Creating account..." : "Create account →"}
              </button>
            </div>
          )}
        </div>

        {/* TOAST */}
        <div className={`authToast ${toast.show ? "authToastShow" : ""}`}>
          {toast.msg}
        </div>
      </div>
    </div>
  );
}