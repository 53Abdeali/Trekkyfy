import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axiosInstance from '../utils/axiosConfig';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        await axiosInstance.get('/user-profile');
        setLoading(false); 
      } catch (error) {
        router.push('/login'); 
      }
    }
    checkAuth();
  }, [router]);

  if (loading) return <p>Loading...</p>;
  return <>{children}</>;
}

export default ProtectedRoute;
