import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
    deleteContactUs,
    getContactUs,
    updateContactUs,
} from "../../Redux/ActionCreators/ContactUsActionCreators";

export default function AdminContactUsShow() {
    let { _id } = useParams();
    let ContactUsStateData = useSelector((state) => state.ContactUsStateData);
    let dispatch = useDispatch();
    let navigate = useNavigate()

    let [data, setData] = useState({})
    let [flag,setFlag] = useState(false)

    function deleteRecord() {
        if (window.confirm("Are You Sure to Delete that Item : ")) {
            dispatch(deleteContactUs({ _id: _id }))
            navigate("/admin/contactus")
        }
    }

    function updateRecord(_id) {
        if (window.confirm("Are You Sure to Update the Status : ")) {
            let item = ContactUsStateData.find(x => x._id === _id)
            let index = ContactUsStateData.findIndex(x => x._id === _id)
            dispatch(updateContactUs({ ...item, active: !item.active }))
            ContactUsStateData[index].active = !item.active
            setFlag(!flag)
        }
    }

    useEffect(() => {
        (() => {
            dispatch(getContactUs())
            if (ContactUsStateData.length) {
                let item = ContactUsStateData.find(x => x._id === _id)
                if (item)
                    setData({ ...item })
                else
                    alert("Invalid Contact Us Id")
            }
        })()
    }, [ContactUsStateData.length])
    

    return (
        <>
            <div className="container-fluid">
                <div className="card shadow-lg border-primary">
                    <div className="card-header bg-primary text-light ">
                        <h5 className="mb-0 text-light text-center">
                            Customer Query
                            <Link to="/contactus">
                                <i className="fa fa-arrow-left text-light float-end"></i>
                            </Link>
                        </h5>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <tbody>
                                    <tr><th>Id</th><td>{data._id}</td></tr>
                                    <tr><th>Email</th><td>{data.email}</td></tr>
                                    <tr><th>Phone</th><td>{new Date(data.phone).toLocaleDateString()}</td></tr>
                                    <tr><th>Subject</th><td>{data.Subject}</td></tr>
                                    <tr><th>Message</th><td>{data.message}</td></tr>
                                    <tr><th>Active</th><td>₹{data.active ? "Yes" : "No"}</td></tr>
                                    <tr>
                                    <td colSpan={2}>
                                        {
                                            data.active ?
                                                <button className='btn btn-primary w-100' onClick={updateRecord}>Update Status</button> :
                                                <button className='btn btn-danger w-100' onClick={deleteRecord}>Delete</button>
                                        }
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}

