import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import Carousel from "../../components/Carousel";
import Header from "../../components/Header";
import Logo from "../../components/Icons/Logo";
import getResults from "../../utils/cachedImages";
import getBase64ImageUrl from "../../utils/generateBlurPlaceholder";
import type { ImageProps } from "../../utils/types";

const Home: NextPage = ({ currentPhoto }: { currentPhoto: ImageProps }) => {
  const router = useRouter();
  const { photoId } = router.query;
  let index = Number(photoId);
  const { data: session, status } = useSession();

  const currentPhotoUrl = currentPhoto.urls?.regular || '';

  return (
    <>
      <Head>
        <title>Next.js Conf 2022 Photos</title>
        <meta property="og:image" content={currentPhotoUrl} />
        <meta name="twitter:image" content={currentPhotoUrl} />
      </Head>
      <Header />
      <main className="mx-auto max-w-[1960px] p-4">
        {status === "loading" ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-white text-xl">Loading...</div>
          </div>
        ) : session ? (
          <Carousel currentPhoto={currentPhoto} index={index} />
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="mb-8">
                <Logo />
                <h1 className="mt-8 mb-4 text-4xl font-bold uppercase tracking-widest text-white">
                  Photo Gallery
                </h1>
                <p className="max-w-[40ch] text-white/75 mx-auto">
                  Please sign in to view the photo gallery
                </p>
              </div>
              <button
                onClick={() => signIn("ssojet")}
                className="px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg font-semibold"
              >
                Sign In to View Photos
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async (context) => {
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

  const currentPhoto = reducedResults.find(
    (img) => img.id === Number(context.params.photoId),
  );
  currentPhoto.blurDataUrl = await getBase64ImageUrl(currentPhoto);

  return {
    props: {
      currentPhoto: currentPhoto,
    },
  };
};

export async function getStaticPaths() {
  const results = await getResults();

  let fullPaths = [];
  for (let i = 0; i < results.resources.length; i++) {
    fullPaths.push({ params: { photoId: i.toString() } });
  }

  return {
    paths: fullPaths,
    fallback: false,
  };
}
