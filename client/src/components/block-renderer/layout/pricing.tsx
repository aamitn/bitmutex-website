import type { PriceGridProps } from "@/types";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function Pricing(data: Readonly<PriceGridProps>) {
  if (!data) return null;
  const priceItems = data.priceCard;

  return (
    <section className="container flex flex-col items-center gap-6 py-24 sm:gap-7">
      <div className="mt-7 grid w-full grid-cols-1 gap-7 lg:grid-cols-3">
        {priceItems.map(({ id, heading, description, price, selected, feature, link }) => {
          const selectedStyle = selected ? "border-2 border-primary" : "";
          return (
            <Card className={cn("relative shadow-lg h-full", selectedStyle)} key={id}>
              <CardContent className="flex flex-col h-full p-7 pb-16 relative">
                <h4 className="font-heading text-2xl font-semibold text-foreground">{heading}</h4>
                <p className="mt-2 text-muted-foreground">{description}</p>
                <div className="mt-5">
                  <span className="font-heading text-5xl font-semibold">${price}</span>
                  <span className="text-sm"> /month</span>
                </div>
                <ul className="space-y-2 mt-9  mb-9 ">
                  {feature?.map((item) => (
                    <li className="flex items-center gap-2" key={item.id}>
                      <Check size={20} className="text-primary" />
                      <span className="text-sm text-muted-foreground">{item.description}</span>
                    </li>
                  ))}
                </ul>

                {/* Button Wrapper - Fixed at Bottom */}
                <div className="absolute bottom-7 left-0 right-0 px-7">
                  <Button size="lg" asChild className="w-full">
                    <Link href={link.href}>{link.text}</Link>
                  </Button>
                </div>
              </CardContent>

              {/* "Most Popular" Badge */}
              {selected ? (
                <span className="absolute inset-x-0 -top-5 mx-auto w-32 rounded-full bg-primary px-3 py-2 text-center text-sm font-semibold text-primary-foreground shadow-md">
                  Most popular
                </span>
              ) : null}
            </Card>

          );
        })}
      </div>
    </section>
  );
}
