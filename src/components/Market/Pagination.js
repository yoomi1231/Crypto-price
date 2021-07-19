import React from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 20px;
`;

const PageButton = styled.button`
    background: #fff;
    padding: 10px;
    color: blue;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.4);
    margin: 0 10px;
    cursor: pointer;
    border: none;
`;

const ActiveButton = styled.button`
    background: #fff;
    padding: 10px;
    color: blue;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.4);
    margin: 0 10px;
    border: 1px solid blue;
`;

const Pagination = ({ pageLimit, currentPage, updateCurrentPage }) => {
    // const [pages, setPages] = useState(Math.round(data.length / dataLimit));

    function goToNextPage() {
        updateCurrentPage((page) => page + 1);
    }

    function goToPreviousPage() {
        updateCurrentPage((page) => page - 1);
    }

    function goToFirstPage() {
        updateCurrentPage(1);
    }

    const changePage = (event) => {
        const pageNumber = Number(event.target.textContent);
        updateCurrentPage(pageNumber);
    };

    const getPaginationGroup = () => {
        let start = Math.floor((currentPage - 1) / pageLimit) * pageLimit;
        return new Array(pageLimit).fill().map((_, idx) => start + idx + 1);
    };

    return (
        <Container>
                {
                    currentPage  > 10 &&
                        <div>
                            <PageButton onClick={goToFirstPage}>First</PageButton>
                            <PageButton onClick={goToPreviousPage}>Prev</PageButton>

                        </div>
                }
        
                {getPaginationGroup().map((item, index) => {
                    const Comp = currentPage === item ? ActiveButton : PageButton;
                    return (
                        <Comp key={index} onClick={changePage}>
                            <span>{item}</span>
                        </Comp>
                    );
                })}  
            <PageButton onClick={goToNextPage}>Next</PageButton>
        </Container>
    );
};

export default Pagination;
