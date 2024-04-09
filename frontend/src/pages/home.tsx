import { GridListWithHeading as Features } from '~/components/features';
import { Hero } from '~/components/hero';

const Home = (): JSX.Element => {
  return (
    <main>
      <Hero />
      <Features />
    </main>
  );
};

// eslint-disable-next-line import/no-default-export
export default Home;
