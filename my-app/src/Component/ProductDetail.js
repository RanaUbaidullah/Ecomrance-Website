import React, { useEffect, useState } from "react";
import { Link, useLocation  } from "react-router-dom";
import LatestProduct from "./LatestProduct";
import { useDispatch, useSelector } from "react-redux";
import {add} from '../Store/cartSlice';
function ProductDetail() {
  const item = useSelector((state)=> state.cart)
  const dispatch = useDispatch();
  const [rid, setRid] = useState();
  const location = useLocation();
  const [pData, setPData] = useState([]); 
  const [prodata, setProdata] = useState({
    id: "",
    qnt: "",
  });
  const [totalqnty, setTotalqnty] = useState()
  const getMovieList = async () => {
    const url = "http://localhost:1337/api/products?populate=*";
    const response = await fetch(url);
    try {
      const responseJson = await response.json();
      const data = responseJson;
      setPData(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getMovieList();
    setRid(location?.state?.id);
  }, []);

  function onChangevalue(event, tqnty) {
    setTotalqnty(tqnty - event.target.value)
    setProdata((prodata) => ({ ...prodata, [event.target.name]: event.target.value }));
  }

 
  function Addcart(data ) {
    const itemExists = item.some((oldData) => oldData.id === data.id);
    if (!itemExists) {
      dispatch(add(data));
    }
    console.log(data)
  }
  
  return (
    <>
      <section className="section product-detail">
        {pData?.map((p) => {
          if (p?.id === rid) {
            return (
              <section className="section product-detail">
                <div className="details container">
                  <div className="left image-container">
                    <div className="main">
                      <img src={"http://localhost:1337" + p?.attributes?.image?.data?.attributes?.url} id="zoom" alt="" />
                    </div>
                  </div>
                  <div className="right">
                    <span>{p?.attributes?.catagory?.data?.attributes?.title}/{p?.attributes?.subcatas?.data[0]?.attributes?.title}</span>
                    <h1>{p?.attributes?.name}</h1>
                    <div className="price">${p?.attributes?.price}</div>
                    <form className="form">
                      
                      <label htmlFor="">Avalabale Quantity {totalqnty}</label> 
                      <input className="quntaty"  type="number" name="qnt" value={prodata.qnt} onChange={(e) => onChangevalue(e, p?.attributes.quantity)} placeholder="0" />
                      <button type="button" onClick={() => Addcart(p)}  className="addCart">
                        Add To Cart
                      </button>
                      <Link to="/Checkout" type="button"  className="addCart">
                        Buy Now
                      </Link>
                    </form>
                    <h3>Product Detail</h3>
                    <p>{p?.attributes?.pdetail}</p>
                  </div>
                </div>
              </section>
            );
          }
        })}
      </section>
      <LatestProduct num={4} />
    </>
  );
}

export default ProductDetail;
