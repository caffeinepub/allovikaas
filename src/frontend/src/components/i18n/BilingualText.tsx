import React from 'react';

interface BilingualTextProps {
  english: React.ReactNode;
  regional: React.ReactNode;
  containerClassName?: string;
  englishClassName?: string;
  regionalClassName?: string;
}

export default function BilingualText({
  english,
  regional,
  containerClassName = '',
  englishClassName = '',
  regionalClassName = '',
}: BilingualTextProps) {
  return (
    <div className={containerClassName}>
      <div className={englishClassName}>{english}</div>
      <div className={regionalClassName}>{regional}</div>
    </div>
  );
}
