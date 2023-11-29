import React from "react";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product.jsx";
// import { useEffect, useState } from "react";
// import axios from "axios";
import { useGetProductsQuery } from "../redux/slices/productsApiSlice.js";
import Loader from "../components/Loader.jsx";
import Message from "../components/Message.jsx";

const HomeScreen = () => {
    // const [products, setProducts] = useState([]);

    // useEffect(() => {
    //     const fetchProducts = async () => {
    //         try {
    //             const { data } = await axios.get("/api/products");
    //             // console.log("data", data);
    //             setProducts(data);
    //         } catch (error) {
    //             console.log("Error fetching products", error);
    //         }
    //     };
    //     fetchProducts();
    // }, []);

    const { data: products, isLoading, error } = useGetProductsQuery();

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">
                    <h2>Something Went Wrong...</h2>
                </Message>
            ) : (
                <>
                    <h1>Latest Products</h1>
                    <Row>
                        {products.map((product) => (
                            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                                <Product product={product} />
                            </Col>
                        ))}
                    </Row>
                </>
            )}
        </>
    );
};

export default HomeScreen;