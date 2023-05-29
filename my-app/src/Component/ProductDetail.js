import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import LatestProduct from "./LatestProduct";

function ProductDetail() {
  const [rid, setRid] = useState();
  const location = useLocation();
  const [pData, setPData] = useState([]);
  const [prodata, setProdata] = useState({
    id: "",
    qnt: "",
  });

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

  function onChangevalue(event) {
    setProdata((prodata) => ({ ...prodata, [event.target.name]: event.target.value }));
  }

  function Addcart(id) {
    const existingData = localStorage.getItem("product");
    let newData = [];

    if (existingData) {
      newData = JSON.parse(existingData);
    }

    // Check if the product is already in the cart
    const isProductInCart = newData.some((item) => item.product_id === id);
    if (!isProductInCart) {
      const newProduct = {
        product_id: id,
        product_qty: prodata.qnt,
      };

      newData.push(newProduct);
      localStorage.setItem("product", JSON.stringify(newData));
    }
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
                      <label htmlFor="">Total Quantity {p?.attributes?.quantity}</label> 
                      <input  type="number" name="qnt" value={prodata.qnt} onChange={(e) => onChangevalue(e)} placeholder="0" />
                      <button type="button" onClick={() => Addcart(p?.id)} className="addCart">
                        Add To Cart
                      </button>
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
