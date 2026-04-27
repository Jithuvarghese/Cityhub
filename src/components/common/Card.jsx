import PropTypes from 'prop-types';

/**
 * Reusable Card component
 */
const Card = ({ 
  children, 
  className = '',
  padding = 'md',
  hover = false,
  onClick,
  ...props 
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  };
  
  const hoverClass = hover ? 'hover:shadow-lg transition-shadow duration-200 cursor-pointer' : '';
  const clickableClass = onClick ? 'cursor-pointer' : '';
  
  return (
    <div 
      className={`bg-white rounded-lg shadow-md dark:bg-gray-800 ${paddingClasses[padding]} ${hoverClass} ${clickableClass} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick(e) : undefined}
      {...props}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  padding: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl']),
  hover: PropTypes.bool,
  onClick: PropTypes.func
};

export default Card;
