"use client";
import { CardList } from "@/components/CardList";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function Fleet() {
  const [vehicles, setVehicles] = useState([]);

  const fetchVehicles = async () => {
    const res = await axios("/api/vehicle");

    setVehicles(res.data);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
    <div>
      <CardList vehicles={vehicles} />
    </div>
  );
}
