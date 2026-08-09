import { Button as AntButton, type ButtonProps } from 'antd';
import { memo } from 'react';

export const AppButton = memo((props: ButtonProps) => <AntButton {...props} />);

AppButton.displayName = 'AppButton';
