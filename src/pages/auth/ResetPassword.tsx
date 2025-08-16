import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Lock, Key } from 'lucide-react';

const schema = yup.object().shape({
  otp: yup.string().required('OTP is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm your password'),
});

type ResetPasswordInputs = {
  otp: string;
  password: string;
  confirmPassword: string;
};

const ResetPassword: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (_data: ResetPasswordInputs) => {
    // handle reset password
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-background px-2">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-card w-full max-w-sm p-8 flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 mb-2">
                      <span className="text-2xl font-extrabold text-primary tracking-tight">KIRKIDATA</span>
          <span className="text-muted text-sm">Reset Password</span>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1">OTP</label>
            <div className="flex items-center border rounded-xl px-2">
              <Key className="w-4 h-4 text-muted mr-2" />
              <input {...register('otp')} className="w-full py-2 outline-none" placeholder="OTP" />
            </div>
            {errors.otp && <p className="text-error text-xs mt-1">{errors.otp.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">New Password</label>
            <div className="flex items-center border rounded-xl px-2">
              <Lock className="w-4 h-4 text-muted mr-2" />
              <input type="password" {...register('password')} className="w-full py-2 outline-none" placeholder="New Password" />
            </div>
            {errors.password && <p className="text-error text-xs mt-1">{errors.password.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Confirm Password</label>
            <div className="flex items-center border rounded-xl px-2">
              <Lock className="w-4 h-4 text-muted mr-2" />
              <input type="password" {...register('confirmPassword')} className="w-full py-2 outline-none" placeholder="Confirm Password" />
            </div>
            {errors.confirmPassword && <p className="text-error text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>
        </div>
        <button type="submit" className="w-full bg-gradient-to-r from-primary to-accent text-white py-2 rounded-xl hover:scale-105 shadow-card transition font-semibold">Reset Password</button>
        <div className="flex justify-between mt-2 text-xs">
          <a href="/login" className="text-accent hover:underline">Login</a>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword; 