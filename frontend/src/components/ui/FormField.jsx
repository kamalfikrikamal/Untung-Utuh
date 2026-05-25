import React from 'react';
import PropTypes from 'prop-types';
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

FormField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
};
