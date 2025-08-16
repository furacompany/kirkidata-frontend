import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Mail } from 'lucide-react';

const schema = yup.object().shape({
  identifier: yup.string().required('Email or phone is required'),
});

type ForgotPasswordInputs = {
  identifier: string;
};

const ForgotPassword: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (_data: ForgotPasswordInputs) => {
    // handle forgot password
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-background px-2">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-card w-full max-w-sm p-8 flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 mb-2">
                      <span className="text-2xl font-extrabold text-primary tracking-tight">KIRKIDATA</span>
          <span className="text-muted text-sm">Forgot Password</span>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1">Email or Phone</label>
            <div className="flex items-center border rounded-xl px-2">
              <Mail className="w-4 h-4 text-muted mr-2" />
              <input {...register('identifier')} className="w-full py-2 outline-none" placeholder="Email or Phone" />
            </div>
            {errors.identifier && <p className="text-error text-xs mt-1">{errors.identifier.message}</p>}
          </div>
        </div>
        <button type="submit" className="w-full bg-gradient-to-r from-primary to-accent text-white py-2 rounded-xl hover:scale-105 shadow-card transition font-semibold">Send OTP</button>
        <div className="flex justify-between mt-2 text-xs">
          <a href="/login" className="text-accent hover:underline">Login</a>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword; 