"use client";
import { BackgroundImage } from '@mantine/core';
import '../../../styles/ManageBlog.css';
import React, { useState, useEffect , useRef} from 'react';
import Modal from 'react-modal';
import { set } from 'lodash';
import SuccessToast from '@/components/layouts/SuccessToast';
import ErrorToast from '@/components/layouts/ErrorToast';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageBlog = () => {
    const role = sessionStorage.getItem('role');
    const [data, setData] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [selectedBlogs, setSelectedBlogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentBlog, setCurrentBlog] = useState(null); 
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [typegroup, setTypegroup] = useState('');
    const [loadingGenAll, setLoadingGenAll] = useState(false);

    useEffect(() => {
        fetchBlogs(currentPage, typegroup);
    }, [currentPage, typegroup]);

    const fetchBlogs = async (page, type) => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch(`${process.env.domainApi}/api/blogfb?page=${page}&limit=${itemsPerPage}&type=${typegroup}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `${token}`
                }
            });
            const data = await response.json();
            setData(data);
            setBlogs(data.blogs);
            setTotalPages(data.totalPage);
            setItemsPerPage(data.limitItems);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        }
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const getPaginationGroup = () => {
        let start = Math.floor((currentPage - 1) / 5) * 5;
        return new Array(5).fill().map((_, idx) => start + idx + 1).filter(page => page <= totalPages);
    };

    const handleCheckboxChange = (blogId) => {
        if (selectedBlogs.includes(blogId)) {
            setSelectedBlogs(selectedBlogs.filter(id => id !== blogId));
        } else {
            setSelectedBlogs([...selectedBlogs, blogId]);
        }
    };

    const handleEdit = (blogId) => {
        const blog = blogs.find(b => b._id === blogId);
        setCurrentBlog(blog);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setCurrentBlog(null);
    };

    const handleGenAll = async () => {
        const confirmGenAll = window.confirm("Are you sure you want to generate AI for all blogs?");
        if (confirmGenAll) {
            const token = sessionStorage.getItem('token');
            setLoadingGenAll(true);
            const url = `${process.env.domainApi}/api/blogfb/genAI/genAIPostAll`;
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'authorization': `${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                console.log(response);
                if (response.ok) {
                    SuccessToast({ message: "AI generated successfully", time: 5000 });
                    fetchBlogs();
                } else {
                    ErrorToast({ message: "Không còn bài viết nào chưa GEN", time: 5000 });
                }
            } catch (error) {
                console.error('Error generating AI:', error);
            }
            setLoadingGenAll(false);
        }
    }

    return (
        <div className='box-manage-blog'>
            <h1>Manage Blog</h1>
            <div>
                <select onChange={(e) => setTypegroup(e.target.value)}>
                    <option value="">All</option>
                    <option value="bán">Mua Bán</option>
                    <option value="cho thuê">Cho Thuê</option>
                </select>
            </div>
            <div>
                    {role === '1' && (
                    <button onClick={handleGenAll}>
                        {loadingGenAll ? (
                            <span className="animate-spin border-4 border-t-transparent border-white rounded-full w-5 h-5 inline-block"></span>
                        ) : (
                            "Gen ALL"
                        )}
                    </button>
                )}
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Tick</th>
                        <th>STT</th>
                        <th>Content</th>
                        <th>Phường</th>
                        <th>Quận</th>
                        <th>Thành phố</th>
                    </tr>
                </thead>
                <tbody>
                    {blogs && blogs.map((blog, index) => (
                        <tr key={blog.id}>
                            <td><input type="checkbox" onChange={() => handleCheckboxChange(blog._id)} /></td>
                            <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                            <td>{blog.content}</td>
                            <td>{blog.position[1]}</td>
                            <td>{blog.position[0]}</td>
                            <td>{blog.khuvuc}</td>
                            <td>
                                <button style={{ backgroundColor: "orange" }} onClick={() => handleEdit(blog._id)}>View</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='pagination'>
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                    Prev
                </button>
                {getPaginationGroup().map((item, index) => (
                    <button
                        key={index}
                        onClick={() => paginate(item)}
                        className={currentPage === item ? 'active' : ''}
                    >
                        {item}
                    </button>
                ))}
                <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Blog Details"
                ariaHideApp={false}
                style={{ width: "100%" }}
            >
                {currentBlog && (
                    <div style={{ width: "100%" }}>
                        <p><strong>ngày tạo:</strong> {currentBlog.createdAt}</p>
                        <p><strong>Tiêu đề:</strong> {currentBlog.titleAI}</p>
                        <p><strong>ContentAI</strong></p>
                        <div dangerouslySetInnerHTML={{ __html: currentBlog.contentAI }} />
                        <p><strong>Content:</strong> {currentBlog.content}</p>
                        <p><strong>Phường:</strong> {currentBlog.position[1]}</p>
                        <p><strong>Quận:</strong> {currentBlog.position[0]}</p>
                        {currentBlog.imageUrls && currentBlog.imageUrls.length > 0 && (
                            <div>
                                <p><strong>Images:</strong></p>
                                {currentBlog.imageUrls.map((url, index) => (
                                    <img key={index} src={url} alt={`Blog Image ${index + 1}`} style={{ width: '100%', marginBottom: '10px' }} />
                                ))}
                            </div>
                        )}
                        <p><strong>linkgroupFb:</strong> {currentBlog.LinkFb}</p>
                        <p><strong>ID bài viết:</strong> {currentBlog.ID}</p>
                        <p><strong>Giá :</strong> {currentBlog.price}</p>

                        <button onClick={closeModal}>Close</button>
                    </div>
                )}
            </Modal>
            <ToastContainer />
        </div>
    );
};

export default ManageBlog;