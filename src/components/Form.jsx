import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { UserContext } from "./context/UserContext";

export const Form = () => {
    const { isAdmin } = useContext(UserContext)
    const handlerSubmit = (e) => {
    e.preventDefault();

    const fields = [
      { state: model, setter: setModelErr, id: "#modelInput" },
      { state: price, setter: setPriceErr, id: "#priceInput" },
      { state: plate, setter: setPlateErr, id: "#plateInput" },
      { state: detail, setter: setDetailErr, id: "#detailInput" },
      {
        state: description,
        setter: setDescriptionErr,
        id: "#descriptionInput",
      }
    ];

    fields.forEach((field) => {
      if (!field.state) {
        field.setter(true);
        document.querySelector(field.id).classList.add("errInput");
      } else {
        field.setter(false);
        document.querySelector(field.id).classList.remove("errInput");
      }
    });

    if (!year || year.length === 0 || year > 2023 || year < 1886) {
      setYearErr1(!year || year.length === 0);
      setYearErr2((year > 2023 || year < 1886) && year != 0);
      document.querySelector("#yearInput").classList.add("errInput");
    } else {
      setYearErr1(false);
      setYearErr2(false);
      document.querySelector("#yearInput").classList.remove("errInput");
    }
    if (brand.name == "") {
      setBrandErr(true);
      document.querySelector("#brandInput").classList.add("errInput");
    } else {
      setBrandErr(false)
      document.querySelector("#brandInput").classList.remove("errInput");
    }
    
    if (isAdmin) {
      if(!category) {
        setCategoryErr(true);
        document.querySelector("#categoryInput").classList.add("errInput");
      } else {
        setCategoryErr(false)
        document.querySelector("#categoryInput").classList.remove("errInput");
      }
    }

    if (
      year &&
      year.length !== 0 &&
      year <= 2023 &&
      year > 1886 &&
      brand.id !== 0 &&
      fields[4].state &&
      fields[3].state &&
      fields[2].state &&
      fields[1].state &&
      fields[0].state
    ) {
      if(isAdmin){
        if (category) {
          createPost()
        }
      }else{
        createPost()
      }
    }
  };

  const apiUrl = "/api/vehicle";

  function createPost() {
        let parsCategory 
    if(category){
      parsCategory = JSON.parse(category)
    }

    let parsModel = JSON.parse(model)

    if(isAdmin){

      toast.promise(
        axios.post(apiUrl, {
          "name": "",
          "plate": plate,
          "detail": detail,
          "year": +year,
          "price_per_day": +price,
          "long_description": description,
          "deleted": false,
          "category": {
            "idcategory": parsCategory.idcategory,
            "name": parsCategory.name,
            "url": parsCategory.url,
            "deleted": false
          },
          "images": [],
          "model": {
            "idmodel": parsModel.idmodel,
            "name": parsModel.name,
            "brandIdbrand": parsModel.brandIdbrand,
            "deleted": false,
            "brand": {
              "idbrand": brand.idbrand,
              "name": brand.name,
              "url": brand.url,
              "deleted": false
            }
          }
        }),
        {
          loading: "Loading...",
          success: (data) => {
            return `Post has been created successfully`;
          },
          error: "Error while creating post",
        }
      );

    }else{
      toast.promise(
        axios.post(apiUrl, {
          "name": "",
          "plate": plate,
          "detail": detail,
          "year": +year,
          "price_per_day": +price,
          "long_description": description,
          "deleted": false,
          "category": {
            "idcategory": 1,
            "name": "sedan",
            "url": "https://revistacarro.com.br/wp-content/uploads/2021/11/Audi-A3-Sedan-Performance-Black_1.jpg",
            "deleted": false
          },
          "images": [],
          "model": {
            "idmodel": parsModel.idmodel,
            "name": parsModel.name,
            "brandIdbrand": parsModel.brandIdbrand,
            "deleted": false,
            "brand": {
              "idbrand": brand.idbrand,
              "name": brand.name,
              "url": brand.url,
              "deleted": false
            }
          }
        }),
        {
          loading: "Loading...",
          success: (data) => {
            return `Post has been created successfully`;
          },
          error: "Error while creating post",
        }
      );
    }
  }

  //* Controled inputs states
  const [brand, setBrand] = useState({
    name: "",
    models: [],
  });
  const [model, setModel] = useState("");
  const [price, setPrice] = useState("");
  const [plate, setPlate] = useState("");
  const [year, setYear] = useState("");
  const [detail, setDetail] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  //* Error States
  const [brandErr, setBrandErr] = useState(false);
  const [modelErr, setModelErr] = useState(false);
  const [priceErr, setPriceErr] = useState(false);
  const [plateErr, setPlateErr] = useState(false);
  const [yearErr1, setYearErr1] = useState(false);
  const [yearErr2, setYearErr2] = useState(false);
  const [detailErr, setDetailErr] = useState(false);
  const [descriptionErr, setDescriptionErr] = useState(false);
  const [categoryErr, setCategoryErr] = useState(false);

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  const fetchBrands = async () => {
    const res = await axios("/api/brand");
    setBrands(res.data);
  };

  const fetchCategories = async () => {
    const res = await axios("/api/category");
    setCategories(res.data);
  };

  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, []);

  return (
    <>
      <h1 className=" m-5 text-6xl font-bold font-secondary text-center ">
        Rent your own car!
      </h1>
      <form
        noValidate
        onSubmit={handlerSubmit}
        className="flex items-center flex-col "
      >
        <div className="grid md:grid-cols-2 grid-cols-1">
          <div className="mx-6">
            <div className="m-[0.85rem]  ">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Brand
              </label>

              <div className="relative mt-2 rounded-md shadow-sm">
                <select
                  id="brandInput"
                  type="text"
                  onChange={(e) => {
                    const selectedBrand = JSON.parse(e.target.value);

                    setBrand((prevState) => ({
                      ...prevState,
                      name: selectedBrand.name,
                      models: selectedBrand.models,
                    }));
                  }}
                  className="block w-full cursor-pointer rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:outline-none sm:text-sm sm:leading-6 transition ease-in-out duration-300"
                >
                  <option value="" disabled selected>
                    Select some brand
                  </option>
                  {brands.map((brand) => {
                    return (
                      <option value={JSON.stringify(brand)} key={brand.idbrand}>
                        {brand.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              {brandErr ? (
                <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                  You must choose the brand of your car
                </span>
              ) : (
                <></>
              )}
            </div>

            <div className="m-3">
              <label className="block  text-sm font-medium leading-6 text-gray-900">
                Model
              </label>
              <div>
                <select
                  id="modelInput"
                  value={model}
                  onChange={(e) => {
                    setModel(e.target.value);
                    console.log("model :>> ", model);
                  }}
                  type="text"
                  className="block mt-2 w-full cursor-pointer rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:outline-none sm:text-sm sm:leading-6 transition ease-in-out duration-300"
                >
                  <option value="" disabled selected>
                    Select some model
                  </option>
                  {brand.models?.map((model) => {
                    return (
                      <option value={JSON.stringify(model)} key={model.idmodel}>
                        {model.name}
                        {console.log(model)}
                      </option>
                    );
                  })}

                </select>
              </div>
              {modelErr ? (
                <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                  You must choose the model of your car
                </span>
              ) : (
                <></>
              )}
            </div>

            <hr className="mt-5 mb-5" />

            <div className="m-3">
              <label
                for="price"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Price per day
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  id="priceInput"
                  type="number"
                  value={price}
                  onChange={() => setPrice(event.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:outline-none sm:text-sm sm:leading-6 transition ease-in-out duration-300"
                  placeholder="0.00"
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <label className="sr-only">Currency</label>
                  <select className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm">
                    <option>USD</option>
                    <option>ARS</option>
                    <option>EUR</option>
                  </select>
                </div>
              </div>
              {priceErr ? (
                <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                  The price can't be blank
                </span>
              ) : (
                <></>
              )}
            </div>

            <hr className="mt-5 mb-5" />

            <div className="m-3  ">
              <label className="block mb-2 text-sm font-medium leading-6 text-gray-900">
                Upload multiple photos
              </label>
              <div>
                <label className="block">
                  <span className="sr-only">Choose profile photo</span>
                  <input
                    multiple
                    type="file"
                    cursor-pointer
                    className=" text-xs block w-full  text-gray-500 pr-2
                                    ring-2 ring-gray-300 ring-inset rounded-md
                                    file:mr-1 file:py-2 file:px-2
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-primary file:text-white
                                    hover:file:bg-secondary file:transition-all duration-200 ease-in-out
                                    "
                  />
                </label>
              </div>
            </div>
          </div>

          <div>
            <div className="m-3">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Plate
              </label>
              <div>
                <input
                  id="plateInput"
                  value={plate}
                  onChange={() => setPlate(event.target.value)}
                  type="text"
                  className="block mt-2 w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:outline-none sm:text-sm sm:leading-6 transition ease-in-out duration-300"
                />
              </div>
              {plateErr ? (
                <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                  Invalid plate
                </span>
              ) : (
                <></>
              )}
            </div>

            <div className="m-3">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Year
              </label>
              <div>
                <input
                  id="yearInput"
                  type="number"
                  min="1886"
                  max="2023"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="block mt-2 w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:outline-none sm:text-sm sm:leading-6 transition ease-in-out duration-300"
                />
              </div>
              {yearErr1 ? (
                <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                  The year can't be blank
                </span>
              ) : (
                <></>
              )}
              {yearErr2 ? (
                <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                  Invalid year
                </span>
              ) : (
                <></>
              )}
            </div>

            <div className="m-3">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Detail
              </label>
              <div className="w-full max-w-sm mx-auto">
                <textarea
                  id="detailInput"
                  className=" block mt-2 h-full w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:outline-none sm:text-sm sm:leading-6 transition ease-in-out duration-300"
                  placeholder="Enter your car's detail here"
                  value={detail}
                  onChange={() => setDetail(event.target.value)}
                ></textarea>
              </div>

              {detailErr ? (
                <span className="flex  items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                  The details can't be blank
                </span>
              ) : (
                <></>
              )}
            </div>

            <div className="m-3">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Long Description
              </label>
              <div className="w-full max-w-sm mx-auto">
                <textarea
                  className=" w-full mt-2 rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:outline-none sm:text-sm sm:leading-6 transition ease-in-out duration-300"
                  id="descriptionInput"
                  placeholder="Enter your description here"
                  value={description}
                  onChange={() => setDescription(event.target.value)}
                ></textarea>
              </div>
              {descriptionErr ? (
                <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                  The description can't be blank
                </span>
              ) : (
                <></>
              )}
            </div>
            {isAdmin
              ?
              (<div className="m-3">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Category
                </label>
                <select
                  id="categoryInput"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    console.log("category :>> ", category);
                  }}
                  type="text"
                  className="block mt-2 w-full cursor-pointer rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:outline-none sm:text-sm sm:leading-6 transition ease-in-out duration-300"
                >
                  <option value="" disabled selected>
                    Select some category
                  </option>
                  {categories.map((category) => {
                    return (
                      <option
                        value={JSON.stringify(category)}
                        key={category.categoryId}
                      >
                        {category.name}

                      </option>
                    );
                  })}
                </select>
                {categoryErr ? (
                  <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                    You must choose the category of your car
                  </span>
                ) : (
                  <></>
                )}
              </div>
              )
              :
              <></>
            }
          </div>
        </div>

        <div className="mt-5  ">
          <button className="rounded-xl py-3 px-5 w-full text-white bg-primary hover:bg-secondary file:transition-all duration-200 ease-in-out">
            Submit
          </button>
        </div>
      </form>
    </>
  );
};
