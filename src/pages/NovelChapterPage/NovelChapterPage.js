import React, { Fragment, useContext, useEffect, useState } from 'react';
import ChapterService from '../../services/chapter.s';

import './NovelChapterPage.css'
import { toast } from 'react-toastify';
import { NovelContext } from '../../context/NovelContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ChapterStatusConverter from '../../utils/chapterStatusConverter';
import DetailNovelService from '../../services/detailnovel.s';
import PluginSourcePerpageGetter from '../../utils/pluginSourcePerpageGetter';
import { UserContext } from '../../context/UserContext';
import UserLatestNovelGetter from '../../utils/localStorage/userLatestNovelGetter';
import ActionBar from '../../Components/ActionBar/ActionBar';

function NovelChapterPage(props) {
    const navigate = useNavigate();

    const { novelSlug, chapterSlug, sourceSlug } = useParams();

    const { novelContext, setNovelContext, chapterContext, setChapterContext } = useContext(NovelContext);
    const { setUserLatestNovels } = useContext(UserContext);

    const defaultPerpage = PluginSourcePerpageGetter.getChaptersPerpageByPluginSource(sourceSlug);
    const [perpage, setPerpage] = useState(defaultPerpage);
    const [totalPage, setTotalPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(parseInt(novelContext?.page ?? 1));

    const [chapterID, setChapterID] = useState(chapterContext?.number ?? 0);
    const [isChapterIDFetched, setIsChapterIDFetched] = useState(false);
    const [curChapterSlug, setCurChapterSlug] = useState(chapterSlug);



    const defaultIsDisabledSiblingChapter = {
        previous: false,
        next: false
    }
    const [isDisabledSiblingChapter, setDisabledSiblingChapter] = useState(defaultIsDisabledSiblingChapter);

    const [novelChapter, setChapterContent] = useState({});
    const [isLoadingNovelChapterPage, setIsLoadingNovelChapterPage] = useState(true);

    const fetchNovelInfo = async (source, slug) => {
        try {
            const response = await DetailNovelService.fetchDetailNovel(source, slug, currentPage);
            if (response && response.data && parseInt(response.statusCode) === 200) {
                const newNovelInfo = handleConvertNovelStatusCode(response.data);
                updateRelatedData(newNovelInfo)
            } else {
                toast.error("Error fetching novel Info: " + response?.message);
            }
        } catch (error) {
            console.error("Error fetching novel Info: " + error.message);
        }
    }

    const fetchChapterList = async (source = sourceSlug, slug = novelSlug, page = currentPage) => {
        try {
            const response = await DetailNovelService.fetchChapterList(source, slug, page);
            if (response && response.data && parseInt(response.statusCode) === 200) {
                const newNovelInfo = {
                    ...novelContext,
                    chapters: response.data,
                    page: response.meta.page,
                    totalPage: response.meta.totalPage,
                }

                updateRelatedData(newNovelInfo);
                return newNovelInfo;
            } else {
                toast.error("Error fetching novel Info: " + response?.message);
            }
        } catch (error) {
            console.error("Error fetching novel Info: " + error.message);
        }
    }

    const getChapterIDFromChapterListIndex = (index, newNovelInfo = novelContext) => {
        return index += parseInt(parseInt(newNovelInfo.page) - 1) * parseInt(perpage);
    }

    const saveNovelToUserLatestNovels = (newNovel) => {
        if (!newNovel || !newNovel?.slug) {
            return;
        }

        let chapterNumber = newNovel?.chapters?.find(chapter => chapter.slug === curChapterSlug)?.number;
        const newUserLatestNovels = UserLatestNovelGetter.saveNovelToUserStorage({
            ...newNovel,
            source: sourceSlug,
            chapterID: chapterID,
            chapterSlug: curChapterSlug,
            chapterNumber: chapterNumber,
        });
        if (!newUserLatestNovels) {
            toast.error('Số lượng truyện được lưu đã vượt quá cho phép !')
            return;
        }
        setUserLatestNovels(newUserLatestNovels);
    }

    const updateRelatedData = (newNovelInfo) => {
        // KEY UPDATE
        setNovelContext(newNovelInfo);

        // NON-KEY UPDATE
        const newPage = newNovelInfo?.page;
        if (parseInt(newPage) !== parseInt(currentPage)) {
            setCurrentPage(newNovelInfo?.page);
        }
        setIsLoadingNovelChapterPage(false);
        saveNovelToUserLatestNovels(newNovelInfo);


        if (!totalPage || parseInt(totalPage) !== parseInt(newNovelInfo?.chapters?.length)) {
            setTotalPage(parseInt(newNovelInfo.totalPage));
        }

        let newChapterID = newNovelInfo?.chapters?.findIndex((chapter, index) => chapter.slug === chapterSlug);
        if (newChapterID === -1) {
            return;
        }
        newChapterID = getChapterIDFromChapterListIndex(newChapterID, newNovelInfo);

        if (chapterID !== newChapterID) {
            setChapterID(newChapterID);
            saveNovelToUserLatestNovels(novelContext);
        }

        if (parseInt(newPage) !== parseInt(currentPage)) {
            setCurrentPage(newPage);
        }


        if (!perpage || parseInt(perpage) !== parseInt(newNovelInfo?.chapters?.length)) {
            setPerpage(parseInt(newNovelInfo?.chapters?.length))
        }
        setDisabledStatusForSiblingChapters(newChapterID, newNovelInfo, newPage);
    }

    const handleConvertNovelStatusCode = (newNovel) => {
        return {
            ...newNovel,
            status: ChapterStatusConverter.convertCodeToStatus(newNovel.status)
        }
    }

    const fetchChapterContent = async () => {
        try {
            const response = await ChapterService.fetchChapterContent(sourceSlug, novelSlug, curChapterSlug);
            if (response && response.data && parseInt(response.statusCode) === 200) {
                setChapterContent(response.data);
                toast.success(response.message);
                let newChapterData = {
                    ...response.data,
                    ...response.meta,
                    content: '',
                };

                let newChapterIndex = novelContext?.chapters?.findIndex(novel => novel.slug === response?.meta?.chapterSlug);
                let newChapterID = response.data.number;
                if (newChapterIndex !== undefined && newChapterIndex !== -1) {
                    newChapterID = getChapterIDFromChapterListIndex(newChapterIndex, novelContext);
                }

                console.log("CHAPTER ID AFTER FETCH CHAPTER CONTENT: " + newChapterID);

                const newPage = Math.floor(newChapterID / perpage + 1);
                if (parseInt(newPage) !== parseInt(currentPage)) {
                    setCurrentPage(newPage);
                }
                setChapterContext(newChapterData);


                saveNovelToUserLatestNovels(novelContext);
                setDisabledStatusForSiblingChapters(newChapterID, novelContext, newPage);
            } else {
                toast.error("Error fetching chapter content: " + response?.message);
            }
        } catch (error) {
            console.error("Error fetching chapter content: " + error.message);
            toast.error(error.message);
        }

    }

    const setDisabledStatusForSiblingChapters = (chapterIndex = chapterID, newNovelInfo = novelContext, curPage = currentPage) => {

        const totalpage = newNovelInfo?.totalPage ?? totalPage;

        const previousStatus = checkIfChapterIDInList(chapterIndex - 1, newNovelInfo);
        const nextStatus = checkIfChapterIDInList(chapterIndex + 1, newNovelInfo);
        const newDisabledStatusForSiblingChapters = {
            previous: (curPage === 1 && previousStatus === false) ? true : false,
            next: (curPage === totalpage && nextStatus === false) ? true : false,
        }

        setDisabledSiblingChapter(newDisabledStatusForSiblingChapters);
    }

    const checkIfChapterIDInList = (chapterID, novelInfo = novelContext) => {
        if (!novelInfo?.chapters) {
            return true;
        }
        const existingChapter = novelInfo?.chapters?.find((novel, index) => {
            const novelChapterIndex = getChapterIDFromChapterListIndex(index, novelInfo);
            return novelChapterIndex === parseInt(chapterID) ? true : false;
        });

        return existingChapter ? true : false;
    }

    const handleSiblingChapterClick = async (increment) => {

        const siblingChapterID = parseInt(parseInt(chapterID) + increment);
        try {
            let newNovelContext = {
                chapters: novelContext.chapters.map((novel => novel)),
                page: novelContext.page,
            }

            if (checkIfChapterIDInList(siblingChapterID, newNovelContext) === false) {
                console.log("Chapter not found in current page");
                console.log("Fetch for page: " + parseInt(currentPage + increment));
                newNovelContext = await fetchChapterList(sourceSlug, novelSlug, parseInt(currentPage + increment));
            }

            const siblingChapter = newNovelContext?.chapters?.find((novel, index) => {
                return getChapterIDFromChapterListIndex(index, newNovelContext) === parseInt(siblingChapterID);
            });
            console.log("Sibling chapter: ");
            console.log(siblingChapter);
            const newChapterSlug = siblingChapter?.slug;


            setCurChapterSlug(newChapterSlug);
            setChapterID(siblingChapterID);

            navigate(`/source/${sourceSlug}/novel/${novelSlug}/chapter/${newChapterSlug}`)
        } catch (error) {
            console.error("Error fetching new chapter list: " + error.message);
        }
    }

    const scrollToFrontList = () => {
        const frontList = document.querySelector('#novel-chapter-container');
        if (frontList) {
            frontList.scrollIntoView({ behavior: 'smooth' })
        }
    }

    useEffect(() => {
        console.log(`Calling fetching chapter content for id ${chapterID} and slug: ${curChapterSlug}`);
        fetchChapterContent();

        scrollToFrontList();
        setIsChapterIDFetched(true);
    }, [chapterID, curChapterSlug])

    useEffect(() => {
        if (isChapterIDFetched === true) {
            fetchNovelInfo(sourceSlug, novelSlug);
        }
    }, [currentPage, isChapterIDFetched])

    return (
        <div className='novel-chapter-page-container'>
            {isLoadingNovelChapterPage === true
                ? <h1 className='loading-message'>... Loading Data ...</h1>
                : <Fragment >
                    <h3 id='novel-chapter-container'>{novelContext.title}</h3>
                    <h5 >Chương {novelChapter.number} {novelChapter.title}</h5>
                    <h5>Đánh giá: {novelContext.rating} / {novelContext.maxRating}
                        <span> - </span>
                        Tác giả: {novelContext.authors[0]?.name}
                        <span> - </span>
                        Trạng thái: {novelContext.status}</h5>
                    <span className='d-none'>Trang: {currentPage} / {totalPage}</span>
                    <div className='novel-chapter-content-container'>

                        {novelChapter.content && novelChapter.content.length > 0 &&
                            <div key={`content-chapter-${chapterSlug}`} dangerouslySetInnerHTML={{ __html: novelChapter.content }}></div>
                        }
                    </div>

                    <div className='novel-chapter-footer-navigator'>
                        <button className='btn btn-secondary previous-chapter-btn'
                            disabled={isDisabledSiblingChapter.previous} onClick={() => handleSiblingChapterClick(-1)}>
                            <i className="fa-solid fa-arrow-left-long"></i>
                            <span className='ps-3'>Trước</span>
                        </button>
                        <button className='btn btn-secondary home-btn'>
                            <i className="fa-solid fa-house-user"></i>
                            <span className='ps-3'>Trang chủ</span>
                        </button>
                        <button className='btn btn-secondary next-chapter-btn'
                            disabled={isDisabledSiblingChapter.next} onClick={() => handleSiblingChapterClick(1)}>
                            <span className='pe-3'>Sau</span>
                            <i className="fa-solid fa-arrow-right-long"></i>
                        </button>
                    </div>
                </Fragment>}
            <ActionBar 
             isDisabledSiblingChapter={isDisabledSiblingChapter} 
             handleSiblingChapterClick={handleSiblingChapterClick} 
            />

        </div >
    );
}

export default NovelChapterPage;