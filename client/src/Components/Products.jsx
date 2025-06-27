import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

export default function Products({ data }) {
    const [filterData, setFilterData] = useState([])
    const [displayedData, setDisplayedData] = useState([]) // Visible products
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(false)
    const [itemsToShow, setItemsToShow] = useState(16) // Initially show 16 items
    const dispatch = useDispatch()

    useEffect(() => {
        setFilterData(data);
        setDisplayedData(data.slice(0, itemsToShow)); // Show initial items
    }, [data]);

    function postSearch(e) {
        e.preventDefault();
        let ch = search.toLowerCase();
        let filteredResults = data.filter(
            (x) =>
                x.active &&
                (x.maincategory?.name?.toLowerCase().includes(ch) ||
                    x.subcategory?.name?.toLowerCase().includes(ch) ||
                    x.resturent?.name?.toLowerCase().includes(ch) ||
                    x.description?.toLowerCase().includes(ch))
        );
        setFilterData([...filteredResults]);
        setDisplayedData(filteredResults.slice(0, itemsToShow));
    }

    function handleFilter(option) {
        let sortedData = [...filterData];
        if (option === "latest") sortedData.sort((x, y) => y._id - x._id);
        else if (option === "price_high") sortedData.sort((x, y) => y.finalPrice - x.finalPrice);
        else if (option === "price_low") sortedData.sort((x, y) => x.finalPrice - y.finalPrice);
        else if (option === "discount_high") sortedData.sort((x, y) => y.discount - x.discount);
        else if (option === "discount_low") sortedData.sort((x, y) => x.discount - y.discount);

        setFilterData(sortedData);
        setDisplayedData(sortedData.slice(0, itemsToShow));
    }

    function loadMore() {
        setLoading(true);
        setTimeout(() => {
            setItemsToShow((prev) => prev + 16);
            setDisplayedData(filterData.slice(0, itemsToShow + 16));
            setLoading(false);
        }, 1000); // Simulate loading delay
    }

    return (
        <>
            {/* Product Section */}
            <div className="container-xxl py-5">
                <div className="container">
                    <div className="row g-0 gx-5 align-items-end">
                        <div className="col-lg-5">
                            <div className="section-header text-start mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: 500 }}>
                                <h1 className="display-5 mb-3">Our Products</h1>
                                <p>Discover top products with great deals and discounts.</p>
                            </div>
                        </div>
                        <div className="col-lg-7 text-start text-lg-end wow slideInRight" data-wow-delay="0.1s">
                            <div className="row">
                                <div className="col-md-8 mb-5">
                                    <form onSubmit={postSearch}>
                                        <div className="btn-group w-100">
                                            <input type="search" name="search" placeholder='Search' onChange={(e) => setSearch(e.target.value)} value={search} className='form-control border-3 border-primary' style={{ borderRadius: "10px 0 0 10px" }} />
                                            <button type='submit' className='btn btn-primary' style={{ borderRadius: "0 10px 10px 0" }}>Search</button>
                                        </div>
                                    </form>
                                </div>
                                <div className="col-md-4">
                                    <select name="combinedFilter" onChange={(e) => handleFilter(e.target.value)} className="form-select border-3 border-primary">
                                        <option className='bg-primary text-light' value="">Select Filter</option>
                                        <optgroup label="Sort By">
                                            <option value="latest">Latest</option>
                                            <option value="price_high">Price: High to Low</option>
                                            <option value="price_low">Price: Low to High</option>
                                        </optgroup>
                                        <optgroup label="Discount">
                                            <option value="discount_high">High to Low</option>
                                            <option value="discount_low">Low to High</option>
                                        </optgroup>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="tab-content" >
                        <div id="tab-1" className="tab-pane fade show p-0 active">
                            <div className="row g-3">
                                {displayedData.length > 0 ? (
                                    displayedData.map((item, index) => (
                                        <div key={index} className="col-xl-3 col-lg-4 col-md-6 wow fadeInUp" style={{ minHeight: "400px" }}  data-wow-delay="0.1s">
                                            <div className="product-item">
                                                <div className="position-relative bg-light overflow-hidden" style={{ height: "250px" }}>
                                                    <img className="img-fluid w-100 h-100" src={`${process.env.REACT_APP_BACKEND_SERVER}/${item.pic}`} alt="" />
                                                    <div className="bg-secondary rounded text-white position-absolute start-0 top-0 m-4 py-1 px-3">New</div>
                                                </div>
                                                <div className="text-center p-4">
                                                    <Link className="d-block h6 mb-2 fw-bold" style={{fontSize:"1.1rem"}} to="#">
                                                        {item.name}
                                                    </Link>
                                                    <div className="d-flex justify-content-center align-items-center">
                                                        <span className="text-primary fw-bold me-2">&#8377;{item.finalPrice}</span>
                                                        <span className="text-body text-decoration-line-through me-2">&#8377;{item.basePrice}</span>
                                                        <sup className="text-success fw-semibold">{item.discount}% OFF</sup>
                                                    </div>
                                                </div>
                                                <div className="d-flex justify-content-around pb-3 btn-group">
                                                    <Link to={`/product/${item._id}`} className="btn btn-sm btn-primary w-50">
                                                         <i className='fa fa-shopping-bag pe-2'><span className='ps-2'>Add To Cart</span></i>
                                                    </Link>
                                                    <Link to="" className="btn btn-sm btn-primary bg-danger w-50">
                                                        <i className='fa fa-heart '><span className='ps-2'>Wishlist</span></i>
                                                    </Link>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-12 text-center">
                                        <p>No products found</p>
                                    </div>
                                )}

                                {/* Skeleton Loader */}
                                {loading && (
                                    Array.from({ length: 8 }).map((_, index) => (
                                        <div key={index} className="col-xl-3 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                                            <div className="product-item">
                                                <div className="position-relative bg-light overflow-hidden" style={{ height: "250px" }}>
                                                    <div className="skeleton w-100 h-100"></div>
                                                </div>
                                                <div className="text-center p-4">
                                                    <div className="skeleton w-75 h-20"></div>
                                                    <div className="skeleton w-50 h-20 mt-2"></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Load More Button */}
                            {itemsToShow < filterData.length && (
                                <div className="col-12 text-center">
                                    <button onClick={loadMore} className="btn btn-primary rounded-pill py-3 px-5">
                                        {loading ? "Loading..." : "Browse More Products"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            
        </>
    )
}
