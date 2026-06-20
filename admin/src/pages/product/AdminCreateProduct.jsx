import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import formValidator from "../../FormValidators/formValidator";
import imageValidator from "../../FormValidators/imageValidator";
import { createProduct } from "../../Redux/ActionCreators/ProductActionCreators";
import { getMaincategory } from "../../Redux/ActionCreators/MaincategoryActionCreators";
import { getSubcategory } from "../../Redux/ActionCreators/SubcategoryActionCreators";
import { getResturent } from "../../Redux/ActionCreators/ResturentActionCreators";

const checklist = [
  {
    dot: "bg-success",
    title: "Name & categorize",
    body: "Use a clear dish name and pick the right category, subcategory, and restaurant.",
  },
  {
    dot: "bg-primary",
    title: "Set pricing",
    body: "Base price and discount automatically calculate the final price shown to customers.",
  },
  {
    dot: "bg-warning",
    title: "Upload image",
    body: "Add a single clear photo of the dish — it appears as the cover image.",
  },
];

export default function AdminCreateProduct() {
  const [data, setData] = useState({
    name: "",
    maincategory: "",
    subcategory: "",
    resturent: "",
    basePrice: 0,
    discount: 0,
    finalPrice: 0,
    description: "",
    pic: null,
    availability: true,
    active: true,
  });

  const [error, setError] = useState({
    name: "Name Field is Mandatory",
    basePrice: "Base Price Field is Mandatory",
    discount: "Discount Field is Mandatory",
    pic: "Pic Field is Mandatory",
  });

  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const MaincategoryStateData = useSelector((state) => state.MaincategoryStateData);
  const SubcategoryStateData = useSelector((state) => state.SubcategoryStateData);
  const ResturentStateData = useSelector((state) => state.ResturentStateData);
  const dispatch = useDispatch();

  useEffect(() => { dispatch(getMaincategory()); }, [MaincategoryStateData.length]);
  useEffect(() => { dispatch(getSubcategory()); }, [SubcategoryStateData.length]);
  useEffect(() => { dispatch(getResturent()); }, [ResturentStateData.length]);

  function getInputData(e) {
    const name = e.target.name;
    const value = e.target.files ? e.target.files[0] : e.target.value;

    if (name !== "active" && name !== "availability") {
      setError((old) => ({
        ...old,
        [name]: e.target.files ? imageValidator(e) : formValidator(e),
      }));
    }

    setData((old) => ({
      ...old,
      [name]:
        name === "active" || name === "availability"
          ? value === "1"
            ? true
            : false
          : value,
    }));
  }

  function postSubmit(e) {
    e.preventDefault();
    const errorItem = Object.values(error).find((x) => x !== "");
    if (errorItem) {
      setShow(true);
      return;
    }

    const bp = parseInt(data.basePrice);
    const d = parseInt(data.discount);
    const fp = parseInt(bp - (bp * d) / 100);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("maincategory", data.maincategory ? data.maincategory : MaincategoryStateData[0]?._id);
    formData.append("subcategory", data.subcategory ? data.subcategory : SubcategoryStateData[0]?._id);
    formData.append("resturent", data.resturent ? data.resturent : ResturentStateData[0]?._id);
    formData.append("basePrice", bp);
    formData.append("discount", d);
    formData.append("finalPrice", fp);
    formData.append("description", data.description);
    formData.append("availability", data.availability);
    formData.append("active", data.active);
    if (data.pic) formData.append("pic", data.pic);

    dispatch(createProduct(formData));
    navigate("/product");
  }

  return (
    <main className="dashboard-content">
      <div className="container-fluid px-3 px-lg-4 py-4">
        <div className="page-heading">
          <div className="page-heading-copy">
            <span className="page-icon">
              <i className="bi bi-plus-circle" aria-hidden="true"></i>
            </span>
            <div>
              <p className="eyebrow mb-1">Management</p>
              <h1 className="h3 mb-1">Add Dish</h1>
              <p className="text-muted mb-0">
                Create a new dish with category, restaurant, pricing, and image.
              </p>
            </div>
          </div>
          <div className="heading-actions">
            <Link className="btn btn-outline-secondary btn-sm" to="/product">
              <i className="bi bi-arrow-left" aria-hidden="true"></i> Back to
              Products
            </Link>
          </div>
        </div>

        {show && (
          <div className="alert alert-danger alert-dismissible" role="alert">
            {Object.values(error).find((x) => x !== "")}
            <button
              type="button"
              className="btn-close"
              onClick={() => setShow(false)}
              aria-label="Close"
            />
          </div>
        )}

        <section className="row g-3">
          <div className="col-12 col-xl-8">
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2 className="h5 mb-1 section-title">
                    <i className="bi bi-egg-fried" aria-hidden="true"></i>
                    <span>Dish Information</span>
                  </h2>
                  <p className="text-muted mb-0">
                    Fill in the details to create a new dish.
                  </p>
                </div>
              </div>

              <div className="row g-3">

                {/* Name */}
                <div className="col-12">
                  <label className="form-label" htmlFor="name">Name</label>
                  <input
                    className={`form-control ${show && error.name ? "is-invalid" : ""}`}
                    id="name"
                    type="text"
                    name="name"
                    onChange={getInputData}
                    placeholder="Enter Dish Name"
                  />
                  {show && error.name && (
                    <div className="text-danger small mt-1">{error.name}</div>
                  )}
                </div>

                {/* Main Category */}
                <div className="col-md-4">
                  <label className="form-label" htmlFor="maincategory">Main Category</label>
                  <select
                    className="form-select"
                    id="maincategory"
                    name="maincategory"
                    onChange={getInputData}
                  >
                    {MaincategoryStateData?.filter((x) => x.active).map((item) => (
                      <option key={item._id} value={item._id}>{item.name}</option>
                    ))}
                  </select>
                </div>

                {/* Sub Category */}
                <div className="col-md-4">
                  <label className="form-label" htmlFor="subcategory">Sub Category</label>
                  <select
                    className="form-select"
                    id="subcategory"
                    name="subcategory"
                    onChange={getInputData}
                  >
                    {SubcategoryStateData?.filter((x) => x.active).map((item) => (
                      <option key={item._id} value={item._id}>{item.name}</option>
                    ))}
                  </select>
                </div>

                {/* Restaurant */}
                <div className="col-md-4">
                  <label className="form-label" htmlFor="resturent">Restaurant</label>
                  <select
                    className="form-select"
                    id="resturent"
                    name="resturent"
                    onChange={getInputData}
                  >
                    {ResturentStateData?.filter((x) => x.active).map((item) => (
                      <option key={item._id} value={item._id}>{item.name}</option>
                    ))}
                  </select>
                </div>

                {/* Base Price */}
                <div className="col-md-4">
                  <label className="form-label" htmlFor="basePrice">Base Price (₹)</label>
                  <input
                    className={`form-control ${show && error.basePrice ? "is-invalid" : ""}`}
                    id="basePrice"
                    type="number"
                    name="basePrice"
                    onChange={getInputData}
                    placeholder="Enter Base Price"
                  />
                  {show && error.basePrice && (
                    <div className="text-danger small mt-1">{error.basePrice}</div>
                  )}
                </div>

                {/* Discount */}
                <div className="col-md-4">
                  <label className="form-label" htmlFor="discount">Discount (%)</label>
                  <input
                    className={`form-control ${show && error.discount ? "is-invalid" : ""}`}
                    id="discount"
                    type="number"
                    name="discount"
                    onChange={getInputData}
                    placeholder="Enter Discount"
                  />
                  {show && error.discount && (
                    <div className="text-danger small mt-1">{error.discount}</div>
                  )}
                </div>

                {/* Final Price (read-only preview) */}
                <div className="col-md-4">
                  <label className="form-label">Final Price (₹)</label>
                  <input
                    className="form-control bg-light"
                    type="number"
                    readOnly
                    value={
                      data.basePrice && data.discount !== undefined
                        ? Math.round(data.basePrice - (data.basePrice * data.discount) / 100)
                        : 0
                    }
                    placeholder="Auto-calculated"
                  />
                  <div className="text-muted small mt-1">Calculated automatically</div>
                </div>

                {/* Description */}
                <div className="col-12">
                  <label className="form-label">Description</label>
                  <ReactQuill
                    theme="snow"
                    value={data.description}
                    onChange={(value) => setData((old) => ({ ...old, description: value }))}
                    className="quill-editor"
                    style={{ color: "var(--admin-text)" }}
                  />
                </div>

                {/* Image Upload (single) */}
                <div className="col-md-6">
                  <label className="form-label" htmlFor="pic">Upload Image</label>
                  <input
                    className={`form-control ${show && error.pic ? "is-invalid" : ""}`}
                    id="pic"
                    type="file"
                    name="pic"
                    accept="image/*"
                    onChange={getInputData}
                  />
                  {show && error.pic && (
                    <div className="text-danger small mt-1">{error.pic}</div>
                  )}
                </div>

                {/* Availability */}
                <div className="col-md-3">
                  <label className="form-label" htmlFor="availability">Availability</label>
                  <select
                    className="form-select"
                    id="availability"
                    name="availability"
                    value={data.availability ? "1" : "0"}
                    onChange={getInputData}
                  >
                    <option value="1">Available</option>
                    <option value="0">Unavailable</option>
                  </select>
                </div>

                {/* Status */}
                <div className="col-md-3">
                  <label className="form-label" htmlFor="active">Status</label>
                  <select
                    className="form-select"
                    id="active"
                    name="active"
                    value={data.active ? "1" : "0"}
                    onChange={getInputData}
                  >
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>

              </div>

              <div className="d-flex flex-wrap justify-content-end gap-2 mt-4">
                <Link className="btn btn-outline-secondary" to="/product">Cancel</Link>
                <button className="btn btn-primary" type="button" onClick={postSubmit}>
                  <i className="bi bi-check-circle" aria-hidden="true"></i>{" "}
                  Create Dish
                </button>
              </div>
            </div>
          </div>

          <div className="col-12 col-xl-4">
            <div className="panel h-100">
              <h2 className="h5 mb-3 section-title">
                <i className="bi bi-list-check" aria-hidden="true"></i>
                <span>Setup Checklist</span>
              </h2>
              <div className="activity-list">
                {checklist.map(({ dot, title, body }) => (
                  <div key={title} className="activity-item">
                    <span className={`activity-dot ${dot}`}></span>
                    <div>
                      <p className="mb-1 fw-semibold">{title}</p>
                      <p className="text-muted small mb-0">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}