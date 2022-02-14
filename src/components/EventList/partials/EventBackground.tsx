import Image from 'next/image';

import modern from '../../../assets/modern-placeholder.jpg';

const format2image: Record<string, StaticImageData> = {
  modern,
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
      quality={100}
      className="opacity-70"
    />
  );
}