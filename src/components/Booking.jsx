import React, { useEffect, useState } from "react";

import { MdOutlineLocationOn, MdMyLocation } from "react-icons/md";
import { BiDirections } from "react-icons/bi";
import { BsCalendar3 } from "react-icons/bs";
import { motion } from "framer-motion";
import axios from "axios";

export const Booking = ({ vehicle }) => {
  const [modal, setModal] = useState(false);

  const [locations, setLocations] = useState([{}]);

  const [dates, setDates] = useState({
    checkin: "",
    checkout: "",
    qty: 0,
  });

  const hideModal = () => {
    console.log("Modal hideModal called"); // Add this line
    setModal(false);
  };

  const handleCheckinChange = (e) => {
    const newCheckin = e.target.value;
    setDates((prevState) => ({
      ...prevState,
      checkin: newCheckin,
      qty: calculateTotalDays(newCheckin, dates.checkout),
    }));
  };

  const handleCheckoutChange = (e) => {
    const newCheckout = e.target.value;
    setDates((prevState) => ({
      ...prevState,
      checkout: newCheckout,
      qty: calculateTotalDays(dates.checkin, newCheckout),
    }));
  };

  const calculateTotalDays = (checkin, checkout) => {
    if (checkin && checkout) {
      const checkinDate = new Date(checkin);
      const checkoutDate = new Date(checkout);
      const timeDifference = checkoutDate - checkinDate;
      const totalDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
      return totalDays;
    }
    return 0;
  };

  const [query, setQuery] = useState("");

  const [location, setLocation] = useState("");

  const searchLocations = (searchQuery) => {
    axios
      .get(`/api/location/${searchQuery}`)
      .then((res) => {
        setLocations(res.data);

        if (res.data.length > 0) {
          setModal(true);
        } else {
          setModal(false);
        }
      })
      .catch((error) => {
        console.log("error :>> ", error);
      });
  };
  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    if (newQuery.trim() === "") {
      // If the input is empty or only contains whitespace, close the modal
      setModal(false);
    } else {
      // If there is a query, show the modal and perform the search
      setModal(true);
      debounce(searchLocations(newQuery), 300); // Delay the API call by 300ms
    }
  };

  const filterVehicles = () => {
    console.log("location :>> ", location);
    console.log("dates :>> ", dates);
  };

  return (
    <div className="w-full p-6 bg-[#00243f] flex flex-col lg:flex-row items-center justify-around rounded-md shadow-md gap-4 mb-12">
      {/* Location */}
      <div
        className="flex flex-col lg:flex-row items-center w-full relative "
        onClick={() => {
          searchLocations();
        }}
      >
        <div className="relative w-full">
          <label className="absolute left-12 uppercase text-gray-400 top-2 text-[10px] tracking-widest w-full">
            Origin
          </label>
          <button className="absolute top-5 left-3 group">
            <MdMyLocation className="group-hover:text-purple-600" size={25} />
          </button>
          <input
            type="text"
            placeholder={`Where are you from? Enter your city, state or country`}
            value={
              location
                ? `${location.city}, ${location.state}, ${location.country}`
                : query
            }
            className="w-full  shadow-md rounded-lg pl-12 text-sm  py-5 pt-7  border-r-[1px] border-gray-300 text-ellipsis font-semibold placeholder:font-normal placeholder:italic focus:outline-2 outline-blue-800 "
            onChange={handleInputChange}
            onFocus={() => {
              setQuery("");
              setLocation("");
            }}
          />
        </div>

        {modal && (
          <Modal
            locations={locations}
            setLocation={setLocation}
            query={query}
            hideModal={hideModal}
          />
        )}

        {/*   <div className="relative w-full">
          <button className="hidden lg:block absolute top-3 -left-[18px] bg-white border-gray-200 border-2 rounded-md p-1">
            <BiDirections size={25} />
          </button>
          <label className="absolute left-12 uppercase text-gray-400 top-2 text-[10px] tracking-widest  group-focus:top-12">
            Destiny
          </label>

          <MdOutlineLocationOn
            className="absolute top-5 left-3 lg:left-5"
            size={25}
          />

          <input
            type="text"
            placeholder="Your destination?"
            className="truncate w-full rounded-r-md shadow-md lg:rounded-r-md rounded-l-md   text-sm rounded-t-none  pl-12 lg:pl-12 border-t-2 lg:border-t-0 border-gray-200 lg:rounded-l-none  py-3 pt-6 border-l-[1px] lg:border-gray-300  font-semibold placeholder:font-normal placeholder:italic focus:outline-2 outline-blue-800"
          />
        </div> */}
      </div>

      {/* Calendar */}

      <div className="flex flex-col lg:flex-row items-center w-full">
        <div className="relative w-full">
          <label className="absolute left-12 uppercase text-gray-400 top-2 text-[10px] tracking-widest">
            DATES
          </label>
          <button className="absolute top-5 left-3 group">
            <BsCalendar3 className="group-hover:text-purple-600" size={25} />
          </button>
          <input
            type="date"
            className="rounded-tl-md rounded-tr-md w-full   lg:rounded-l-md lg:rounded-r-none  pl-12 pr-2 py-4 pt-6 border-r-[1px] border-gray-300 text-ellipsis font-semibold placeholder:font-normal placeholder:italic focus:outline-2 outline-blue-800"
            onChange={handleCheckinChange}
          />
        </div>

        <div className="relative w-full">
          <input
            type="date"
            className="w-full rounded-r-md rounded-l-md  lg:rounded-r-md  rounded-t-none  pl-10 lg:pl-4 pr-2  border-t-2 lg:border-t-0 border-gray-200 lg:rounded-l-none py-4 pt-6 border-l-[1px] lg:border-gray-300 text-ellipsis font-semibold placeholder:font-normal placeholder:italic focus:outline-2 outline-blue-800"
            onChange={handleCheckoutChange}
          />
        </div>
      </div>

      <button
        onClick={() => {
          filterVehicles();
        }}
        className="bg-white text-black font-bold py-4 rounded-lg w-full lg:w-[20%] hover:bg-gray-200 transition-all duration-200"
      >
        Continue
      </button>
    </div>
  );
};

const Modal = ({ locations, setLocation, query, hideModal }) => {
  return (
    <div className="absolute w-full top-20 bg-white shadow-md rounded-md z-40">
      <p className="p-2 bg-gray-200 font-poppins uppercase text-lg font-semibold">
        Results
      </p>
      <ul className="bg-white mt-2">
        {locations.map((location) => {
          const lowerCaseQuery = query.toLowerCase();
          const locationString = `${location.city}, ${location.state}, ${location.country}`;
          const startIndex = locationString
            .toLowerCase()
            .indexOf(lowerCaseQuery);

          if (startIndex === -1) {
            return null;
          }

          return (
            <li
              key={location.id}
              onClick={() => {
                console.log("Location clicked"); // Add this line
                setLocation(location);
                hideModal();
              }}
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
            >
              {locationString.substring(0, startIndex)}
              <span className="text-purple-600 font-bold">
                {locationString.substring(
                  startIndex,
                  startIndex + query.length
                )}
              </span>
              {locationString.substring(startIndex + query.length)}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
