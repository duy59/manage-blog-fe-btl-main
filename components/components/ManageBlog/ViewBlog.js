"use client"
import React, { useState, useEffect } from 'react';
import "../../../styles/EditBlog.css";
import { useRouter } from 'next/navigation';
import "../../../styles/viewblog.css";

const ViewBlog = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const blogId = searchParams.get('id');

    const [content, setContent] = useState('');


    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await fetch(`${process.env.domainApi}/api/blog/${blogId}` , {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': `${sessionStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                setContent(data.content);
            } catch (error) {
                console.error('Error fetching blog:', error);
            }
        };

        fetchBlog();
    }, [blogId]);

    const modules = {
        toolbar: {
            container: [
                [{ header: [1, 2 , 3, 4, 5, 6] }, { font: [] }],
                [{ size: [] }],
                ["bold", "italic", "underline", "strike", "blockquote"],
                [
                    { list: "ordered" },
                    { list: "bullet" },
                    { indent: "-1" },
                    { indent: "+1" },
                ],
                ["link", "image", "video"],
                ["code-block"],
                ["clean"],
            ],
        },
        clipboard: {
            matchVisual: false,
        },
    };
    const formats = [
        "header",
        "font",
        "size",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "link",
        "image",
        "video",
        "code-block",
    ];

    const handleSubmit = async (e) => {
    };

    return (
        <div className='box-view-blog'>
            <h1>View Blog</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ height: "600px" }}>
                    <label>Content:</label>
                </div>
            </form>
        </div>
    );
}

export default ViewBlog;