'use client';

import React from 'react';
import Layout from '../components/layout/Layout';
import RegisterForm from '../components/auth/RegisterForm';

export default function Register() {
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
        <RegisterForm />
      </div>
    </Layout>
  );
}