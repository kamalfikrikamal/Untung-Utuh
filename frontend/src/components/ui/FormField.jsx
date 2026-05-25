import React from 'react';
import { Input } from './Input';
import { Label } from './Label';

export function FormField({ id, label, error, ...props }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} error={error} {...props} />
    </div>
  );
}
