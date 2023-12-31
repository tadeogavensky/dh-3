"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import Link from "next/link";

import DataDetails from "./dataDetails";
import PersonalDetails from "./personalDetails";
import Success from "./success";
import { Infinit } from "@/components/Infinit";

export default function Registration() {
  const [step, setStep] = useState(1);
  const [dataDetails, setDataDetails] = useState({});
  const [personalDetails, setPersonalDetails] = useState({});

  const handleDataDetailsNext = (data) => {
    setDataDetails(data);
    setStep(step + 1);
  };

  const handlePersonalDetailsNext = (data) => {
    setPersonalDetails(data);

    let completeObject = {
      ...dataDetails,
      ...data,
    };

    console.log('completeObject :>> ', completeObject);

    axios
      .post("/api/register", completeObject)
      .then((res) => {
        console.log("res :>> ", res);
        setStep(step + 1);
      })
      .catch((error) => {
        console.log("error :>> ", error);
      });

    /*  toast.promise(axios.post("/api/register", completeObject), {
      loading: "Loading...",
      success: (data) => {
      
        return `User has been created successfully`;
      },
      error: (error) => {
        console.log(error);
        if (error.response && error.response.data) {
          return error.response.data.message;
        }
      },
    }); */
  };

  const handleConfirmationBack = () => {
    setStep(step - 1);
  };

  return (
    <div className="flex flex-col bg-white justify-around pb-12">
      <div className="flex min-h-full flex-1 flex-col items-center px-6 py-12 lg:px-8">
        <Link href="/">
          <Infinit />
        </Link>

        <p className="text-lg sm:text-2xl worksans-regular mt-10 border-b-primary border-b-4 pb-2">
          Create your account
        </p>
      </div>
      {step === 1 && (
        <DataDetails onNext={handleDataDetailsNext} data={dataDetails} />
      )}
      {step === 2 && (
        <PersonalDetails
          onBack={handleConfirmationBack}
          onNext={handlePersonalDetailsNext}
          data={personalDetails}
        />
      )}

      {step === 3 && <Success />}
    </div>
  );
}