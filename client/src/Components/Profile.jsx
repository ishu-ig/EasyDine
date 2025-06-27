import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Profile({ title }) {
    let [data, setData] = useState([])
    let navigate = useNavigate()

    useEffect(() => {
        (async () => {
            let response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/user/${localStorage.getItem("userid")}`, {
                method: "GET",
                headers: {
                    "content-type": "application/json",
                    "authorization":localStorage.getItem("token")
                }
            })
            response = await response.json()
            if (response.data) 
                setData(response.data)
            else 
                navigate("/login")
        })()
    })
    return (
        <>
            <h5 className={`${title !== "Checkout" ? "bg-primary text-light text-center p-2 mb-3" : "bg-primary text-light text-center p-2 mb-4"}`}>{title === "Checkout" ? "Billing Address" : `${title} Profile`}</h5>
            <div className="container">
                <div className="row">
                    {
                        title !== "Checkout" ? <div className="col-md-6">
                            {
                                data?.pic ?
                                    <img src={`${process.env.REACT_APP_BACKEND_SERVER}/${data.pic}`} style={{ borderRadius: "10px" }} height={400} width="90%" alt="" />
                                    : <img src="/img/noimage.jpg" style={{ borderRadius: "10px" }} height={400} width="90%" alt="" />
                            }
                        </div> : null
                    }
                    <div className={`${title !== "Checkout" ? "col-md-6" : "col-md-12"}`}>
                        <table className="table table-bordered border-3 border-primary">
                            <tbody>
                                <tr>
                                    <th>Name</th>
                                    <td>{data.name}</td>
                                </tr>
                                {
                                    title !== "Checkout" ?
                                        <tr>
                                            <th>User Name</th>
                                            <td>{data.username}</td>
                                        </tr> : null
                                }
                                <tr>
                                    <th>Email Adress</th>
                                    <td>{data.email}</td>
                                </tr>
                                <tr>
                                    <th>Phone</th>
                                    <td>{data.phone}</td>
                                </tr>
                                <tr>
                                    <th>Address</th>
                                    <td>{data.address}</td>
                                </tr>
                                <tr>
                                    <th>State</th>
                                    <td>{data.state}</td>
                                </tr>
                                <tr>
                                    <th>City</th>
                                    <td>{data.city}</td>
                                </tr>
                                <tr>
                                    <th>Pin</th>
                                    <td>{data.pin}</td>
                                </tr>
                                <tr>
                                    <td colSpan={2}>
                                        {
                                            title !== "Checkout" ? <Link to="/update-profile" className="btn btn-primary w-100">Update Profile</Link> :
                                                <Link to="/update-profile" className="btn btn-primary w-100">Update Address</Link>
                                        }
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}
