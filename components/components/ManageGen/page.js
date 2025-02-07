"use client"
import React, { useState, useEffect } from 'react';
import SuccessToast from '@/components/layouts/SuccessToast';
import ErrorToast from '@/components/layouts/ErrorToast';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './manageGen.css'; // Nhập tệp CSS

const App = () => {
    const [visibleInput, setVisibleInput] = useState(null);
    const [blogContent, setBlogContent] = useState('');
    const [blogContent1, setBlogContent1] = useState('');
    const [facebookContent, setFacebookContent] = useState('');
    const [facebookThueContent, setFacebookThueContent] = useState('');
    const [savedBlogContent, setSavedBlogContent] = useState('');
    const [savedFacebookContent, setSavedFacebookContent] = useState('');
    const [savedFacebookThueContent, setSavedFacebookThueContent] = useState('');

    const id = "67a5dd3e45e8cb4dbe438234";

    const toggleInput = (inputType) => {
        setVisibleInput(visibleInput === inputType ? null : inputType);
    };

    const handleBlogContentChange = (e) => setBlogContent(e.target.value);
    const handleBlogContent1Change = (e) => setBlogContent1(e.target.value);
    const handleFacebookContentChange = (e) => setFacebookContent(e.target.value);
    const handleFacebookThueContentChange = (e) => setFacebookThueContent(e.target.value);

    const fetchContent = async () => {
        try {
            const url = `${process.env.domainApi}/api/contentgen/getcontent/${id}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                     "authorization": `${sessionStorage.getItem('token')}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setBlogContent(data.data[0]);
                setFacebookContent(data.data[1]);
                setFacebookThueContent(data.data[2]);
                setBlogContent1(data.data[3]);
            }
        } catch (error) {
            console.error('Error fetching content:', error);
        }
    };

    const handleSaveBlogContent = async () => {
        try {
            const url = `${process.env.domainApi}/api/contentgen/updatecontent/${id}`;
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": `${sessionStorage.getItem('token')}`,
                },
                body: JSON.stringify({ content: blogContent }),
            });
            if (response.ok) {
                const data = await response.json();
                setSavedBlogContent(data.content);
                SuccessToast({ message: 'Blog content saved successfully!', time: 3000 });
            }
        } catch (error) {
            console.error('Error saving blog content:', error);
            ErrorToast({ message: 'Error saving blog content!', time: 3000 });
        }
    };

    const handleSaveBlogContent1 = async () => {
        try {
            const url = `${process.env.domainApi}/api/contentgen/updatecontent/${id}`;
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": `${sessionStorage.getItem('token')}`,
                },
                body: JSON.stringify({ content1: blogContent1 }),
            });
            if (response.ok) {
                const data = await response.json();
                SuccessToast({ message: 'Blog content saved successfully!', time: 3000 });
            }
        } catch (error) {
            console.error('Error saving blog content:', error);
            ErrorToast({ message: 'Error saving blog content!', time: 3000 });
        }
    };


    const handleSaveFacebookContent = async () => {
        try {
            const url = `${process.env.domainApi}/api/contentgen/updatecontent/${id}`;
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": `${sessionStorage.getItem('token')}`,
                },
                body: JSON.stringify({ contentFBban: facebookContent }),
            });
            if (response.ok) {
                const data = await response.json();
                setSavedFacebookContent(data.contentFBban);
                SuccessToast({ message: 'Facebook Bán content saved successfully!', time: 3000 });
            }
        } catch (error) {
            console.error('Error saving Facebook content:', error);
            ErrorToast({ message: 'Error saving Facebook content!', time: 3000 });
        }
    };

    const handleSaveFacebookThueContent = async () => {
        try {
            const url = `${process.env.domainApi}/api/contentgen/updatecontent/${id}`;
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": `${sessionStorage.getItem('token')}`,
                },
                body: JSON.stringify({ contentFBthue: facebookThueContent }),
            });
            if (response.ok) {
                const data = await response.json();
                setSavedFacebookThueContent(data.contentFBthue);
                SuccessToast({ message: 'Facebook Thuê content saved successfully!', time: 3000 });
            }
        } catch (error) {
            console.error('Error saving Facebook thuê content:', error);
            ErrorToast({ message: 'Error saving Facebook thuê content!', time: 3000 });
        }
    };

    useEffect(() => {
        fetchContent();
    }, []);

    const role = sessionStorage.getItem('role');

    return (
        <div className="content-manager">
        {role === "1" ? (
            <>
                <div className="button-container">
                    <button onClick={() => toggleInput('blog')}>Manage Content Blog</button>
                    <button onClick={() => toggleInput('facebook')}>Manage Content Blog Facebook Bán</button>
                    <button onClick={() => toggleInput('facebookThue')}>Manage Content Blog Facebook Thuê</button>
                </div>

                {visibleInput === 'blog' && (
                    <div className="input-container-wrapper" style={{ display: 'flex', gap: '20px' }}>
                        <div className="input-container" style={{ flex: 1 }}>
                            <h2>Manage Content1 Blog</h2>
                            <textarea
                                value={blogContent}
                                onChange={handleBlogContentChange}
                                placeholder="Enter blog content"
                                className="content-input"
                                style={{ width: '100%' }}
                            />
                            <div className="button-group">
                                <button onClick={handleSaveBlogContent} className="save-button">Lưu</button>
                                <button onClick={() => toggleInput('blog')} className="close-button">Close</button>
                            </div>
                        </div>
                        <div className="input-container" style={{ flex: 1 }}>
                            <h2>Manage Content2 Blog</h2>
                            <textarea
                                value={blogContent1}
                                onChange={handleBlogContent1Change}
                                placeholder="Enter blog content"
                                className="content-input"
                                style={{ width: '100%' }}
                            />
                            <div className="button-group">
                                <button onClick={handleSaveBlogContent1} className="save-button">Lưu</button>
                                <button onClick={() => toggleInput('blog')} className="close-button">Close</button>
                            </div>
                        </div>
                    </div>
                )}

                {visibleInput === 'facebook' && (
                    <div className="input-container">
                        <h2>Manage Content Blog Facebook Bán</h2>
                        <textarea
                            value={facebookContent}
                            onChange={handleFacebookContentChange}
                            placeholder="Enter Facebook content"
                            className="content-input"
                        />
                        <div className="button-group">
                            <button onClick={handleSaveFacebookContent} className="save-button">Lưu</button>
                            <button onClick={() => toggleInput('facebook')} className="close-button">Close</button>
                        </div>
                    </div>
                )}

                {visibleInput === 'facebookThue' && (
                    <div className="input-container">
                        <h2>Manage Content Blog Facebook Thuê</h2>
                        <textarea
                            value={facebookThueContent}
                            onChange={handleFacebookThueContentChange}
                            placeholder="Enter Facebook content"
                            className="content-input"
                        />
                        <div className="button-group">
                            <button onClick={handleSaveFacebookThueContent} className="save-button">Lưu</button>
                            <button onClick={() => toggleInput('facebookThue')} className="close-button">Close</button>
                        </div>
                    </div>
                )}
                <ToastContainer />
            </>
        ) : (
            <div className="no-access">
                <h2>Không phận sự</h2>
            </div>
        )}
    </div>
    );
};

export default App;