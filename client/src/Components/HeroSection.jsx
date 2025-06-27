import React from 'react'

export default function HeroSection({ title }) {
    return (
        <>
            <div className="container-fluid page-header mb-5 wow fadeIn" data-wow-delay="0.1s">
                <div className="container">
                    <h1 className="display-3 mb-3 animated slideInDown text-light">{title}</h1>
                    <nav aria-label="breadcrumb animated slideInDown">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a className="text-light-white" href="#">Home</a></li>
                            <li className="breadcrumb-item"><a className="text-light-white" href="#">Pages</a></li>
                            <li className="breadcrumb-item text-dark active" aria-current="page">{title}</li>
                        </ol>
                    </nav>
                </div>
            </div>
        </>
    )
}
