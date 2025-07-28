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
        setFilteredItems(banksList) // Initialize with all items
    }, [banksList])

    useEffect(() => {
        setCurrentPage(1) // Reset page to 1 when filter changes
        filterItems()
    }, [filter])

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
            setFilteredItems(banksList)
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
            )
            setFilteredItems(filtered)
        }
    }
    
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
                            <th className='det-th-global sticky-col start-col' scope="col" style={{ width: '2%', textAlign: 'center' }}>
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
                            <th className='det-th-global sticky-col end-col' scope="col" style={{ width: '2%', textAlign: 'center' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 &&
                            currentItems.map((object, index) => (
                                <tr key={index} className="det-tr-global tr-bancos">
                                    <th className='sticky-col start-col' scope="row" style={{ textAlign: 'center' }} onClick={() => { onEdit(object, index) }}>
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
                                    <th className='sticky-col end-col' scope="row" style={{ textAlign: 'center' }} onClick={() => onDelete(object)}>
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

/*
    objeto retornado da função "loadBanks":

{
        "CODIGO": 41,
        "CLICODIGO": 0,
        "ICMCODIGO": 1,
        "CODIGOBANCO": "041-8",
        "NOME": "BANRISUL-STRATUSX",
        "NOMEEXTERNO": "BANRISUL",
        "NOMECEDENTE": "STRATUSX TREINAMENTO E INFORMATICA LTDA",
        "CNPJCEDENTE": "94.648.797/0001-81",
        "GRUPONOSSONRO": "22604",
        "CTACODIGO": "1",
        "SEDCODIGO": 1,
        "LAYCODIGO": 7,
        "NUMEROREMESA": 1140,
        "CODIGOAGENCIA": "0018",
        "NUMEROCONTA": "060633710",
        "DIGITOCONTA": "3",
        "TARIFABANCARIA": 0.00,
        "TARIFAUTILIZAPARAMETRO": "N",
        "MULTA": 2.00,
        "JURO": 1.00,
        "ATUALIZACAOMONETARIA": 1.00,
        "CARTEIRA": "8050",
        "COBRANCAREGISTRADA": "S",
        "ESPECIEDOC": "DS",
        "ESPECIEMOEDA": "REAIS",
        "ACEITE": "N",
        "VARIACAO": "",
        "TIPOPRAZOMULTA": "P",
        "PRAZOMULTA": 1,
        "TIPOPRAZOJURO": "P",
        "PRAZOJURO": 1,
        "TIPOPRAZODEVOLUCAO": "P",
        "PRAZODEVOLUCAO": 90,
        "TIPOPRAZOPROTESTO": null,
        "PRAZOPROTESTO": 0,
        "TIPOPRAZOCORRECAOMONETARIA": "P",
        "PRAZOCORRECAOMONETARIA": 1,
        "CODIGOCEDENTE": "063371099",
        "CODIGOCONVENIO": "04650",
        "CODIGOCONVENIOLIDER": "",
        "LAYOUTREMESSA": "Cnab400",
        "LOCALPAGAMENTO": "PAGUE PREFERENCIALMENTE NA REDE INTEGRADA BANRISUL",
        "MENSAGEMINSTRUCAO": "",
        "MENSAGEMINSTRUCAOMULTA": "",
        "MENSAGEMINSTRUCAOJURO": "",
        "MENSAGEMINSTRUCAOCORRECAO": "",
        "MENSAGEMINSTRUCAODEVOLUCAO": "",
        "MENSAGEMINSTRUCAOPROTESTO": "",
        "NUMEROREMESSA": 0,
        "USUARIOINSERCAO": 164385,
        "DATAINSERCAO": "2018-12-12T17:45:55.437",
        "USUARIOMODIFICACAO": 164381,
        "DATAMODIFICACAO": "2020-12-01T09:38:01.69",
        "ATIVO": true,
        "BANLOGOMARCA": "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",
        "CODIGOINTEGRACAO": null,
        "FREQUENCIAINTEGRACAO": null
    }
*/