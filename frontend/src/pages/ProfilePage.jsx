import React from "react";
import { useState, useEffect } from "react";
import { Table, Form, Button, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message.jsx";
import Loader from "../components/Loader.jsx";
import { toast } from "react-toastify";
import { useProfileMutation } from "../redux/slices/usersApiSlice.js";
import { setCredentials } from "../redux/slices/authSlice.js";
import { useGetMyOrdersQuery } from "../redux/slices/ordersApiSlice.js";
import { FaTimes } from "react-icons/fa";

const ProfilePage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const dispatch = useDispatch();

    const { userInformation } = useSelector((state) => state.auth);

    const [updateProfile, { isLoading: loadingUpdateProfile }] =
        useProfileMutation();

    const { data: orders, isLoading, error } = useGetMyOrdersQuery();

    useEffect(() => {
        if (userInformation) {
            setName(userInformation.name);
            setEmail(userInformation.email);
        }
    }, [userInformation, userInformation.name, userInformation.email]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Password don't match");
        } else {
            try {
                const res = await updateProfile({
                    _id: userInformation._id,
                    name,
                    email,
                    password,
                }).unwrap();
                dispatch(setCredentials(res));
                toast.success("Profile updated succesfully");
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    return (
        <Row>
            <Col md={3}>
                <h2>User Profile</h2>
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId="name" className="my-2">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="name"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId="email" className="my-2">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter your Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId="password" className="my-2">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter your Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId="confirmPassword" className="my-2">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Confirm your Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Button type="submit" variant="dark" className="my-2">
                        Update
                    </Button>
                    {loadingUpdateProfile && <Loader />}
                </Form>
            </Col>
            <Col md={9}>
                <h2>My Orders</h2>
                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <Message variant="danger">
                        {error?.data?.message || error.error}
                    </Message>
                ) : (
                    <Table striped hover responsive className="table-sm">
                        <thead>
                            <tr>
                                <th className="text-center">ID</th>
                                <th className="text-center">DATE</th>
                                <th className="text-center">TOTAL</th>
                                <th className="text-center">PAID</th>
                                <th className="text-center">DELIVERED</th>
                                <th className="text-center"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td className="text-center">{order._id}</td>
                                    <td className="text-center">
                                        {order.createdAt.substring(0, 10)}
                                    </td>
                                    <td className="text-center">
                                        ${order.totalPrice}
                                    </td>
                                    <td className="text-center">
                                        {order.isPaid ? (
                                            order.paidAt.substring(0, 10)
                                        ) : (
                                            <FaTimes style={{ color: "red" }} />
                                        )}
                                    </td>
                                    <td className="text-center">
                                        {order.isDelivered ? (
                                            order.deliveredAt.substring(0, 10)
                                        ) : (
                                            <FaTimes style={{ color: "red" }} />
                                        )}
                                    </td>
                                    <td className="text-center">
                                        <LinkContainer
                                            to={`/order/${order._id}`}
                                        >
                                            <Button
                                                className="btn-sm"
                                                variant="dark"
                                            >
                                                Details
                                            </Button>
                                        </LinkContainer>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Col>
        </Row>
    );
};

export default ProfilePage;
