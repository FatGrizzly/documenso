import { HTMLAttributes } from 'react';

import Image from 'next/image';

import { cn } from '@documenso/ui/lib/utils';
import { Card, CardContent } from '@documenso/ui/primitives/card';

import backgroundPattern from '~/assets/background-pattern.png';
import cardBeautifulFigure from '~/assets/card-beautiful-figure.png';
import cardFastFigure from '~/assets/card-fast-figure.png';
import cardSmartFigure from '~/assets/card-smart-figure.png';

export type FasterSmarterBeautifulBentoProps = HTMLAttributes<HTMLDivElement>;

export const FasterSmarterBeautifulBento = ({
  className,
  ...props
}: FasterSmarterBeautifulBentoProps) => {
  return (
    <div className={cn('relative', className)} {...props}>
      <div className="absolute inset-0 -z-10 flex items-center justify-center">
        <Image
          src={backgroundPattern}
          alt="background pattern"
          className="h-full scale-125 object-cover md:scale-150 lg:scale-[175%]"
        />
      </div>
      <h2 className="px-0 text-[22px] font-semibold md:px-12 md:text-4xl lg:px-24">
        A 10x better signing experience.
        <span className="block md:mt-0">Faster, smarter and more beautiful.</span>
      </h2>

      <div className="mt-6 grid grid-cols-2 gap-8 md:mt-8">
        <Card className="col-span-2" degrees={45} gradient>
          <CardContent className="grid grid-cols-12 gap-8 overflow-hidden p-6 lg:aspect-[2.5/1]">
            <p className="col-span-12 leading-relaxed text-[#555E67] lg:col-span-6">
              <strong className="block">Fast.</strong>
              When it comes to sending or receiving a contract, you can count on lightning-fast
              speeds.
            </p>

            <div className="col-span-12 -my-6 -mr-6 flex items-end justify-end pt-12 lg:col-span-6">
              <Image src={cardFastFigure} alt="its fast" className="max-w-[80%] lg:max-w-none" />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 lg:col-span-1" spotlight>
          <CardContent className="grid grid-cols-1 gap-8 p-6">
            <p className="leading-relaxed text-[#555E67]">
              <strong className="block">Beautiful.</strong>
              Because signing should be celebrated. That’s why we care about the smallest detail in
              our product.
            </p>

            <div className="flex items-center justify-center p-8">
              <Image src={cardBeautifulFigure} alt="its fast" className="w-full max-w-xs" />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 lg:col-span-1" spotlight>
          <CardContent className="grid grid-cols-1 gap-8 p-6">
            <p className="leading-relaxed text-[#555E67]">
              <strong className="block">Smart.</strong>
              Our custom templates come with smart rules that can help you save time and energy.
            </p>

            <div className="flex items-center justify-center p-8">
              <Image src={cardSmartFigure} alt="its fast" className="w-full max-w-[16rem]" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
