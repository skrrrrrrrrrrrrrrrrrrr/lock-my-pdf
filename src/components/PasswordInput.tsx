import React, { useState } from 'react';
import { Eye, EyeOff, Lock, AlertCircle, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface PasswordInputProps {
  password: string;
  onPasswordChange: (password: string) => void;
  confirmPassword: string;
  onConfirmPasswordChange: (password: string) => void;
  error?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  password,
  onPasswordChange,
  confirmPassword,
  onConfirmPasswordChange,
  error
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordStrength = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
  };

  const strengthScore = Object.values(passwordStrength).filter(Boolean).length;
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const getStrengthColor = () => {
    if (strengthScore <= 2) return 'text-destructive';
    if (strengthScore <= 3) return 'text-warning';
    return 'text-success';
  };

  const getStrengthText = () => {
    if (strengthScore <= 2) return 'Weak';
    if (strengthScore <= 3) return 'Medium';
    return 'Strong';
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password" className="flex items-center space-x-2">
          <Lock className="h-4 w-4" />
          <span>Set Password</span>
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="Enter a strong password"
            className={cn(
              "pr-10",
              error && "border-destructive focus:border-destructive"
            )}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        
        {password && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Password strength:</span>
              <span className={cn("text-sm font-medium", getStrengthColor())}>
                {getStrengthText()}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1 rounded-full transition-colors",
                    i < strengthScore
                      ? strengthScore <= 2
                        ? "bg-destructive"
                        : strengthScore <= 3
                        ? "bg-warning"
                        : "bg-success"
                      : "bg-muted"
                  )}
                />
              ))}
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex items-center space-x-2">
                {passwordStrength.length ? (
                  <Check className="h-3 w-3 text-success" />
                ) : (
                  <div className="h-3 w-3 rounded-full border border-muted-foreground" />
                )}
                <span>At least 8 characters</span>
              </div>
              <div className="flex items-center space-x-2">
                {passwordStrength.uppercase && passwordStrength.lowercase ? (
                  <Check className="h-3 w-3 text-success" />
                ) : (
                  <div className="h-3 w-3 rounded-full border border-muted-foreground" />
                )}
                <span>Upper and lowercase letters</span>
              </div>
              <div className="flex items-center space-x-2">
                {passwordStrength.number ? (
                  <Check className="h-3 w-3 text-success" />
                ) : (
                  <div className="h-3 w-3 rounded-full border border-muted-foreground" />
                )}
                <span>At least one number</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
            placeholder="Confirm your password"
            className={cn(
              "pr-10",
              confirmPassword && !passwordsMatch && "border-destructive focus:border-destructive",
              confirmPassword && passwordsMatch && "border-success focus:border-success"
            )}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        
        {confirmPassword && (
          <div className="flex items-center space-x-2 text-sm">
            {passwordsMatch ? (
              <>
                <Check className="h-4 w-4 text-success" />
                <span className="text-success">Passwords match</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="text-destructive">Passwords do not match</span>
              </>
            )}
          </div>
        )}
      </div>
      
      {error && (
        <div className="flex items-center space-x-2 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  );
};