import { SignIn } from "@clerk/nextjs";
import React from "react";

const SignInPage = ({ searchParams }) => {
  const redirectTo = searchParams?.redirectTo ?? "/onboarding";
  return <SignIn forceRedirectUrl={redirectTo} />;
};

export default SignInPage;
