import Navbar from "@/components/navbar";
import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";

export default function Home() {
  const settings = {
    autoplay: true,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto mt-24 sm:mt-32 overflow-x-hidden">
        <div className="sm:grid sm:grid-cols-2 gap-6">
          <div className="md:pr-8">
            <h1 className="mb-6 text-neutral-800 text-2xl">
              Create your own Solana Art Gallery
            </h1>
            <p className="font-sans">
              Create your own gallery of NFT&apos;s that you hold in your
              wallet. Choose your username and get a URL that you
              can share.
            </p>
            <p className="font-sans mt-6">
              Choose which NFT&apos;s you want to hide and then drag &amp; drop
              the remaining NFT&apos;s to make your perfect gallery.
            </p>
          </div>
          <div className="mt-12 sm:mt-0 md:pl-8">
            <Slider {...settings}>
              <div className="border-4 border-neutral-200">
                <Image
                  src="/images/gallery1.png"
                  alt="Gallery Preview Image"
                  width={1429}
                  height={929}
                />
              </div>
              <div className="border-4 border-neutral-200">
                <Image
                  src="/images/gallery2.png"
                  alt="Gallery Preview Image"
                  width={1429}
                  height={929}
                />
              </div>
              <div className="border-4 border-neutral-200">
                <Image
                  src="/images/gallery3.png"
                  alt="Gallery Preview Image"
                  width={1429}
                  height={929}
                />
              </div>
              <div className="border-4 border-neutral-200">
                <Image
                  src="/images/gallery4.png"
                  alt="Gallery Preview Image"
                  width={1429}
                  height={929}
                />
              </div>
            </Slider>
          </div>
        </div>
        <section className="mt-12 border-t pt-4 text-neutral-800"></section>
        <Link href="https://github.com/richardfsr/provable"><img src="/images/github.png" className="w-20 float-right" /></Link>
      </div>
    </>
  );
}
