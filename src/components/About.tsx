import "../styles/About.css";

export const About = () => {
  return (
    <div className="About">
      <h1 className="About__title">About</h1>
      <h2 className="About__hi">Hi!</h2>
      <article className="About__body">
        <p>
          For as far as I can remember, I have enjoyed languages, their beauty,
          their complexity, their quirks, and the underlying humor that gives
          every tongue its own charm. Over the years and through countless
          talks, chats, discussions or otherwise debates, pointing out the
          ridiculoussness of the words that had just been uttered by my
          counterpart has almost become like a sport. Once captured, these words
          would be framed, thus gaining an entirely new context or meaning, like
          a life of their own, and would become, if only for an instant, a
          fleeting reminder that we came from dust and to dust we shall return.
        </p>
        <p>
          While happily unemployed as of recent, I decided to take some time and
          create this (silly) web app in order to have fun and pass time while
          learning, practicing and honing my skills in the unforgiving craft of
          juggling chainsaws while monocycling on a spinning ball of fire, also
          known as frontend web development.
        </p>
        <p>
          With this app I hope that other (silly) band name enthusiasts like
          myself will find as much joy as I do in capturing, sharing and liking
          the band names of others. But remember, a good{" "}
          <span className="Globals__bandName">BandName!</span> is one that is
          born in context, organically, within a discussion with one or more
          other humans (or whatever Neanderthals you like going to the pub
          with). Although coming up with a{" "}
          <span className="Globals__bandName">BandName!</span> you hear from a
          Netflix show about children in the 80s or, Dog forbid, from a book,
          can be funny, it will never have the impact, the weight, no, the{" "}
          <b>pizzazz</b> of an organically grown, carbon neutral, non-GMO{" "}
          <span className="Globals__bandName">BandName!</span>.
        </p>
        <p>
          So let's keep it fun, keep it legal but most of all, let's keep it
          funny.
        </p>
        <p>
          Yours truly,
          <br />
          BN
        </p>
      </article>
    </div>
  );
};
