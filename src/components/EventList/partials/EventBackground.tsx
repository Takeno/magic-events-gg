import Image, {StaticImageData} from 'next/image';

import standard from '../../../assets/standard-placeholder.jpg';
import modern from '../../../assets/modern-placeholder.jpg';
import vintage from '../../../assets/vintage-placeholder.jpg';
import legacy from '../../../assets/legacy-placeholder.jpg';
import commander from '../../../assets/commander-placeholder.webp';
import centurion from '../../../assets/centurion-placeholder.jpg';
import pauper from '../../../assets/pauper-placeholder.png';
import pioneer from '../../../assets/pioneer-placeholder.jpg';
import draft from '../../../assets/draft-placeholder.jpg';
import sealed from '../../../assets/sealed-placeholder.jpg';

const format2image: Record<Format, StaticImageData> = {
  standard,
  modern,
  pauper,
  vintage,
  commander,
  centurion,
  legacy,
  pioneer,
  draft,
  sealed,
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
      fill
      className="opacity-70 object-cover object-center"
      sizes="(min-width: 1024px) 300px, 100vw"
    />
  );
}
