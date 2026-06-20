import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProduct, deleteProduct, updateProduct } from "../../Redux/ActionCreators/ProductActionCreators";

export default function AdminProduct() {
  const ProductStateData = useSelector((state) => state.ProductStateData);
  const dispatch = useDispatch();
  const [flag, setFlag] = useState(false);
  const [search, setSearch] = useState("");

  const totalCount       = ProductStateData?.length ?? 0;
  const activeCount      = ProductStateData?.filter((i) => i.active).length ?? 0;
  const inactiveCount    = totalCount - activeCount;
  const availableCount   = ProductStateData?.filter((i) => i.availability).length ?? 0;

  function deleteRecord(_id) {
    if (window.confirm("Are you sure you want to delete this dish?")) {
      dispatch(deleteProduct({ _id }));
      setFlag((f) => !f);
    }
  }

  function toggleActive(_id) {
    const item = ProductStateData.find((p) => p._id === _id);
    if (!item) return;
    const formData = new FormData();
    formData.append("_id", item._id);
    formData.append("name", item.name);
    formData.append("active", !item.active);
    dispatch(updateProduct(formData));
    setFlag((f) => !f);
  }

  useEffect(() => { dispatch(getProduct()); }, [flag]);

  const filteredData = ProductStateData?.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase()) ||
    item.maincategory?.name?.toLowerCase().includes(search.toLowerCase()) ||
    item.subcategory?.name?.toLowerCase().includes(search.toLowerCase()) ||
    item.resturent?.name?.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  return (
    <>
      <style>{`
        .act-strip {
          display: inline-flex; align-items: center; gap: 2px;
          background: var(--bs-tertiary-bg, #f8f9fa);
          border: 1px solid var(--bs-border-color, #dee2e6);
          border-radius: 8px; padding: 3px;
        }
        .act-btn {
          display: inline-flex; align-items: center; justify-content: center;
          width: 30px; height: 30px; border-radius: 6px;
          border: none; background: transparent; cursor: pointer;
          font-size: 0.88rem; color: #6c757d;
          transition: background .13s, color .13s, transform .1s;
          text-decoration: none; position: relative;
        }
        .act-btn:hover { transform: scale(1.1); }
        .act-btn-edit:hover  { background: #cfe2ff; color: #0d6efd; }
        .act-btn-on:hover    { background: #d1e7dd; color: #198754; }
        .act-btn-off:hover   { background: #fff3cd; color: #856404; }
        .act-btn-del:hover   { background: #f8d7da; color: #dc3545; }
        .act-sep { width: 1px; height: 16px; background: var(--bs-border-color, #dee2e6); flex-shrink: 0; }
        .act-btn::after {
          content: attr(data-tip);
          position: absolute; bottom: calc(100% + 6px); left: 50%;
          transform: translateX(-50%);
          background: #212529; color: #fff;
          font-size: 0.67rem; font-weight: 600;
          padding: 3px 7px; border-radius: 4px; white-space: nowrap;
          pointer-events: none; z-index: 20;
          opacity: 0; transition: opacity .12s;
        }
        .act-btn:hover::after { opacity: 1; }
        .product-thumb {
          width: 64px; height: 48px; object-fit: cover;
          border-radius: 6px; border: 1px solid var(--bs-border-color, #dee2e6);
        }
        .price-strike { text-decoration: line-through; color: #6c757d; font-size: 0.78rem; }
        .price-final  { font-weight: 600; color: #198754; }
        .rating-star  { color: #f5a623; font-size: 0.8rem; }
      `}</style>

      <main className="dashboard-content">
        <div className="container-fluid px-3 px-lg-4 py-4">

          <div className="page-heading">
            <div className="page-heading-copy">
              <span className="page-icon">
                <i className="bi bi-egg-fried" aria-hidden="true"></i>
              </span>
              <div>
                <p className="eyebrow mb-1">Management</p>
                <h1 className="h3 mb-1">Dishes</h1>
                <p className="text-muted mb-0">Review and manage your menu catalogue.</p>
              </div>
            </div>
            <div className="heading-actions">
              <Link className="btn btn-primary btn-sm" to="/product/create">
                <i className="bi bi-plus-circle" aria-hidden="true"></i> Add Dish
              </Link>
            </div>
          </div>

          {/* Summary Cards */}
          <section className="row g-3 mt-2 mb-1" aria-label="Dish summary">
            <div className="col-12 col-sm-6 col-xl-3">
              <article className="metric-card text-white">
                <div className="metric-top">
                  <span className="metric-label">Total</span>
                  <span className="metric-icon"><i className="bi bi-egg-fried"></i></span>
                </div>
                <div className="metric-value">{totalCount}</div>
                <div className="metric-meta"><span>all</span><span>dishes</span></div>
              </article>
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <article className="metric-card text-white">
                <div className="metric-top">
                  <span className="metric-label">Active</span>
                  <span className="metric-icon"><i className="bi bi-check-circle-fill"></i></span>
                </div>
                <div className="metric-value">{activeCount}</div>
                <div className="metric-meta"><span>published</span><span>on menu</span></div>
              </article>
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <article className="metric-card">
                <div className="metric-top">
                  <span className="metric-label">Inactive</span>
                  <span className="metric-icon"><i className="bi bi-eye-slash-fill"></i></span>
                </div>
                <div className="metric-value">{inactiveCount}</div>
                <div className="metric-meta"><span>hidden</span><span>from menu</span></div>
              </article>
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <article className="metric-card text-white">
                <div className="metric-top">
                  <span className="metric-label">Available</span>
                  <span className="metric-icon"><i className="bi bi-bag-check-fill"></i></span>
                </div>
                <div className="metric-value">{availableCount}</div>
                <div className="metric-meta"><span>ready</span><span>to order</span></div>
              </article>
            </div>
          </section>

          {/* Table */}
          <section className="panel mt-3">
            <div className="panel-header">
              <div>
                <h2 className="h5 mb-1 section-title">
                  <i className="bi bi-table" aria-hidden="true"></i>
                  <span>Dish List</span>
                </h2>
                <p className="text-muted mb-0">Search, review, and manage dishes.</p>
              </div>
              <div className="ms-auto" style={{ minWidth: 220 }}>
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-white">
                    <i className="bi bi-search text-muted"></i>
                  </span>
                  <input
                    type="text" className="form-control border-start-0"
                    placeholder="Search dishes..." value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search && (
                    <button className="btn btn-outline-secondary" type="button" onClick={() => setSearch("")}>
                      <i className="bi bi-x"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Restaurant</th>
                    <th>Price</th>
                    <th>Rating</th>
                    <th>Availability</th>
                    <th>Status</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <tr key={item._id}>
                        <td>{index + 1}</td>

                        {/* Image */}
                        <td>
                          {item.pic ? (
                            <a href={item.pic} target="_blank" rel="noreferrer">
                              <img src={item.pic} className="product-thumb" alt={item.name} />
                            </a>
                          ) : (
                            <div className="product-thumb d-flex align-items-center justify-content-center bg-light">
                              <i className="bi bi-image text-muted"></i>
                            </div>
                          )}
                        </td>

                        {/* Name */}
                        <td>
                          <div className="fw-semibold">{item.name}</div>
                        </td>

                        {/* Category */}
                        <td>
                          <div className="small">{item.maincategory?.name ?? "—"}</div>
                          <div className="text-muted" style={{ fontSize: "0.75rem" }}>{item.subcategory?.name}</div>
                        </td>

                        {/* Restaurant */}
                        <td>{item.resturent?.name ?? "—"}</td>

                        {/* Price */}
                        <td>
                          <div className="price-final">₹{item.finalPrice}</div>
                          {item.discount > 0 && (
                            <div className="price-strike">
                              ₹{item.basePrice}{" "}
                              <span className="text-danger">-{item.discount}%</span>
                            </div>
                          )}
                        </td>

                        {/* Rating */}
                        <td>
                          {item.rating > 0 ? (
                            <span>
                              <i className="bi bi-star-fill rating-star"></i>{" "}
                              {item.rating.toFixed(1)}
                              <span className="text-muted small ms-1">
                                ({item.reviews?.length ?? 0})
                              </span>
                            </span>
                          ) : (
                            <span className="text-muted small">No reviews</span>
                          )}
                        </td>

                        {/* Availability */}
                        <td>
                          <span className={`badge ${item.availability ? "text-bg-success" : "text-bg-danger"}`}>
                            {item.availability ? "Available" : "Unavailable"}
                          </span>
                        </td>

                        {/* Status */}
                        <td>
                          <span className={`badge ${item.active ? "text-bg-success" : "text-bg-secondary"}`}>
                            {item.active ? "Active" : "Inactive"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="text-end">
                          <div className="act-strip">
                            <Link
                              className="act-btn act-btn-edit"
                              to={`/product/update/${item._id}`}
                              data-tip="Edit"
                            >
                              <i className="bi bi-pencil-square"></i>
                            </Link>
                            <span className="act-sep"></span>
                            <button
                              className={`act-btn ${item.active ? "act-btn-off" : "act-btn-on"}`}
                              onClick={() => toggleActive(item._id)}
                              data-tip={item.active ? "Deactivate" : "Activate"}
                            >
                              <i className={`bi ${item.active ? "bi-pause-fill" : "bi-play-fill"}`}></i>
                            </button>
                            {localStorage.getItem("role") === "Admin" && (
                              <>
                                <span className="act-sep"></span>
                                <button
                                  className="act-btn act-btn-del"
                                  onClick={() => deleteRecord(item._id)}
                                  data-tip="Delete"
                                >
                                  <i className="bi bi-trash3-fill"></i>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-center text-muted py-4">
                        {search ? `No dishes found for "${search}"` : "No dishes available."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </main>
    </>
  );
}