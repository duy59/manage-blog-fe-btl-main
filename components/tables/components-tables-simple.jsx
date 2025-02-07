'use client';
import IconTrashLines from '@/components/icon/icon-trash-lines';
import IconPencilPaper from '@/components/icon/icon-pencil-paper';
import PanelCodeHighlight from '@/components/panel-code-highlight';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import React from 'react';
import { useState, useEffect, useRef } from 'react';
import SuccessToast from '../layouts/SuccessToast';
import ErrorToast from '../layouts/ErrorToast';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const ComponentsTablesSimple = () => {
    const [tableData, setTableData] = useState([]);
    const [showInput, setShowInput] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [typelinkUrl, setTypeLinkUrl] = useState(''); 
    const [linkType, setLinkType] = useState('');
    const [khuvuc, setKhuVuc] = useState('');
    const [editLinkId, setEditLinkId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const token = sessionStorage.getItem('token');

    const fetchData = async () => {
        const url = `${process.env.domainApi}/api/linkfb/getlinkcao`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': token
            }
        });
        const data = await response.json();
        setTableData(data.data);
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteLink = async (link) => {
        const url1 = `${process.env.domainApi}/api/linkfb/deletelinkcao`;
        const response1 = await fetch(url1, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'authorization': token
            },
            body: JSON.stringify({
                link : link,
            })
        });
        if (response1.ok) {
            const result = await response1.json();
            if (result.code === 200) {
                SuccessToast({ message: result.message, time: 2000 });
                fetchData();
            } else {
                ErrorToast({ message: result.message, time: 2000 });
            }
        }
    }

    const handleEditLink = (link) => {
        console.log(link);
        setEditLinkId(link._id);
        setLinkUrl(link.link);
        setLinkType(link.type);
        setTypeLinkUrl(link.type);
        setKhuVuc(link.khuvuc);
        setShowEditModal(true);
    };

    const handleUpdateLink = async () => {
        const data = {
            link: linkUrl,
            type: linkType,
            khuvuc: khuvuc
        }

        console.log(data);

        const url = `${process.env.domainApi}/api/linkfb/editlinkcao/${editLinkId}`;
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${token}`
            },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            const result = await response.json();
            if (result.code === 200) {
                SuccessToast({ message: result.message, time: 3000 });
                setShowEditModal(false);
                setEditLinkId(null);
                setLinkUrl('');
                setTypeLinkUrl('');
                setKhuVuc('');
                fetchData();
            } else {
                ErrorToast({ message: result.message, time: 3000 });
            }
        }
    };

    const inputRef = useRef(null);

    const handleButtonClick = () => {
        setShowInput(true);
    };

    const handleInputChange = (e) => {
        setLinkUrl(e.target.value);
    };

    const handleTypeLinkUrlChange = (e) => {
        setTypeLinkUrl(e.target.value);
        if (e.target.value === "bannha") {
            setLinkType("Bán");
        } else {
            setLinkType("Cho thuê");
        }
    };

    const handleSubmit = async () => {
        const data2 = {
            link: linkUrl,
            type: linkType,
            khuvuc: khuvuc
        }


        const url1 = `${process.env.domainApi}/api/linkfb/addlinkcao`;
        const response1 = await fetch(url1, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${token}`
            },
            body: JSON.stringify(data2)
        });
        if (response1.ok) {
            const result = await response1.json();
            if (result.code === 200) {
                SuccessToast({ message: result.message, time: 3000 });
                setShowInput(false);
                setLinkUrl('');
                setTypeLinkUrl('');
                setKhuVuc('');
                fetchData();
            } else {
                ErrorToast({ message: result.message, time: 3000 });
            }
        }
    };

    const handleClickOutside = (event) => {
        if (inputRef.current && !inputRef.current.contains(event.target)) {
            setShowInput(false);
            setLinkUrl('');
            setTypeLinkUrl('');
            setKhuVuc('');
        }
    };

    useEffect(() => {
        if (showInput) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        }
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [showInput]);

    const role = sessionStorage.getItem('role');
    return (
        <div>
            {role === "1" ? (
                <PanelCodeHighlight title="Manage Link">
                    <div style={{ width: "1000px" }}>
                        {!showInput && (
                            <button onClick={handleButtonClick} style={{ backgroundColor: "red", width: "100px", height: "50px", borderRadius: "10px", color: "white" }}>Thêm link FB</button>
                        )}
                        {showInput && (
                            <div ref={inputRef} style={{ display: 'flex', alignItems: 'center' }}>
                                <input
                                    type="text"
                                    value={linkUrl}
                                    onChange={handleInputChange}
                                    placeholder="URL"
                                    style={{ width: "500px", marginRight: '10px', height: "30px", borderRadius: "5px", border: "1px solid black" }}
                                />
                                <div style={{ marginRight: '10px' }}>
                                    <select onChange={handleTypeLinkUrlChange}>
                                        <option value="">Chọn loại nhóm</option>
                                        <option value="bannha">Mua Bán</option>
                                        <option value="chothue">Cho Thuê</option>
                                    </select>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Khu vực"
                                    onChange={(e) => setKhuVuc(e.target.value)}
                                    style={{ width: "200px", marginRight: '10px', height: "30px", borderRadius: "5px", border: "1px solid black" }}
                                />
                                <button onClick={handleSubmit} style={{ backgroundColor: "blue", height: "36px", borderRadius: "5px", border: "none", color: "white", width: "100px" }}>Submit</button>
                            </div>
                        )}
                    </div>

                    <div className="table-responsive mb-5">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Link</th>
                                    <th>Type</th>
                                    <th>Khu vực</th>
                                    <th className="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map((data, index) => (
                                    <tr key={data._id}>
                                        <td>
                                            <div className="whitespace-nowrap">{data.link}</div>
                                        </td>
                                        <td>{data.type}</td>
                                        <td>{data.khuvuc}</td>
                                        <td className="text-center">
                                            <Tippy content="Edit">
                                                <button type="button" onClick={() => handleEditLink(data)}>
                                                    <IconPencilPaper />
                                                </button>
                                            </Tippy>
                                            <Tippy content="Delete">
                                                <button type="button" onClick={() => handleDeleteLink(data.link)}>
                                                    <IconTrashLines className="m-auto" />
                                                </button>
                                            </Tippy>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {showEditModal && (
                            <div style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <div style={{
                                    backgroundColor: 'white',
                                    padding: '20px',
                                    borderRadius: '10px',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    width: '400px',
                                    maxWidth: '90%'
                                }}>
                                    <h2>Edit Link</h2>
                                    <input
                                        type="text"
                                        value={linkUrl}
                                        onChange={handleInputChange}
                                        placeholder="URL"
                                        style={{ width: "100%", marginBottom: '10px', height: "30px", borderRadius: "5px", border: "1px solid black" }}
                                    />
                                     <input
                                        type="text"
                                        value={linkType}
                                        placeholder="type"
                                        style={{ width: "100%", marginBottom: '10px', height: "30px", borderRadius: "5px", border: "1px solid black" }}
                                    />
                                    <input
                                        type="text"
                                        value={khuvuc}
                                        onChange={(e) => setKhuVuc(e.target.value)}
                                        placeholder="Khu vực"
                                        style={{ width: "100%", marginBottom: '10px', height: "30px", borderRadius: "5px", border: "1px solid black" }}
                                    />
                                    <button onClick={handleUpdateLink} style={{ backgroundColor: "blue", height: "36px", borderRadius: "5px", border: "none", color: "white", width: "100px" }}>Update</button>
                                    <button onClick={() => setShowEditModal(false)} style={{ backgroundColor: "red", height: "36px", borderRadius: "5px", border: "none", color: "white", width: "100px", marginLeft: '10px' }}>Cancel</button>
                                </div>
                            </div>
                        )}
                    </div>
                    <ToastContainer />
                </PanelCodeHighlight>
            ) : (
                <div className="no-access">
                    <h2>Không phận sự</h2>
                </div>
            )}
        </div>
    );
};

export default ComponentsTablesSimple;