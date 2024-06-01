import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import NovelService from '../../services/detailNovel.s';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
function NovelPage(props) {


    const { novelID } = useParams();
    const defaultNovel = {
        title: `Mushoku Tensei - Old Dragon's Tale`,
        cover: 'https://scontent.fsgn4-1.fna.fbcdn.net/v/t39.30808-6/311151454_441803738051212_5345550456087243642_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGcq4yB9NvQ5r0ZeDkS8a4zKw6RxbcPf9MrDpHFtw9_0_6QJkJDdbsRmH2GnS0a0SWzzOOn1nKRiJ2UEr_cgHZ0&_nc_ohc=fmkLaF8s1-UQ7kNvgFfhqXR&_nc_ht=scontent.fsgn4-1.fna&oh=00_AYDv9FvVwJIMDxxAwNMsYxyMKqQgdZTnAb9c6y5uzCW7Ew&oe=6659FA4D',
        rating: 7.0,
        authors: [{
            name: 'Tac gia 1',
        },
        {
            name: 'Tac gia 2',
        },
        {
            name: 'Tac gia 3',
        },
        {
            name: 'Tac gia 4',
        },
        ],
        categories: [{
            name: 'The loai 1',
        },
        {
            name: 'The loai 2',
        },
        {
            name: 'The loai 3',
        },
        {
            name: 'The loai 4',
        },
        ],
        updatedAt: Date.now(),
        chapters: [{
            slug: 'phong-luu-diem-hiep-truyen-ky',
            title: 'Chương 1'
        },
        {
            slug: 'phong-luu-diem-hiep-truyen-ky',
            title: 'Chương 2'
        },
        {
            slug: 'phong-luu-diem-hiep-truyen-ky',
            title: 'Chương 3'
        },
        {
            slug: 'phong-luu-diem-hiep-truyen-ky',
            title: 'Chương 4'
        },
        ],
        description: 'Thong tin mo ta'
    }

    const [totalPage, setTotalPage] = useState(5);
    const handlePageClick = async () => {
        // TODO: replace this with calling API from server
    }

    const [novel, setNovel] = useState(defaultNovel);
    const fetchNovelInfo = async (source, slug) => {
        try {
            const response = await NovelService.fetchDetailNovel(source, slug);
            if (response && response.data && parseInt(response.statusCode) === 200) {
                console.log("Novel id: " + response.data.id);
                console.log(response.data);
                setNovel(response.data);
            } else {
                toast.error("Error fetching novel Info: " + response?.message);
            }
        } catch (error) {
            console.error("Error fetching novel Info: " + error.message);
        }
    }


    useEffect(() => {
        fetchNovelInfo('PluginCrawlTruyenFull', 'phong-luu-diem-hiep-truyen-ky');
    }, []);

    return (
        <div className='novel-page-container'>
            {novel &&
                <>
                    <div className="row">
                        <div className="col-md-4 mt-2">
                            <img width={300} src={novel.cover} alt={`${novel.title} thumbnail`} />
                        </div>
                        <div className="col-md-8 text-start">
                            <h4>{novel.title}</h4>

                            <span className="fw-bold">Tác giả: </span>
                            {novel.authors.map((author, index) => (
                                <span key={index}>{author.name}{index < novel.authors.length - 1 ? ', ' : ''}</span>
                            ))}
                            <br></br>
                            <span className="fw-bold">Thể loại: </span>
                            {novel.categories.map((category, index) => (
                                <span key={index}>{category.name}{index < novel.categories.length - 1 ? ', ' : ''}</span>
                            ))}
                            <br></br>
                            <span className="fw-bold">Điểm đánh giá: {novel.rating}</span>
                            <p>{novel.description}</p>
                            <button className='btn btn-primary'>
                                <Link to='/novel/1/chapter/10'>Đọc ngay</Link>
                            </button>
                        </div>
                    </div>

                    <h5>Danh sách chương</h5>
                    <div className="chapter-table-container">
                        <table className="table table-bordered border-secondary table-hover table-striped chapter-table">
                            <thead className="table-primary">
                                <tr>
                                    <th>ID</th>
                                    <th>Nội dung</th>
                                </tr>
                            </thead>
                            <tbody className="table-striped">
                                {novel.chapters.map((chapter, index) => (
                                    <tr >
                                        <th scope="row"><a href="/detailactor/">{chapter.slug}</a></th>
                                        <td>{chapter.title}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <ReactPaginate
                        containerClassName='pagination justify-content-center' //important
                        activeClassName='active'
                        breakLabel="..."
                        nextLabel="Next ->"
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={5}
                        marginPagesDisplayed={2}
                        pageCount={totalPage}
                        previousLabel="<- Previous"
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
                    <table className="table table-bordered border-secondary table-hover table-striped chapter-table">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Nội dung</th>
                            </tr>
                        </thead>
                        <tbody className="table-striped">
                            {novel.chapters && novel.chapters.map((chapter, index) => (
                                <tr key={`novel-chapter-${index}`}>
                                    <td>{chapter.title}</td>
                                    <th scope="row"><Link to={`/novel/1/chapter/${index}`}>{chapter.slug}</Link></th>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <ReactPaginate
                        containerClassName='pagination justify-content-center' //important
                        activeClassName='active'
                        breakLabel="..."
                        nextLabel="Next ->"
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={5}
                        marginPagesDisplayed={2}
                        pageCount={totalPage}
                        previousLabel="<- Previous"
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
            }
        </div>
    );
}

export default NovelPage;