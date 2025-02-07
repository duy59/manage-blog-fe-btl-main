"use client"
import React, { useRef, useState, useEffect } from 'react';
import "../../../styles/EditBlog.css";
import { useRouter } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomEditor from '../custom-editor';
import SuccessToast from '@/components/layouts/SuccessToast';
import ErrorToast from '@/components/layouts/ErrorToast';

const EditBlog = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const blogId = searchParams.get('id');

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('');
    const [slug, setSlug] = useState('');
    const [image, setImage] = useState(null);
    const [imageUrls, setImageUrls] = useState([]);
    const [order, setOrder] = useState(1);
    const router = useRouter();

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const url = `${process.env.domainApi}/api/blog/${blogId}`;

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': `${sessionStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                setTitle(data.title);
                setContent(data.content);
                setStatus(data.status);
                setSlug(data.slug);
            } catch (error) {
                console.error('Error fetching blog:', error);
            }
        };

        fetchBlog();
    }, [blogId]);

    const findImageSrcs = (htmlContent) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const imgs = doc.querySelectorAll('img');
        const srcs = Array.from(imgs).map(img => img.src);
        return srcs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = sessionStorage.getItem('token');
            const url = `${process.env.domainApi}/api/blog/update/${blogId}`;
    
            // Tìm kiếm tất cả các thẻ img và lấy src
            const imageUrls = findImageSrcs(content);

            console.log('imageUrls:', imageUrls);
    
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `${token}`
                },
                body: JSON.stringify({ title, content, status,imageUrl: imageUrls })
            });
            if (response.ok) {
                SuccessToast({ message: "Blog updated successfully", time: 2000 });
                setTimeout(() => {
                    router.push('/manage-blog');
                }, 2000);
            } else {
                ErrorToast({ message: "Failed to update blog", time: 5000 });
            }
        } catch (error) {
            console.error('Error updating blog:', error);
        }
    };

    return (
        <div className='box-edit-blog'>
            <h1>Edit Blog</h1>
            <form onSubmit={handleSubmit}>
                <input type="hidden" id="sttname" value={order}/>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Content:</label>
                    <CustomEditor content={content} setContent={setContent}/>
                </div>
                <div>
                    <label>Slug:</label>
                    <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Status:</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                </div>
                <button type="submit">Update Blog</button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default EditBlog;