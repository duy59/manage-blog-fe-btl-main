"use client"
import React, { useRef, useState, useEffect } from 'react';
import "../../../styles/EditBlog.css";
import { useRouter } from 'next/navigation';

import CustomEditor from '../custom-editor';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../../../styles/alertStyle.css"; // Import custom CSS for toast
import * as XLSX from 'xlsx';

const PushBlog = ({ blogId }) => {
    const [titleCeo , setTitleCeo] = useState('');
    const [descriptionCeo , setDescriptionCeo] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const router = useRouter();
    const [dataCategory, setDataCategory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [contentorigin, setContentOrigin] = useState('');
    const [imgUrl, setImgUrl] = useState([]);
    const [slug , setSlug] = useState('');
    const [category, setCategory] = useState('');
    const [idCategory, setIdCategory] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [statusthumbnail, setStatusThumbnail] = useState(false);

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
                setTitleCeo(res.titleAI);
                setDescriptionCeo(res.descriptionAI);
                setTitle(res.title);
                setDescription(res.description);
                setContent(res.contentAI);
                setContentOrigin(res.content);
                setSlug(res.slug);
                setThumbnail(res.thumbnail);
                setStatusThumbnail(res.downloadthumbnail);
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


    const tokenWeb = "idGhlbSIsInN1YSIsInhvYSJdLCJpYXQiOjE3Mjg4MDIyODg" ;
    
    function fetchCategory() {
        fetch(`https://xemnha.vn/api/categories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${tokenWeb}`
            }
        })
            .then(response => {
                if(!response.ok) {
                    throw new Error('Failed to fetch category');
                }
                return response.json();
            })
            .then(data => {
                setDataCategory(data.data);
            }
            )
            .catch(error => console.error('Error fetching category:', error));

    }

    useEffect(() => {
        fetchCategory();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(idCategory === ''){
            toast.error('Please select category', {
                className: 'toast-error',
                autoClose: 5000 
            });
            return;
        }
        try {
            const WebToken = "idGhlbSIsInN1YSIsInhvYSJdLCJpYXQiOjE3Mjg4MDIyODg";
            const body = {
                name: title,
                slug: slug,
                cat_id: idCategory,
                description: descriptionCeo,
                content: content,
                seo_title: titleCeo,
                seo_description: descriptionCeo,
                thumbnail: thumbnail,
            };
            console.log("du lieu gui di " ,   content);
            console.log(body);
            // Gửi yêu cầu POST để chèn bài viết mới
            const response = await fetch(`https://xemnha.vn/api/insertPost`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${WebToken}`
                },
                body: JSON.stringify(body)
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }
    
            const postData = await response.json(); 
            console.log(postData);

            window.open(postData.url, '_blank');

            // Gửi yêu cầu PATCH để cập nhật trường status thành published
            const updateResponse = await fetch(`${process.env.domainApi}/api/blog/update/${blogId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `${sessionStorage.getItem('token')}`
                },
                body: JSON.stringify({ status: 'published' , urlXuat : postData.url , statusXuat : "noXuat" , ExcelDay : Date.now() })
            });
    
            if (!updateResponse.ok) {
                const errorText = await updateResponse.text();
                console.error(`HTTP error! status: ${updateResponse.status}, message: ${errorText}`);
                throw new Error(`HTTP error! status: ${updateResponse.status}, message: ${errorText}`);
            }
            toast.success('Push blog successfully', {
                className: 'toast-success',
                autoClose: 5000 
            });
            setTimeout(() => {
                router.push('/manage-blog');
            }, 2000);
        } catch (error) {
            console.error('Error pushing blog:', error);
            toast.error('Error pushing blog', {
                className: 'toast-error',
                autoClose: 5000 
            });
        }
    };

    const handleCategoryChange = (e) => {
        const selectedId = e.target.value;
        console.log(selectedId);
        const selectedCategory = dataCategory.find(category => category.id === selectedId);
        if (selectedCategory) {
            setCategory(selectedCategory.name);
            setIdCategory(selectedCategory.id);
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

    return (
        <div className='box-edit-blog'>
            <h1>Push Blog</h1>
            <form onSubmit={handleSubmit}>
            <div>
                <label>Category:</label>
                        <select onChange={handleCategoryChange}>
                            <option value="">Select category</option>
                            {Array.isArray(dataCategory) && dataCategory.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                </div>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <input
                        type="text"
                        value={descriptionCeo}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div>
                    <label>Slug:</label>
                    <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                    />
                </div>
                <div>
                    <label>Title Ceo:</label>
                    <input
                        type="text"
                        value={titleCeo}
                        onChange={(e) => setTitleCeo(e.target.value)}   
                    />
                </div>
                <div>
                    <label>Description Ceo:</label>
                    <input
                        type="text"
                        value={descriptionCeo}
                        onChange={(e) => setDescriptionCeo(e.target.value)}
                    />
                </div>
                <div>
                    <label>Content:</label>
                    <CustomEditor content={content} setContent={setContent} />
                </div>
                <div>
                    <label>Thumbnail:</label>
                    <img src={thumbnail} alt="thumbnail" />
                </div>
                <button type="submit">Push</button>
            </form>
            {/* <button onClick={downloadExcel} style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '5px', border: 'none', backgroundColor: '#4CAF50', color: 'white', cursor: 'pointer' }}>
                Tải file Excel
            </button> */}
            <ToastContainer />
        </div>
    );
};

export default PushBlog;