import React from 'react';
import '../styles/LoanCategories.css'


export default function LoanCategories() {
  const categories = [
    {
      title: "Good Karma",
      users: [
        { name: "Mayank Agarwal", phone: "+91 901 954 9457", gender: "Male", age: "45 Years" },
        { name: "Ritesh Kumar", phone: "+91 901 954 9457", gender: "Male", age: "45 Years" },
        { name: "Danush Goud", phone: "+91 901 954 9457", gender: "Male", age: "45 Years" }
      ]
    },
    {
      title: "Run Kms",
      users: [
        { name: "Danush Goud", phone: "+91 901 954 9457", gender: "Male", age: "45 Years" },
        { name: "Suresh Chawla", phone: "+91 901 954 9457", gender: "Male", age: "45 Years" },
        { name: "Patap Singh", phone: "+91 901 954 9457", gender: "Male", age: "45 Years" }
      ]
    },
    {
      title: "Vintage",
      users: [
        { name: "Mayank Agarwal", phone: "+91 901 954 9457", gender: "Male", age: "45 Years" },
        { name: "Manorajan", phone: "+91 901 954 9457", gender: "Male", age: "45 Years" },
        { name: "Manish Kumar", phone: "+91 901 954 9457", gender: "Male", age: "45 Years" }
      ]
    }
  ];

  return (
    <div className="loan-categories-container">
      {categories.map((category, index) => (
        <div key={index} className="category-column">
          <h2 className="category-title">{category.title}</h2>
          <div className="user-list">
            {category.users.map((user, userIndex) => (
              <div key={userIndex} className="user-item">
                <div className="user-avatar">
                  {/* <img src={`/api/placeholder/40/40`} alt={user.name} /> */}
                  <img src={avatar} alt={user.name} />
                </div>
                <div className="user-info">
                  <div className="user-name">{user.name}</div>
                  <div className="user-details">
                    {user.phone} | {user.gender} {user.age}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="view-all">
            <a href="#">View all</a>
          </div>
          {index < categories.length - 1 && <div className="vertical-separator"></div>}
        </div>
      ))}
    </div>
  );
}