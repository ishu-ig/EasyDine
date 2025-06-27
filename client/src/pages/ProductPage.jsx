import React, { useEffect, useState } from 'react';
import HeroSection from '../Components/HeroSection';
import Products from '../Components/Products';
import { getProduct } from '../Redux/ActionCreators/ProductActionCreators';
import { getMaincategory } from '../Redux/ActionCreators/MaincategoryActionCreators';
import { getSubcategory } from '../Redux/ActionCreators/SubcategoryActionCreators';
import { getResturent } from '../Redux/ActionCreators/ResturentActionCreators';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';

export default function ProductPage() {
  let [data, setData] = useState([]);
  let [mc, setMc] = useState('All');
  let [sc, setSc] = useState('All');
  let [rn, setRn] = useState('All');
  let [search, setSearch] = useState('');
  let [min, setMin] = useState(0);
  let [max, setMax] = useState(1000);
  
  let [searchParams] = useSearchParams();
  let dispatch = useDispatch();

  let ProductStateData = useSelector((state) => state.ProductStateData);
  let MaincategoryStateData = useSelector((state) => state.MaincategoryStateData);
  let SubcategoryStateData = useSelector((state) => state.SubcategoryStateData);
  let ResturentStateData = useSelector((state) => state.ResturentStateData);

  useEffect(() => {
    dispatch(getMaincategory());
    dispatch(getSubcategory());
    dispatch(getResturent());
    dispatch(getProduct());
  }, [dispatch]);

  useEffect(() => {
    let mcParam = searchParams.get("mc") ?? "All";
    let scParam = searchParams.get("sc") ?? "All";
    let rnParam = searchParams.get("rn") ?? "All";

    setMc(mcParam);
    setSc(scParam);
    setRn(rnParam);

    if (ProductStateData.length) {
      filter(mcParam, scParam, rnParam, Number(min), Number(max));
    }
  }, [ProductStateData.length, searchParams, min, max]);

  function filter(mc, sc, rn, minPrice = -1, maxPrice = -1) {
    setSearch("");
    const filteredData = ProductStateData.filter((p) => {
      return (
        (mc === "All" || p.maincategory?.name === mc) &&
        (sc === "All" || p.subcategory?.name === sc) &&
        (rn === "All" || p.resturent?.name === rn) &&
        (minPrice === -1 || p.finalPrice >= minPrice) &&
        (maxPrice === -1 || p.finalPrice <= maxPrice)
      );
    });
    setData(filteredData);
  }

  function applyPriceFilter(e) {
    e.preventDefault();
    filter(mc, sc, rn, Number(min), Number(max));
  }


  return (
    <>
      <HeroSection title="Products" />
      <div className="container-fluid my-3">
        <div className="row">
          <div className="col-md-2">
            <div className="list-group">
              <Link to="" className="list-group-item list-group-item-action active fw-bolder fs-5">
                Apply Filter
              </Link>
              <hr />
              <Link className="list-group-item list-group-item-action active">Maincategory</Link>
              <Link to={`/product?mc=All&sc=${sc}&rn=${rn}`} className="list-group-item list-group-item-action">All</Link>
              {MaincategoryStateData.filter((x) => x.active).map((item) => (
                <Link key={item._id} to={`/product?mc=${item.name}&sc=${sc}&rn=${rn}`} className="list-group-item list-group-item-action">
                  {item.name}
                </Link>
              ))}
              <Link className="list-group-item list-group-item-action active">Subcategory</Link>
              <Link to={`/product?mc=${mc}&sc=All&rn=${rn}`} className="list-group-item list-group-item-action">All</Link>
              {Array.isArray(SubcategoryStateData) &&
                [...new Map(SubcategoryStateData.filter((x) => x.active).map((item) => [item.name, item])).values()].map((item) => (
                  <Link key={item._id} to={`/product?mc=${mc}&sc=${item.name}&rn=${rn}`} className="list-group-item list-group-item-action">
                    {item.name}
                  </Link>
                ))}
              <Link className="list-group-item list-group-item-action active">Restaurant</Link>
              <Link to={`/product?mc=${mc}&sc=${sc}&rn=All`} className="list-group-item list-group-item-action">All</Link>
              {ResturentStateData.filter((x) => x.active).map((item) => (
                <Link key={item._id} to={`/product?mc=${mc}&sc=${sc}&rn=${item.name}`} className="list-group-item list-group-item-action">
                  {item.name}
                </Link>
              ))}
            </div>
            <h5 className="bg-primary text-light text-center p-2">Price Filter</h5>
            <form onSubmit={applyPriceFilter}>
              <div className="row">
                <div className="col-6 mb-3">
                  <label>Minimum</label>
                  <input type="number" value={min} placeholder="Min" onChange={(e) => setMin(e.target.value)} className="form-control border-3 border-primary" />
                </div>
                <div className="col-6 mb-3">
                  <label>Maximum</label>
                  <input type="number" value={max} placeholder="Max" onChange={(e) => setMax(e.target.value)} className="form-control border-3 border-primary" />
                </div>
              </div>
              <div className="mb-5">
                <button type="submit" className="btn btn-primary w-100">Apply Filter</button>
              </div>
            </form>
          </div>
          <div className="col-md-10">
            <Products data={data} />
          </div>
        </div>
      </div>
    </>
  );
}
