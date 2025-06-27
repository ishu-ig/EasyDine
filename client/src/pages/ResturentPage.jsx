import React, { useEffect } from 'react'
import { getResturent } from "../Redux/ActionCreators/ResturentActionCreators"
import { useDispatch, useSelector } from 'react-redux'
import HeroSection from '../Components/HeroSection'
import Resturent from '../Components/Resturent'

export default function ResturentPage({data}) {
    let ResturentStateData = useSelector((state)=>state.ResturentStateData)
    let dispatch = useDispatch()
    useEffect(()=>{
        (()=>{
            dispatch(getResturent())
        })()
    },[ResturentStateData.length])
  return (
    <>
        <HeroSection title="Resturent" />
        <Resturent title="Resturent" />
    </>
  )
}
