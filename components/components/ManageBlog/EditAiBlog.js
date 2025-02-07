"use client"
import React, { useRef, useState, useEffect } from 'react';
import "../../../styles/EditBlog.css";
import { useRouter } from 'next/navigation';
import CustomEditor from '../custom-editor';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../../../styles/alertStyle.css"; 

const EditAiBlog = ({ blogId }) => {
    const [titleCeo , setTitleCeo] = useState('');
    const [descriptionCeo , setDescriptionCeo] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [contentGPt , setContentGPt] = useState('');
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [contentorigin, setContentOrigin] = useState('');
    const [imgUrl, setImgUrl] = useState([]);
    const [newimg , setNewImg] = useState([]);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await fetch(`${process.env.domainApi}/api/blog/${blogId}`, {

                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': `${sessionStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                const res = data;
                console.log(res);
                setTitleCeo(res.titleAI);
                setDescriptionCeo(res.descriptionAI);
                setTitle(res.title);
                setContent(res.contentAI);
                setContentOrigin(res.content);
                setContentGPt(res.contentGPT);
                setImgUrl(res.imageUrl);
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
            const newimg = findImageSrcs(content);

            console.log('newimg:', newimg);
    
            // Nếu newimg không rỗng, push từng URL vào imgUrl
            if (newimg.length > 0) {
                setImgUrl(prevImgUrls => [...(prevImgUrls || []), ...newimg]);
            }

            const token = sessionStorage.getItem('token');
            const contentAI = content;
            const statusBlog = 'ai';
            const status = statusBlog;
            const response = await fetch(`${process.env.domainApi}/api/blog/update/${blogId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `${token}`
                },
                body: JSON.stringify({ title, contentAI, status , imageUrl: imgUrl })
            });
            if (response.ok) {
                toast.success('Blog updated successfully', {
                    className: 'toast-success',
                    autoClose: 2000 
                });
                setTimeout(() => {
                    router.push('/manage-blog');
                }, 2000);
            } else {
                toast.error('Failed to update blog', {
                    className: 'toast-error',
                    autoClose: 5000 
                });
            }
        } catch (error) {
            console.error('Error updating blog:', error);
            toast.error('An error occurred while updating the blog', {
                className: 'toast-error',
                autoClose: 5000 
            });
        }
    };

    if (loading) {
        return (
            <div>
                <h1 className="text-center">
                    <span className="animate-[spin_2s_linear_infinite] border-8 border-[#f1f2f3] border-l-primary border-r-primary rounded-full w-14 h-14 inline-block align-middle m-auto mb-10"></span>
                </h1>
            </div>
        ); // Render loading indicator
    }

    console.log('imgUrl:', imgUrl);
    return (
        <div className='box-edit-blog'>
            <h1>Gen AI Blog</h1>
            <form onSubmit={handleSubmit}>
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
                    <label>Title Ceo:</label>
                    <input
                        type="text"
                        value={titleCeo}
                    />
                </div>
                <div>
                    <label>Description Ceo:</label>
                    <input
                        type="text"
                        value={descriptionCeo}
                    />
                </div>
                <div>
                    <label>Content Ai:</label>
                    <CustomEditor content={content} setContent={setContent} />
                </div>
                <div>
                    <label>Content GPT:</label>
                    <CustomEditor content={contentGPt} setContent={setContentGPt} />
                </div>
                <div>
                    <label>Content Origin:</label>
                    <div dangerouslySetInnerHTML={{ __html: contentorigin }}></div>
                </div>
                <div>
                    <label>Image:</label>
                    {(imgUrl || []).map((img, index) => (
                        <img key={index} src={img} alt="blog-img" className="img-blog" />
                    ))}
                </div>
                <button type="submit">Update Data</button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default EditAiBlog;