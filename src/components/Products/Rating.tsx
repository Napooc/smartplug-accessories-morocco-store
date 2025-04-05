
import { Star } from 'lucide-react';

export interface RatingProps {
  value: number;
  max?: number;
}

export function Rating({ value, max = 5 }: RatingProps) {
  const stars = [];
  
  for (let i = 1; i <= max; i++) {
    if (i <= value) {
      stars.push(<Star key={i} size={16} fill="#FBBF24" stroke="#FBBF24" />);
    } else if (i - 0.5 <= value) {
      stars.push(
        <div key={i} className="relative">
          <Star size={16} fill="#FBBF24" stroke="#FBBF24" className="absolute" style={{ clipPath: 'inset(0 50% 0 0)' }} />
          <Star size={16} stroke="#FBBF24" />
        </div>
      );
    } else {
      stars.push(<Star key={i} size={16} stroke="#FBBF24" />);
    }
  }
  
  return <div className="flex">{stars}</div>;
}
