import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { memo, useEffect, useState } from 'react';

interface AppSearchProps {
  value?: string;
  placeholder?: string;
  onSearch: (value: string) => void;
  debounceMs?: number;
}

export const AppSearch = memo(
  ({
    value = '',
    placeholder = 'Search...',
    onSearch,
    debounceMs = 350,
  }: AppSearchProps) => {
    const [local, setLocal] = useState(value);

    useEffect(() => {
      setLocal(value);
    }, [value]);

    useEffect(() => {
      const timer = setTimeout(() => onSearch(local), debounceMs);
      return () => clearTimeout(timer);
    }, [local, debounceMs, onSearch]);

    return (
      <Input
        allowClear
        prefix={<SearchOutlined />}
        placeholder={placeholder}
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        style={{ maxWidth: 320 }}
      />
    );
  },
);

AppSearch.displayName = 'AppSearch';
