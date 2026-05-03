import { useEffect } from 'react';
import { useStore } from '../store';

const normalizeOption = (option) =>
  typeof option === 'string' ? { value: option, label: option } : option;

export const NodeField = ({
  id,
  name,
  label,
  type = 'text',
  options = [],
  defaultValue = '',
  className,
  ...rest
}) => {
  const value = useStore(
    (state) => state.nodes.find((node) => node.id === id)?.data?.[name]
  );
  const updateNodeField = useStore((state) => state.updateNodeField);

  useEffect(() => {
    if (value === undefined) {
      updateNodeField(id, name, defaultValue);
    }
  }, [id, name, value, defaultValue, updateNodeField]);

  const displayValue = value !== undefined ? value : defaultValue;
  const onChange = (e) => updateNodeField(id, name, e.target.value);

  const control =
    type === 'select' ? (
      <select
        className={className || 'vs-select'}
        value={displayValue}
        onChange={onChange}
        {...rest}
      >
        {options.map((option) => {
          const { value: optValue, label: optLabel } = normalizeOption(option);
          return (
            <option key={optValue} value={optValue}>
              {optLabel}
            </option>
          );
        })}
      </select>
    ) : type === 'textarea' ? (
      <textarea
        className={className || 'vs-textarea'}
        value={displayValue}
        onChange={onChange}
        {...rest}
      />
    ) : (
      <input
        type={type}
        className={className || 'vs-input'}
        value={displayValue}
        onChange={onChange}
        {...rest}
      />
    );

  return (
    <label style={{ display: 'flex', flexDirection: 'column' }}>
      {label && <span className="vs-field-label">{label}</span>}
      {control}
    </label>
  );
};
