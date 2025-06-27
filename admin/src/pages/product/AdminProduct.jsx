import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import $ from 'jquery';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import 'datatables.net';

import { deleteProduct, getProduct } from "../../Redux/ActionCreators/ProductActionCreators";

export default function AdminProduct() {
    let ProductStateData = useSelector(state => state.ProductStateData);
    let dispatch = useDispatch();
    function deleteRecord(_id) {
        if (window.confirm("Are you sure you want to delete this item?")) {
            dispatch(deleteProduct({ _id: _id }));
            getAPIData();
        }
    }

    function getAPIData() {
        dispatch(getProduct());
        let time = setTimeout(() => {
            if (!$.fn.DataTable.isDataTable('#DataTable')) {
                $('#DataTable').DataTable();
            }
        }, 500);
        return time;
    }

    useEffect(() => {
        let time = getAPIData();
        return () => {
            clearTimeout(time);
            if ($.fn.DataTable.isDataTable('#DataTable')) {
                $('#DataTable').DataTable().destroy();
            }
        };
    }, [ProductStateData.length]);

    // useEffect(() => {
    //     (() => {
    //         dispatch(getMaincategory())
    //         if(MaincategoryStateData.length >  0){
    //             let item = Maincategory.find(x=> x._id === )
    //         }

    //     })()
    // }, [MaincategoryStateData.length])

    return (
        <>
            <div className="container-fluid">
                {/* Header */}
                <h5 className="text-center text-light bg-primary p-3">Product <Link to="/product/create"><i className="fa fa-plus text-light float-end pt-1"></i></Link></h5>
                {/* Table */}
                <div className="table-responsive mt-3">
                    <table id="DataTable" className="table table-striped table-hover table-bordered text-center">
                        <thead className="text-light" style={{ backgroundColor: "#1F2A40" }}>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Maincategory</th>
                                <th>Subcategory</th>
                                <th>Resturent</th>
                                <th>Base Price</th>
                                <th>Discount</th>
                                <th>Final Price</th>
                                <th>Pic</th>
                                <th>Rating</th>
                                <th>Availability</th>
                                <th>Active</th>
                                <th>Update</th>
                                {localStorage.getItem("role")==="Super Admin" ?<th>Delete</th> :""}
                            </tr>
                        </thead>
                        <tbody>
                            {ProductStateData.map((item) => (
                                <tr key={item._id}>
                                    <td>{item._id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.maincategory ? item.maincategory.name : "N/A"}</td>
                                    <td>{item.subcategory ? item.subcategory.name : "N/A"}</td>
                                    <td>{item.resturent ? item.resturent.name : "N/A"}</td>
                                    <td>{item.basePrice}</td>
                                    <td>{item.discount}</td>
                                    <td>{item.finalPrice}</td>
                                    <td>
                                        <Link to={`${process.env.REACT_APP_BACKEND_SERVER}/${item.pic}`} target='_blank' rel='noreferrer'>
                                            <img src={`${process.env.REACT_APP_BACKEND_SERVER}/${item.pic}`} height={50} width={80} className="rounded shadow-sm" alt="" />
                                        </Link>
                                    </td>
                                    <th>{item.rating}</th>
                                    <td className={item.availability ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                                        {item.active ? "Yes" : "No"}
                                    </td>
                                    <td className={item.active ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                                        {item.active ? "Yes" : "No"}
                                    </td>
                                    <td>
                                        <Link to={`/product/update/${item._id}`} className="btn btn-primary text-light btn-sm">
                                            <i className="fa fa-edit fs-5"></i>
                                        </Link>
                                    </td>
                                    {
                                        localStorage.getItem("role")==="Super Admin" ? <td>
                                        <button className="btn btn-danger btn-sm" onClick={() => deleteRecord(item._id)}>
                                            <i className="fa fa-trash fs-5"></i>
                                        </button>
                                    </td>:""
                                    }
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
