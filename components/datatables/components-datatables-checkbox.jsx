"use client"
import React, { useState, useEffect, useCallback, use } from 'react';
import { DataTable } from 'mantine-datatable';
import IconTrashLines from '@/components/icon/icon-trash-lines';
import IconPencilPaper from '@/components/icon/icon-pencil-paper';
import IconLogout from '../icon/icon-logout';
import IconEye from '@/components/icon/icon-eye';
import debounce from 'lodash.debounce';
import ErrorToast from '../layouts/ErrorToast';
import SuccessToast from '../layouts/SuccessToast';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './test.css'; // Import the CSS file
import IconCpuBolt from '../icon/icon-cpu-bolt';

const ManageBlog = () => {
    const [page, setPage] = useState(() => {
        const savedPage = localStorage.getItem('currentPage');
        return savedPage ? Number(savedPage) : 1;
    });
    
    const [status, setStatus] = useState(() => {
        return localStorage.getItem('currentStatus') || '';
    });
    
    const [domain, setDomain] = useState(() => {
        return localStorage.getItem('currentDomain') || '';
    });
    
    const [ctvSearch, setCtvSearch] = useState(() => {
        return localStorage.getItem('currentCtv') || '';
    });
    const [statusXuat, setStatusXuat] = useState(() => {
        return localStorage.getItem('currentStatusXuat') || '';
    });
    

    const token = sessionStorage.getItem('token');
    const [recordsData, setRecordsData] = useState([]);
    // const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortStatus, setSortStatus] = useState({ columnAccessor: 'title', direction: 'asc' });
    const [searchTerms, setSearchTerms] = useState({
        title: '',
        category: '',
        author: '',
        status: localStorage.getItem('currentStatus') || '',
        statusGPT: '',
        ctv: localStorage.getItem('currentCtv') || '',
        domain: localStorage.getItem('currentDomain') || '',
        statusXuat : localStorage.getItem('currentStatusXuat') || ''
    });
    const [selectedBlogs, setSelectedBlogs] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [selectAll, setSelectAll] = useState(false);
    const [loadingAssign, setLoadingAssign] = useState(false); // Thêm trạng thái loadingAssign
    const [loadingAssignAgain, setLoadingAssignAgain] = useState(false); // Thêm trạng thái loadingAssignAgain
    // const [status, setStatus] = useState('');
    // const [domain, setDomain] = useState('');
    // const [ctvSearch , setCtvSearch] = useState('');
    const [loadingGenAI, setLoadingGenAI] = useState(false); // Thêm trạng thái loadingGenAI'
    const [loadingGenAll, setLoadingGenAll] = useState(false); // Thêm trạng thái loadingGenAll
    const [soBaiDaChia, setSoBaiDaChia] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loadingIndex , setLoadingIndex] = useState(false);

    const fetchBlogs = useCallback(async (searchTerms) => {
        try {
            const query = new URLSearchParams({
                page,
                limit: pageSize,
                title: searchTerms.title,
                category: searchTerms.category,
                author: searchTerms.author,
                status: searchTerms.status,
                statusGPT : searchTerms.statusGPT,
                ctv : searchTerms.ctv,
                domain : searchTerms.domain,
                statusXuat : searchTerms.statusXuat
            }).toString();

            const url = `${process.env.domainApi}/api/blog?${query}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'authorization': `${token}`,
                }
            });
            const data = await response.json();
            setRecordsData(Array.isArray(data.blogs) ? data.blogs : []);
            setTotalRecords(data.totalPage * pageSize); 
        } catch (error) {
            console.error('Error fetching blogs:', error);
        }
    }, [page, pageSize, token]);

    // Debounce the fetchBlogs function
    const debouncedFetchBlogs = useCallback(debounce(fetchBlogs, 300), [fetchBlogs]);

    const fetchCountBlogChuaChia = async () => {
        const url = `${process.env.domainApi}/api/blog/blog/chuachia`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'authorization': `${token}`
            }
        });
        const data = await response.json();
        setSoBaiDaChia(data.chuachia);
    };
    useEffect(() => {
        fetchCountBlogChuaChia();
    }, [soBaiDaChia]);

    // useEffect(() => {
    //     // Khôi phục trạng thái trang từ localStorage
    //     const savedPage = localStorage.getItem('currentPage');
    //     const savedStatus = localStorage.getItem('currentStatus');
    //     const savedDomain = localStorage.getItem('currentDomain');
    //     const savedCtv = localStorage.getItem('currentCtv');

    //     if (savedPage) {
    //         setPage(Number(savedPage));
    //     }
    //     if (savedStatus) {
    //         setStatus(savedStatus);
    //         handleSearchChange('status', savedStatus);
    //     }
    //     if (savedDomain) {
    //         setDomain(savedDomain);
    //         handleSearchChange('domain', savedDomain);
    //     }
    //     if (savedCtv) {
    //         setCtvSearch(savedCtv);
    //         handleSearchChange('ctv', savedCtv);
    //     }
    // }, []);

    const handlePageChange = (p) => {
        setPage(p);
        localStorage.setItem('currentPage', p); // Lưu trạng thái trang vào localStorage
    };

    useEffect(() => {
        debouncedFetchBlogs(searchTerms);
    }, [page, pageSize, searchTerms, debouncedFetchBlogs]);

    const handleCheckboxChange = (blogId) => {
        if (selectedBlogs.includes(blogId)) {
            setSelectedBlogs(selectedBlogs.filter(id => id !== blogId));
        } else {
            setSelectedBlogs([...selectedBlogs, blogId]);
        }
    };

    const handleSelectAll = () => {
        setSelectAll(!selectAll);
        if (!selectAll) {
          const allIds = recordsData.map(record => record._id);
          setSelectedBlogs(allIds);
        } else {
          setSelectedBlogs([]);
        }
    };
    const calculateSTT = (index) => {
        return (page - 1) * pageSize + index + 1;
    };

    const handleSearchChange = (field, value) => {
        setSearchTerms(prevTerms => ({
            ...prevTerms,
            [field]: value
        }));
        if (field === 'status') {
            setStatus(value);
            localStorage.setItem('currentStatus', value);
            setPage(1);
            localStorage.setItem('currentPage', 1);
        }
        if (field === 'domain') {
            setDomain(value);
            localStorage.setItem('currentDomain', value);
            setPage(1);
            localStorage.setItem('currentPage', 1);
        }
        if (field === 'ctv') {
            setCtvSearch(value);
            localStorage.setItem('currentCtv', value);
            setPage(1);
            localStorage.setItem('currentPage', 1);
        }
        if (field === 'statusXuat') {
            setStatusXuat(value);
            localStorage.setItem('currentStatusXuat', value);
            setPage(1);
            localStorage.setItem('currentPage', 1);
        }
        debouncedFetchBlogs({ ...searchTerms, [field]: value });
    };
    console.log("currentStatus", localStorage.getItem('currentStatus'));
    const handleEdit = (blogId) => {
        window.location.href = `/manage-blog/edit-blog?id=${blogId}`;
    };

    const handleDelete = async (blogId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
        if (confirmDelete) {
            const token = sessionStorage.getItem('token');
            const url = `${process.env.domainApi}/api/blog/delete/${blogId}`;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: { 'authorization': `${token}` }
            });
            if (response.ok) {
                SuccessToast({ message: "Blog deleted successfully", time: 5000 });
                fetchBlogs(searchTerms); // Fetch lại dữ liệu sau khi xóa
            } else {
                ErrorToast({ message: "Error deleting blog", time: 5000 });
            }
        }
    };

    const handleView = (blogId) => {
        window.open(`/manage-blog/view-ai/${blogId}`, '_blank');
        window.open(`/manage-blog/view-blog?id=${blogId}`, '_blank');
    };

    const handleGenAi = (blogId) => {  
        window.location.href =`/manage-blog/gen-ai/${blogId}`;
    }

    const handlePush = (blogId) => {
        window.location.href = `/manage-blog/push-blog/${blogId}`;
    }

    const handleClickAssign = async () => {
        const url = `${process.env.domainApi}/api/blog/duybeo/assignBlogNew`;
        setLoadingAssign(true); // Bắt đầu hiển thị loading
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'authorization': `${token}`
                },
            });
            if (response.ok) {
                fetchCountBlogChuaChia();
                toast.success('Chia việc thành công', {
                    className: 'toast-success',
                    autoClose: 5000
                });
                const data = await response.json();
                if(data.code == 200) {
                    const response1 = await fetch(`${process.env.domainApi}/api/blog/duybeo/laytenCtv`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'authorization': `${token}`
                        },
                    });
                    if (response1.ok) {
                        fetchBlogs(searchTerms);
                    } else {
                        fetchBlogs(searchTerms);
                    }
                }
                else {
                    ErrorToast({ message: "Đã chia hết các công việc", time: 5000 });
                }
            } else {
                ErrorToast({ message: "Chia việc thất bại", time: 5000 });
            }
        } catch (error) {
            console.error('Error:', error);
            ErrorToast({ message: "Có lỗi xảy ra, vui lòng thử lại", time: 5000 });
            fetchCountBlogChuaChia();
        } finally {
            setLoadingAssign(false); // Ẩn loading sau khi hoàn tất
        }
    };

    const handleDeleteAll = async () => {
        if(selectedBlogs.length === 0) {
            ErrorToast({ message: "Please select blogs to delete", time: 5000 });
            return;
        }
        else {
            const confirmDelete = window.confirm("Are you sure you want to delete these blogs?");
        if (confirmDelete) {
            const token = sessionStorage.getItem('token');
            try {
                const url = `${process.env.domainApi}/api/blog/deleteAll`;
                const response = await fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'authorization': `${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ids: selectedBlogs })
                });
                if(response.ok) {
                    SuccessToast({ message: "Blogs deleted successfully", time: 5000 });
                    setSelectedBlogs([]);
                    fetchBlogs(searchTerms);
                } else {
                    ErrorToast({ message: "Failed to delete blogs", time: 5000 });
                }
            } catch (error) {
                console.error('Error deleting blogs:', error);
            }
        }
        }
    };

    const handleClickRestore = async () => {
        if (selectedBlogs.length === 0) {
            ErrorToast({ message: "Please select blogs to restore", time: 5000 });
            return;
        } else {
            const confirmRestore = window.confirm("Are you sure you want to restore these blogs?");
            if (confirmRestore) {
                const token = sessionStorage.getItem('token');
                const url = `${process.env.domainApi}/api/blog/restore`;
                try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'authorization': `${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ ids: selectedBlogs })
                    });
                    if (response.ok) {
                        SuccessToast({ message: "Blogs restored successfully", time: 5000 });
                        setSelectedBlogs([]);
                        fetchBlogs(searchTerms);
                    } else {
                        ErrorToast({ message: "Failed to restore blogs", time: 5000 });
                    }
                } catch (error) {
                    console.error('Error restoring blogs:', error);
                }
            }
        }
    };

    const handleGenManyAI = async () => {
        if (selectedBlogs.length === 0) {
            ErrorToast({ message: "Please select blogs to generate AI", time: 5000 });
            return;
        } else {
            const confirmGenAI = window.confirm("Are you sure you want to generate AI for these blogs?");
            if (confirmGenAI) {
                const token = sessionStorage.getItem('token');
                setLoadingGenAI(true);
                const url = `${process.env.domainApi}/api/blog/genAI/genAIPostAll`;
                try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'authorization': `${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ ids: selectedBlogs})
                    });
                    if (response.ok) {
                        SuccessToast({ message: "AI generated successfully", time: 5000 });
                        setSelectedBlogs([]);
                        fetchBlogs(searchTerms);
                    } else {
                        ErrorToast({ message: "Failed to generate AI", time: 5000 });
                    }
                } catch (error) {
                    console.error('Error generating AI:', error);
                }
            }
            setLoadingGenAI(false); 
        }

    };

    const handleClickDLExcel = async () => {
        if (!startDate || !endDate) {
            ErrorToast({ message: "Vui lòng chọn ngày bắt đầu và kết thúc", time: 5000 });
            return;
        }
        if (new Date(startDate) > new Date(endDate)) {
            ErrorToast({ message: "Ngày bắt đầu không được sau ngày kết thúc", time: 5000 });
            return;
        }
        setLoadingIndex(true); // Bắt đầu loading
        try {
            const token = sessionStorage.getItem('token');
            const url = `${process.env.domainApi}/api/blog/exportsExcel/DlExcel`;
    
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'authorization': `${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    startDate,
                    endDate
                })
            });
    
            // Kiểm tra loại nội dung trả về
            const contentType = response.headers.get('Content-Type');
    
            if (response.ok && contentType === 'application/zip') {
                const blob = await response.blob();
                const downloadUrl = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.setAttribute('download', 'urls.zip'); // Đặt tên tệp tải về
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(downloadUrl);
                SuccessToast({ message: "Tải xuống tệp thành công", time: 5000 });
    
                // Reset lại ngày sau khi tải xong
                setStartDate('');
                setEndDate('');
            } else {
                // Nếu không phải tệp ZIP, giả sử là JSON với thông báo lỗi
                const errorData = await response.json();
                ErrorToast({
                    message: errorData.message || "Không thể tải xuống tệp",
                    time: 5000
                });
            }
        } catch (error) {
            console.error('Lỗi khi tải xuống tệp:', error);
            ErrorToast({ message: "Lỗi khi tải xuống tệp", time: 5000 });
        } finally {
            setLoadingIndex(false); // Kết thúc loading
        }
    };

    const handleDeleteBlogonDate = async () => {
        window.location.href = '/xoa-blog';
    };
    const role = sessionStorage.getItem('role');

    return (
        <div className="panel mt-6">
            <div>
            </div>
            <div className="mb-5 flex flex-col gap-5 md:flex-row md:items-center">
                <div>
                    {role === '1' && (
                        <p className="text-2xl">Số lượng bài viết chưa chia cho CTV : <span>{soBaiDaChia}</span></p>
                    )}    
                    {role === '1' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <label>
                                Start Date:
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    style={{ marginLeft: '5px' }}
                                />
                            </label>
                            <label>
                                End Date:
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    style={{ marginLeft: '5px' }}
                                />
                            </label>
                            <button
                                type="button"
                                onClick={handleClickDLExcel}
                                style={{ backgroundColor: "green", height: "30px", width: "150px", borderRadius: "10px", color: "white" }}
                            >
                                {loadingIndex ? (
                                    <span className="animate-spin border-4 border-t-transparent border-white rounded-full w-5 h-5 inline-block"></span>
                                ) : (
                                    "INDEX"
                                )}
                            </button>
                        </div>
                    )}
                </div>
                <div className="ltr:ml-auto rtl:mr-auto" style={{'display':'flex','flex-direction':'row','grid-column-gap': '15px'}}>
                {role === '1' && status === 'deleted' && (
                    <button type="button" className="btn btn-info" onClick={handleClickRestore}>
                        {loadingAssign ? (
                            <span className="animate-spin border-4 border-t-transparent border-white rounded-full w-5 h-5 inline-block"></span>
                        ) : (
                            "Phục hồi"
                        )}
                    </button>
                )}
                {role === '1' && (
                    <button type="button" className="btn btn-info" onClick={handleDeleteBlogonDate}>Delete Blog from Date</button>
                )}
                {role === '1' && (
                    <button type="button" className="btn btn-info" onClick={handleClickAssign}>
                        {loadingAssign ? (
                            <span className="animate-spin border-4 border-t-transparent border-white rounded-full w-5 h-5 inline-block"></span>
                        ) : (
                            "Chia bài cho CTV"
                        )}
                    </button>
                )}
                   
                    <button type="button" className="btn btn-success" onClick={handleDeleteAll}>Xóa nhiều</button>
                    <button type="button" className="btn btn-danger" onClick={handleGenManyAI}>
                        {loadingGenAI ? (
                            <span className="animate-spin border-4 border-t-transparent border-white rounded-full w-5 h-5 inline-block"></span>
                        ) : (
                            "Gen AI"
                        )}
                    </button>
                </div>
            </div>
            <div className="datatables">
                <DataTable
                    className="table-hover whitespace-nowrap"
                    records={recordsData.map((record, index) => ({
                        ...record,
                        stt: calculateSTT(index),
                        category: typeof record.category === 'object' && record.category !== null ? record.category.name : record.category,
                    }))}
                    columns={[
                        {
                            accessor: 'checkbox', width: '5%',
                            title: (
                              <input
                                type="checkbox"
                                checked={selectAll}
                                onChange={handleSelectAll}
                              />
                            ),
                            render: (record) => (
                                <input
                                  type="checkbox"
                                  checked={selectedBlogs.includes(record._id)}
                                  onChange={() => handleCheckboxChange(record._id)}
                                />
                            ),
                          },
                        { accessor: 'stt', title: 'STT', width: '3%' },
                        {
                            accessor: 'title',
                            title: (
                                <div style={{ width: "100%" }}>
                                    <input
                                        type="text"
                                        placeholder="Title"
                                        value={searchTerms.title}
                                        onChange={(e) => handleSearchChange('title', e.target.value)}
                                        className="search-input"
                                        style={{ borderRadius: '5px', width: '50%' }}
                                    />
                                </div>
                            ),
                            width: "700px",
                            render: (record) => {
                                const displayText = record.title ? record.title.trim() : '';
                                return <span className="text-ellipsis">{displayText}</span>;
                            },
                            style: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
                        },
                        {
                            accessor: 'author',
                            title: (
                                <div style={{width : "100%"}}>
                                    <input
                                        type="text"
                                        placeholder="Author"
                                        value={searchTerms.author}
                                        onChange={(e) => handleSearchChange('author', e.target.value)}
                                        className="search-input"
                                        style={{ width: '100%' , borderRadius : '5px' }}
                                    />
                                </div>
                            ),
                            width: '120px',
                            render: (record) => {
                                return <span className="text-author" style={{width : "100%"}}>
                                {record.author}
                                </span>;
                            },
                            style: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
                        },
                        {
                            accessor: 'status', width: '2%',
                            title: (
                                <div>
                                    <select
                                        value={searchTerms.status}
                                        onChange={(e) => handleSearchChange('status', e.target.value)}
                                        className="search-select"
                                        style={{ }}
                                    >
                                        <option value="">All</option>
                                        <option value="published">Published</option>
                                        <option value="draft">Draft</option>
                                        <option value="ai">AI</option>
                                        <option value="deleted">Deleted</option>
                                    </select>
                                </div>
                            ),
                            style: { marginLeft: "0px" , whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
                        },
                        ...(role === '1' ? [{
                            accessor: 'ctv',
                            title: (
                                <div style={{ width: '100%' }}>
                                    <input
                                        type="text"
                                        placeholder="CTV"
                                        value={searchTerms.ctv}
                                        onChange={(e) => handleSearchChange('ctv', e.target.value)}
                                        className="search-input"
                                        style={{ width: '100%', borderRadius: '5px' }}
                                    />
                                </div>
                            ),
                            width: '120px',
                            render: (record) => {
                                return <span className="text-ellipsis" style={{ width: '100%' }}>
                                    {record.ctv}
                                </span>;
                            },
                            style: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
                        }] : []),

                        ...(role === '1' ? [{
                            accessor: 'statusXuat',
                            title: (
                                <div style={{ width: '100%' }}>
                                    <input
                                        type="text"
                                        placeholder="StatusXuat"
                                        value={searchTerms.statusXuat}
                                        onChange={(e) => handleSearchChange('statusXuat', e.target.value)}
                                        className="search-input"
                                        style={{ width: '100%', borderRadius: '5px' }}
                                    />
                                </div>
                            ),
                            width: '120px',
                            render: (record) => {
                                return <span className="text-ellipsis" style={{ width: '100%' }}>
                                    {record.statusXuat}
                                </span>;
                            },
                            style: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
                        }] : []),

                        ...(role === '1' ? [{
                            accessor: 'domain',
                            title: (
                                <div style={{ width: '100%' }}>
                                    <input
                                        type="text"
                                        placeholder="Domain"
                                        value={searchTerms.domain}
                                        onChange={(e) => handleSearchChange('domain', e.target.value)}
                                        className="search-input"
                                        style={{ width: '100%', borderRadius: '5px' }}
                                    />
                                </div>
                            ),
                            width: '120px',
                            render: (record) => {
                                return <span className="text-ellipsis" style={{ width: '100%' }}>
                                    {record.domain}
                                </span>;
                            },
                            style: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
                        }] : []),
                        // {
                        //     accessor: 'statusGPT', width: '3%',
                        //     title: (
                        //         <div>
                        //             <select
                        //                 value={searchTerms.statusGPT}
                        //                 onChange={(e) => handleSearchChange('statusGPT', e.target.value)}
                        //                 className="search-select"
                        //                 style={{ }}
                        //             >
                        //                 <option value="1">đã qua</option>
                        //                 <option value="0">chưa qua</option>
                        //             </select>
                        //         </div>
                        //     ),
                        //     style: { marginLeft: "0px" , whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
                        // },
                        {
                            accessor: 'thumbnail', width: '5%', title: 'Thumbnail',
                            render: (record) => {
                                return <img src={record.thumbnail} alt={record.title} className="thumbnail" style={{width : "70px" , height : "auto"}}/>;
                            },
                            style: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
                        },
                        {
                            accessor: 'category',
                            title: (
                                <div style={{width : "100%"}}>
                                    <input
                                        type="text"
                                        placeholder="Category"
                                        value={searchTerms.category}
                                        onChange={(e) => handleSearchChange('category', e.target.value)}
                                        className="search-input"
                                        style={{ width: '100%' , borderRadius : '5px' }}
                                    />
                                </div>
                            ),
                            width: '10%',
                            render: (record) => {
                                return <span className="text-ellipsis">
                                    {record.category}
                                </span>;
                            },
                            style: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
                        },
                        {
                            accessor: 'actions',
                            title: 'Actions',
                            width: '20%',
                            render: (record) => (
                                <div className="action-buttons" style={{width : "100%"}}>
                                    <button title="View" onClick={() => handleView(record._id)}><IconEye /></button>
                                    <button title="Edit" onClick={() => handleEdit(record._id)}><IconPencilPaper /></button>
                                    <button title="Gen AI" onClick={() => handleGenAi(record._id)}><IconCpuBolt /></button>
                                    {role === '1' && (
                                    <button title="Delete" onClick={() => handleDelete(record._id)}><IconTrashLines /></button>
                                    )}
                                    <button title='push' onClick={() => handlePush(record._id)}><IconLogout /></button>
                                </div>
                            ),
                        },
                    ]}
                    highlightOnHover
                    totalRecords={totalRecords} 
                    recordsPerPage={pageSize}
                    page={page}
                    onPageChange={handlePageChange}
                    recordsPerPageOptions={[5, 10, 15, 20]}
                    onRecordsPerPageChange={setPageSize}
                    sortStatus={sortStatus}
                    onSortStatusChange={setSortStatus}
                    paginationText={({ from, to, allPage }) => `Showing ${from} to ${to} of ${allPage} entries`}
                />
            </div>
            <ToastContainer />
        </div>
    );
};

export default ManageBlog;