import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Mail, Lock } from 'lucide-react';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

type AdminLoginFormInputs = {
  email: string;
  password: string;
};

const AdminLoginPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<AdminLoginFormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (_data: AdminLoginFormInputs) => {
    // handle admin login
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-primary">Admin Login</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-text mb-1">Email</label>
          <div className="flex items-center border rounded px-2">
            <Mail className="w-4 h-4 text-secondaryText mr-2" />
            <input {...register('email')} className="w-full py-2 outline-none" placeholder="Email" />
          </div>
          {errors.email && <p className="text-danger text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-text mb-1">Password</label>
          <div className="flex items-center border rounded px-2">
            <Lock className="w-4 h-4 text-secondaryText mr-2" />
            <input type="password" {...register('password')} className="w-full py-2 outline-none" placeholder="Password" />
          </div>
          {errors.password && <p className="text-danger text-xs mt-1">{errors.password.message}</p>}
        </div>
        <button type="submit" className="w-full bg-primary text-white py-2 rounded hover:bg-dark transition">Login</button>
      </form>
    </div>
  );
};

export default AdminLoginPage; 