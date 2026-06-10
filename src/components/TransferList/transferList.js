import React, { useState } from 'react';
import { TbArrowBigLeftLines, TbArrowBigRightLines, TbArrowLeft, TbArrowRight } from "react-icons/tb";
import './transferList.scss';

const TransferList = () => {
  const [leftList, setLeftList] = useState(['Item 1', 'Item 2', 'Item 3', 'Item 4']);
  const [rightList, setRightList] = useState([]);
  const [selectedLeftItem, setSelectedLeftItem] = useState(null);
  const [selectedRightItem, setSelectedRightItem] = useState(null);

  const moveToRight = () => {
    const itemToMove = selectedLeftItem || leftList[0]
    if (itemToMove) {
      setRightList([...rightList, itemToMove])
      setLeftList(leftList.filter(item => item !== itemToMove))
      setSelectedLeftItem(null)
    }
  }

  const moveToLeft = () => {
    const itemToMove = selectedRightItem || rightList[0]
    if (itemToMove) {
      setLeftList([...leftList, itemToMove])
      setRightList(rightList.filter(item => item !== itemToMove))
      setSelectedRightItem(null)
    }
  }

  const moveAllToRight = () => {
    if (leftList.length > 0) {
      setRightList([...rightList, ...leftList])
      setLeftList([])
      setSelectedLeftItem(null)
    }
  }

  const moveAllToLeft = () => {
    if (rightList.length > 0) {
      setLeftList([...leftList, ...rightList])
      setRightList([])
      setSelectedRightItem(null)
    }
  }

  return (
    <div className='transferlist-component'>
      <div className='transferlist-container'>
        <h5 className='h5-transfer'>Clientes Cadastrados</h5>
        <ul className='transferlist-box-container'>
          {leftList.map((item, index) => (
            <li
              className='transferlist-box-content'
              key={index}
              onClick={() => setSelectedLeftItem(item)}
              style={{
                cursor: 'pointer',
                backgroundColor: selectedLeftItem === item ? '#ddd' : 'transparent',
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className='transferlist-button-container'>
        <button
          className='btn btn-primary btn-transfer btn-global'
          onClick={moveToRight}
          disabled={leftList.length === 0}
        >
          <TbArrowRight />
        </button>
        <button
          className='btn btn-primary btn-transfer btn-global'
          onClick={moveToLeft}
          disabled={rightList.length === 0}
        >
          <TbArrowLeft />
        </button>
        <button
          className='btn btn-primary btn-transfer btn-global'
          onClick={moveAllToRight}
          disabled={leftList.length === 0}
        >
          <TbArrowBigRightLines />
        </button>
        <button
          className='btn btn-primary btn-transfer btn-global'
          onClick={moveAllToLeft}
          disabled={rightList.length === 0}
        >
          <TbArrowBigLeftLines />
        </button>
      </div>

      {/* Right Box */}
      <div className='transferlist-container'>
        <h5 className='h5-transfer'>Clientes Selecionados</h5>
        <ul className='transferlist-box-container'>
          {rightList.map((item, index) => (
            <li
              className='transferlist-box-content'
              key={index}
              onClick={() => setSelectedRightItem(item)}
              style={{
                cursor: 'pointer',
                backgroundColor: selectedRightItem === item ? '#ddd' : 'transparent',
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default TransferList
