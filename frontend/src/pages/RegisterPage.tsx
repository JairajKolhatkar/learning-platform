import React from 'react';
import Layout from '../components/layout/Layout';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    <Layout>
      <div className="pt-16 pb-20 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <RegisterForm />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;