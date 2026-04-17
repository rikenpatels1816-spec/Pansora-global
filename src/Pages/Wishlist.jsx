import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";

const IMAGE_BASE = "https://pansoraglobal.ganeshinfotech.org/Item_Images/Item/";

export default function Wishlist() {
  const [activeTab, setActiveTab] = useState("wishlist");

  const [list, setList] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);

  const [confirmBox, setConfirmBox] = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));

  /* =========================
     FETCH WISHLIST
  ========================== */
  async function fetchWishlist() {
    if (!user?.Cust_Code) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `https://apis.ganeshinfotech.org/api/wishlist/GetWishlist/${user.Cust_Code}`
      );

      const data = await res.json();

      setList(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      console.error(err);
      setList([]);
    } finally {
      setLoading(false);
    }
  }

  /* =========================
     FETCH ORDERS
  ========================== */
  async function fetchOrders() {
    if (!user?.Cust_Code) return;

    try {
      setOrderLoading(true);

      const res = await fetch(
        `https://apis.ganeshinfotech.org/api/Customer/Get_Customer_Quoted/${user.Cust_Code}`
      );

      const data = await res.json();

      setOrders(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      console.error(err);
      setOrders([]);
    } finally {
      setOrderLoading(false);
    }
  }

  /* =========================
     TAB SWITCH
  ========================== */
  useEffect(() => {
    if (activeTab === "wishlist") {
      fetchWishlist();
    } else {
      fetchOrders();
    }
  }, [activeTab]);

  /* =========================
     REMOVE SINGLE
  ========================== */
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

  /* =========================
     REMOVE ALL
  ========================== */
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

  /* =========================
     GET QUOTE (EMAILJS)
  ========================== */
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

  /* =========================
     UI
  ========================== */

  return (
    <div className="wl-page">

      {/* 🔥 TABS */}
      <div className="tabs">
        <button
          className={activeTab === "wishlist" ? "tab active" : "tab"}
          onClick={() => setActiveTab("wishlist")}
        >
          ❤️ Wishlist
        </button>

        <button
          className={activeTab === "orders" ? "tab active" : "tab"}
          onClick={() => setActiveTab("orders")}
        >
          📦 Orders
        </button>
      </div>

      {/* =========================
         WISHLIST TAB
      ========================== */}
      {activeTab === "wishlist" && (
        <>
          {loading ? (
            <p>Loading wishlist...</p>
          ) : list.length === 0 ? (
            <div className="wl-empty">
              <h3>Your wishlist is empty</h3>
              <button onClick={() => navigate("/")}>
                Explore Products →
              </button>
            </div>
          ) : (
            <>
              <div className="wl-header">
                <h2>Wishlist ({list.length})</h2>

                <button
                  className="wl-clear-btn"
                  onClick={() => setConfirmBox({ type: "all" })}
                >
                  Remove All
                </button>
              </div>

              <div className="wl-grid">
                {list.map((item, i) => (
                  <div className="wl-card" key={i}>
                    <div className="wl-img-wrap">
                      {item.Item_Images?.[0] ? (
                        <img
                          src={IMAGE_BASE + item.Item_Images[0]}
                          alt={item.Itm_Name}
                        />
                      ) : (
                        <div className="no-image-box">No Image</div>
                      )}
                    </div>

                    <div className="wl-body">
                      <h4>{item.Itm_Name}</h4>
                      <p>{item.Itm_Code}</p>
                    </div>

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
                          setConfirmBox({
                            type: "single",
                            code: item.Itm_Code,
                          })
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="wl-footer">
                <button onClick={handleGetQuote}>
                  Get Quote for All Items
                </button>
              </div>
            </>
          )}
        </>
      )}

      {/* =========================
         ORDERS TAB
      ========================== */}
      {activeTab === "orders" && (
        <>
          <div className="wl-header">
            <h2>Orders ({orders.length})</h2>
          </div>

          {orderLoading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <div className="wl-empty">
              <h3>No Orders Yet</h3>
            </div>
          ) : (
            <div className="wl-grid">
              {orders.map((order, i) => (
                <div className="wl-card" key={i}>
                  <div className="wl-body">
                    <h4>{order.Itm_Name}</h4>
                    <p>Code: {order.Itm_Code}</p>
                    <p>Status: {order.Status || "Pending"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* =========================
         CONFIRM MODAL
      ========================== */}
      {confirmBox && (
        <div className="confirmOverlay">
          <div className="confirmBox">
            <h3>
              {confirmBox.type === "all"
                ? "Remove all items?"
                : "Remove this item?"}
            </h3>

            <div className="confirmActions">
              <button onClick={() => setConfirmBox(null)}>
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