import React, { useEffect, useState } from 'react'
import './../../styles/myProduct.css'
import image1 from '/images/Rectangle 34624487.png'
import image2 from '/images/Rectangle 34624487 (1).png'
import image4 from '/images/Insurance.png'
import MyProductCard from '../../child components/MyProductCard'
import ApiService from '../../services/api'
import { useNbfcFilter } from '../NBFCFilter/NbfcFilterContext'

function MyProducts() {
  const { selectedNbfc } = useNbfcFilter();
  const [productNumbers, setProductNumbers] = useState(null);
  const [loading, setLoading] = useState(true);

  // Static product data - only structure, images, titles
  const staticProductData = [
    {
      title: "Battery",
      image: image2,
      unit: "",
    },
    {
      title: "Vehicle",
      image: image1,
      unit: "",
    },
    
    {
      title: "Insurance",
      image: image4,
      unit: "",
      value: "Coming Soon",
      activeDrivers: "...",
    }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const nbfcFilter = selectedNbfc || 'all';
        const response = await ApiService.getMyProducts(nbfcFilter);
        
        if (response.success) {
          setProductNumbers(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setProductNumbers(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedNbfc]);

  // Combine static data with real numbers
  const getProductsData = () => {
    return staticProductData.map((product) => {
      if (product.title === "Vehicle" && productNumbers?.vehicle) {
        return {
          ...product,
          value: productNumbers.vehicle.value,
          activeDrivers: productNumbers.vehicle.activeDrivers,
        };
      }
      if (product.title === "Battery" && productNumbers?.battery) {
        return {
          ...product,
          value: productNumbers.battery.value,
          activeDrivers: productNumbers.battery.activeDrivers,
        };
      }
      return product; // Insurance stays as "Coming Soon"
    });
  };
  return (
    <div className='myproduct'>
      <h2>My Products</h2>
      <div className='productCards'>
        {loading ? (
          // Loading skeleton cards
          [1,2,3].map((index) => (
            <div className="cards" key={index} style={{ opacity: 0.6 }}>
              <div style={{ 
                height: '190px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#999',
                fontSize: '14px'
              }}>
                Loading...
              </div>
            </div>
          ))
        ) : (
          getProductsData().map((item, index) => (
            <div className="cards" key={index}>
              <MyProductCard props={item}/>
            </div> 
          ))
        )}
      
      {/* Coming Soon Cards */}
      {/* <div className="cards coming-soon-card">
        <div style={{ 
          height: '190px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#999',
          fontSize: '16px',
          fontWeight: '500'
        }}>
          Coming Soon...
        </div>
      </div> */}
      
      <div className="cards coming-soon-card">
        <div style={{ 
          height: '190px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#999',
          fontSize: '16px',
          fontWeight: '500'
        }}>
          Coming Soon...
        </div>
      </div>
    </div>
    </div>
  
)
}

export default MyProducts