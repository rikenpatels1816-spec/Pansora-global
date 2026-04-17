import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import styles from "./Wishlist.module.css";

const IMAGE_BASE = "https://pansoraglobal.ganeshinfotech.org/Item_Images/Item/";

/* ── Initials avatar ─────────────────────────────── */
function getInitials(name) {
  if (!name) return "?";
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
}

function NoImage({ name }) {
  return (
    <div className={styles.noImg}>
      <div className={styles.noImgCircle}>
        <span className={styles.noImgInitials}>{getInitials(name)}</span>
      </div>
    </div>
  );
}

/* ── Skeleton card ───────────────────────────────── */
function SkeletonCard({ index }) {
  return (
    <div className={styles.skeletonCard} style={{ animationDelay: `${index * 60}ms` }}>
      <div className={styles.skeletonImg} />
      <div className={styles.skeletonBody}>
        <div className={styles.skeletonLine} style={{ height: 10, width: "30%" }} />
        <div className={styles.skeletonLine} style={{ height: 16, width: "80%" }} />
        <div className={styles.skeletonLine} style={{ height: 34, width: "100%", marginTop: 8, borderRadius: 100 }} />
      </div>
    </div>
  );
}

/* ── Order card with carousel ────────────────────── */
function OrderCard({ order, index, navigate }) {
  const [imgIndex, setImgIndex] = useState(0);
  const images   = order.Item_Images || [];
  const hasMulti = images.length > 1;

  const next = (e) => { e.stopPropagation(); setImgIndex((p) => (p + 1) % images.length); };
  const prev = (e) => { e.stopPropagation(); setImgIndex((p) => (p - 1 + images.length) % images.length); };

  return (
    <div className={styles.orderCard} style={{ "--i": index }}>
      <div className={styles.orderImgWrap}>
        {images.length > 0
          ? <img src={IMAGE_BASE + images[imgIndex]} alt={order.Itm_Name} className={styles.orderImg} />
          : <NoImage name={order.Itm_Name} />
        }
        {hasMulti && (
          <>
            <button className={`${styles.arrowBtn} ${styles.arrowLeft}`}  onClick={prev}>‹</button>
            <button className={`${styles.arrowBtn} ${styles.arrowRight}`} onClick={next}>›</button>
          </>
        )}
        <div className={styles.orderImgOverlay} />
      </div>
      <div className={styles.orderBody}>
        <span className={styles.orderCode}>#{order.Itm_Code}</span>
        <h3 className={styles.orderName}>{order.Itm_Name}</h3>
        <button
          className={styles.orderViewBtn}
          onClick={() => navigate(`/productdetails/${order.Itm_Code}`)}
        >
          View Details
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────── */
export default function Wishlist() {
  const [activeTab,    setActiveTab]    = useState("wishlist");
  const [list,         setList]         = useState([]);
  const [orders,       setOrders]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [confirmBox,   setConfirmBox]   = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [toast,        setToast]        = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user") || "null");

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  async function fetchWishlist() {
    if (!user?.Cust_Code) { navigate("/login"); return; }
    try {
      setLoading(true);
      const res  = await fetch(`https://apis.ganeshinfotech.org/api/wishlist/GetWishlist/${user.Cust_Code}`);
      const data = await res.json();
      setList(Array.isArray(data?.data) ? data.data : []);
    } catch { setList([]); }
    finally  { setLoading(false); }
  }

  async function fetchOrders() {
    if (!user?.Cust_Code) return;
    try {
      setOrderLoading(true);
      const res  = await fetch(`https://apis.ganeshinfotech.org/api/Customer/Get_Customer_Quoted/${user.Cust_Code}`);
      const data = await res.json();
      setOrders(Array.isArray(data?.data) ? data.data : []);
    } catch { setOrders([]); }
    finally  { setOrderLoading(false); }
  }

  useEffect(() => {
    activeTab === "wishlist" ? fetchWishlist() : fetchOrders();
  }, [activeTab]);

  async function removeItem(Itm_Code) {
    try {
      const res  = await fetch("https://apis.ganeshinfotech.org/api/wishlist/RemoveWishList", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Cust_Code: user.Cust_Code, Itm_Code }),
      });
      const data = await res.json();
      if (data?.success) {
        setList((prev) => prev.filter((item) => item.Itm_Code !== Itm_Code));
        window.dispatchEvent(new Event("wishlistUpdated"));
        showToast("Item removed from wishlist");
      }
    } catch { showToast("Failed to remove item", "error"); }
  }

  async function clearWishlist() {
    try {
      const res  = await fetch("https://apis.ganeshinfotech.org/api/wishlist/DeleteWishList", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Cust_Code: user.Cust_Code }),
      });
      const data = await res.json();
      if (data?.success) {
        setList([]);
        window.dispatchEvent(new Event("wishlistUpdated"));
        showToast("Wishlist cleared");
      }
    } catch { showToast("Failed to clear wishlist", "error"); }
  }

  async function handleGetQuote() {
    if (!user) { navigate("/login"); return; }
    const wishlistText = list.map((item, i) => `${i + 1}. ${item.Itm_Name} (${item.Itm_Code})`).join("\n");
    try {
      setQuoteLoading(true);
      await emailjs.send(
        "service_vv9r9q3", "template_ko3j82v",
        { customer_name: user.Cust_Name, customer_email: user.Cust_Email, message: wishlistText },
        "09nWHi2weMuj-prpZ"
      );
      showToast("Quote request sent successfully!");
    } catch { showToast("Failed to send quote request", "error"); }
    finally { setQuoteLoading(false); }
  }

  return (
    <div className={styles.page}>

      {/* ── CONTENT ── */}
      <div className={styles.contentWrap}>

        {/* TABS */}
        <div className={styles.tabBar}>
          <button
            className={`${styles.tab} ${activeTab === "wishlist" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("wishlist")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={activeTab === "wishlist" ? "#fff" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            Wishlist
            {list.length > 0 && <span className={styles.tabBadge}>{list.length}</span>}
          </button>
          <button
            className={`${styles.tab} ${activeTab === "orders" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            Orders
            {orders.length > 0 && <span className={styles.tabBadge}>{orders.length}</span>}
          </button>
        </div>

        {/* ── WISHLIST ── */}
        {activeTab === "wishlist" && (
          <>
            {loading ? (
              <div className={styles.skeletonGrid}>
                {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} index={i} />)}
              </div>
            ) : list.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIconWrap}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1E4FA5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </div>
                <h3 className={styles.emptyTitle}>Your wishlist is empty</h3>
                <p className={styles.emptyText}>Save products you love and request quotes for all of them at once.</p>
                <button className={styles.emptyBtn} onClick={() => navigate("/")}>
                  Explore Products
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
              </div>
            ) : (
              <>
                {/* Section header */}
                <div className={styles.sectionRow}>
                  <div className={styles.sectionLeft}>
                    <h2 className={styles.sectionTitle}>Saved Items</h2>
                    <span className={styles.sectionCount}>{list.length}</span>
                  </div>
                  <button className={styles.clearBtn} onClick={() => setConfirmBox({ type: "all" })}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                    Remove All
                  </button>
                </div>

                {/* Grid */}
                <div className={styles.wlGrid}>
                  {list.map((item, i) => (
                    <div className={styles.wlCard} key={item.Itm_Code} style={{ "--i": i }}>
                      <div className={styles.wlImgWrap}>
                        {item.Item_Images?.[0]
                          ? <img src={IMAGE_BASE + item.Item_Images[0]} alt={item.Itm_Name} className={styles.wlImg} />
                          : <NoImage name={item.Itm_Name} />
                        }
                        <button
                          className={styles.wlRemoveFloat}
                          onClick={() => setConfirmBox({ type: "single", code: item.Itm_Code })}
                          title="Remove"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                      </div>
                      <div className={styles.wlBody}>
                        <span className={styles.wlCode}>#{item.Itm_Code}</span>
                        <h3 className={styles.wlName}>{item.Itm_Name}</h3>
                        <button
                          className={styles.wlViewBtn}
                          onClick={() => navigate(`/productdetails/${item.Itm_Code}`)}
                        >
                          View Details
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quote footer */}
                <div className={styles.quoteBar}>
                  <div className={styles.quoteBarLeft}>
                    <div className={styles.quoteBarIcon}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    </div>
                    <div>
                      <p className={styles.quoteBarTitle}>Ready to request a quote?</p>
                      <p className={styles.quoteBarSub}>{list.length} item{list.length !== 1 ? "s" : ""} selected</p>
                    </div>
                  </div>
                  <button className={styles.quoteBtn} onClick={handleGetQuote} disabled={quoteLoading}>
                    {quoteLoading
                      ? <><span className={styles.btnSpinner} />Sending...</>
                      : <>Get Quote for All Items <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></>
                    }
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {/* ── ORDERS ── */}
        {activeTab === "orders" && (
          <>
            {orderLoading ? (
              <div className={styles.skeletonGrid}>
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} index={i} />)}
              </div>
            ) : orders.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIconWrap}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1E4FA5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                </div>
                <h3 className={styles.emptyTitle}>No orders yet</h3>
                <p className={styles.emptyText}>Your quoted orders will appear here once you've requested a quote.</p>
                <button className={styles.emptyBtn} onClick={() => navigate("/")}>
                  Browse Products
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
              </div>
            ) : (
              <>
                <div className={styles.sectionRow}>
                  <div className={styles.sectionLeft}>
                    <h2 className={styles.sectionTitle}>Your Orders</h2>
                    <span className={styles.sectionCount}>{orders.length}</span>
                  </div>
                </div>
                <div className={styles.ordersGrid}>
                  {orders.map((order, i) => (
                    <OrderCard key={i} order={order} index={i} navigate={navigate} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* ── CONFIRM MODAL ── */}
      {confirmBox && (
        <div className={styles.overlay} onClick={() => setConfirmBox(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalIconWrap}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e8394b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
            </div>
            <h3 className={styles.modalTitle}>
              {confirmBox.type === "all" ? "Remove all items?" : "Remove this item?"}
            </h3>
            <p className={styles.modalText}>
              {confirmBox.type === "all"
                ? "All items will be removed from your wishlist. This cannot be undone."
                : "This item will be removed from your wishlist."}
            </p>
            <div className={styles.modalActions}>
              <button className={styles.modalCancelBtn} onClick={() => setConfirmBox(null)}>Cancel</button>
              <button
                className={styles.modalDangerBtn}
                onClick={() => {
                  confirmBox.type === "all" ? clearWishlist() : removeItem(confirmBox.code);
                  setConfirmBox(null);
                }}
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div className={`${styles.toast} ${toast.type === "error" ? styles.toastError : styles.toastSuccess}`}>
          {toast.type === "error"
            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          }
          {toast.msg}
        </div>
      )}
    </div>
  );
}