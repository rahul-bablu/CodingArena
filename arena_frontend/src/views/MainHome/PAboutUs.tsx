import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const movieData = [
  {
    title: "Inception",
    releaseYear: 2010,
    genre: ["Action", "Sci-Fi", "Thriller"],
    director: "Christopher Nolan",
    description:
      "A skilled thief is offered a chance to have his criminal history erased if he can implant another person's idea into a target's subconscious.",
    imageUrl:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.explicit.bing.net%2Fth%3Fid%3DOIP.Hz7rEtzKCjkE-feei-7asAHaLH%26pid%3DApi&f=1&ipt=b59c3e66f7f46cdea7cd7957ecdeed3cd198f4266a126c6a99b3f7f827513e00&ipo=images",
  },
  {
    title: "The Shawshank Redemption",
    releaseYear: 1994,
    genre: ["Drama"],
    director: "Frank Darabont",
    description:
      "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    imageUrl:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.yobjBRMMdekQvZwGHeebKgHaLH%26pid%3DApi&f=1&ipt=04886b6e3e7424640709ac399e7286868b0027c94093aa3f37847bf643e364df&ipo=images",
  },
  {
    title: "The Godfather",
    releaseYear: 1972,
    genre: ["Crime", "Drama"],
    director: "Francis Ford Coppola",
    description:
      "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    imageUrl:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.4GKJG_7gWWKFmJJdi6-HTQHaLK%26pid%3DApi&f=1&ipt=6be65fa6f2d4b586e617c1ace7300e1d743f55f8ec26ae113c5696260b4fba33&ipo=images",
  },
  {
    title: "Pulp Fiction",
    releaseYear: 1994,
    genre: ["Crime", "Drama"],
    director: "Quentin Tarantino",
    description:
      "The lives of two mob hitmen, a boxer, a gangster's wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    imageUrl:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.JzYnwQk_OqfqTGUl5ZUTsgHaLH%26pid%3DApi&f=1&ipt=4055dadb58486a58163979bd793aa0d1ce62e18d3653db4773d1ff3cb0aa48a7&ipo=images",
  },
  {
    title: "The Dark Knight",
    releaseYear: 2008,
    genre: ["Action", "Crime", "Drama"],
    director: "Christopher Nolan",
    description:
      "When the menace known as the Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham.",
    imageUrl:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.NN9rKH-vZbFgtH4FuoW7OwHaLH%26pid%3DApi&f=1&ipt=160e03d164280c2e188b437fd66d80988778ac19582fbc5a42f8b6a336c6c9a6&ipo=images",
  },
  {
    title: "Forrest Gump",
    releaseYear: 1994,
    genre: ["Drama", "Romance"],
    director: "Robert Zemeckis",
    description:
      "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal, and other historical events unfold through the perspective of an Alabama man.",
    imageUrl:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.aBuK-cB1uvAur7DN9V9bgAHaKp%26pid%3DApi&f=1&ipt=d74d1ac222f39db7db0abf1d35dc47695dcfb8b55c675b33c0470f92f7853412&ipo=images",
  },
  {
    title: "The Matrix",
    releaseYear: 1999,
    genre: ["Action", "Sci-Fi"],
    director: "Lana Wachowski, Lilly Wachowski",
    description:
      "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    imageUrl:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.gjF_px0_PyPzmI2fButiWAHaLH%26pid%3DApi&f=1&ipt=61a23dfe1b042f4a6871709c3ff407dd6d97bd3264984526f7602597b5e13c29&ipo=images",
  },
  {
    title: "Fight Club",
    releaseYear: 1999,
    genre: ["Drama"],
    director: "David Fincher",
    description:
      "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.",
    imageUrl:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.uBlOvPkHm1gSPsBSICDHgwHaKz%26pid%3DApi&f=1&ipt=8d5d3d89d8f289f1f87272773ab7e2043ecae0161bf1ab50d2c77a6cf31cb0da&ipo=images",
  },
  {
    title: "The Social Network",
    releaseYear: 2010,
    genre: ["Biography", "Drama"],
    director: "David Fincher",
    description:
      "As Harvard students create the social networking site that would become known as Facebook, they face personal and legal complications.",
    imageUrl:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.6ZX0iW_0gv6SxVBqC4THCQHaK3%26pid%3DApi&f=1&ipt=49f2e9ed84ce3824b008e045bbb6ddf8c38b8afdf1d7c179c68107fe6356da1e&ipo=images",
  },
  {
    title: "Interstellar",
    releaseYear: 2014,
    genre: ["Adventure", "Drama", "Sci-Fi"],
    director: "Christopher Nolan",
    description:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    imageUrl:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.qIQhYQ_QDVC28ScsUPfqyQHaK9%26pid%3DApi&f=1&ipt=c64a4b03e48e84e056d4285ee2f5f4e7c3b12049924ffd986cdaf1c06b8719d4&ipo=images",
  },
];

const PAboutUs = () => {
  const [leftImage, setLeftImage] = useState(movieData[0].imageUrl); // Default image
  const rightRef = useRef<any>(null);

  useEffect(() => {
    const observerOptions = {
      root: null, // Uses the viewport as the root
      rootMargin: "0px",
      threshold: 0.5, // Trigger when 50% of the heading is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const movieIndex: any = entry.target.getAttribute("data-index");
          setLeftImage(movieData[movieIndex].imageUrl);
        }
      });
    }, observerOptions);

    // Observe each heading in the right section
    const rightSection = rightRef.current;
    if (rightSection) {
      const headings = rightSection.querySelectorAll("h1");
      headings.forEach((heading: any) => observer.observe(heading));
    }

    // Cleanup observer on component unmount
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div style={{background: 'var(--bg-color)', color: 'var(--text-color)', position: 'relative'}}>
      <div className="__section-title" 
      // style={{background: 'var(--bg-color)', position: 'sticky', top: 55, zIndex: 99}}
      >
        Past Events
      </div>
    <div style={{ position: "relative", width: "100%", display: "flex",  }}>
      {/* Left Component (Sticky) */}
      <div
        style={{
          position: "sticky",
          width: "45%",
          top: "55px",
          height: "calc(100vh - 55px)",
          display: "inline-block",
        }}
      >
        <div
          style={{ display: "grid", placeContent: "center", height: "100%" }}
        >
          <motion.img
            src={leftImage}
            style={{ width: "80%", borderRadius: "8px" }}
            key={leftImage} // Key update triggers re-animation
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          />
        </div>
      </div>

      {/* Right Component */}
      <div
        ref={rightRef}
        style={{
          display: "inline-block",
          width: "55%",
          backgroundColor: "#050d1a",
          color: "white",
          paddingInline: "10%",
          paddingBlock: '100px'
        }}
      >
        {movieData.map((movie, index) => (
          <div
            key={index}
            style={{
              minHeight: "calc(90vh - 55px)",
              paddingBottom: "100px",
              fontSize: "1rem",
            }}
          >
            <h1 data-index={index} style={{ fontSize: "2em" }}>
              {movie.title}
            </h1>
            <p style={{  fontWeight: "bold" }}>
              {movie.releaseYear}
            </p>
            <p style={{  fontStyle: "italic" }}>
              <strong>Year:</strong> {movie.releaseYear}
            </p>
            <p style={{  fontStyle: "italic" }}>
              <strong>Genre:</strong> {movie.genre.join(", ")}
            </p>
            <p style={{  fontStyle: "italic" }}>
              <strong>Director:</strong> {movie.director}
            </p>
            <p>{movie.description}</p>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default PAboutUs;
