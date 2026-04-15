import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";

const IMAGE_BASE = "https://pansoraglobal.ganeshinfotech.org/Item_Images/Item/";

export default function Wishlist() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmBox, setConfirmBox] = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    fetchWishlist();
  }, []);

  async function fetchWishlist() {
    if (!user?.Cust_Code) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(
        `https://apis.ganeshinfotech.org/api/wishlist/GetWishlist/${user.Cust_Code}`
      );
      const data = await res.json();

      console.log("Wishlist API:", data);

      // ✅ FIX: Safe array handling
      setList(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      console.error(err);
      setList([]); // fallback
    } finally {
      setLoading(false);
    }
  }

  async function removeItem(Itm_Code) {
    try {
      const res = await fetch(
        `https://apis.ganeshinfotech.org/api/wishlist/RemoveWishList`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Cust_Code: user.Cust_Code,
            Itm_Code,
          }),
        }
      );

      const data = await res.json();

      if (data?.success) {
        setList((prev) =>
          prev.filter((item) => item.Itm_Code !== Itm_Code)
        );
        window.dispatchEvent(new Event("wishlistUpdated"));
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function clearWishlist() {
    try {
      const res = await fetch(
        `https://apis.ganeshinfotech.org/api/wishlist/DeleteWishList`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Cust_Code: user.Cust_Code,
          }),
        }
      );

      const data = await res.json();

      if (data?.success) {
        setList([]);
        window.dispatchEvent(new Event("wishlistUpdated"));
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleGetQuote() {
    if (!user) {
      navigate("/login");
      return;
    }

    const wishlistText = list
      .map((item, i) => `${i + 1}. ${item.Itm_Name} (${item.Itm_Code})`)
      .join("\n");

    const templateParams = {
      customer_name: user.Cust_Name,
      customer_email: user.Cust_Email,
      message: wishlistText,
    };

    try {
      await emailjs.send(
        "service_vv9r9q3",
        "template_ko3j82v",
        templateParams,
        "09nWHi2weMuj-prpZ"
      );

      alert("Quote request sent successfully 📩");
    } catch (err) {
      console.error(err);
      alert("Failed to send request ❌");
    }
  }

  // 🔄 Loading state
  if (loading) {
    return (
      <div className="wl-loading">
        <div className="wl-spinner" />
        <p>Loading your wishlist…</p>
      </div>
    );
  }

  // ❌ Empty state (FIXED)
  if (!list || list.length === 0) {
    return (
      <div className="wl-empty">
        <div className="wl-empty-icon">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </div>
        <h3>Your wishlist is empty</h3>
        <p>Save items you love and come back to them anytime.</p>

        <button
          className="wl-explore-btn"
          onClick={() => navigate("/")}
        >
          Explore Products →
        </button>
      </div>
    );
  }

  return (
    <div className="wl-page">

      {/* Header */}
      <div className="wl-header">
        <h2>Wishlist ({list.length})</h2>

        <button
          className="wl-clear-btn"
          onClick={() => setConfirmBox({ type: "all" })}
        >
          Remove All
        </button>
      </div>

      {/* Grid */}
      <div className="wl-grid">
        {list.map((item, i) => (
          <div className="wl-card" key={i}>

            {/* Image */}
            <div className="wl-img-wrap">
              {item.Item_Images?.[0] ? (
                <img
                  src={IMAGE_BASE + item.Item_Images[0]}
                  alt={item.Itm_Name}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div className="no-image-box">No Image</div>
              )}
            </div>

            {/* Info */}
            <div className="wl-body">
              <h4>{item.Itm_Name}</h4>
              <p>{item.Itm_Code}</p>
            </div>

            {/* Actions */}
            <div className="wl-actions">
              <button
                onClick={() =>
                  navigate(`/productdetails/${item.Itm_Code}`)
                }
              >
                View
              </button>

              <button
                onClick={() =>
                  setConfirmBox({ type: "single", code: item.Itm_Code })
                }
              >
                Remove
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="wl-footer">
        <button onClick={handleGetQuote}>
          Get Quote for All Items
        </button>
      </div>

      {/* Confirm Modal */}
      {confirmBox && (
        <div className="confirmOverlay">
          <div className="confirmBox">
            <h3>
              {confirmBox.type === "all"
                ? "Remove all items?"
                : "Remove this item?"}
            </h3>

            <div className="confirmActions">
              <button
                onClick={() => setConfirmBox(null)}
                style={{ border: "1px solid #aaa" }}
              >
                Cancel
              </button>

              <button
                className="danger"
                onClick={() => {
                  if (confirmBox.type === "all") {
                    clearWishlist();
                  } else {
                    removeItem(confirmBox.code);
                  }
                  setConfirmBox(null);
                }}
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}