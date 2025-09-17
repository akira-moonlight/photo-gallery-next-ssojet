import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import Bridge from "../components/Icons/Bridge";
import Logo from "../components/Icons/Logo";
import Modal from "../components/Modal";
import Header from "../components/Header";
import getResults from "../utils/cachedImages";
import getBase64ImageUrl from "../utils/generateBlurPlaceholder";
import type { ImageProps } from "../utils/types";
import { useLastViewedPhoto } from "../utils/useLastViewedPhoto";

const Home: NextPage = ({ images }: { images: ImageProps[] }) => {
  const router = useRouter();
  const { photoId } = router.query;
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();
  const { data: session, status } = useSession();
  const [selectedPhotoId, setSelectedPhotoId] = useState<number | null>(null);

  const lastViewedPhotoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This effect keeps track of the last viewed photo in the modal to keep the index page in sync when the user navigates back
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef.current.scrollIntoView({ block: "center" });
      setLastViewedPhoto(null);
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto]);

  return (
    <>
      <Head>
        <title>Photo Gallery - Secure Image Collection with SSOJet Authentication</title>
        <meta
          name="description"
          content="A modern, responsive photo gallery built with Next.js and SSOJet OpenID Connect authentication. Features beautiful masonry layout, full-screen modal viewing, and secure access control."
        />
        <meta
          name="keywords"
          content="photo gallery, image collection, SSOJet, authentication, Next.js, React, secure gallery, OpenID Connect"
        />
        <meta
          property="og:title"
          content="Photo Gallery - Secure Image Collection with SSOJet Authentication"
        />
        <meta
          property="og:description"
          content="A modern, responsive photo gallery built with Next.js and SSOJet OpenID Connect authentication. Features beautiful masonry layout, full-screen modal viewing, and secure access control."
        />
        <meta
          property="og:type"
          content="website"
        />
        <meta
          property="og:url"
          content="https://your-domain.com"
        />
        <meta
          property="og:image"
          content="https://your-domain.com/og-image.png"
        />
        <meta
          name="twitter:card"
          content="summary_large_image"
        />
        <meta
          name="twitter:title"
          content="Photo Gallery - Secure Image Collection with SSOJet Authentication"
        />
        <meta
          name="twitter:description"
          content="A modern, responsive photo gallery built with Next.js and SSOJet OpenID Connect authentication. Features beautiful masonry layout, full-screen modal viewing, and secure access control."
        />
        <meta
          name="twitter:image"
          content="https://your-domain.com/og-image.png"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <meta
          name="author"
          content="Photo Gallery Team"
        />
        <meta
          name="robots"
          content="index, follow"
        />
      </Head>
      <Header />
      <main className="mx-auto max-w-[1960px] p-4 min-h-[calc(100vh-4rem)]">
        {selectedPhotoId !== null && (
          <Modal
            images={images}
            selectedPhotoId={selectedPhotoId}
            onClose={() => {
              setLastViewedPhoto(selectedPhotoId);
              setSelectedPhotoId(null);
            }}
            onChangePhoto={(newPhotoId) => setSelectedPhotoId(newPhotoId)}
          />
        )}
        
        {status === "loading" ? (
          <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
            <div className="text-white text-xl">Loading...</div>
          </div>
        ) : session ? (
          <div className="columns-1 gap-4 sm:columns-2 xl:columns-3 2xl:columns-4">
         
          {images.map(({ id, public_id, format, blurDataUrl }) => (
            <div
              key={id}
              ref={id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
              className="after:content group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
            >
              <button
                onClick={() => setSelectedPhotoId(id)}
                className="w-full h-full"
              >
                <Image
                  alt="Next.js Conf photo"
                  className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
                  style={{ transform: "translate3d(0, 0, 0)" }}
                  placeholder="blur"
                  blurDataURL={blurDataUrl}
                  src={images.find(img => img.id === id)?.urls?.small || ''}
                  width={720}
                  height={480}
                  sizes="(max-width: 640px) 100vw,
                    (max-width: 1280px) 50vw,
                    (max-width: 1536px) 33vw,
                    25vw"
                />
              </button>
            </div>
          ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-start h-[calc(100vh-4rem)] pt-20">
            <div className="text-center max-w-md mx-auto px-4">
              <div className="mb-6">
             
                <h1 className="mt-6 mb-3 text-3xl font-bold uppercase tracking-widest text-white">
                  Photo Gallery
                </h1>
                <p className="text-white/75 text-sm leading-relaxed">
                  Please sign in to view the photo gallery
                </p>
              </div>
              <button
                onClick={() => signIn("ssojet")}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-base font-semibold w-full"
              >
                Sign In to View Photos
              </button>
            </div>
            <footer className="p-4 text-center text-white/60 text-sm">
              Thank you to{" "}
              <a
                href="https://ssojet.com/"
                target="_blank"
                className="font-semibold hover:text-white"
                rel="noreferrer"
              >
                SSOJET
              </a>{" "}
              for the easy implementation.
            </footer>
          </div>
        )}
      </main>
      {session && (
        <footer className="p-6 text-center text-white/80 sm:p-12">
          Thank you to{" "}
          <a
            href="https://ssojet.com/"
            target="_blank"
            className="font-semibold hover:text-white"
            rel="noreferrer"
          >
            SSOJET
          </a>{" "}
          for the easy implementation.
        </footer>
      )}
    </>
  );
};

export default Home;

export async function getStaticProps() {
  const results = await getResults();
  let reducedResults: ImageProps[] = [];

  let i = 0;
  for (let result of results.resources) {
    reducedResults.push({
      id: i,
      height: result.height,
      width: result.width,
      public_id: result.id, // Use id as public_id for compatibility
      format: 'jpg', // Default format for Unsplash images
      urls: result.urls,
      alt_description: result.alt_description,
    });
    i++;
  }

  const blurImagePromises = results.resources.map((image: ImageProps) => {
    return getBase64ImageUrl(image);
  });
  const imagesWithBlurDataUrls = await Promise.all(blurImagePromises);

  for (let i = 0; i < reducedResults.length; i++) {
    reducedResults[i].blurDataUrl = imagesWithBlurDataUrls[i];
  }

  return {
    props: {
      images: reducedResults,
    },
  };
}
