import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import BreadCrumbGenerator from '../../utils/breadCrumbGenerator';
import _ from 'lodash';
import { NovelContext } from '../../context/NovelContext';

import './BreadCrumb.css';

function BreadCrumb(props) {
    const urlPath = useLocation().pathname;
    const separator = '>';

    const { novelContext, chapterContext } = useContext(NovelContext);

    const defaultSubsetOfPath = BreadCrumbGenerator.convertPathToBreadCrumb(urlPath);
    const [subsetOfPath, setSubsetOfPath] = useState(defaultSubsetOfPath);


    const updateBreadcrumb = (title = 'Truyện', newName) => {
        const originalTitle = title;
        let newSubSetOfPath = subsetOfPath.map(x => x);
        newSubSetOfPath = newSubSetOfPath?.map(segment => {
            if (segment?.title === originalTitle) {
                return {
                    ...segment,
                    name: String(newName),
                }
            }

            return segment;
        })

        setSubsetOfPath(newSubSetOfPath);
    }

    useEffect(() => {
        updateBreadcrumb('Truyện', novelContext?.title);
    }, [novelContext])

    useEffect(() => {
        updateBreadcrumb('Chương', chapterContext?.title);
    }, [chapterContext])

    return (
        <div className='app-breadcrumb'>
            <Link to="/">
                Trang chủ
            </Link>
            {subsetOfPath && subsetOfPath.length > 0 &&
                <Fragment>
                    <span className='breadcrumb-separator px-2'>{separator}</span>

                    {subsetOfPath.map((ele, index) => {
                        return <Fragment key={`breadcrumb-num-${index}`} >
                            <Link to={ele.path}>
                                <span>{ele.title}</span>
                                {ele.name.length > 0 &&
                                    <span>: {ele.name}</span>
                                }
                            </Link>

                            {index < subsetOfPath.length - 1 &&
                                <span className='breadcrumb-separator px-2'>{separator}</span>
                            }
                        </Fragment>
                    })
                    }
                </Fragment>
            }
        </div>
    );
}

export default BreadCrumb;