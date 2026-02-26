import { useState } from "react";
import { toast } from "sonner";


const useFetch = (cb) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const fn = async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const response = await cb(...args);
      if (response && response.success === false) {
        throw new Error(response.error || "An error occurred");
      }
      setData(response);
      setError(null);
    } catch (error) {
      setError(error);
      // If server says unauthenticated, redirect to sign-in preserving path
      try {
        const isUnauthorized = error?.message === "Unauthorized" || error?.name === "UnauthorizedError";
        if (isUnauthorized && typeof window !== "undefined") {
          toast.error("Please sign in to continue");
          const redirectTo = encodeURIComponent(window.location.pathname + window.location.search);
          setTimeout(() => (window.location.href = `/sign-in?redirectTo=${redirectTo}`), 300);
          return;
        }
      } catch (e) {
        // ignore
      }

      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn, setData };
};

export default useFetch;