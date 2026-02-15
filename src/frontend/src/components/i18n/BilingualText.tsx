import { ReactNode } from 'react';

interface BilingualTextProps {
  english: ReactNode;
  regional: ReactNode;
  englishClassName?: string;
  regionalClassName?: string;
  containerClassName?: string;
}

export default function BilingualText({
  english,
  regional,
  englishClassName = '',
  regionalClassName = 'text-sm mt-1 opacity-80',
  containerClassName = '',
}: BilingualTextProps) {
  return (
    <div className={containerClassName}>
      <div className={englishClassName}>{english}</div>
      <div className={regionalClassName}>{regional}</div>
    </div>
  );
}
