"use client";

import React from 'react'
import { useEffect, useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { FIREBASE_AUTH, FIRESTORE } from '@/firebase/firebase'
import { useRouter } from 'next/navigation'
import { text } from 'stream/consumers';
import DefaultBg from '@/app/_components/defaultBg'
import ProgressBar from '@/app/_components/progress-bar';
import StepPersonalInfo, { PersonalInfoData } from './personal-info-step';
import StepMedicalHistory, { MedicalHistoryData } from './medical-history-step';
import StepGoalsPreferences, { GoalsPreferencesData } from './goals-preferences-step';
import StepEmailPassword, { EmailPasswordData } from './email-password-step';

const SignUp: React.FC = () => {

  const steps = ['Personal Info', 'Medical History', 'Goals & Preferences', 'Email & Password'];

  const [currentStep, setCurrentStep] = useState(0);

  const [personalInfo, setPersonalInfo] = useState<PersonalInfoData>({
    firstName: '',
    lastName: '',
    address: '',
    gender: '',
  });

  const [medicalHistory, setMedicalHistory] = useState<MedicalHistoryData>({
    primaryInjury: '',
    conditions: '',
    conditionDuration: '',
  });

  const [goalsPreferences, setGoalsPreferences] = useState<GoalsPreferencesData>({
    treatmentGoals: '',
    sessionTypePreference: '',
  });

  const [emailPassword, setEmailPassword] = useState<EmailPasswordData>({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const updatePersonalInfo = (fields: Partial<PersonalInfoData>) => {
    setPersonalInfo((prev) => ({ ...prev, ...fields }));
  };

  const updateMedicalHistory = (fields: Partial<MedicalHistoryData>) => {
    setMedicalHistory((prev) => ({ ...prev, ...fields }));
  };

  const updateGoalsPreferences = (fields: Partial<GoalsPreferencesData>) => {
    setGoalsPreferences((prev) => ({ ...prev, ...fields }));
  };

  const updateEmailPassword = (fields: Partial<EmailPasswordData>) => {
    setEmailPassword((prev) => ({ ...prev, ...fields }));
  };

  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [userName, setUserName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Navigation
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSignUp = async (e: any) => {
    e.preventDefault()
    console.log("Password:", `"${emailPassword.password}"`);
    console.log("🟢 Gender from form:", personalInfo.gender);

    if (emailPassword.password !== emailPassword.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!emailPassword.email || !emailPassword.password || !personalInfo.firstName || !personalInfo.lastName) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true)
      setError('')
      const userCredentials = await createUserWithEmailAndPassword(FIREBASE_AUTH, emailPassword.email, emailPassword.password)
      await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userCredentials.user.uid,
          user_name: `${personalInfo.firstName} ${personalInfo.lastName}`,
          user_gender: personalInfo.gender,
          user_address: personalInfo.address,
          primaryInjury: medicalHistory.primaryInjury,
          duration_of_condition: medicalHistory.conditionDuration,
          user_goals: goalsPreferences.treatmentGoals,
          preferred_physio_specialty: goalsPreferences.sessionTypePreference,
          user_email: emailPassword.email,
          user_password: emailPassword.password,
        })
      })
      //router.push('/')
    } catch (error: any) {
      console.log(error);
      setError("Failed to sign up, please try again")
    } finally {
      setLoading(false);
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <StepPersonalInfo data={personalInfo} onUpdate={updatePersonalInfo} />;
      case 1:
        return <StepMedicalHistory data={medicalHistory} onUpdate={updateMedicalHistory} />;
      case 2:
        return <StepGoalsPreferences data={goalsPreferences} onUpdate={updateGoalsPreferences} />;
      case 3:
        return <StepEmailPassword data={emailPassword} onUpdate={updateEmailPassword} />;
      default:
        return null;
    }
  };


  return (
    <div className='w-full h-[90vh] flex justify-center items-center'>
      <div className="w-full h-full relative overflow-hidden">
        <DefaultBg />
        <div className="w-full md:w-[75%] h-full absolute top-0 left-0 flex items-center pt-0 px-4">
          <h1 className=' leading-tight w-[50%] text-7xl xl:text-8xl font-bold text-primary p-5'>
            {steps[currentStep]}
          </h1>
        </div>
      </div>
      <div className="absolute top-0 right-[10%] bottom-0 flex pt-2 justify-center items-center">
        <div className="flex flex-col items-center gap-4 w-[100%]">
          <div className="w-[80%] pt-8 items-start">
            <ProgressBar currentStep={currentStep} totalSteps={steps.length} />
          </div>
          {error && (
            <div className="w-[80%] p-3 text-center bg-red-500 text-white rounded-md">
              {error}
            </div>
          )}
          {renderStepContent()}
          <div className="mt-8 flex space-x-4">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="px-6 py-2 border rounded-md"
              >
                Back
              </button>
            )}
            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-green-500 text-white rounded-md"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSignUp}
                className="px-6 py-2 bg-blue-500 text-white rounded-md"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp;
