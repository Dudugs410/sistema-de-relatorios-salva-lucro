import React, { useContext, useEffect, useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiSkipBack, FiSkipForward } from 'react-icons/fi';
import GerarRelatorio from '../../components/Componente_GerarRelatorio';
import { AuthContext } from '../../contexts/auth';

const TabelaCompTaxas = ({ array }) => {
    const dataArray = Array.isArray(array) ? array : [array];

    useEffect(()=>{
        console.log("TabelaCompTaxas: ", array)
    },[])
    
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15);
    const [expandedRows, setExpandedRows] = useState([]);

    useEffect(() => {
        setCurrentPage(1); // Reset page to 1 when data changes
    }, [array]);

    // Toggle row expansion
    const toggleRow = (index) => {
        const newExpandedRows = [...expandedRows];
        if (newExpandedRows.includes(index)) {
            // If row is already expanded, collapse it
            const idx = newExpandedRows.indexOf(index);
            newExpandedRows.splice(idx, 1);
        } else {
            // If row is not expanded, expand it
            newExpandedRows.push(index);
        }
        setExpandedRows(newExpandedRows);
    };

    // Change page functions
    const goToPrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const goToNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(dataArray.length / itemsPerPage)));
    };

    const goToFirstPage = () => {
        setCurrentPage(1);
    };
    
    const goToLastPage = () => {
        setCurrentPage(Math.ceil(dataArray.length / itemsPerPage));
    };
  
    // Calculate indexes for pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = dataArray.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <>
            <GerarRelatorio />
            <hr className='hr-global'/>
            <div data-tour="tabelavendas-section" className='dropShadow vendas-view'>
                <div className='table-wrapper'>
                    <table className='table table-striped table-hover det-table-global'>
                        <thead>
                            <tr className='det-tr-top-global'>
                                <th className='det-th-global' scope="col">Grupo</th>
                                <th className='det-th-global' scope="col">Cliente</th>
                                <th className='det-th-global' scope="col">Período</th>
                                <th className='det-th-global' scope="col">CNPJ</th>
                                <th className='det-th-global' scope="col">Taxas</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataArray.length > 0 && currentItems.map((item, index) => {
                                const absoluteIndex = indexOfFirstItem + index;
                                const isExpanded = expandedRows.includes(absoluteIndex);
                                const rowKey = `row-${absoluteIndex}`;
                                
                                return (
                                    <React.Fragment key={rowKey}>
                                        <tr 
                                            className='det-tr-global clickable-row'
                                            onClick={() => toggleRow(absoluteIndex)}
                                        >
                                            <td className='det-td-vendas-global' data-label="Grupo">{item.nomeGrupo}</td>
                                            <td className='det-td-vendas-global' data-label="Cliente">{item.nomeCliente}</td>
                                            <td className='det-td-vendas-global' data-label="Periodo">{item.periodo}</td>
                                            <td className='det-td-vendas-global' data-label="CNPJ">{item.cnpj}</td>
                                            <td className='det-td-vendas-global' data-label="Taxas">
                                                {item.taxas?.length || 0} taxa(s)
                                                <span className="float-end">
                                                    {isExpanded ? '▼' : '▶'}
                                                </span>
                                            </td>
                                        </tr>
                                        
                                        {isExpanded && item.taxas && (
                                            <tr key={`expanded-${rowKey}`} className="expanded-row">
                                                <td colSpan="5">
                                                    <div className="sub-table-container p-3">
                                                        <table className="table table-bordered table-sm sub-table">
                                                            <thead>
                                                                <tr>
                                                                    <th>Adquirente</th>
                                                                    <th>Bandeira</th>
                                                                    <th>Produto</th>
                                                                    <th>Modalidade</th>
                                                                    <th>Taxa Penúltimo Mês</th>
                                                                    <th>Taxa Último Mês</th>
                                                                    <th>Taxa Cadastrada</th>
                                                                    <th>Comparativo</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {item.taxas.map((taxa, taxaIndex) => (
                                                                    <tr key={`taxa-${rowKey}-${taxaIndex}`}>
                                                                        <td>{taxa.adquirente}</td>
                                                                        <td>{taxa.bandeira}</td>
                                                                        <td>{taxa.produto}</td>
                                                                        <td>{taxa.modalidade}</td>
                                                                        <td>{taxa.taxaMediaPenultimoMes}%</td>
                                                                        <td>{taxa.taxaMediaUltimoMes}%</td>
                                                                        <td>{taxa.taxaCadastrada}%</td>
                                                                        <td className={taxa.comparativo > 0 ? 'text-danger' : 'text-success'}>
                                                                            {taxa.comparativo > 0 ? '+' : ''}{taxa.comparativo}%
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table> 
                </div>
            </div>
            <hr className='hr-global'/>
            {dataArray.length > itemsPerPage && (
                <div className="container-btn-pagina">
                    <button
                        className='btn btn-primary btn-global btn-skip'
                        onClick={goToFirstPage}
                        disabled={currentPage === 1}
                    >
                        <FiSkipBack />
                    </button>
                    <button
                        className='btn btn-primary btn-global btn-navigate'
                        onClick={goToPrevPage}
                        disabled={currentPage === 1}
                    >
                        <FiChevronLeft/>
                    </button>
                    <div className='pagina-atual'>
                        <span className='texto-paginacao'>Página </span>
                        <span className='texto-paginacao'>{currentPage}</span>
                    </div>
                    <button
                        className='btn btn-primary btn-global btn-navigate'
                        onClick={goToNextPage}
                        disabled={currentPage === Math.ceil(dataArray.length / itemsPerPage)}
                    >
                        <FiChevronRight/>
                    </button>
                    <button
                        className='btn btn-primary btn-global btn-skip'
                        onClick={goToLastPage}
                        disabled={currentPage === Math.ceil(dataArray.length / itemsPerPage)}
                    >
                        <FiSkipForward />
                    </button>
                </div>
            )}
            <hr className='hr-global'/>
            
            {/* CSS for the expanded rows */}
            <style jsx>{`
                .clickable-row {
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                .clickable-row:hover {
                    background-color: #f5f5f5;
                }
                .expanded-row {
                    background-color: #f9f9f9;
                }
                .expanded-row td {
                    padding: 0 !important;
                    border-top: none;
                }
                .sub-table-container {
                    padding: 0;
                }
                .sub-table {
                    margin-bottom: 0;
                    width: 100%;
                }
                .sub-table th {
                    background-color: #e9ecef;
                    position: sticky;
                    top: 0;
                }
                .text-success {
                    color: #28a745;
                }
                .text-danger {
                    color: #dc3545;
                }
            `}</style>
        </>
    );
};

export default TabelaCompTaxas;