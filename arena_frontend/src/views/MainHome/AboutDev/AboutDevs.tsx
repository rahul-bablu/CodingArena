import { useEffect, useRef } from "react";
import "./about-dev.css";

interface Developer {
    name: string;
    title: string;
    bio: string;
    skills: string[];
    image: string;
}

const developers: Developer[] = [
    {
        name: "Bezawada Vignesh",
        title: "Frontend Developer",
        bio: "Specializes in React and responsive design. Passionate about creating beautiful and user-friendly interfaces.",
        skills: ["React", "CSS", "JavaScript", "TypeScript"],
        image: "/Vignesh-img-t.png"
    },
    {
        name: "R Rahul",
        title: "Backend Developer",
        bio: "Experienced in Node.js and Express. Focuses on building robust APIs and ensuring seamless database integration.",
        skills: ["Node.js", "Express", "MySQL", "Docker"],
        image: "/rahul-no-bg.png"
    },
    {
        name: "Harinath Reddy",
        title: "Full Stack Developer",
        bio: "Skilled in both frontend and backend development, dedicated to building complete web solutions.",
        skills: ["React", "Node.js", "GraphQL", "MongoDB"],
        image: "/jagadeesh-no-bg.png"
    },
    // Add more developer objects as needed
];

const AboutDevs: React.FC = () => {
    const carouselRef = useRef<HTMLDivElement>(null);
    const nextButtonRef = useRef<HTMLButtonElement>(null);
    const prevButtonRef = useRef<HTMLButtonElement>(null);
    const backButtonRef = useRef<HTMLButtonElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const nextButton = nextButtonRef.current!;
        const prevButton = prevButtonRef.current!;
        const carousel = carouselRef.current!;
        const list = listRef.current!;
        const seeMoreButtons = carousel?.querySelectorAll('.seeMore');
        const backButton = backButtonRef.current;
        
        let unAcceppClick: any;

        const showSlider = (type: string) => {
            if (!carousel || !list || !nextButton || !prevButton) return;

            nextButton.style.pointerEvents = 'none';
            prevButton.style.pointerEvents = 'none';

            carousel.classList.remove('next', 'prev');
            const items = list.querySelectorAll('.item');
            if (type === 'next') {
                list.appendChild(items[0]);
                carousel.classList.add('next');
            } else {
                list.prepend(items[items.length - 1]);
                carousel.classList.add('prev');
            }

            clearTimeout(unAcceppClick);
            unAcceppClick = setTimeout(() => {
                nextButton.style.pointerEvents = 'auto';
                prevButton.style.pointerEvents = 'auto';
            }, 2000);
        };

        nextButton!.onclick = () => showSlider('next');
        prevButton!.onclick = () => showSlider('prev');

        seeMoreButtons?.forEach((button: any) => {
            button.onclick = () => {
                carousel.classList.remove('next', 'prev');
                carousel.classList.add('showDetail');
            };
        });

        backButton!.onclick = () => {
            carousel.classList.remove('showDetail');
        };

        return () => {
            nextButton!.onclick = null;
            prevButton!.onclick = null;
            seeMoreButtons?.forEach((button :any) => button.onclick = null);
            backButton!.onclick = null;
        };
    }, []);

    return (
        <div className="carousel" ref={carouselRef}>
            <div className="list" ref={listRef}>
                {developers.map((developer, index) => (
                    <div className="item" key={index}>
                        <img src={developer.image} alt={developer.name} />
                        <div className="introduce">
                            <div className="name">{developer.name}</div>
                            <div className="title">{developer.title}</div>
                            <div className="bio">{developer.bio}</div>
                            <button className="seeMore">SEE MORE &#8599;</button>
                        </div>
                        <div className="detail">
                            <div className="name">{developer.name}</div>
                            <div className="title">{developer.title}</div>
                            <div className="bio">{developer.bio}</div>
                            <div className="skills">
                                {developer.skills.map((skill, skillIndex) => (
                                    <div key={skillIndex}>
                                        <p>{skill}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="checkout">
                                <button>CONTACT</button>
                                <button>VIEW PORTFOLIO</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="arrows">
                <button ref={prevButtonRef} id="prev">{"<"}</button>
                <button ref={nextButtonRef} id="next">{">"}</button>
                <button ref={backButtonRef} id="back">See All &#8599;</button>
            </div>
        </div>
    );
};

export default AboutDevs;
