import React, { useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { FiTrendingUp, FiDollarSign } from "react-icons/fi"
import { BsPiggyBank } from "react-icons/bs"
import { TbReportAnalytics } from "react-icons/tb"
import { LiaFileInvoiceDollarSolid } from "react-icons/lia"
import { PiFoldersLight, PiIdentificationBadgeLight } from "react-icons/pi"
import { GoGift } from "react-icons/go"
import './menuExtrato.scss'
import '../../styles/global.scss'

const MenuExtrato = ({ connectorData, handleProduct, disabled }) => {
  const [selectedProduct, setSelectedProduct] = useState(null)

  if (!connectorData) {
    return <></>
  }

  const productInfo = {
    ACCOUNTS: { name: 'Contas', icon: <FiDollarSign className='icone-global'/> },
    INVESTMENTS: { name: 'Investimentos', icon: <FiTrendingUp className='icone-global'/> },
    IDENTITY: { name: 'Identidade', icon: <PiIdentificationBadgeLight className='icone-global'/> },
    LOANS: { name: 'Empréstimos', icon: <BsPiggyBank className='icone-global'/> },
    BENEFITS: { name: 'Benefícios', icon: <GoGift className='icone-global'/> },
    PORTFOLIO: { name: 'Portfolio', icon: <PiFoldersLight className='icone-global'/> },
    INCOME_REPORTS: { name: 'Relatórios de Renda', icon: <TbReportAnalytics className='icone-global' /> }
  }

  const availableProductCodes = Object.keys(productInfo)
  
  const filteredProducts = (connectorData.products || [])
    .filter(productCode => availableProductCodes.includes(productCode))

  const handleProductSelect = (product) => {
    if (disabled) return
    setSelectedProduct(product)
    handleProduct(product)
  }

  if (filteredProducts.length === 0) {
    return <div className="text-muted py-3">Nenhum produto disponível</div>
  }

  return (
    <Container className="my-4 products-container">
      <Row xs={4} md={6} lg={8} className="g-3 options_export">
        <h4 className='products-menu' style={{fontWeight: 'bold'}}>Menu</h4>
        {filteredProducts.map((productCode) => {
          const product = productInfo[productCode]
          return (
            <Col style={{alignItems: 'center'}} key={productCode}>
              <button 
                className={`product-icon-button ${selectedProduct === productCode ? 'selected-card' : ''}`}
                onClick={() => handleProductSelect(productCode)}
                disabled={disabled}
                data-tooltip={product.name}
                aria-label={product.name}
              >
                {product.icon}
              </button>
            </Col>
          )
        })}
      </Row>
    </Container>
  )
}

export default MenuExtrato