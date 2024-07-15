import React, { useState, useEffect } from 'react'
import { FiEdit, FiTrash, FiPlus, FiChevronLeft, FiChevronRight, FiSkipBack, FiSkipForward } from 'react-icons/fi'

const BanksTable = ({banksList, adminsList, bannersList, productList, onAdd, onEdit, onDelete}) => {
    
    //adicionando páginas à tabela:

    const [filter, setFilter] = useState('')
    const [filteredItems, setFilteredItems] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(15) // Number of items per page

    const getAdminName = (adqCodigo, adminsList) => {
        const admin = adminsList.find(admin => admin.codigoAdquirente === adqCodigo)
        return admin ? admin.nomeAdquirente : 'Desconhecido'
    }

    const getBannerName = (banCodigo, bannersList) => {
        const banner = bannersList.find(banner => banner.codigoBandeira === banCodigo)
        return banner ? banner.descricaoBandeira : 'Desconhecido'
    }

    const getProductDescription = (prodCodigo, productList) => {
        const product = productList.find(product => product.codigoProduto === prodCodigo)
        return product ? product.descricaoProduto : 'Desconhecido'
    }

    useEffect(() => {
        setFilteredItems(banksList); // Initialize with all items
    }, [banksList]);

    useEffect(() => {
        setCurrentPage(1); // Reset page to 1 when filter changes
        filterItems();
    }, [filter]);

    // Change page functions
    const goToPrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1)) // Decrease page by 1, minimum page is 1
    }

    const goToNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(banksList.length / itemsPerPage))) // Increase page by 1, maximum page is calculated based on array length
    }

    const goToFirstPage = () => {
        setCurrentPage(1) // Go to the first page
    }

    const goToLastPage = () => {
        setCurrentPage(Math.ceil(filteredItems.length / itemsPerPage)) // Go to the last page
    }

    // Calculate indexes for pagination
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem)
    
        const filterItems = () => {
            if (filter === '') {
                setFilteredItems(banksList);
            } else {
                const filtered = banksList.filter(item =>
                    item.BANCO.toLowerCase().includes(filter.toLowerCase()) ||
                    item.AGENCIA.toLowerCase().includes(filter.toLowerCase()) ||
                    item.CONTA.toLowerCase().includes(filter.toLowerCase()) ||
                    getAdminName(item.ADQCODIGO, adminsList).toLowerCase().includes(filter.toLowerCase()) ||
                    getBannerName(item.BADCODIGO, bannersList).toLowerCase().includes(filter.toLowerCase()) ||
                    getProductDescription(item.PROCODIGO, productList).toLowerCase().includes(filter.toLowerCase()) ||
                    item.SUPCODIGO.toString().toLowerCase().includes(filter.toLowerCase()) ||
                    item.CODIGOESTABELECIMENTO.toString().toLowerCase().includes(filter.toLowerCase()) ||
                    item.CLICODIGO.toString().toLowerCase().includes(filter.toLowerCase()) ||
                    item.CLDCODIGO.toString().toLowerCase().includes(filter.toLowerCase()) ||
                    item.CODIGO.toString().toLowerCase().includes(filter.toLowerCase())
                );
                setFilteredItems(filtered);
            }
        };
    
        return (
            <>
                <div>
                    <input
                        type="text"
                        placeholder="Digite para Filtrar..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        style={{ marginBottom: '10px' }}
                    />
                </div>
                <div className='table-wrapper table-wrapper-taxes'>
                    <table className="table table-striped table-hover table-bordered table-bancos det-table-global">
                        <thead>
                            <tr className='det-tr-top-global'>
                                <th className='det-th-global' scope="col" style={{ width: '2%', textAlign: 'center' }}>
                                    <button className="btn btn-primary btn-global" style={{ width: '100%' }} onClick={onAdd}>
                                        <FiPlus size={25} className="icon" />
                                    </button>
                                </th>
                                <th className='det-th-global' scope="col" style={{ textAlign: 'center', minWidth: '150px' }}>Banco</th>
                                <th className='det-th-global' scope="col" style={{ textAlign: 'center', minWidth: '150px' }}>Agencia</th>
                                <th className='det-th-global' scope="col" style={{ textAlign: 'center', minWidth: '150px' }}>Conta</th>
                                <th className='det-th-global' scope="col" style={{ textAlign: 'center', minWidth: '150px' }}>Adquirente</th>
                                <th className='det-th-global' scope="col" style={{ textAlign: 'center', minWidth: '150px' }}>Bandeira</th>
                                <th className='det-th-global' scope="col" style={{ textAlign: 'center', minWidth: '150px' }}>Produto</th>
                                <th className='det-th-global' scope="col" style={{ textAlign: 'center', minWidth: '150px' }}>Subproduto</th>
                                <th className='det-th-global' scope="col" style={{ textAlign: 'center', minWidth: '150px' }}>Cod Estab.</th>
                                <th className='det-th-global' scope="col" style={{ textAlign: 'center', minWidth: '150px' }}>Cod Cli</th>
                                <th className='det-th-global' scope="col" style={{ textAlign: 'center', minWidth: '150px' }}>Cod Cli Adq</th>
                                <th className='det-th-global' scope="col" style={{ textAlign: 'center', minWidth: '150px' }}>ID</th>
                                <th className='det-th-global' scope="col" style={{ width: '2%', textAlign: 'center' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length > 0 &&
                                currentItems.map((object, index) => (
                                    <tr key={index} className="det-tr-global tr-bancos">
                                        <th scope="row" style={{ textAlign: 'center' }} onClick={() => { onEdit(object, index) }}>
                                            <FiEdit className="icon" />
                                        </th>
                                        <td className="det-td-vendas-global" data-label="banco">{object.BANCO}</td>
                                        <td className="det-td-vendas-global" data-label="agencia">{object.AGENCIA}</td>
                                        <td className="det-td-vendas-global" data-label="conta">{object.CONTA}</td>
                                        <td className="det-td-vendas-global" data-label="adquirente">{getAdminName(object.ADQCODIGO, adminsList)}</td>
                                        <td className="det-td-vendas-global" data-label="bandeira">{getBannerName(object.BADCODIGO, bannersList)}</td>
                                        <td className="det-td-vendas-global" data-label="produto">{getProductDescription(object.PROCODIGO, productList)}</td>
                                        <td className="det-td-vendas-global" data-label="subproduto">{object.SUPCODIGO}</td>
                                        <td className="det-td-vendas-global" data-label="codigoEstabelecimento">{object.CODIGOESTABELECIMENTO}</td>
                                        <td className="det-td-vendas-global" data-label="codigoCliente">{object.CLICODIGO}</td>
                                        <td className="det-td-vendas-global" data-label="codigoClienteAdquirente">{object.CLDCODIGO}</td>
                                        <td className="det-td-vendas-global" data-label="ID">{object.CODIGO}</td>
                                        <th scope="row" style={{ textAlign: 'center' }} onClick={() => onDelete(object)}>
                                            <FiTrash className="icon" />
                                        </th>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
                <hr className='hr-global'/>
                {filteredItems.length > itemsPerPage && (
                    <div className="container-btn-pagina">
                        <button
                            className='btn btn-primary btn-global btn-skip'
                            onClick={goToFirstPage}
                            disabled={currentPage === 1} // Disable if already on the first page
                        >
                            <FiSkipBack />
                        </button>
                        <button
                            className='btn btn-primary btn-global btn-navigate'
                            onClick={goToPrevPage}
                            disabled={currentPage === 1} // Disable if it's the first page
                        >
                            <FiChevronLeft/> {/* Left arrow */}
                        </button>
                        <div className='pagina-atual'>
                            <span className='texto-paginacao'>Página </span>
                            <span className='texto-paginacao'>{currentPage}</span>
                        </div>
                        <button
                            className='btn btn-primary btn-global btn-navigate'
                            onClick={goToNextPage}
                            disabled={currentPage === Math.ceil(banksList.length / itemsPerPage)} // Disable if it's the last page
                        >
                            <FiChevronRight/> {/* Right arrow */}
                        </button>
                        <button
                            className='btn btn-primary btn-global btn-skip'
                            onClick={goToLastPage}
                            disabled={currentPage === Math.ceil(banksList.length / itemsPerPage)} // Disable if already on the last page
                        >
                            <FiSkipForward />
                        </button>
                    </div>
                )}
                { filteredItems.length > itemsPerPage ? (<hr className='hr-global'/>) : (<></>)}
            </>
        )
    }

    export default BanksTable