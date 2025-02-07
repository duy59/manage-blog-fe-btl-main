"use client"
import React, { useRef, useState, useEffect } from 'react';
import "../../../styles/EditBlog.css";
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import CustomEditor from '../custom-editor';
import 'react-toastify/dist/ReactToastify.css';
import "../../../styles/alertStyle.css"; // Import custom CSS for toast

const ViewBlog = ({ blogId }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [contentorigin, setContentOrigin] = useState('');

    useEffect(() => {
        const fetchBlog = async () => {
            try {
               
                const response = await fetch(`${process.env.domainApi}/api/blogfb/${blogId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': `${sessionStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                const res = data;
                setContent(res.contentAI);
                setContentOrigin(res.content);
            } catch (error) {
                console.error('Error fetching blog:', error);
                toast.error('Error fetching blog', {
                    className: 'toast-error',
                    autoClose: 5000 
                });
            } finally {
                setLoading(false); // Set loading to false after fetching data
            }
        };

        fetchBlog();
    }, [blogId]);


    if (loading) {
        return (
            <div>
                <h1 className="text-center">
                    <span className="animate-[spin_2s_linear_infinite] border-8 border-[#f1f2f3] border-l-primary border-r-primary rounded-full w-14 h-14 inline-block align-middle m-auto mb-10"></span>
                </h1>
            </div>
        ); // Render loading indicator
    }

    return (
        <div className='box-edit-blog'>
            <h1>view AI Blog</h1>
            <form >
                <div>
                    <label>Content Ai:</label>
                    <CustomEditor content={content} setContent={setContent} />
                </div>
                <div>
                    <label>Content Origin:</label>
                    <div dangerouslySetInnerHTML={{ __html: contentorigin }}></div>
                </div>
                <button type="submit">Update Data</button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default ViewBlog;