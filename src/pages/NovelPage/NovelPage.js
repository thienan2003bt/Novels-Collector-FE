import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import DetailNovelService from '../../services/detailnovel.s';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import { NovelContext } from '../../context/NovelContext';
import ChapterStatusConverter from '../../utils/chapterStatusConverter';
import './NovelPage.css';
import HTMLToReactParser from '../../utils/htmlToReactParser';

function NovelPage(props) {
    const { novelSlug, sourceSlug } = useParams();
    const { setNovelContext } = useContext(NovelContext);

    const [isLoadingNovelPage, setIsLoadingNovelPage] = useState(true);
    const [novel, setNovel] = useState({});
    const [totalPage, setTotalPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewStars, setReviewStars] = useState([]);

    // Default max length of truncated description = 500
    const maxLengthTruncatedDescription = 500;

    const [novelDescription, setNovelDescription] = useState('');
    const [isSeeMoreDescription, setIsSeeMoreDescription] = useState(false);

    const handleSetNovelDescription = (description) => {
        let newNovelDescription = description;
        if (sourceSlug === "TruyenTangThuVienVn") {
            newNovelDescription = truncateNovelDescription(description);
        }

        setNovelDescription(newNovelDescription);
    }

    const handleSetReviewStars = (rating, maxRating) => {
        let ratingArr = [];

        for (let i = 1; i <= maxRating; i++) {
            ratingArr[i] = {
                className: "fa-regular fa-star",
                color: "#FFD43B",
            }
            const decisionPoint = parseFloat(parseFloat(rating) - i);
            if (decisionPoint >= 0) {
                ratingArr[i].className = "fa-solid fa-star";
            } else if (decisionPoint > -1) {
                ratingArr[i].className = "fa-regular fa-star-half-stroke";
            }
        }

        setReviewStars(ratingArr);
    }

    const fetchNovelInfo = async (source, slug) => {
        try {
            const response = await DetailNovelService.fetchDetailNovel(source, slug, currentPage);
            if (response && response.data && parseInt(response.statusCode) === 200) {
                response.data.source = response.meta.source;
                const newNovelInfo = handleConvertNovelStatusCode(response.data);
                setNovel(newNovelInfo);

                setTotalPage(parseInt(newNovelInfo.totalPage));
                setIsLoadingNovelPage(false);

                handleSetNovelDescription(newNovelInfo.description);

                handleSetReviewStars(newNovelInfo.rating, newNovelInfo.maxRating);
                setNovelContext(newNovelInfo);
            } else {
                toast.error("Error fetching novel Info: " + response?.message);
            }
        } catch (error) {
            console.error("Error fetching novel Info: " + error.message);
        }
    }

    const handleConvertNovelStatusCode = (newNovel) => {
        return {
            ...newNovel,
            status: ChapterStatusConverter.convertCodeToStatus(newNovel.status)
        }
    }

    const handlePageClick = async (e) => {
        let selectedPage = parseInt(e.selected) + 1;
        setCurrentPage(selectedPage);
    }

    const truncateNovelDescription = (desc) => {
        const truncatedDesc = HTMLToReactParser.truncateHtml(desc, maxLengthTruncatedDescription);
        return truncatedDesc;
    }

    useEffect(() => {
        fetchNovelInfo(sourceSlug, novelSlug);
    }, [currentPage]);

    return (
        <div className='novel-page-container'>
            {isLoadingNovelPage ? (
                <h1 className='loading-message'>... Loading Data ...</h1>
            ) : (
                <>
                    {novel && novel.cover && (
                        <>
                            <div className="row w-100">
                                <div className="col-md-4 mt-2">
                                    <img className='novel-img' src={novel?.cover} alt={`${novel?.title} thumbnail`} />
                                </div>
                                <div className="col-md-8 text-start px-0">
                                    <div className="pb-4 border-bottom border-white-50">
                                        <h2 className="text-white fw-bold mb-1">{novel?.title}</h2>
                                        <div className="d-flex">
                                            <div className="d-flex align-items-center mr-3">
                                                <span className="text-white-50 me-1">Đánh giá: {novel?.rating}/{novel?.maxRating}</span>
                                                <div className="d-flex align-items-center">
                                                    {reviewStars && reviewStars.length > 0 && reviewStars.map((ele, index) => (
                                                        <i
                                                            key={`review-star-${index}`}
                                                            className={ele.className}
                                                            style={{ color: ele.color }}
                                                        ></i>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 row">
                                            <div className="col">
                                                <p className="text-white fw-bold mb-1">Tác giả</p>
                                                {novel.authors && novel.authors.length > 0 && novel.authors.map((author, index) => (
                                                    <span key={index}>{author.name}{index < novel.authors.length - 1 ? ', ' : ''}</span>
                                                ))}
                                            </div>
                                            <div className="col">
                                                <p className="text-white fw-bold mb-1">Thể loại</p>
                                                {novel.categories && novel.categories.length > 0 && novel.categories.map((category, index) => (
                                                    <span key={index}>{category.title}{index < novel.categories.length - 1 ? ', ' : ''}</span>
                                                ))}
                                            </div>
                                            <div className="col">
                                                <p className="text-white fw-bold mb-1">Nguồn truyện</p>
                                                <span>{sourceSlug}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-0">
                                        <h5 className="text-white fw-bold mt-3 mb-2">Giới thiệu</h5>
                                        <div className="text-white mt-0 novel-description">
                                            {isSeeMoreDescription ? novelDescription : novelDescription.slice(0, maxLengthTruncatedDescription) + ' ...'}
                                        </div>
                                        <button className='btn btn-secondary my-2' onClick={() => setIsSeeMoreDescription(!isSeeMoreDescription)}>
                                            {isSeeMoreDescription ? "Thu gọn" : "Xem thêm"}
                                        </button>
                                    </div>
                                    <h5 className="text-white fw-bold mt-3 mb-2">Danh sách chương</h5>
                                    <div className="list-group scrollable-list-group mt-3 border border-dark border-4 mb-4 round-pill">
                                        {novel.chapters && novel.chapters.length > 0 && novel.chapters.map((chapter, index) => (
                                            <Link
                                                to={`/source/${sourceSlug}/novel/${novelSlug}/chapter/${chapter.slug}`}
                                                className="list-group-item list-group-item-action border border-double"
                                                key={`novel-chapter-${index}`}
                                            >
                                                <strong>{chapter.title}</strong>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <ReactPaginate
                                containerClassName='pagination justify-content-center'
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
                        </>
                    )}
                </>
            )}
        </div>
    );
}

export default NovelPage;
