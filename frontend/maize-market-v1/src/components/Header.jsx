import React from 'react'

const Header = ({toggleModal, numOfProducts}) => {
  return (
    <header className = 'header'>
        <div className='container'>
            <h3>Products({numOfProducts})</h3>
            <button onClick={() => toggleModal(true)} className= 'btn'>
                <i className = 'bi bi-plus-square'></i> List New Product
            </button>
        </div>
    </header>
  )
}

export default Header
