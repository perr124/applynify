const KlarnaBadge = () => {
  return (
    <div className='flex items-center justify-center gap-2 text-sm text-gray-600'>
      <span>Split into 4 installments with</span>
      <svg
        className='h-4'
        viewBox='0 0 75 20'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <rect width='75' height='20' rx='4' fill='#FFB3C7' />
        <text
          x='50%'
          y='50%'
          dominantBaseline='middle'
          textAnchor='middle'
          fill='#000'
          fontSize='12'
          fontWeight='700'
          fontFamily='Arial, sans-serif'
        >
          Klarna
        </text>
      </svg>
    </div>
  );
};

export default KlarnaBadge;

