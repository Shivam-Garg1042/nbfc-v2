import React from 'react'

function FilterComponent() {
  return (
    <div className="filter-container">
        <div className="filters-header">
        {/* <h2>Filters ({filterCount})</h2> */}
        <h2>Filters</h2>
        {/* <button 
          className="clear-button"
          onClick={clearAll}
        > */}
        <button 
        >
          Clear all
        </button>
        </div>
    </div>
  )
}

export default FilterComponent