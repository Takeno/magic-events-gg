import Image from 'next/image';

import modern from '../../../assets/modern-placeholder.jpg';
import pauper from '../../../assets/pauper-placeholder.png';

const format2image: Record<string, StaticImageData> = {
  modern,
  pauper,
};

type EventBackgroundProps = {
  event: Tournament;
};

export default function EventBackground({event}: EventBackgroundProps) {
  const image = format2image[event.format] || format2image.modern;

  return (
    <Image
      src={image}
      alt={event.format}
      layout="fill"
      objectFit="cover"
      objectPosition="top center"
      className="opacity-70"
      sizes="(min-width: 1024px) 300px, 100vw"
    />
  );
}
