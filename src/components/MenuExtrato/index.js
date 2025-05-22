import React,  {useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './menuExtrato.scss';

const MenuExtrato = ({ connectorData, handleProduct }) => {

  if (!connectorData) {
    return <></>;
  }

  const productInfo = {
    ACCOUNTS: { name: 'Contas', icon: '💰' },
    //CREDIT_CARDS: { name: 'Cartões', icon: '💳' },
    //TRANSACTIONS: { name: 'Transações', icon: '↔️' },
    //PAYMENT_DATA: { name: 'Dados de Pagamentos', icon: '🧾' },
    INVESTMENTS: { name: 'Investimentos', icon: '📈' },
    //INVESTMENTS_TRANSACTIONS: { name: 'Transações de Investimento', icon: '📊' },
    //IDENTITY: { name: 'Identity', icon: '🆔' },
    LOANS: { name: 'Empréstimos', icon: '🏦' },
    //BENEFITS: { name: 'Benefícios', icon: '🎁' },
    //PORTFOLIO: { name: 'Portfolio', icon: '📂' },
    //INCOME_REPORTS: { name: 'Relatórios de Renda', icon: '📄' }
  }

  const availableProductCodes = Object.keys(productInfo)
  
  const filteredProducts = (connectorData.products || [])
    .filter(productCode => availableProductCodes.includes(productCode))

  const handleProductSelect = (product) => {
    console.log('Selected product:', product)
    handleProduct(product)
  }

  if (filteredProducts.length === 0) {
    return <div className="text-muted py-3">Nenhum produto disponível</div>
  }

  return (
    <Container className="my-4 products-container">
      <h4 className="mb-4">Produtos Disponíveis</h4>
      <Row xs={2} md={3} lg={4} className="g-4 options_export">
        {filteredProducts.map((productCode) => {
          const product = productInfo[productCode]
          
          return (
            <Col key={productCode}>
              <Card 
                className="h-100 product-card" 
                onClick={() => handleProductSelect(productCode)}
              >
                <Card.Body className="text-center">
                  <div className="display-4 mb-2">{product.icon}</div>
                  <Card.Title>{product.name}</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default MenuExtrato;