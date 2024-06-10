
import './ListNovelPage.css'
import React, { useState, useEffect, useContext } from 'react';
import ReactPaginate from 'react-paginate';
import { Link, useSearchParams } from 'react-router-dom';
import NovelSidebar from '../../Components/NovelSidebar/NovelSidebar';
import { NovelContext } from '../../context/NovelContext';
import ListNovelService from '../../services/listnovel.s';
import { toast } from 'react-toastify';



function ListNovelPage(props) {
    const { pluginSources, searchValue, searchTarget } = useContext(NovelContext);

    const [totalPage, setTotalPage] = useState(1);
    const [isLoadingListNovelPage, setIsLoadingListNovelPage] = useState(true);

    const [novels, setNovels] = useState([]);

    const [searchParams, setSearchParams] = useSearchParams();
    const [curPage, setCurPage] = useState(1);
    const [curCategory, setCurCategory] = useState('');
    const [curSearchValue, setCurSearchValue] = useState();
    const [isHandlingSearchParams, setIsHandlingSearchParams] = useState(true);

    const handlePageClick = async (e) => {
        let selectedPage = parseInt(e.selected) + 1;
        setCurPage(selectedPage);
    }


    const fetchListNovelData = async () => {
        try {
            if (curSearchValue === '') {
                console.log("Cur search value is empty");
                return;
            }
            const response = await ListNovelService.fetchNovelListData(pluginSources[0].name, curSearchValue, searchTarget, curPage, curCategory);
            if (response && response.data && parseInt(response.statusCode) === 200) {
                setNovels(response.data);
                setTotalPage(response?.meta?.totalPage);
            } else {
                toast.error("Error fetching novel Info: " + response?.message);
            }
        } catch (error) {
            console.error("Error fetching novel Info: " + error.message);
        }
    }

    const fetchHottestData = async () => {
        try {
            const response = await ListNovelService.fetchHotNovels(pluginSources[0].name, curPage);
            if (response && response.data && parseInt(response.statusCode) === 200) {
                setNovels(response.data);
                setTotalPage(response?.meta?.totalPage);
            } else {
                toast.error("Error fetching novel Info: " + response?.message);
            }
        } catch (error) {
            console.error("Error fetching novel Info: " + error.message);
        }
    }

    const scrollToFrontList = () => {
        const frontList = document.querySelector('#yearRelease');
        if (frontList) {
            frontList.scrollIntoView({ behavior: 'smooth' })
        }
    }

    const handleChangeByParams = () => {
        setCurPage(searchParams.get('page') ?? 1);
        setCurCategory(searchParams.get('category') ?? '');

        console.log("searchValue: " + searchValue);
        if (searchValue && searchValue !== '') {
            setCurSearchValue(searchParams.get(searchTarget) ?? searchValue)
        }

        setIsHandlingSearchParams(false)
    }

    useEffect(() => {
        setIsHandlingSearchParams(true)
        handleChangeByParams();

    }, [searchTarget, searchParams, pluginSources[0]])

    useEffect(() => {
        if (isHandlingSearchParams === false) {
            if (curSearchValue) {
                fetchListNovelData();
            } else {
                fetchHottestData();
            }
            scrollToFrontList();

            setIsLoadingListNovelPage(false);
        }
    }, [isHandlingSearchParams, curPage, curSearchValue]);

    return (
        <div className='list-novel-page-container'> {isLoadingListNovelPage === true
            ? <h1 className='loading-message'>... Loading Data ...</h1>
            : <div className='list-novel-page-content'>
                <div className="filter-engine d-flex justify-content-between align-items-center my-3">
                    <div className="btn-group filter-button-list">
                        <div className="form-floating me-3">
                            <select defaultValue={"1"} className="form-select" id="yearRelease">
                                <option value="1">Tăng dần</option>
                                <option value="2">Giảm dần</option>
                            </select>
                            <label htmlFor="floatingSelectGrid">Tên truyện</label>
                        </div>
                        <div className="form-floating me-3">
                            <select defaultValue={"1"} className="form-select" id="yearRelease">
                                <option value="1">Mới nhất</option>
                                <option value="2">Cũ nhất</option>

                            </select>
                            <label htmlFor="floatingSelectGrid">Năm phát hành</label>
                        </div>
                        <div className="form-floating me-3">
                            <select defaultValue={"1"} className="form-select " id="Status">
                                <option value="1">Đang tiến hành</option>
                                <option value="2">Tạm ngưng</option>
                                <option value="3">Đã hoàn thành</option>

                            </select>
                            <label htmlFor="floatingSelectGrid">Tình trạng</label>
                        </div>
                        <div className="form-floating me-3 select-item">
                            <select defaultValue={"1"} className="form-select " id="ratingPoint">
                                <option value="1">Tăng dần</option>
                                <option value="2">Giảm dần</option>

                            </select>
                            <label htmlFor="floatingSelectGrid">Điểm đánh giá</label>
                        </div>

                    </div>
                </div>

                <div className='list-novel-page-main-container'>
                    <div className='novel-sublists'>
                        <div className='outstanding-sublist' id='outstanding-sublist'>

                            <div className='novel-sublist-row'>
                                {novels && novels?.length > 0
                                    ? novels.map((novel, index) => {
                                        return <div key={`novel-list-card-${index}`} className='novel-card'>
                                            <Link to={`/source/${pluginSources[0].name}/novel/${novel.slug}`}>
                                                <img className='' src={novel.cover} alt={`Ảnh bìa truyện ${novel.title}`} />
                                                <h6>{novel.title.length <= 30
                                                    ? novel.title
                                                    : `${novel.title.slice(0, 31) + ' ...'}`
                                                } </h6>
                                                <span>{novel.authors[0].name}</span>
                                            </Link>
                                        </div>
                                    })
                                    : <h3 className='mt-3'>Không tìm thấy kết quả nào !</h3>}
                            </div>
                        </div>
                    </div>
                </div>

                <ReactPaginate
                    containerClassName='pagination justify-content-center' //important
                    activeClassName='active'
                    breakLabel="..."
                    nextLabel="Sau >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    marginPagesDisplayed={2}
                    pageCount={totalPage}
                    previousLabel="< Trước"
                    pageClassName='page-item'
                    pageLinkClassName='page-link'
                    breakClassName='page-item'
                    breakLinkClassName='page-link'
                    previousClassName='page-item'
                    previousLinkClassName='page-link'
                    nextClassName='page-item'
                    nextLinkClassName='page-link'
                    renderOnZeroPageCount={null}
                />
            </div>
        }

            <NovelSidebar />
        </div>

    );
}

export default ListNovelPage;