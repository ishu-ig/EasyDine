import React, { useEffect, useState } from 'react';
import { getResturent } from '../Redux/ActionCreators/ResturentActionCreators';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Resturent({ title }) {
    let [data, setData] = useState([])
    let [search,setSearch] = useState("")
    let ResturentStateData = useSelector(state => state.ResturentStateData);
    
    let dispatch = useDispatch();

    useEffect(() => {
        dispatch(getResturent());
    }, [dispatch]);

    useEffect(()=>{
        (()=>{
            setData(ResturentStateData)
        })()
    },[ResturentStateData.length])

    function sortFilter(option) {
        let sortedData = [...data]
       if (option === "1") {
            sortedData.sort((x, y) => y.finalPrice - x.finalPrice);
        } else {
            sortedData.sort((x, y) => x.finalPrice - y.finalPrice);
        }
        setData(sortedData)
    }

    function postSearch(e) {
        e.preventDefault()
        let ch = search.toLowerCase()
        setData(ResturentStateData.filter(x => x.active && x.name?.toLowerCase().includes(ch)));
    }

    return (
        <div className="resturent-container container-fluid py-5" style={{ backgroundColor: "#f8f9fa" }}>
            <div className="container">
                <div className="row g-0 gx-5 align-items-end">
                    <div className="col-lg-5">
                        <div className="section-header text-start mb-5" style={{ maxWidth: 500 }}>
                            <h1 className="display-5 mb-3">Restaurants</h1>
                            <p>Discover the best dining spots around you. Enjoy delicious meals, cozy ambiance, and exceptional service.</p>
                        </div>
                    </div>
                    <div className="col-lg-7 text-start text-lg-end mb-5">
                        <div className='row'>
                            <div className="col-md-9">
                                <form onSubmit={postSearch}>
                                    <div className="btn-group w-100">
                                        <input type="search" name="search" placeholder='Search Resturent By Name' onChange={(e)=>setSearch(e.target.value)} className='form-control border-3 border-primary' style={{ borderRadius: "10px 0 0 10px" }} />
                                        <button type='submit' className='btn btn-primary' style={{ borderRadius: "0 10px 10px 0" }}>Search</button>
                                    </div>
                                </form>
                            </div>
                            <div className="col-md-3">
                                <select name="sortFilter" onChange={(e) => sortFilter(e.target.value)} className='form-select border-3 border-primary'>
                                    <option value="">Sort</option>
                                    <option value="1">Hight to Low</option>
                                    <option value="2">Low to High</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row g-4">
                    {data?.map((item) => (
                        <div key={item._id} className="col-md-4">
                            <div className="card resturent-card border-0 shadow-sm p-3 text-center" style={{ backgroundColor: "#ffffff", borderRadius: "10px" }}>
                                <div className="img-container">
                                    <img
                                        src={`${process.env.REACT_APP_BACKEND_SERVER}/${item.pic}`}
                                        className="slider-image"
                                        style={{ height: "250px", width: "100%", objectFit: "cover", borderRadius: "10px" }}
                                        alt={item.name}
                                    />
                                    {item.discount && (
                                        <div className="discount-badge">{item.discount}% OFF</div>
                                    )}
                                </div>
                                <div className="slider-card-element mt-3 p-3 shadow-sm rounded border border-light" style={{ backgroundColor: "#ffffff" }}>
                                    <h4 className="mt-2 text-primary" style={{ fontSize: "1.3rem", fontWeight: "bold" }}>{item.name}</h4>
                                    <p className="text-muted mb-2" style={{ fontSize: "0.9rem" }}>{item.address}</p>

                                    {item.seatAvailable > 0 ? (
                                        <>
                                            <p className="text-success text-center mb-1" style={{ fontSize: "0.9rem" }}>
                                                <strong>Booking Available</strong><span className="fs-5 ms-1">😊</span>
                                            </p>
                                            <p className="text-muted text-center mb-2" style={{ fontSize: "0.9rem" }}>
                                                <strong>Seats :</strong> {item.seatAvailable}
                                            </p>
                                            <p className="text-muted mb-2" style={{ fontSize: "1rem" }}>
                                                <del className="text-danger me-1">{item.reservationPrice}</del>
                                                <span className="text-success fw-bold">{item.finalPrice}</span>
                                                <sup className="text-primary ms-1">{item.discount}% OFF</sup>
                                            </p>
                                        </>
                                    ) : (
                                        <p className="text-danger text-center" style={{ fontSize: "0.9rem" }}>
                                            <strong>Booking Not Available</strong><span className="fs-5 ms-1">😞</span>
                                        </p>
                                    )}

                                    <p className="text-warning fw-bold text-center" style={{ fontSize: "1.1rem" }}>
                                        ⭐ {item.rating} / 5
                                    </p>

                                    <div className="btn-group mt-3 w-100">
                                        <Link to={`/resturent/${item._id}`} className="btn btn-primary text-light" style={{ borderRadius: "30px 0 0 30px", padding: "10px 15px" }}>
                                            View Details
                                        </Link>
                                        <Link to={`/resturent/${item._id}/reservation`} className="btn btn-outline-primary" style={{ borderRadius: "0 30px 30px 0", padding: "10px 15px" }}>
                                            Reserve Now
                                        </Link>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
