import React,  {useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './menuExtrato.scss';

const MenuExtrato = ({ connectorData, handleProduct }) => {
  // Return early if no data

  if (!connectorData) {
    return <></>;
  }

  // Product mapping
  const productInfo = {
    ACCOUNTS: { name: 'Contas', icon: '💰' },
    //CREDIT_CARDS: { name: 'Cartões', icon: '💳' },
    //TRANSACTIONS: { name: 'Transações', icon: '↔️' },
    //PAYMENT_DATA: { name: 'Dados de Pagamentos', icon: '🧾' },
    INVESTMENTS: { name: 'Investimentos', icon: '📈' },
    //INVESTMENTS_TRANSACTIONS: { name: 'Transações de Investimento', icon: '📊' },
    IDENTITY: { name: 'Identity', icon: '🆔' },
    LOANS: { name: 'Empréstimos', icon: '🏦' },
    //BENEFITS: { name: 'Benefícios', icon: '🎁' },
    //PORTFOLIO: { name: 'Portfolio', icon: '📂' },
    //INCOME_REPORTS: { name: 'Relatórios de Renda', icon: '📄' }
  }

  // Get available product codes from the mapping (not from connectorData)
  const availableProductCodes = Object.keys(productInfo)
  
  // Filter connector's products to only include those in our mapping
  const filteredProducts = (connectorData.products || [])
    .filter(productCode => availableProductCodes.includes(productCode))

  // Handle product selection
  const handleProductSelect = (product) => {
    console.log('Selected product:', product)
    handleProduct(product)
  };

  // If no matching products available
  if (filteredProducts.length === 0) {
    return <div className="text-muted py-3">Nenhum produto disponível</div>
  }

  return (
    <Container className="my-4 products-container">
      <h4 className="mb-4">Produtos Disponíveis</h4>
      <Row xs={2} md={3} lg={4} className="g-4">
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