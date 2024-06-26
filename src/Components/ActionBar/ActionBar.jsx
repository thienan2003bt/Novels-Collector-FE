import { Link } from 'react-router-dom'
import { React, useState } from 'react';
import ChapterPageSideBar from '../ChapterPageSideBar/ChapterPageSideBar'
import ToolbarModal from '../ToolbarModal/ToolbarModal';
import './ActionBar.scss'

export default function Action({ isDisabledSiblingChapter, handleSiblingChapterClick, novelName, novelPoster, novelAuthor, chapterList, sourceSlug, novelSlug, curChapterSlug, onConfirmToolbarModal }) {

    const [showSideBar, setShowSideBar] = useState(false);
    const handleViewInformaton = () => {
        setShowSideBar(!showSideBar);
    }

    const [showModalEdit, setModalEdit] = useState(false);
    const handleModalEdit = () => {
        setModalEdit(!showModalEdit);
    }

    const [isShowToolbarModal, setIsShowToolbarModal] = useState(false);

    const handleCloseToolbarModal = () => setIsShowToolbarModal(false);

    const handleOnChangeToolbarModal = (newStyleSettings) => {
        // TODO: implement this
        onConfirmToolbarModal(newStyleSettings);
    }

    return (
        <div className="actionbar">
            <button className="actionbar-icon" disabled={isDisabledSiblingChapter.previous} onClick={() => handleSiblingChapterClick(-1)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="svg-icon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061A1.125 1.125 0 0 1 21 8.689v8.122ZM11.25 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061a1.125 1.125 0 0 1 1.683.977v8.122Z" />
                </svg>
            </button>
            <Link to='/' className="actionbar-icon" style={{ textDecoration: 'none', color: 'inherit' }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="svg-icon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
            </Link>
            <button className="actionbar-icon" onClick={() => setIsShowToolbarModal(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="svg-icon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
            </button>

            <button className="actionbar-icon"
                data-bs-toggle="offcanvas" data-bs-target="#offcanvasLeft" aria-controls="offcanvasLeftLabel"
                onClick={handleViewInformaton}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="svg-icon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>

            </button>
            <button className="actionbar-icon" disabled={isDisabledSiblingChapter.next} onClick={() => handleSiblingChapterClick(1)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="svg-icon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z" />
                </svg>
            </button>
            <ChapterPageSideBar
                handleSiblingChapterClick={handleSiblingChapterClick}
                novelName={novelName}
                novelPoster={novelPoster}
                novelAuthor={novelAuthor}
                chapterList={chapterList}
                sourceSlug={sourceSlug}
                novelSlug={novelSlug}
                curChapterSlug={curChapterSlug}
            />
            <ToolbarModal show={isShowToolbarModal} handleClose={handleCloseToolbarModal} onConfirm={handleOnChangeToolbarModal} />

        </div>
    );
}