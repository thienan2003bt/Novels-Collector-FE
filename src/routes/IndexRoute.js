import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import HomePage from '../pages/HomePage/HomePage';
import ListNovelPage from '../pages/ListNovelPage/ListNovelPage';
import AdminPage from '../pages/AdminPage/AdminPage';
import PageNotFound from '../pages/PageNotFound/PageNotFound';
import NovelPage from '../pages/NovelPage/NovelPage';
import NovelChapterPage from '../pages/NovelChapterPage/NovelChapterPage';
import LoginPage from '../pages/LoginPage/LoginPage';
import SourceManagementPage from '../pages/SourceManagementPage/SourceManagementPage';
import PrivateRoute from './PrivateRoute';
function IndexRoute(props) {
    return (
        <Routes>
            {/* Public */}
            <Route path='/' element={<HomePage />} />
            <Route path='/novel-list' element={<ListNovelPage />} />
            {/* <Route path='/novel' element={<NovelPage />} /> */}
            <Route path='/novel/:novelSlug' element={<NovelPage />} />
            <Route path='/novel/:novelSlug/chapter/:chapterSlug' element={<NovelChapterPage />} />

            {/* Private */}
            <Route path='/login/' element={<LoginPage />} />
            <Route path='/admin/' element={<AdminPage />} />
            <Route path='/admin/source' element={<SourceManagementPage />} />


            {/* TODO: Fix it when complete login feature */}
            <Route path="/admin/:adminID" element={<PrivateRoute>
                <AdminPage />
            </PrivateRoute>}
            />

            {/* Not Found */}
            <Route path='*' element={<PageNotFound />} />
        </Routes>
    );
}

export default IndexRoute;