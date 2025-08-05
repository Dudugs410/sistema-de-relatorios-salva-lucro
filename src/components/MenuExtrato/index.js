import React,  {useEffect, useState } from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { FiTrendingUp, FiDollarSign } from "react-icons/fi"
import { BsPiggyBank, BsCreditCard } from "react-icons/bs"
import { TbTransactionDollar, TbReportAnalytics } from "react-icons/tb";
import { LiaChartBarSolid, LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { PiFoldersLight, PiIdentificationBadgeLight } from "react-icons/pi";
import { GrTransaction } from "react-icons/gr";
import { GoGift } from "react-icons/go";

import './menuExtrato.scss'
import '../../styles/global.scss'

const MenuExtrato = ({ connectorData, handleProduct }) => {

  const [selectedProduct, setSelectedProduct] = useState(null)

  if (!connectorData) {
    return <></>;
  }

  const productInfo = {
    ACCOUNTS: { name: <p className='text-global'>Contas</p>, icon: <FiDollarSign className='icone-global'/> },
    //CREDIT_CARDS: { name: <p className='text-global'>'Cartões'</p>, icon: <BsCreditCard className='icone-global'/> },
    TRANSACTIONS: { name: <p className='text-global'>'Transações'</p>, icon: <GrTransaction className='icone-global'/> },
    PAYMENT_DATA: { name: <p className='text-global'>'Dados de Pagamentos'</p>, icon: <LiaFileInvoiceDollarSolid className='icone-global'/> },
    INVESTMENTS: { name: <p className='text-global'>Investimentos</p>, icon: <FiTrendingUp className='icone-global'/> },
    INVESTMENTS_TRANSACTIONS: { name: <p className='text-global'>'Transações de Investimento'</p>, icon: <LiaChartBarSolid className='icone-global'/> },
    IDENTITY: { name: <p className='text-global'>Identity</p>, icon: <PiIdentificationBadgeLight className='icone-global'/> },
    LOANS: { name: <p className='text-global'>Empréstimos</p>, icon: <BsPiggyBank className='icone-global'/> },
    BENEFITS: { name: <p className='text-global'>'Benefícios'</p>, icon: <GoGift className='icone-global'/> },
    PORTFOLIO: { name: <p className='text-global'>'Portfolio'</p>, icon: <PiFoldersLight className='icone-global'/> },
    INCOME_REPORTS: { name: <p className='text-global'>'Relatórios de Renda'</p>, icon: <TbReportAnalytics className='icone-global' /> }
  }

  const availableProductCodes = Object.keys(productInfo)
  
  const filteredProducts = (connectorData.products || [])
    .filter(productCode => availableProductCodes.includes(productCode))

    const handleProductSelect = (product) => {
    setSelectedProduct(product); // Update the selected product
    console.log('Selected product:', product)
    handleProduct(product)
  }

  if (filteredProducts.length === 0) {
    return <div className="text-muted py-3">Nenhum produto disponível</div>
  }

  return (
    <Container className="my-4 products-container">
      <h4 className="mb-4 title-global text-global">Produtos Disponíveis</h4>
      <Row xs={2} md={3} lg={4} className="g-4 options_export">
        {filteredProducts.map((productCode) => {
          const product = productInfo[productCode]
          return (
            <Col key={productCode}>
              <Card 
                className={`h-100 product-card ${selectedProduct === productCode ? 'selected-card' : ''}`}
                onClick={() => handleProductSelect(productCode)}
              >
                <Card.Body className="text-center">
                  <div className="display-4 mb-2">{product.icon}</div>
                  <Card.Title >{product.name}</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          )
        })}
      </Row>
    </Container>
  )
}

export default MenuExtrato