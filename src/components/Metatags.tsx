type Props = { title: string; description: string; image: string };

export const Metatags = ({ title, description, image }: Props) => {
  return (
    <header>
      <title>{title}</title>
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
    </header>
  );
};
