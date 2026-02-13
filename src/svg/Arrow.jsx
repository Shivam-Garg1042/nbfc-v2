import React from 'react'

function Arrow() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" style={{transform: 'translateY(15%)', cursor: 'pointer'}}>
  <path d="M1 6H11" stroke="#009DFF" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M6 1L11 6L6 11" stroke="#009DFF" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
  )
}

export default Arrow