import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ProductDetail() {
  const { id } = useParams();
  const [medicine, setMedicine] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((m) => m.id === parseInt(id));
        setMedicine(found);
      });
  }, [id]);

  if (!medicine) return <p>Loading...</p>;

  return (
    <div className="section">
      <div className="bmi-container">
        <img
          src={medicine.image}
          alt={medicine.name}
          style={{ width: "100%", borderRadius: "10px" }}
        />
        <h2>{medicine.name}</h2>
        <p>{medicine.description}</p>
        <p>
          <strong>${medicine.price.toFixed(2)}</strong>
        </p>
      </div>
    </div>
  );
}

export default ProductDetail;
