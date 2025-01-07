import React from 'react'
import './Header.css'
const Header = ({toggleModal, numOfProducts}) => {
  return (
    <header className = 'header'>
        <div className='containerHeading'>
            <h3 className='prodHeading'>Maize Market</h3>
            <button onClick={() => toggleModal(true)} className= 'btn'>
                <i className = 'bi bi-plus-square'></i> List New Product
            </button>
        </div>
    </header>
  )
}



export default Header
