import React, { useEffect, useState } from "react";
import HeroSection from "../Components/HeroSection";
import Products from "../Components/Products";
import { getProduct } from "../Redux/ActionCreators/ProductActionCreators";
import { getMaincategory } from "../Redux/ActionCreators/MaincategoryActionCreators";
import { getSubcategory } from "../Redux/ActionCreators/SubcategoryActionCreators";
import { getResturent } from "../Redux/ActionCreators/ResturentActionCreators";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";

export default function ProductPage({show}) {
  const [data, setData] = useState([]);
  const [mc, setMc] = useState("All");
  const [sc, setSc] = useState("All");
  const [rn, setRn] = useState("All");
  const [search, setSearch] = useState("");
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(1000);

  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const ProductStateData = useSelector((state) => state.ProductStateData);
  const MaincategoryStateData = useSelector((state) => state.MaincategoryStateData);
  const SubcategoryStateData = useSelector((state) => state.SubcategoryStateData);
  const ResturentStateData = useSelector((state) => state.ResturentStateData);

  // Fetch Data
  useEffect(() => {
    dispatch(getMaincategory());
    dispatch(getSubcategory());
    dispatch(getResturent());
    dispatch(getProduct());
  }, [dispatch]);

  // Handle Filters on Param Change
  useEffect(() => {
    const mcParam = searchParams.get("mc") ?? "All";
    const scParam = searchParams.get("sc") ?? "All";
    const rnParam = searchParams.get("rn") ?? "All";

    setMc(mcParam);
    setSc(scParam);
    setRn(rnParam);

    if (ProductStateData.length) {
      applyFilters(mcParam, scParam, rnParam, Number(min), Number(max), search);
    }
  }, [ProductStateData.length, searchParams, min, max, search]);

  // Core Filter Function
  function applyFilters(mc, sc, rn, minPrice, maxPrice, keyword = "") {
    const ch = keyword.toLowerCase();
    const filtered = ProductStateData.filter((p) => {
      return (
        p.active &&
        (mc === "All" || p.maincategory?.name === mc) &&
        (sc === "All" || p.subcategory?.name === sc) &&
        (rn === "All" || p.resturent?.name === rn) &&
        (minPrice === -1 || p.finalPrice >= minPrice) &&
        (maxPrice === -1 || p.finalPrice <= maxPrice) &&
        (!ch ||
          p.maincategory?.name?.toLowerCase().includes(ch) ||
          p.subcategory?.name?.toLowerCase().includes(ch) ||
          p.resturent?.name?.toLowerCase().includes(ch) ||
          p.description?.toLowerCase().includes(ch))
      );
    });
    setData(filtered);
  }

  // Sorting
  function sortFilter(option) {
    const sorted = [...data];
    if (option === "latest") sorted.sort((x, y) => y._id.localeCompare(x._id));
    else if (option === "price_high") sorted.sort((x, y) => y.finalPrice - x.finalPrice);
    else if (option === "price_low") sorted.sort((x, y) => x.finalPrice - y.finalPrice);
    else if (option === "discount_high") sorted.sort((x, y) => y.discount - x.discount);
    else if (option === "discount_low") sorted.sort((x, y) => x.discount - y.discount);
    setData(sorted);
  }

  /** 🔹 Reusable Filter List Component */
  const FilterList = ({ title, current, items, paramKey }) => (
    <div className="list-group mb-3 shadow-sm rounded">
      <span className="list-group-item active fw-bold">{title}</span>
      <Link
        to={`/product?mc=${paramKey === "mc" ? "All" : mc}&sc=${
          paramKey === "sc" ? "All" : sc
        }&rn=${paramKey === "rn" ? "All" : rn}`}
        className={`list-group-item ${current === "All" ? "bg-primary text-white" : ""}`}
      >
        All
      </Link>
      {items
        .filter((x) => x.active)
        .map((item) => (
          <Link
            to={`/product?mc=${paramKey === "mc" ? item.name : mc}&sc=${
              paramKey === "sc" ? item.name : sc
            }&rn=${paramKey === "rn" ? item.name : rn}`}
            key={item._id}
            className={`list-group-item ${current === item.name ? "bg-primary text-white" : ""}`}
          >
            {item.name}
          </Link>
        ))}
    </div>
  );

  /** 🔹 Filters Section (Shared for Desktop & Mobile) */
  const Filters = () => (
    <>
      <FilterList title="Maincategory" current={mc} items={MaincategoryStateData} paramKey="mc" />
      <FilterList
        title="Subcategory"
        current={sc}
        items={[...new Map(SubcategoryStateData.map((s) => [s.name, s]))].map((x) => x[1])}
        paramKey="sc"
      />
      <FilterList title="Restaurant" current={rn} items={ResturentStateData} paramKey="rn" />

      <div className="card shadow-sm border-primary mt-3">
        <div className="card-header bg-primary text-white fw-bold text-center">Price Filter</div>
        <div className="card-body">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              applyFilters(mc, sc, rn, Number(min), Number(max), search);
            }}
          >
            <div className="row">
              <div className="col-6 mb-3">
                <label className="small">Min</label>
                <input
                  type="number"
                  value={min}
                  onChange={(e) => setMin(e.target.value)}
                  className="form-control border-primary"
                />
              </div>
              <div className="col-6 mb-3">
                <label className="small">Max</label>
                <input
                  type="number"
                  value={max}
                  onChange={(e) => setMax(e.target.value)}
                  className="form-control border-primary"
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Apply Filter
            </button>
          </form>
        </div>
      </div>
    </>
  );

  return (
    <>
      <HeroSection title="Products" />
      <div className="container-fluid my-3">
        <div className="row">
          {/* Sidebar (Desktop) */}
          <div className="col-md-2 d-none d-md-block">
            <Filters />
          </div>

          {/* Mobile Filters */}
          <div className="col-12 d-block d-md-none mb-3">
            <button
              className="btn btn-primary w-100"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#mobileFilters"
            >
              Filter Options
            </button>
            <div className="collapse mt-2" id="mobileFilters">
              <div className="card card-body shadow-sm">
                <Filters />
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="col-md-10">
            <div className="row mb-3 align-items-center">
              <div className="col-md-9 mb-2 mb-md-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    applyFilters(mc, sc, rn, min, max, search);
                  }}
                >
                  <div className="input-group shadow-sm">
                    <input
                      type="search"
                      placeholder="Search products..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="form-control border-primary"
                    />
                    <button type="submit" className="btn btn-primary">
                      Search
                    </button>
                  </div>
                </form>
              </div>
              <div className="col-md-3">
                <select
                  onChange={(e) => sortFilter(e.target.value)}
                  className="form-select border-primary shadow-sm"
                >
                  <option value="latest">Latest</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="discount_high">Discount: High to Low</option>
                  <option value="discount_low">Discount: Low to High</option>
                </select>
              </div>
            </div>

            {/* Pass filtered data */}
            <Products data={data} />
          </div>
        </div>
      </div>
    </>
  );
}
