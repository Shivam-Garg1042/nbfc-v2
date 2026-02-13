import React from 'react'
import LoanDriverList from './LoanDriversList'
import Filters from '../../Helper/Filters'
import ProductDesc from './ProductDesc'
import FilterComponent from './FilterComponent'

function ProductView() {
  return (
    <section id = "productView" className="view">
        <div className="leftPart">
          <Filters/>
          <ProductDesc/>
          <LoanDriverList/>
        </div>
        <div className="rightPart">
          <FilterComponent/>
        </div>
    </section>
  )
}

export default ProductView